'use client';

import { Student } from './types';
import { AIGenerationResult } from './ai-types';

/**
 * Supabase MCP 연동 및 데이터 검증
 * 개발문서 08_데이터_보안.md, 12_MCP_아키텍처_설계.md 기반 구현
 */

// MCP 프로토콜 메시지 타입
interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Supabase MCP 설정
interface SupabaseMCPConfig {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey?: string;
  enableRLS: boolean;
  maxConnections: number;
  connectionTimeout: number;
  queryTimeout: number;
}

// 데이터 검증 규칙
interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

// 데이터 무결성 검사 결과
interface IntegrityCheckResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  utf8Safe: boolean;
  sanitizedData?: any;
}

/**
 * Supabase MCP 클라이언트
 */
export class SupabaseMCP {
  private config: SupabaseMCPConfig;
  private connectionId: string | null = null;
  private isConnected: boolean = false;
  private lastHealthCheck: Date | null = null;

  constructor(config: Partial<SupabaseMCPConfig> = {}) {
    this.config = {
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'mock://localhost:54321',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      enableRLS: true,
      maxConnections: 10,
      connectionTimeout: 30000,
      queryTimeout: 15000,
      ...config
    };
  }

  /**
   * MCP 연결 초기화
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('Supabase MCP 연결 초기화 중...');
      
      // Mock 환경에서는 즉시 성공 반환
      if (this.config.projectUrl.startsWith('mock://')) {
        this.connectionId = `mock_${Date.now()}`;
        this.isConnected = true;
        this.lastHealthCheck = new Date();
        console.log('Mock Supabase MCP 연결 성공');
        return true;
      }

      // 실제 Supabase 연결 로직 (현재는 Mock)
      await this.simulateConnection();
      
      this.connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.isConnected = true;
      this.lastHealthCheck = new Date();
      
      console.log('Supabase MCP 연결 성공:', this.connectionId);
      return true;
    } catch (error) {
      console.error('Supabase MCP 연결 실패:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * 연결 시뮬레이션 (Mock)
   */
  private async simulateConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% 성공률
          resolve();
        } else {
          reject(new Error('Connection timeout'));
        }
      }, 1000);
    });
  }

  /**
   * MCP 메시지 전송
   */
  async sendMessage(message: MCPMessage): Promise<MCPMessage> {
    if (!this.isConnected) {
      throw new Error('MCP 연결이 활성화되지 않았습니다.');
    }

    try {
      // UTF-8 안전성 검증
      const serialized = JSON.stringify(message);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      
      try {
        const encoded = encoder.encode(serialized);
        decoder.decode(encoded);
      } catch (error) {
        throw new Error('UTF-8 인코딩 오류: 메시지에 잘못된 문자가 포함되어 있습니다.');
      }

      // Mock 응답 생성
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));

      const response: MCPMessage = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          success: true,
          timestamp: new Date().toISOString(),
          connectionId: this.connectionId
        }
      };

      return response;
    } catch (error) {
      const errorResponse: MCPMessage = {
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
          data: { timestamp: new Date().toISOString() }
        }
      };
      return errorResponse;
    }
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<{ healthy: boolean; latency: number; timestamp: Date }> {
    const startTime = Date.now();
    
    try {
      const message: MCPMessage = {
        jsonrpc: '2.0',
        id: 'health_check',
        method: 'health.check',
        params: {}
      };

      const response = await this.sendMessage(message);
      const latency = Date.now() - startTime;
      
      this.lastHealthCheck = new Date();
      
      return {
        healthy: !response.error,
        latency,
        timestamp: this.lastHealthCheck
      };
    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * 연결 상태 확인
   */
  getConnectionStatus(): {
    connected: boolean;
    connectionId: string | null;
    lastHealthCheck: Date | null;
    config: SupabaseMCPConfig;
  } {
    return {
      connected: this.isConnected,
      connectionId: this.connectionId,
      lastHealthCheck: this.lastHealthCheck,
      config: { ...this.config, serviceRoleKey: '***' } // 보안을 위해 마스킹
    };
  }

  /**
   * 연결 종료
   */
  async disconnect(): Promise<void> {
    if (this.isConnected && this.connectionId) {
      try {
        const message: MCPMessage = {
          jsonrpc: '2.0',
          id: 'disconnect',
          method: 'connection.close',
          params: { connectionId: this.connectionId }
        };

        await this.sendMessage(message);
      } catch (error) {
        console.warn('MCP 연결 종료 중 오류:', error);
      }
    }

    this.isConnected = false;
    this.connectionId = null;
    this.lastHealthCheck = null;
  }
}

/**
 * 데이터 검증기
 */
export class DataValidator {
  private static studentValidationRules: ValidationRule[] = [
    { field: 'name', type: 'string', required: true, minLength: 1, maxLength: 50 },
    { field: 'birthDate', type: 'string', required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    { field: 'gender', type: 'string', required: true, customValidator: (v) => ['남성', '여성'].includes(v) },
    { field: 'grade', type: 'number', required: true, customValidator: (v) => v >= 1 && v <= 12 },
    { field: 'schoolName', type: 'string', required: false, maxLength: 100 },
    { field: 'className', type: 'string', required: false, maxLength: 20 },
    { field: 'integrationType', type: 'string', required: true, customValidator: (v) => 
      ['완전통합', '부분통합', '특수학급', '특수학교'].includes(v) },
    { field: 'disabilityTypes', type: 'array', required: true },
    { field: 'welfareSupports', type: 'array', required: false },
    { field: 'treatmentSupports', type: 'array', required: false },
    { field: 'assistantSupports', type: 'array', required: false }
  ];

  /**
   * UTF-8 안전성 검증
   */
  static isUTF8Safe(data: any): boolean {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      
      const encoded = encoder.encode(jsonString);
      const decoded = decoder.decode(encoded);
      
      return JSON.parse(decoded) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * 문자열 UTF-8 정리
   */
  static sanitizeUTF8(str: string): string {
    try {
      // 유효하지 않은 UTF-8 문자 제거
      return str.replace(/[\uFFFE\uFFFF]/g, '').trim();
    } catch (error) {
      return '';
    }
  }

  /**
   * 객체 전체 UTF-8 정리
   */
  static sanitizeObjectUTF8(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeUTF8(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObjectUTF8(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[this.sanitizeUTF8(key)] = this.sanitizeObjectUTF8(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  /**
   * 학생 데이터 검증
   */
  static validateStudent(student: Partial<Student>): IntegrityCheckResult {
    const errors: Array<{ field: string; message: string; value?: any }> = [];
    const warnings: Array<{ field: string; message: string; value?: any }> = [];

    // UTF-8 안전성 검사
    const utf8Safe = this.isUTF8Safe(student);
    if (!utf8Safe) {
      warnings.push({
        field: 'general',
        message: 'UTF-8 인코딩 문제가 감지되어 자동으로 정리되었습니다.'
      });
    }

    // 필드별 검증
    for (const rule of this.studentValidationRules) {
      const value = (student as any)[rule.field];
      
      // 필수 필드 검증
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: `${rule.field}는 필수 입력 항목입니다.`,
          value
        });
        continue;
      }

      // 값이 없으면 다음 검증 스킵
      if (value === undefined || value === null) continue;

      // 타입 검증
      if (!this.validateType(value, rule.type)) {
        errors.push({
          field: rule.field,
          message: `${rule.field}의 타입이 올바르지 않습니다. 예상: ${rule.type}`,
          value
        });
        continue;
      }

      // 문자열 길이 검증
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field}는 최소 ${rule.minLength}자 이상이어야 합니다.`,
            value
          });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field}는 최대 ${rule.maxLength}자까지 입력 가능합니다.`,
            value
          });
        }
      }

      // 정규식 검증
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field}의 형식이 올바르지 않습니다.`,
          value
        });
      }

      // 커스텀 검증
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field}의 값이 유효하지 않습니다.`,
          value
        });
      }
    }

    // 추가 비즈니스 로직 검증
    this.validateBusinessRules(student, errors, warnings);

    // 데이터 정리
    let sanitizedData = utf8Safe ? student : this.sanitizeObjectUTF8(student);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      utf8Safe,
      sanitizedData
    };
  }

  /**
   * AI 생성 결과 검증
   */
  static validateAIResult(result: Partial<AIGenerationResult>): IntegrityCheckResult {
    const errors: Array<{ field: string; message: string; value?: any }> = [];
    const warnings: Array<{ field: string; message: string; value?: any }> = [];

    // UTF-8 안전성 검사
    const utf8Safe = this.isUTF8Safe(result);
    if (!utf8Safe) {
      warnings.push({
        field: 'general',
        message: 'UTF-8 인코딩 문제가 감지되어 자동으로 정리되었습니다.'
      });
    }

    // 필수 필드 검증
    const requiredFields = ['id', 'serviceType', 'studentId', 'generatedAt'];
    for (const field of requiredFields) {
      if (!(result as any)[field]) {
        errors.push({
          field,
          message: `${field}는 필수 항목입니다.`,
          value: (result as any)[field]
        });
      }
    }

    // 생성된 콘텐츠 검증
    if (result.generatedContent) {
      if (typeof result.generatedContent !== 'string') {
        errors.push({
          field: 'generatedContent',
          message: '생성된 콘텐츠는 문자열이어야 합니다.',
          value: result.generatedContent
        });
      } else if (result.generatedContent.length > 50000) {
        warnings.push({
          field: 'generatedContent',
          message: '생성된 콘텐츠가 매우 깁니다. 성능에 영향을 줄 수 있습니다.',
          value: result.generatedContent.length
        });
      }
    }

    // 품질 점수 검증
    if (result.qualityScore !== undefined) {
      if (typeof result.qualityScore !== 'number' || result.qualityScore < 0 || result.qualityScore > 100) {
        errors.push({
          field: 'qualityScore',
          message: '품질 점수는 0-100 사이의 숫자여야 합니다.',
          value: result.qualityScore
        });
      }
    }

    // 신뢰도 검증
    if (result.confidenceLevel !== undefined) {
      if (typeof result.confidenceLevel !== 'number' || result.confidenceLevel < 0 || result.confidenceLevel > 100) {
        errors.push({
          field: 'confidenceLevel',
          message: '신뢰도는 0-100 사이의 숫자여야 합니다.',
          value: result.confidenceLevel
        });
      }
    }

    let sanitizedData = utf8Safe ? result : this.sanitizeObjectUTF8(result);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      utf8Safe,
      sanitizedData
    };
  }

  /**
   * 타입 검증
   */
  private static validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return value !== null && typeof value === 'object' && !Array.isArray(value);
      case 'date':
        return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
      default:
        return true;
    }
  }

  /**
   * 비즈니스 규칙 검증
   */
  private static validateBusinessRules(
    student: Partial<Student>, 
    errors: Array<{ field: string; message: string; value?: any }>,
    warnings: Array<{ field: string; message: string; value?: any }>
  ): void {
    // 생년월일 유효성 검사
    if (student.birthDate) {
      const birthDate = new Date(student.birthDate);
      const now = new Date();
      const age = now.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > now) {
        errors.push({
          field: 'birthDate',
          message: '생년월일은 미래 날짜일 수 없습니다.',
          value: student.birthDate
        });
      } else if (age > 25) {
        warnings.push({
          field: 'birthDate',
          message: '나이가 25세를 초과합니다. 확인이 필요합니다.',
          value: student.birthDate
        });
      } else if (age < 3) {
        warnings.push({
          field: 'birthDate',
          message: '나이가 3세 미만입니다. 확인이 필요합니다.',
          value: student.birthDate
        });
      }
    }

    // 통합교육 시간 검증
    if (student.integrationHours !== undefined) {
      if (student.integrationHours < 0) {
        errors.push({
          field: 'integrationHours',
          message: '통합교육 시간은 0 이상이어야 합니다.',
          value: student.integrationHours
        });
      } else if (student.integrationHours > 40) {
        warnings.push({
          field: 'integrationHours',
          message: '통합교육 시간이 주당 40시간을 초과합니다.',
          value: student.integrationHours
        });
      }
    }

    // 장애유형과 통합교육 유형 일관성 검증
    if (student.disabilityTypes && student.integrationType) {
      const hasIntellectualDisability = student.disabilityTypes.some(d => 
        d.type && d.type.includes('지적장애')
      );
      
      if (hasIntellectualDisability && student.integrationType === '완전통합') {
        warnings.push({
          field: 'integrationType',
          message: '지적장애 학생의 완전통합은 신중한 검토가 필요합니다.',
          value: student.integrationType
        });
      }
    }
  }
}

// 전역 Supabase MCP 인스턴스
let globalSupabaseMCP: SupabaseMCP | null = null;

/**
 * Supabase MCP 인스턴스 가져오기
 */
export function getSupabaseMCP(): SupabaseMCP {
  if (!globalSupabaseMCP) {
    globalSupabaseMCP = new SupabaseMCP();
  }
  return globalSupabaseMCP;
}

/**
 * MCP 연결 초기화 (앱 시작시 호출)
 */
export async function initializeSupabaseMCP(): Promise<boolean> {
  const mcp = getSupabaseMCP();
  return await mcp.initialize();
}

/**
 * 데이터 유효성 검증 유틸리티
 */
export const dataValidation = {
  validateStudent: DataValidator.validateStudent.bind(DataValidator),
  validateAIResult: DataValidator.validateAIResult.bind(DataValidator),
  isUTF8Safe: DataValidator.isUTF8Safe.bind(DataValidator),
  sanitizeUTF8: DataValidator.sanitizeUTF8.bind(DataValidator),
  sanitizeObjectUTF8: DataValidator.sanitizeObjectUTF8.bind(DataValidator)
};

// 개발 환경에서 자동 초기화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  initializeSupabaseMCP().then(success => {
    if (success) {
      console.log('🟢 Supabase MCP 자동 초기화 성공');
    } else {
      console.warn('🟡 Supabase MCP 자동 초기화 실패 (Mock 모드로 계속 진행)');
    }
  });
}
