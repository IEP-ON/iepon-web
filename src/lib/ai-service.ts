'use client';

import { 
  AIGenerationResult, 
  AIGenerationRequest, 
  AIServiceType, 
  AIGenerationError, 
  UserPreferences,
  StudentContextForAI,
  AIGenerationMetadata,
  ContextUsageInfo,
  AI_SERVICE_TYPES,
  AI_SERVICE_LABELS
} from './ai-types';

/**
 * AI 생성 서비스 유틸리티 클래스
 * 개발문서 09_AI_생성_서비스_통합.md 기반 구현
 */
export class AIServiceUtils {
  /**
   * UTF-8 문자열 유효성 검사
   */
  static isValidUTF8(str: string): boolean {
    try {
      const encoded = new TextEncoder().encode(str);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      return decoded === str;
    } catch (error) {
      return false;
    }
  }

  /**
   * 텍스트 UTF-8 안전성 검증 및 정리
   */
  static validateAndSanitizeUTF8(text: string): string {
    if (!this.isValidUTF8(text)) {
      // UTF-8 안전하지 않은 문자 제거
      return text.replace(/[\u{FFFE}\u{FFFF}]/gu, '').trim();
    }
    return text.trim();
  }

  /**
   * 컨텍스트 완성도 계산
   */
  static calculateContextCompleteness(context: StudentContextForAI): number {
    const requiredFields = ['profile', 'currentLevels', 'supportNeeds'];
    const availableFields = requiredFields.filter(field => {
      const value = (context as any)[field];
      return value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
    });
    return Math.round((availableFields.length / requiredFields.length) * 100);
  }

  /**
   * 품질 점수 계산
   */
  static calculateQualityScore(result: AIGenerationResult, context: StudentContextForAI): number {
    let score = 0;

    // 기본 점수 (50점)
    score += 50;

    // 컨텍스트 완성도 반영 (30점)
    score += (result.contextUsage.contextCompleteness / 100) * 30;

    // 콘텐츠 길이 적절성 (10점)
    const contentLength = result.generatedContent ? result.generatedContent.length : 0;
    if (contentLength > 100 && contentLength < 5000) {
      score += 10;
    }

    // UTF-8 안전성 (10점)
    if (result.generatedContent && this.isValidUTF8(result.generatedContent)) {
      score += 10;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * 신뢰도 계산
   */
  static calculateConfidenceLevel(result: AIGenerationResult): number {
    let confidence = result.qualityScore;

    // 메타데이터가 있으면 추가 점수
    if (result.metadata && result.metadata.totalTokens > 0) {
      confidence += 5;
    }

    // 컨텍스트 사용도가 높으면 추가 점수
    if (result.contextUsage && result.contextUsage.contextCompleteness > 80) {
      confidence += 10;
    }

    return Math.min(Math.round(confidence), 100);
  }

  /**
   * 에러를 사용자 친화적인 형태로 처리
   */
  static handleError(error: any, serviceType: AIServiceType): { hasError: boolean; error: any } {
    console.error('AI Generation Error:', error);
    
    if (error instanceof AIGenerationError) {
      return {
        hasError: true,
        error: {
          code: error.code,
          message: error.getUserFriendlyMessage(),
          timestamp: error.timestamp,
          retryable: error.retryable,
          serviceType: error.serviceType,
          accessibility: error.getAccessibilityInfo()
        }
      };
    }
    
    // 일반 에러를 AI 생성 에러로 변환
    const aiError = new AIGenerationError(
      error.message || '알 수 없는 오류가 발생했습니다.',
      serviceType,
      'UNKNOWN_ERROR',
      { originalError: error },
      true
    );
    
    return aiError.getUserFriendlyMessage ? {
      hasError: true,
      error: {
        code: aiError.code,
        message: aiError.getUserFriendlyMessage(),
        timestamp: aiError.timestamp,
        retryable: aiError.retryable,
        serviceType: aiError.serviceType,
        accessibility: aiError.getAccessibilityInfo()
      }
    } : {
      hasError: true,
      error: {
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
        timestamp: new Date().toISOString(),
        retryable: true,
        serviceType: serviceType,
        accessibility: {
          role: 'alert',
          'aria-live': 'assertive',
          'aria-label': '오류 발생: 알 수 없는 오류가 발생했습니다.'
        }
      }
    };
  }

  /**
   * Sleep 유틸리티 함수
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 고유 ID 생성
   */
  static generateId(): string {
    return `ai_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 현재 시간 ISO 문자열 반환
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * 개별화 수준 계산
   */
  static getIndividualizationLevel(contextUsage: ContextUsageInfo): 'low' | 'medium' | 'high' {
    const totalElements = contextUsage.individualizedElements.length + 
                         contextUsage.adaptationsApplied.length + 
                         contextUsage.supportNeedsAddressed.length;
    if (totalElements >= 5) return 'high';
    if (totalElements >= 3) return 'medium';
    return 'low';
  }
}

/**
 * AI 생성 결과 팩토리 함수
 */
export function createAIGenerationResult(): AIGenerationResult {
  return {
    id: '',
    serviceType: AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT,
    studentId: '',
    generatedContent: null,
    metadata: createAIGenerationMetadata(),
    contextUsage: createContextUsageInfo(),
    qualityScore: 0,
    confidenceLevel: 0,
    generatedAt: '',
    validatedAt: null,
    errors: [],
    warnings: []
  };
}

/**
 * AI 생성 메타데이터 팩토리 함수
 */
export function createAIGenerationMetadata(): AIGenerationMetadata {
  return {
    model: '',
    temperature: 0.7,
    maxTokens: 2000,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    processingTime: 0,
    retryCount: 0,
    version: '1.0.0'
  };
}

/**
 * 컨텍스트 사용 정보 팩토리 함수
 */
export function createContextUsageInfo(): ContextUsageInfo {
  return {
    dataSourcesUsed: [],
    contextCompleteness: 0,
    individualizedElements: [],
    adaptationsApplied: [],
    supportNeedsAddressed: []
  };
}

/**
 * 기본 AI 생성 요청 팩토리 함수
 */
export function createBaseAIGenerationRequest(): Partial<AIGenerationRequest> {
  return {
    studentId: '',
    serviceType: AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT,
    requestId: AIServiceUtils.generateId(),
    priority: 'normal',
    deadline: null,
    additionalContext: {}
  };
}

/**
 * 사용자 선호도 팩토리 함수
 */
export function createUserPreferences(): UserPreferences {
  return {
    language: 'ko',
    tone: 'professional',
    detailLevel: 'moderate',
    includeExamples: true,
    focusAreas: [],
    avoidTerms: [],
    customInstructions: ''
  };
}

/**
 * Mock AI API 시뮬레이션 함수
 */
export class MockAIService {
  static async simulateAIGeneration(
    request: AIGenerationRequest,
    context: StudentContextForAI,
    preferences?: UserPreferences
  ): Promise<AIGenerationResult> {
    // 실제 AI 호출 시뮬레이션 (2-5초 지연)
    const processingTime = Math.random() * 3000 + 2000;
    await AIServiceUtils.sleep(processingTime);

    // 서비스별 Mock 콘텐츠 생성
    const content = this.generateMockContent(request.serviceType, context);
    
    const result = createAIGenerationResult();
    result.id = AIServiceUtils.generateId();
    result.serviceType = request.serviceType;
    result.studentId = request.studentId;
    result.generatedContent = content;
    result.generatedAt = AIServiceUtils.getCurrentTimestamp();

    // 메타데이터 설정
    result.metadata = {
      ...createAIGenerationMetadata(),
      model: 'mock-ai-model-v1',
      promptTokens: Math.floor(Math.random() * 500 + 100),
      completionTokens: Math.floor(Math.random() * 1000 + 200),
      processingTime: Math.round(processingTime),
      requestId: request.requestId,
      serviceType: request.serviceType
    };
    result.metadata.totalTokens = result.metadata.promptTokens + result.metadata.completionTokens;

    // 컨텍스트 사용 정보 설정
    result.contextUsage = createContextUsageInfo();
    result.contextUsage.dataSourcesUsed = ['student_profile', 'learning_history', 'support_needs'];
    result.contextUsage.contextCompleteness = AIServiceUtils.calculateContextCompleteness(context);
    result.contextUsage.individualizedElements = ['disability_type', 'learning_pace', 'support_needs'];
    result.contextUsage.adaptationsApplied = ['visual_support', 'reduced_complexity'];
    result.contextUsage.supportNeedsAddressed = context.supportNeeds.slice(0, 3);

    // 품질 점수 계산
    result.qualityScore = AIServiceUtils.calculateQualityScore(result, context);
    result.confidenceLevel = AIServiceUtils.calculateConfidenceLevel(result);
    result.validatedAt = AIServiceUtils.getCurrentTimestamp();

    return result;
  }

  private static generateMockContent(serviceType: AIServiceType, context: StudentContextForAI): string {
    const studentName = context.profile.name || '학생';
    const grade = context.profile.grade || 1;

    switch (serviceType) {
      case AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT:
        return `# ${studentName}님을 위한 개별화 교육과정 배정

## 학습자 분석
- 현재 학년: ${grade}학년
- 장애 유형: ${context.profile.disabilityTypes.join(', ')}
- 통합교육 유형: ${context.profile.integrationType}

## 권장 교육과정
1. **기초 학습 영역**
   - 국어: 기능적 읽기, 의사소통 중심
   - 수학: 생활수학, 실용수학 중심
   - 사회: 지역사회 적응 기능

2. **개별화 요소**
   - 학습 속도 조절
   - 시각적 보조 자료 활용
   - 단계별 학습 진행

## 지원 방안
${context.supportNeeds.map(need => `- ${need}`).join('\n')}

이 교육과정은 ${studentName}님의 개별 특성과 요구를 반영하여 구성되었습니다.`;

      case AI_SERVICE_TYPES.LESSON_PLAN:
        return `# ${studentName}님을 위한 주간 교육계획

## 주간 목표
- 기능적 의사소통 능력 향상
- 일상생활 기술 습득
- 사회적 상호작용 증진

## 일일 계획

### 월요일 - 국어 (의사소통)
**목표**: 요구사항을 문장으로 표현하기
**활동**: 
- 그림카드를 이용한 어휘 학습
- 역할놀이를 통한 대화 연습
- 일기 쓰기 (단어/문장 수준)

### 화요일 - 수학 (생활수학)
**목표**: 돈의 개념과 사용법 이해
**활동**:
- 동전과 지폐 구분하기
- 간단한 계산 연습
- 마트놀이를 통한 실습

### 수요일 - 사회 (지역사회)
**목표**: 대중교통 이용법 익히기
**활동**:
- 버스정류장 찾기
- 교통카드 사용법
- 안전규칙 학습

## 개별 지원 사항
${context.supportNeeds.map(need => `- ${need}`).join('\n')}`;

      case AI_SERVICE_TYPES.ASSESSMENT:
        return `# ${studentName}님 교육평가 보고서

## 평가 개요
- 평가 기간: 최근 1개월
- 평가 영역: 학습능력, 사회성, 자립생활
- 평가 방법: 관찰, 포트폴리오, 실기평가

## 영역별 평가 결과

### 1. 학습 능력
**국어 영역**: 
- 단어 인식: 양호
- 문장 구성: 향상 필요
- 읽기 이해: 보통

**수학 영역**:
- 기초 연산: 양호
- 문제 해결: 향상 필요
- 실생활 적용: 보통

### 2. 사회성 발달
- 또래 관계: 양호
- 성인과의 상호작용: 우수
- 집단 활동 참여: 보통

### 3. 자립생활 기능
- 개인위생: 우수
- 일상생활 기술: 양호
- 안전 의식: 보통

## 개선 방안
1. 문장 구성 능력 향상을 위한 개별 지도
2. 문제 해결력 증진을 위한 단계별 접근
3. 집단 활동 참여 독려 프로그램

## 향후 목표
- 기능적 읽기 능력 향상
- 사회적 의사소통 기술 개발
- 자립생활 기능 확장`;

      case AI_SERVICE_TYPES.ADMIN_DOCUMENT:
        return `# 학생 진전 상황 보고서

**대상 학생**: ${studentName}
**작성일**: ${new Date().toLocaleDateString('ko-KR')}
**작성자**: 담당 특수교사

## 1. 학생 기본 정보
- 학년: ${grade}학년
- 장애 유형: ${context.profile.disabilityTypes.join(', ')}
- 통합교육 형태: ${context.profile.integrationType}

## 2. 현재 수행 수준
${Object.entries(context.currentLevels).map(([area, level]) => 
  `- ${area}: ${level}`
).join('\n')}

## 3. 주요 성과
- 의사소통 능력의 지속적인 향상
- 일상생활 기능의 안정적 수행
- 사회적 상호작용 기술 발전

## 4. 지원 현황
현재 제공되고 있는 지원 서비스:
${context.supportNeeds.map(need => `- ${need}`).join('\n')}

## 5. 향후 계획
- 개별화교육계획(IEP) 수정 및 보완
- 지역사회 적응 프로그램 참여 확대
- 가족 및 관련 전문가와의 협력 강화

본 보고서는 ${studentName} 학생의 교육적 발전을 위한 지속적인 지원 계획의 기초자료로 활용됩니다.`;

      case AI_SERVICE_TYPES.COUNSELING_GUIDE:
        return `# ${studentName}님 상담 가이드

## 상담 목표
- 정서적 안정감 증진
- 자기표현 능력 향상
- 스트레스 관리 기술 습득

## 현재 상태 분석
**정서 상태**: ${context.wellbeing?.currentState || '안정'}
**행동 특성**: 
${context.observations?.behaviors?.map(behavior => `- ${behavior}`).join('\n') || '- 관찰 데이터 수집 중'}

## 상담 접근 방법

### 1. 라포 형성
- 학생이 좋아하는 활동을 통한 관계 형성
- 비언어적 의사소통 활용
- 안전하고 편안한 환경 조성

### 2. 감정 표현 지원
- 감정카드를 이용한 감정 인식 연습
- 그림이나 만들기를 통한 감정 표현
- 단순하고 명확한 언어 사용

### 3. 문제 행동 개선
- 긍정적 행동 강화
- 대안 행동 제시 및 연습
- 예측 가능한 일과와 규칙 제공

## 가족 지원 방안
- 가정에서의 일관된 접근법 안내
- 부모 교육 및 상담 제공
- 정기적인 소통과 피드백

## 주의사항
- 강압적인 접근 금지
- 학생의 속도에 맞춘 진행
- 작은 성공 경험의 중요성 인식

이 가이드는 ${studentName}님의 개별적 특성을 고려하여 작성되었으며, 지속적인 관찰과 평가를 통해 수정 보완되어야 합니다.`;

      default:
        return `# AI 생성 결과\n\n${AI_SERVICE_LABELS[serviceType]} 서비스를 통해 생성된 내용입니다.\n\n학생: ${studentName}\n생성 시간: ${new Date().toLocaleString('ko-KR')}`;
    }
  }
}
