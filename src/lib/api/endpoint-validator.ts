'use client';

import { mcpAPI } from './mcp-endpoints';
import { getSupabaseMCP, dataValidation } from '../supabase-mcp';

/**
 * API 엔드포인트 매칭 및 검증 시스템
 * 개발문서 07_API_설계.md, 10_에러_처리.md 기반 구현
 */

// API 엔드포인트 정의
interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: APIParameter[];
  responses: APIResponse[];
  authentication: boolean;
  rateLimit?: number;
  timeout?: number;
  validation?: ValidationSchema;
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  validation?: any;
}

interface APIResponse {
  status: number;
  description: string;
  schema?: any;
}

interface ValidationSchema {
  input?: any;
  output?: any;
}

// 검증 결과
interface ValidationResult {
  isValid: boolean;
  endpoint: APIEndpoint | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  matchedPath?: string;
  executionTime?: number;
}

interface ValidationError {
  code: string;
  message: string;
  field?: string;
  expected?: any;
  received?: any;
}

interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

// API 요청 정보
interface APIRequestInfo {
  path: string;
  method: string;
  params?: any;
  body?: any;
  headers?: { [key: string]: string };
}

/**
 * API 엔드포인트 정의 레지스트리
 */
const API_ENDPOINTS: APIEndpoint[] = [
  // 학생 관리 API
  {
    path: '/api/students',
    method: 'GET',
    description: '학생 목록 조회',
    parameters: [
      { name: 'teacherId', type: 'string', required: false, description: '담당 교사 ID' },
      { name: 'limit', type: 'number', required: false, description: '조회할 학생 수' },
      { name: 'offset', type: 'number', required: false, description: '건너뛸 학생 수' }
    ],
    responses: [
      { status: 200, description: '학생 목록 조회 성공' },
      { status: 403, description: '권한 없음' },
      { status: 500, description: '서버 오류' }
    ],
    authentication: true,
    rateLimit: 100,
    timeout: 5000
  },
  {
    path: '/api/students/:id',
    method: 'GET',
    description: '특정 학생 정보 조회',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '학생 ID' }
    ],
    responses: [
      { status: 200, description: '학생 정보 조회 성공' },
      { status: 404, description: '학생을 찾을 수 없음' },
      { status: 403, description: '권한 없음' }
    ],
    authentication: true,
    timeout: 3000
  },
  {
    path: '/api/students',
    method: 'POST',
    description: '새 학생 등록',
    parameters: [
      { name: 'name', type: 'string', required: true, description: '학생 이름' },
      { name: 'birthDate', type: 'string', required: true, description: '생년월일 (YYYY-MM-DD)' },
      { name: 'gender', type: 'string', required: true, description: '성별 (남성/여성)' },
      { name: 'grade', type: 'number', required: true, description: '학년' },
      { name: 'schoolName', type: 'string', required: false, description: '학교명' }
    ],
    responses: [
      { status: 201, description: '학생 등록 성공' },
      { status: 400, description: '잘못된 요청 데이터' },
      { status: 409, description: '중복된 학생 정보' }
    ],
    authentication: true,
    rateLimit: 10,
    timeout: 10000,
    validation: {
      input: 'studentValidation'
    }
  },
  {
    path: '/api/students/:id',
    method: 'PUT',
    description: '학생 정보 수정',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '학생 ID' }
    ],
    responses: [
      { status: 200, description: '학생 정보 수정 성공' },
      { status: 404, description: '학생을 찾을 수 없음' },
      { status: 400, description: '잘못된 요청 데이터' }
    ],
    authentication: true,
    timeout: 8000
  },
  {
    path: '/api/students/:id',
    method: 'DELETE',
    description: '학생 정보 삭제',
    parameters: [
      { name: 'id', type: 'string', required: true, description: '학생 ID' }
    ],
    responses: [
      { status: 200, description: '학생 삭제 성공' },
      { status: 404, description: '학생을 찾을 수 없음' },
      { status: 403, description: '삭제 권한 없음' }
    ],
    authentication: true,
    timeout: 5000
  },

  // AI 생성 API
  {
    path: '/api/ai/generate',
    method: 'POST',
    description: 'AI 콘텐츠 생성',
    parameters: [
      { name: 'studentId', type: 'string', required: true, description: '학생 ID' },
      { name: 'serviceType', type: 'string', required: true, description: 'AI 서비스 타입' },
      { name: 'additionalContext', type: 'object', required: false, description: '추가 컨텍스트' }
    ],
    responses: [
      { status: 200, description: 'AI 생성 성공' },
      { status: 400, description: '잘못된 요청 파라미터' },
      { status: 429, description: '요청 한도 초과' },
      { status: 503, description: 'AI 서비스 일시 불가' }
    ],
    authentication: true,
    rateLimit: 20,
    timeout: 60000
  },
  {
    path: '/api/ai/history/:studentId',
    method: 'GET',
    description: 'AI 생성 기록 조회',
    parameters: [
      { name: 'studentId', type: 'string', required: true, description: '학생 ID' },
      { name: 'limit', type: 'number', required: false, description: '조회할 기록 수' }
    ],
    responses: [
      { status: 200, description: 'AI 생성 기록 조회 성공' },
      { status: 404, description: '학생을 찾을 수 없음' }
    ],
    authentication: true,
    timeout: 5000
  },

  // 통계 API
  {
    path: '/api/statistics/students',
    method: 'GET',
    description: '학생 통계 데이터 조회',
    parameters: [
      { name: 'teacherId', type: 'string', required: false, description: '담당 교사 ID' }
    ],
    responses: [
      { status: 200, description: '통계 데이터 조회 성공' }
    ],
    authentication: true,
    timeout: 8000
  },

  // 시스템 API
  {
    path: '/api/system/health',
    method: 'GET',
    description: '시스템 상태 확인',
    parameters: [],
    responses: [
      { status: 200, description: '시스템 정상' },
      { status: 503, description: '시스템 오류' }
    ],
    authentication: false,
    timeout: 3000
  }
];

/**
 * API 엔드포인트 검증기
 */
export class EndpointValidator {
  private endpoints: APIEndpoint[];
  private requestLog: Array<{ timestamp: Date; path: string; method: string; result: ValidationResult }> = [];

  constructor(customEndpoints?: APIEndpoint[]) {
    this.endpoints = customEndpoints || API_ENDPOINTS;
  }

  /**
   * 요청 경로 매칭
   */
  matchPath(requestPath: string, endpointPath: string): { isMatch: boolean; params: { [key: string]: string } } {
    const requestSegments = requestPath.split('/').filter(s => s);
    const endpointSegments = endpointPath.split('/').filter(s => s);

    if (requestSegments.length !== endpointSegments.length) {
      return { isMatch: false, params: {} };
    }

    const params: { [key: string]: string } = {};

    for (let i = 0; i < endpointSegments.length; i++) {
      const endpointSegment = endpointSegments[i];
      const requestSegment = requestSegments[i];

      if (endpointSegment.startsWith(':')) {
        // 파라미터 세그먼트
        const paramName = endpointSegment.slice(1);
        params[paramName] = requestSegment;
      } else if (endpointSegment !== requestSegment) {
        // 리터럴 세그먼트가 일치하지 않음
        return { isMatch: false, params: {} };
      }
    }

    return { isMatch: true, params };
  }

  /**
   * 엔드포인트 검색
   */
  findEndpoint(path: string, method: string): { endpoint: APIEndpoint | null; pathParams: { [key: string]: string } } {
    for (const endpoint of this.endpoints) {
      if (endpoint.method === method.toUpperCase()) {
        const matchResult = this.matchPath(path, endpoint.path);
        if (matchResult.isMatch) {
          return { endpoint, pathParams: matchResult.params };
        }
      }
    }
    return { endpoint: null, pathParams: {} };
  }

  /**
   * 요청 파라미터 검증
   */
  validateParameters(
    endpoint: APIEndpoint,
    pathParams: { [key: string]: string },
    queryParams: any = {},
    bodyParams: any = {}
  ): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    if (!endpoint.parameters) return { errors, warnings };

    const allParams = { ...pathParams, ...queryParams, ...bodyParams };

    // 필수 파라미터 검증
    for (const param of endpoint.parameters) {
      const value = allParams[param.name];

      if (param.required && (value === undefined || value === null || value === '')) {
        errors.push({
          code: 'MISSING_REQUIRED_PARAMETER',
          message: `필수 파라미터가 누락되었습니다: ${param.name}`,
          field: param.name,
          expected: param.type,
          received: typeof value
        });
        continue;
      }

      if (value !== undefined && value !== null) {
        // 타입 검증
        const typeValid = this.validateParameterType(value, param.type);
        if (!typeValid) {
          errors.push({
            code: 'INVALID_PARAMETER_TYPE',
            message: `파라미터 타입이 올바르지 않습니다: ${param.name}`,
            field: param.name,
            expected: param.type,
            received: typeof value
          });
        }

        // 추가 검증 (예: 문자열 길이, 숫자 범위 등)
        const customValidationResult = this.validateParameterValue(value, param);
        if (!customValidationResult.isValid) {
          errors.push({
            code: 'INVALID_PARAMETER_VALUE',
            message: customValidationResult.message || `파라미터 값이 유효하지 않습니다: ${param.name}`,
            field: param.name
          });
        }
      }
    }

    // 알 수 없는 파라미터 검증
    const knownParams = new Set(endpoint.parameters.map(p => p.name));
    for (const paramName of Object.keys(allParams)) {
      if (!knownParams.has(paramName)) {
        warnings.push({
          code: 'UNKNOWN_PARAMETER',
          message: `알 수 없는 파라미터입니다: ${paramName}`,
          field: paramName,
          suggestion: `지원되는 파라미터: ${Array.from(knownParams).join(', ')}`
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * 파라미터 타입 검증
   */
  private validateParameterType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' || !isNaN(Number(value));
      case 'boolean':
        return typeof value === 'boolean' || value === 'true' || value === 'false';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return value !== null && typeof value === 'object' && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * 파라미터 값 검증
   */
  private validateParameterValue(value: any, param: APIParameter): { isValid: boolean; message?: string } {
    // 학생 ID 검증
    if (param.name === 'id' || param.name === 'studentId') {
      if (typeof value === 'string' && value.length > 0 && value.length < 100) {
        return { isValid: true };
      }
      return { isValid: false, message: 'ID는 1-100자의 문자열이어야 합니다.' };
    }

    // 생년월일 검증
    if (param.name === 'birthDate') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (typeof value === 'string' && dateRegex.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return { isValid: true };
        }
      }
      return { isValid: false, message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.' };
    }

    // 성별 검증
    if (param.name === 'gender') {
      if (['남성', '여성'].includes(value)) {
        return { isValid: true };
      }
      return { isValid: false, message: '성별은 "남성" 또는 "여성"이어야 합니다.' };
    }

    // 학년 검증
    if (param.name === 'grade') {
      const gradeNum = Number(value);
      if (!isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 12) {
        return { isValid: true };
      }
      return { isValid: false, message: '학년은 1-12 사이의 숫자여야 합니다.' };
    }

    return { isValid: true };
  }

  /**
   * 요청 전체 검증
   */
  async validateRequest(requestInfo: APIRequestInfo): Promise<ValidationResult> {
    const startTime = Date.now();
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // 1. 엔드포인트 매칭
      const { endpoint, pathParams } = this.findEndpoint(requestInfo.path, requestInfo.method);
      
      if (!endpoint) {
        errors.push({
          code: 'ENDPOINT_NOT_FOUND',
          message: `엔드포인트를 찾을 수 없습니다: ${requestInfo.method} ${requestInfo.path}`,
          expected: 'Valid API endpoint',
          received: `${requestInfo.method} ${requestInfo.path}`
        });

        const result: ValidationResult = {
          isValid: false,
          endpoint: null,
          errors,
          warnings,
          executionTime: Date.now() - startTime
        };

        this.logRequest(requestInfo, result);
        return result;
      }

      // 2. 파라미터 검증
      const paramValidation = this.validateParameters(
        endpoint,
        pathParams,
        requestInfo.params,
        requestInfo.body
      );
      
      errors.push(...paramValidation.errors);
      warnings.push(...paramValidation.warnings);

      // 3. UTF-8 안전성 검증
      if (requestInfo.body) {
        if (!dataValidation.isUTF8Safe(requestInfo.body)) {
          warnings.push({
            code: 'UTF8_ENCODING_ISSUE',
            message: 'UTF-8 인코딩 문제가 감지되었습니다.',
            suggestion: '데이터를 정리하여 다시 전송하세요.'
          });
        }
      }

      // 4. 데이터 검증 (학생 데이터인 경우)
      if (endpoint.validation?.input === 'studentValidation' && requestInfo.body) {
        const studentValidation = dataValidation.validateStudent(requestInfo.body);
        if (!studentValidation.isValid) {
          studentValidation.errors.forEach(error => {
            errors.push({
              code: 'STUDENT_DATA_VALIDATION_ERROR',
              message: error.message,
              field: error.field
            });
          });
        }
        studentValidation.warnings.forEach(warning => {
          warnings.push({
            code: 'STUDENT_DATA_VALIDATION_WARNING',
            message: warning.message,
            field: warning.field
          });
        });
      }

      // 5. MCP 연결 상태 확인
      const mcp = getSupabaseMCP();
      const connectionStatus = mcp.getConnectionStatus();
      if (!connectionStatus.connected) {
        warnings.push({
          code: 'MCP_CONNECTION_ISSUE',
          message: 'MCP 연결이 비활성화 상태입니다.',
          suggestion: 'MCP 연결을 확인하고 다시 시도하세요.'
        });
      }

      const result: ValidationResult = {
        isValid: errors.length === 0,
        endpoint,
        errors,
        warnings,
        matchedPath: endpoint.path,
        executionTime: Date.now() - startTime
      };

      this.logRequest(requestInfo, result);
      return result;

    } catch (error) {
      errors.push({
        code: 'VALIDATION_INTERNAL_ERROR',
        message: `검증 중 내부 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      });

      const result: ValidationResult = {
        isValid: false,
        endpoint: null,
        errors,
        warnings,
        executionTime: Date.now() - startTime
      };

      this.logRequest(requestInfo, result);
      return result;
    }
  }

  /**
   * 요청 로그 기록
   */
  private logRequest(requestInfo: APIRequestInfo, result: ValidationResult): void {
    this.requestLog.push({
      timestamp: new Date(),
      path: requestInfo.path,
      method: requestInfo.method,
      result
    });

    // 최근 100개 요청만 유지
    if (this.requestLog.length > 100) {
      this.requestLog = this.requestLog.slice(-100);
    }

    // 개발 환경에서 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 API Validation: ${requestInfo.method} ${requestInfo.path}`, {
        valid: result.isValid,
        errors: result.errors.length,
        warnings: result.warnings.length,
        executionTime: result.executionTime
      });
    }
  }

  /**
   * 엔드포인트 목록 조회
   */
  getEndpoints(): APIEndpoint[] {
    return [...this.endpoints];
  }

  /**
   * 특정 경로의 엔드포인트들 조회
   */
  getEndpointsByPath(pathPattern: string): APIEndpoint[] {
    return this.endpoints.filter(endpoint => 
      endpoint.path === pathPattern || 
      endpoint.path.replace(/:[\w]+/g, '*').includes(pathPattern)
    );
  }

  /**
   * 요청 로그 조회
   */
  getRequestLog(limit: number = 10): Array<{ timestamp: Date; path: string; method: string; result: ValidationResult }> {
    return this.requestLog.slice(-limit);
  }

  /**
   * 통계 정보 조회
   */
  getValidationStats(): {
    totalRequests: number;
    validRequests: number;
    invalidRequests: number;
    averageExecutionTime: number;
    commonErrors: { [code: string]: number };
  } {
    const validRequests = this.requestLog.filter(log => log.result.isValid).length;
    const invalidRequests = this.requestLog.length - validRequests;
    
    const avgExecutionTime = this.requestLog.length > 0 
      ? this.requestLog.reduce((sum, log) => sum + (log.result.executionTime || 0), 0) / this.requestLog.length
      : 0;

    const commonErrors: { [code: string]: number } = {};
    this.requestLog.forEach(log => {
      log.result.errors.forEach(error => {
        commonErrors[error.code] = (commonErrors[error.code] || 0) + 1;
      });
    });

    return {
      totalRequests: this.requestLog.length,
      validRequests,
      invalidRequests,
      averageExecutionTime: Math.round(avgExecutionTime),
      commonErrors
    };
  }
}

// 전역 검증기 인스턴스
let globalValidator: EndpointValidator | null = null;

/**
 * 전역 엔드포인트 검증기 가져오기
 */
export function getEndpointValidator(): EndpointValidator {
  if (!globalValidator) {
    globalValidator = new EndpointValidator();
  }
  return globalValidator;
}

/**
 * API 요청 검증 유틸리티 함수
 */
export async function validateAPIRequest(
  path: string,
  method: string,
  params?: any,
  body?: any,
  headers?: { [key: string]: string }
): Promise<ValidationResult> {
  const validator = getEndpointValidator();
  return await validator.validateRequest({
    path,
    method,
    params,
    body,
    headers
  });
}

/**
 * 실제 API 호출과 검증을 결합한 래퍼 함수
 */
export async function callValidatedAPI<T = any>(
  path: string,
  method: string,
  params?: any,
  body?: any
): Promise<{ success: boolean; data?: T; validation: ValidationResult; error?: string }> {
  // 1. 요청 검증
  const validation = await validateAPIRequest(path, method, params, body);
  
  if (!validation.isValid) {
    return {
      success: false,
      validation,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  // 2. 실제 API 호출 (현재는 Mock API 사용)
  try {
    let apiResponse;

    // 라우팅 로직
    if (path.startsWith('/api/students')) {
      if (method === 'GET') {
        if (path.includes('/api/students/')) {
          const id = path.split('/').pop();
          apiResponse = await mcpAPI.students.getStudent(id || '');
        } else {
          apiResponse = await mcpAPI.students.getStudents(params?.teacherId);
        }
      } else if (method === 'POST') {
        apiResponse = await mcpAPI.students.createStudent(body);
      } else if (method === 'PUT') {
        const id = path.split('/').pop();
        apiResponse = await mcpAPI.students.updateStudent(id || '', body);
      } else if (method === 'DELETE') {
        const id = path.split('/').pop();
        apiResponse = await mcpAPI.students.deleteStudent(id || '');
      }
    } else if (path.startsWith('/api/ai/generate')) {
      apiResponse = await mcpAPI.aiGeneration.generateContent({
        studentId: body.studentId,
        serviceType: body.serviceType,
        additionalContext: body.additionalContext
      });
    } else if (path.startsWith('/api/ai/history')) {
      const studentId = path.split('/').pop();
      apiResponse = await mcpAPI.aiGeneration.getGenerationHistory(studentId || '', params?.limit);
    } else if (path.startsWith('/api/statistics')) {
      apiResponse = await mcpAPI.statistics.getStudentStats(params?.teacherId);
    } else if (path.startsWith('/api/system/health')) {
      apiResponse = await mcpAPI.system.getHealth();
    }

    if (apiResponse && apiResponse.success) {
      return {
        success: true,
        data: apiResponse.data,
        validation
      };
    } else {
      return {
        success: false,
        validation,
        error: apiResponse?.error?.message || 'API 호출 실패'
      };
    }
  } catch (error) {
    return {
      success: false,
      validation,
      error: error instanceof Error ? error.message : 'API 호출 중 예상치 못한 오류'
    };
  }
}
