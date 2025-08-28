'use client';

/**
 * 데이터 무결성 검증 및 에러 핸들링
 * 개발문서 10_에러_처리.md, 08_데이터_보안.md 기반 구현
 */

// 에러 타입 정의
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATA_INTEGRITY_ERROR = 'DATA_INTEGRITY_ERROR',
  UTF8_ENCODING_ERROR = 'UTF8_ENCODING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 에러 심각도
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 표준화된 에러 인터페이스
export interface StandardError {
  type: ErrorType;
  code: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: any;
  userFriendlyMessage?: string;
  accessibility?: {
    role: string;
    'aria-live': 'polite' | 'assertive';
    'aria-label': string;
  };
  retryable: boolean;
  troubleshooting?: string;
  correlationId?: string;
}

// 데이터 무결성 검사 결과
export interface IntegrityResult {
  isValid: boolean;
  errors: StandardError[];
  warnings: StandardError[];
  correctedData?: any;
  checksum?: string;
  validationReport: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    checkDetails: Array<{
      name: string;
      status: 'passed' | 'failed' | 'warning';
      message?: string;
    }>;
  };
}

/**
 * 에러 핸들러 클래스
 */
export class ErrorHandler {
  private errorLog: StandardError[] = [];
  private errorCounts: Map<string, number> = new Map();

  /**
   * 표준 에러 생성
   */
  createError(
    type: ErrorType,
    code: string,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: any
  ): StandardError {
    const error: StandardError = {
      type,
      code,
      message,
      severity,
      timestamp: new Date(),
      context,
      userFriendlyMessage: this.generateUserFriendlyMessage(type, message),
      accessibility: this.generateAccessibilityInfo(type, message),
      retryable: this.isRetryable(type),
      troubleshooting: this.getTroubleshooting(type, code),
      correlationId: this.generateCorrelationId()
    };

    this.logError(error);
    return error;
  }

  /**
   * 사용자 친화적 메시지 생성
   */
  private generateUserFriendlyMessage(type: ErrorType, message: string): string {
    switch (type) {
      case ErrorType.VALIDATION_ERROR:
        return '입력하신 정보에 오류가 있습니다. 다시 확인해 주세요.';
      case ErrorType.DATA_INTEGRITY_ERROR:
        return '데이터 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      case ErrorType.UTF8_ENCODING_ERROR:
        return '문자 인코딩에 문제가 있습니다. 특수문자 사용을 확인해 주세요.';
      case ErrorType.NETWORK_ERROR:
        return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해 주세요.';
      case ErrorType.AUTHENTICATION_ERROR:
        return '로그인이 필요합니다. 다시 로그인해 주세요.';
      case ErrorType.AUTHORIZATION_ERROR:
        return '접근 권한이 없습니다. 관리자에게 문의하세요.';
      case ErrorType.RATE_LIMIT_ERROR:
        return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
      case ErrorType.TIMEOUT_ERROR:
        return '처리 시간이 초과되었습니다. 다시 시도해 주세요.';
      case ErrorType.SYSTEM_ERROR:
        return '시스템 오류가 발생했습니다. 지속적인 문제 발생시 관리자에게 문의하세요.';
      default:
        return '예상치 못한 오류가 발생했습니다. 지원팀에 문의해 주세요.';
    }
  }

  /**
   * 접근성 정보 생성
   */
  private generateAccessibilityInfo(type: ErrorType, message: string): {
    role: string;
    'aria-live': 'polite' | 'assertive';
    'aria-label': string;
  } {
    const isUrgent = [ErrorType.SYSTEM_ERROR, ErrorType.DATA_INTEGRITY_ERROR].includes(type);
    
    return {
      role: 'alert',
      'aria-live': isUrgent ? 'assertive' : 'polite',
      'aria-label': `오류 발생: ${this.generateUserFriendlyMessage(type, message)}`
    };
  }

  /**
   * 재시도 가능 여부 판단
   */
  private isRetryable(type: ErrorType): boolean {
    const retryableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.RATE_LIMIT_ERROR,
      ErrorType.SYSTEM_ERROR
    ];
    return retryableTypes.includes(type);
  }

  /**
   * 문제 해결 가이드 생성
   */
  private getTroubleshooting(type: ErrorType, code: string): string {
    switch (type) {
      case ErrorType.VALIDATION_ERROR:
        return '1. 필수 입력 항목을 모두 채웠는지 확인 2. 올바른 형식으로 입력했는지 확인 3. 특수문자나 공백 확인';
      case ErrorType.UTF8_ENCODING_ERROR:
        return '1. 이모지나 특수문자 제거 2. 다른 브라우저에서 시도 3. 복사-붙여넣기 대신 직접 입력';
      case ErrorType.NETWORK_ERROR:
        return '1. 인터넷 연결 확인 2. 브라우저 새로고침 3. 잠시 후 다시 시도 4. 다른 네트워크에서 시도';
      case ErrorType.TIMEOUT_ERROR:
        return '1. 페이지 새로고침 2. 브라우저 캐시 삭제 3. 잠시 후 다시 시도';
      default:
        return '문제가 지속되면 새로고침 후 다시 시도하거나 지원팀에 문의하세요.';
    }
  }

  /**
   * 상관관계 ID 생성
   */
  private generateCorrelationId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  /**
   * 에러 로깅
   */
  private logError(error: StandardError): void {
    this.errorLog.push(error);
    this.errorCounts.set(error.code, (this.errorCounts.get(error.code) || 0) + 1);

    // 최근 500개 에러만 유지
    if (this.errorLog.length > 500) {
      this.errorLog = this.errorLog.slice(-500);
    }

    // 개발 환경에서 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 [${error.severity.toUpperCase()}] ${error.type}:`, error);
    }
  }

  /**
   * 에러 통계 조회
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Map<ErrorType, number>;
    errorsBySeverity: Map<ErrorSeverity, number>;
    mostCommonErrors: Array<{ code: string; count: number }>;
  } {
    const errorsByType = new Map<ErrorType, number>();
    const errorsBySeverity = new Map<ErrorSeverity, number>();

    this.errorLog.forEach(error => {
      errorsByType.set(error.type, (errorsByType.get(error.type) || 0) + 1);
      errorsBySeverity.set(error.severity, (errorsBySeverity.get(error.severity) || 0) + 1);
    });

    const mostCommonErrors = Array.from(this.errorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([code, count]) => ({ code, count }));

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      errorsBySeverity,
      mostCommonErrors
    };
  }
}

/**
 * 데이터 무결성 검사기
 */
export class DataIntegrityChecker {
  private checksumCache = new Map<string, string>();

  /**
   * 체크섬 생성 (간단한 해시)
   */
  generateChecksum(data: any): string {
    try {
      const str = JSON.stringify(data, Object.keys(data).sort());
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit 정수 변환
      }
      return Math.abs(hash).toString(16);
    } catch (error) {
      return 'invalid';
    }
  }

  /**
   * UTF-8 인코딩 검사
   */
  checkUTF8Encoding(data: any): { isValid: boolean; errors: StandardError[] } {
    const errors: StandardError[] = [];
    
    try {
      const jsonStr = JSON.stringify(data);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      
      const encoded = encoder.encode(jsonStr);
      decoder.decode(encoded);
      
      return { isValid: true, errors: [] };
    } catch (error) {
      const errorHandler = new ErrorHandler();
      errors.push(errorHandler.createError(
        ErrorType.UTF8_ENCODING_ERROR,
        'UTF8_INVALID',
        'UTF-8 인코딩이 유효하지 않습니다.',
        ErrorSeverity.HIGH,
        { originalData: data, error: error instanceof Error ? error.message : 'Unknown' }
      ));
      
      return { isValid: false, errors };
    }
  }

  /**
   * 데이터 타입 검사
   */
  checkDataTypes(data: any, schema: any): { isValid: boolean; errors: StandardError[] } {
    const errors: StandardError[] = [];
    const errorHandler = new ErrorHandler();

    if (!schema || typeof schema !== 'object') {
      return { isValid: true, errors: [] };
    }

    for (const [key, expectedType] of Object.entries(schema)) {
      const value = data[key];
      const actualType = typeof value;

      if (expectedType === 'required' && (value === undefined || value === null)) {
        errors.push(errorHandler.createError(
          ErrorType.VALIDATION_ERROR,
          'MISSING_REQUIRED_FIELD',
          `필수 필드가 누락되었습니다: ${key}`,
          ErrorSeverity.HIGH,
          { field: key, expected: 'required', received: actualType }
        ));
      } else if (value !== undefined && value !== null && actualType !== expectedType) {
        errors.push(errorHandler.createError(
          ErrorType.VALIDATION_ERROR,
          'TYPE_MISMATCH',
          `데이터 타입이 일치하지 않습니다: ${key}`,
          ErrorSeverity.MEDIUM,
          { field: key, expected: expectedType, received: actualType }
        ));
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 데이터 범위 검사
   */
  checkDataRanges(data: any): { isValid: boolean; errors: StandardError[] } {
    const errors: StandardError[] = [];
    const errorHandler = new ErrorHandler();

    // 문자열 길이 검사
    if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          if (value.length > 10000) {
            errors.push(errorHandler.createError(
              ErrorType.VALIDATION_ERROR,
              'STRING_TOO_LONG',
              `문자열이 너무 깁니다: ${key}`,
              ErrorSeverity.MEDIUM,
              { field: key, length: value.length, maxLength: 10000 }
            ));
          }
        } else if (typeof value === 'number') {
          if (!isFinite(value)) {
            errors.push(errorHandler.createError(
              ErrorType.VALIDATION_ERROR,
              'INVALID_NUMBER',
              `유효하지 않은 숫자입니다: ${key}`,
              ErrorSeverity.MEDIUM,
              { field: key, value }
            ));
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 종합 무결성 검사
   */
  performIntegrityCheck(data: any, schema?: any): IntegrityResult {
    const allErrors: StandardError[] = [];
    const allWarnings: StandardError[] = [];
    const checkDetails: Array<{ name: string; status: 'passed' | 'failed' | 'warning'; message?: string }> = [];
    let totalChecks = 0;

    // 1. UTF-8 인코딩 검사
    totalChecks++;
    const utf8Check = this.checkUTF8Encoding(data);
    if (utf8Check.isValid) {
      checkDetails.push({ name: 'UTF-8 인코딩', status: 'passed' });
    } else {
      checkDetails.push({ name: 'UTF-8 인코딩', status: 'failed', message: 'UTF-8 인코딩 오류' });
      allErrors.push(...utf8Check.errors);
    }

    // 2. 데이터 타입 검사
    if (schema) {
      totalChecks++;
      const typeCheck = this.checkDataTypes(data, schema);
      if (typeCheck.isValid) {
        checkDetails.push({ name: '데이터 타입', status: 'passed' });
      } else {
        checkDetails.push({ name: '데이터 타입', status: 'failed', message: '타입 불일치' });
        allErrors.push(...typeCheck.errors);
      }
    }

    // 3. 데이터 범위 검사
    totalChecks++;
    const rangeCheck = this.checkDataRanges(data);
    if (rangeCheck.isValid) {
      checkDetails.push({ name: '데이터 범위', status: 'passed' });
    } else {
      checkDetails.push({ name: '데이터 범위', status: 'warning', message: '범위 초과' });
      allWarnings.push(...rangeCheck.errors);
    }

    // 4. 체크섬 생성
    totalChecks++;
    const checksum = this.generateChecksum(data);
    if (checksum !== 'invalid') {
      checkDetails.push({ name: '체크섬', status: 'passed' });
    } else {
      checkDetails.push({ name: '체크섬', status: 'failed', message: '체크섬 생성 실패' });
      const errorHandler = new ErrorHandler();
      allErrors.push(errorHandler.createError(
        ErrorType.DATA_INTEGRITY_ERROR,
        'CHECKSUM_FAILED',
        '데이터 체크섬 생성에 실패했습니다.',
        ErrorSeverity.HIGH
      ));
    }

    const passedChecks = checkDetails.filter(check => check.status === 'passed').length;
    const failedChecks = checkDetails.filter(check => check.status === 'failed').length;

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      correctedData: utf8Check.isValid ? data : this.sanitizeUTF8(data),
      checksum: checksum !== 'invalid' ? checksum : undefined,
      validationReport: {
        totalChecks,
        passedChecks,
        failedChecks,
        checkDetails
      }
    };
  }

  /**
   * UTF-8 데이터 정리
   */
  private sanitizeUTF8(data: any): any {
    if (typeof data === 'string') {
      return data.replace(/[\uFFFE\uFFFF]/g, '').trim();
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeUTF8(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[this.sanitizeUTF8(key)] = this.sanitizeUTF8(value);
      }
      return sanitized;
    }
    
    return data;
  }
}

// 전역 인스턴스
const globalErrorHandler = new ErrorHandler();
const globalIntegrityChecker = new DataIntegrityChecker();

// 유틸리티 함수들
export const errorUtils = {
  createError: globalErrorHandler.createError.bind(globalErrorHandler),
  getErrorStats: globalErrorHandler.getErrorStats.bind(globalErrorHandler),
  checkIntegrity: globalIntegrityChecker.performIntegrityCheck.bind(globalIntegrityChecker),
  generateChecksum: globalIntegrityChecker.generateChecksum.bind(globalIntegrityChecker)
};

// 전역 에러 핸들러 설정
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    globalErrorHandler.createError(
      ErrorType.SYSTEM_ERROR,
      'UNHANDLED_ERROR',
      event.error?.message || 'Unhandled error occurred',
      ErrorSeverity.HIGH,
      { filename: event.filename, lineno: event.lineno, colno: event.colno }
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    globalErrorHandler.createError(
      ErrorType.SYSTEM_ERROR,
      'UNHANDLED_PROMISE_REJECTION',
      event.reason?.message || 'Unhandled promise rejection',
      ErrorSeverity.HIGH,
      { reason: event.reason }
    );
  });
}
