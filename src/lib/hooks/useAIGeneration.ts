'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  AIGenerationResult, 
  AIGenerationRequest, 
  AIServiceType, 
  AIGenerationError,
  AIServiceState,
  StudentContextForAI,
  UserPreferences
} from '../ai-types';
import { AIServiceUtils, MockAIService } from '../ai-service';

interface UseAIGenerationConfig {
  maxRetries?: number;
  requestTimeout?: number;
  rateLimitWindow?: number;
  maxRequestsPerWindow?: number;
}

interface UseAIGenerationReturn {
  // 상태
  state: AIServiceState;
  
  // 메서드
  generateWithContext: (
    studentId: string,
    request: AIGenerationRequest,
    preferences?: UserPreferences
  ) => Promise<AIGenerationResult | null>;
  
  clearError: () => void;
  resetState: () => void;
  
  // 유틸리티
  validateRequest: (request: AIGenerationRequest) => { isValid: boolean; errors: string[] };
  checkRateLimit: (studentId: string, serviceType: AIServiceType) => Promise<boolean>;
}

/**
 * AI 생성 서비스 React 훅
 * 개발문서 09_AI_생성_서비스_통합.md 기반 구현
 */
export function useAIGeneration(config: UseAIGenerationConfig = {}): UseAIGenerationReturn {
  const {
    maxRetries = 3,
    requestTimeout = 30000,
    rateLimitWindow = 60000,
    maxRequestsPerWindow = 100
  } = config;

  // 상태 관리
  const [state, setState] = useState<AIServiceState>({
    status: 'idle',
    progress: 0,
    currentStep: '',
    result: null,
    error: null,
    isRetrying: false,
    retryCount: 0
  });

  // 요청 취소를 위한 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 상태 업데이트 헬퍼
   */
  const updateState = useCallback((updates: Partial<AIServiceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 속도 제한 확인
   */
  const checkRateLimit = useCallback(async (studentId: string, serviceType: AIServiceType): Promise<boolean> => {
    const key = `rate_limit_${studentId}_${serviceType}`;
    const now = Date.now();
    const windowStart = now - rateLimitWindow;

    try {
      // localStorage에서 최근 요청 기록 확인
      const requests = JSON.parse(localStorage.getItem(key) || '[]') as number[];
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);

      if (recentRequests.length >= maxRequestsPerWindow) {
        throw new AIGenerationError(
          `속도 제한 초과: ${rateLimitWindow / 1000}초당 최대 ${maxRequestsPerWindow}회 요청 가능`,
          serviceType,
          'RATE_LIMIT_EXCEEDED',
          { requestCount: recentRequests.length, windowStart, now },
          true
        );
      }

      // 현재 요청 기록 추가
      recentRequests.push(now);
      localStorage.setItem(key, JSON.stringify(recentRequests));
      
      return true;
    } catch (error) {
      if (error instanceof AIGenerationError) {
        updateState({ error: AIServiceUtils.handleError(error, serviceType).error });
        return false;
      }
      throw error;
    }
  }, [rateLimitWindow, maxRequestsPerWindow, updateState]);

  /**
   * 요청 검증
   */
  const validateRequest = useCallback((request: AIGenerationRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 기본 필드 검증
    if (!request.studentId || typeof request.studentId !== 'string') {
      errors.push('유효하지 않은 학생 ID입니다.');
    }

    if (!request.serviceType) {
      errors.push('서비스 타입이 필요합니다.');
    }

    if (!request.requestId) {
      errors.push('요청 ID가 필요합니다.');
    }

    // UTF-8 안전성 검증
    try {
      const textFields = [request.studentId, request.requestId, request.serviceType];
      textFields.forEach(field => {
        if (field && !AIServiceUtils.isValidUTF8(field)) {
          errors.push(`UTF-8 인코딩이 올바르지 않은 필드가 있습니다: ${field}`);
        }
      });

      // 추가 컨텍스트의 UTF-8 검증
      if (request.additionalContext) {
        Object.values(request.additionalContext).forEach(value => {
          if (typeof value === 'string' && !AIServiceUtils.isValidUTF8(value)) {
            errors.push('추가 컨텍스트에 UTF-8 인코딩 오류가 있습니다.');
          }
        });
      }
    } catch (error) {
      errors.push('UTF-8 인코딩 검증 중 오류가 발생했습니다.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  /**
   * 학생 컨텍스트 구축 (Mock 데이터 사용)
   */
  const buildStudentContext = useCallback(async (studentId: string): Promise<StudentContextForAI> => {
    updateState({ currentStep: '학생 정보 로드 중...', progress: 20 });

    // 실제로는 API 호출하여 학생 데이터를 가져옴
    // 현재는 Mock 데이터 반환
    await AIServiceUtils.sleep(500); // 네트워크 지연 시뮬레이션

    return {
      profile: {
        id: studentId,
        name: '김철수',
        grade: 3,
        disabilityTypes: ['지적장애', '의사소통장애'],
        integrationType: '부분통합'
      },
      currentLevels: {
        reading: '초급',
        math: '기초',
        social: '중급'
      },
      recentActivities: [
        {
          type: '학습',
          description: '한글 읽기 연습',
          date: '2024-01-15',
          outcome: '5개 단어 성공적으로 읽음'
        }
      ],
      supportNeeds: ['시각적 지원', '단계별 설명', '충분한 대기시간'],
      goals: {
        shortTerm: ['기본 의사소통', '생활 어휘 습득'],
        longTerm: ['자립적 생활', '사회 적응'],
        targetSkills: ['읽기', '쓰기', '기본 수학']
      },
      preferences: {
        subjects: ['국어', '생활'],
        teachingMethods: ['시각적 자료', '체험 활동'],
        sessionDuration: 30
      },
      analytics: {
        strengths: ['기억력', '집중력'],
        improvements: ['표현력', '문제해결'],
        averagePace: 'slow'
      },
      assessments: {
        recent: [
          {
            type: '진단평가',
            subject: '국어',
            score: 65,
            date: '2024-01-10',
            notes: '기본 어휘 이해 양호'
          }
        ]
      },
      observations: {
        behaviors: ['차분함', '집중력 양호', '도움 요청 적극적'],
        socialInteractions: ['또래와 우호적', '성인과 예의 바름'],
        communicationPatterns: ['단순 문장 선호', '시각적 단서 필요']
      },
      wellbeing: {
        currentState: 'stable',
        concerns: [],
        interventions: []
      }
    };
  }, [updateState]);

  /**
   * 재시도 로직이 포함된 실행기
   */
  const executeWithRetry = useCallback(async <T>(
    operationFn: () => Promise<T>,
    serviceType: AIServiceType
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let retry = 0; retry < maxRetries; retry++) {
      updateState({ retryCount: retry, isRetrying: retry > 0 });

      try {
        return await operationFn();
      } catch (error) {
        lastError = error as Error;

        // 재시도 불가능한 에러인 경우 즉시 중단
        if (error instanceof AIGenerationError && !error.retryable) {
          throw error;
        }

        // 마지막 재시도인 경우 에러 발생
        if (retry >= maxRetries - 1) {
          throw new AIGenerationError(
            `AI 생성 실패 (${retry + 1}회 재시도): ${(error as Error).message}`,
            serviceType,
            'MAX_RETRIES_EXCEEDED',
            { originalError: error, retryCount: retry + 1 }
          );
        }

        // 지수 백오프로 재시도 대기
        const delay = Math.min(1000 * Math.pow(2, retry), 5000);
        await AIServiceUtils.sleep(delay);

        console.warn(`AI 생성 재시도 ${retry + 1}/${maxRetries}:`, (error as Error).message);
      }
    }

    throw lastError || new AIGenerationError(
      '예상치 못한 오류로 AI 생성에 실패했습니다.',
      serviceType,
      'UNEXPECTED_ERROR'
    );
  }, [maxRetries, updateState]);

  /**
   * 메인 AI 생성 메서드
   */
  const generateWithContext = useCallback(async (
    studentId: string,
    request: AIGenerationRequest,
    preferences?: UserPreferences
  ): Promise<AIGenerationResult | null> => {
    // 진행 중인 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // 초기 상태 설정
      updateState({
        status: 'loading',
        progress: 0,
        currentStep: '요청 검증 중...',
        result: null,
        error: null,
        isRetrying: false,
        retryCount: 0
      });

      // 1. 요청 검증
      const validation = validateRequest(request);
      if (!validation.isValid) {
        throw new AIGenerationError(
          validation.errors.join(', '),
          request.serviceType,
          'VALIDATION_FAILED',
          { errors: validation.errors },
          false
        );
      }

      updateState({ progress: 10 });

      // 2. 속도 제한 확인
      const rateLimitOk = await checkRateLimit(studentId, request.serviceType);
      if (!rateLimitOk) {
        return null; // 에러는 이미 상태에 설정됨
      }

      updateState({ progress: 15 });

      // 3. 재시도 로직으로 AI 생성 실행
      const result = await executeWithRetry(async () => {
        // 학생 컨텍스트 구축
        const context = await buildStudentContext(studentId);
        updateState({ progress: 40 });

        // Mock AI 서비스 호출
        updateState({ currentStep: 'AI 생성 중...', progress: 50 });
        const aiResult = await MockAIService.simulateAIGeneration(request, context, preferences);
        updateState({ progress: 90 });

        return aiResult;
      }, request.serviceType);

      // 성공 상태 업데이트
      updateState({
        status: 'success',
        progress: 100,
        currentStep: '완료',
        result,
        error: null,
        isRetrying: false
      });

      return result;

    } catch (error) {
      const errorInfo = AIServiceUtils.handleError(error, request.serviceType);
      updateState({
        status: 'error',
        error: errorInfo.error,
        isRetrying: false
      });
      return null;
    }
  }, [validateRequest, checkRateLimit, buildStudentContext, executeWithRetry, updateState]);

  /**
   * 에러 클리어
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * 상태 리셋
   */
  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState({
      status: 'idle',
      progress: 0,
      currentStep: '',
      result: null,
      error: null,
      isRetrying: false,
      retryCount: 0
    });
  }, []);

  return {
    state,
    generateWithContext,
    clearError,
    resetState,
    validateRequest,
    checkRateLimit
  };
}
