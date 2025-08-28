'use client';

/**
 * AI 생성 서비스 통합 타입 정의
 * 개발문서 09_AI_생성_서비스_통합.md 기반 구현
 */

// AI 서비스 타입 상수
export const AI_SERVICE_TYPES = {
  CURRICULUM_ASSIGNMENT: 'curriculum_assignment',
  LESSON_PLAN: 'lesson_plan', 
  ASSESSMENT: 'assessment',
  ADMIN_DOCUMENT: 'admin_document',
  COUNSELING_GUIDE: 'counseling_guide'
} as const;

// 서비스별 한글 라벨
export const AI_SERVICE_LABELS = {
  [AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT]: '교육과정 배정',
  [AI_SERVICE_TYPES.LESSON_PLAN]: '교육계획 수립',
  [AI_SERVICE_TYPES.ASSESSMENT]: '교육평가',
  [AI_SERVICE_TYPES.ADMIN_DOCUMENT]: '행정문서',
  [AI_SERVICE_TYPES.COUNSELING_GUIDE]: '상담가이드'
} as const;

export type AIServiceType = typeof AI_SERVICE_TYPES[keyof typeof AI_SERVICE_TYPES];

/**
 * AI 생성 메타데이터 인터페이스
 */
export interface AIGenerationMetadata {
  model: string;
  temperature: number;
  maxTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  processingTime: number;
  retryCount: number;
  version: string;
  requestId?: string;
  serviceType?: AIServiceType;
}

/**
 * 컨텍스트 사용 정보 인터페이스
 */
export interface ContextUsageInfo {
  dataSourcesUsed: string[];
  contextCompleteness: number;
  individualizedElements: string[];
  adaptationsApplied: string[];
  supportNeedsAddressed: string[];
}

/**
 * AI 생성 결과 통합 인터페이스
 */
export interface AIGenerationResult {
  id: string;
  serviceType: AIServiceType;
  studentId: string;
  generatedContent: string | null;
  metadata: AIGenerationMetadata;
  contextUsage: ContextUsageInfo;
  qualityScore: number;
  confidenceLevel: number;
  generatedAt: string;
  validatedAt: string | null;
  errors: string[];
  warnings: string[];
}

/**
 * AI 생성 요청 인터페이스
 */
export interface BaseAIGenerationRequest {
  studentId: string;
  serviceType: AIServiceType;
  requestId: string;
  priority: 'low' | 'normal' | 'high';
  deadline: string | null;
  additionalContext: Record<string, unknown>;
}

/**
 * 사용자 선호도 인터페이스
 */
export interface UserPreferences {
  language: string;
  tone: 'professional' | 'friendly' | 'formal';
  detailLevel: 'brief' | 'moderate' | 'detailed';
  includeExamples: boolean;
  focusAreas: string[];
  avoidTerms: string[];
  customInstructions: string;
}

/**
 * AI 생성 에러 클래스
 */
export class AIGenerationError extends Error {
  public readonly code: string;
  public readonly serviceType: AIServiceType | string;
  public readonly context: unknown;
  public readonly timestamp: string;
  public readonly retryable: boolean;

  constructor(
    message: string,
    serviceType: AIServiceType | string = '',
    code = 'GENERATION_FAILED',
    context: unknown = null,
    retryable = true
  ) {
    super(message);
    this.name = 'AIGenerationError';
    this.code = code;
    this.serviceType = serviceType;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.retryable = retryable;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AIGenerationError);
    }
  }

  /**
   * 사용자 친화적인 에러 메시지 생성
   */
  getUserFriendlyMessage(): string {
    switch (this.code) {
      case 'CONTEXT_BUILD_FAILED':
        return '학생 정보를 불러오는 중 오류가 발생했습니다.';
      case 'AI_API_ERROR':
        return 'AI 서비스 연결에 문제가 발생했습니다.';
      case 'VALIDATION_FAILED':
        return '생성된 내용의 검증에 실패했습니다.';
      case 'QUOTA_EXCEEDED':
        return 'AI 생성 할당량을 초과했습니다.';
      case 'UTF8_ENCODING_ERROR':
        return '텍스트 인코딩 처리 중 오류가 발생했습니다.';
      case 'NETWORK_ERROR':
        return '네트워크 연결에 문제가 발생했습니다.';
      case 'TIMEOUT_ERROR':
        return 'AI 생성 시간이 초과되었습니다.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'AI 생성 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      default:
        return 'AI 생성 중 오류가 발생했습니다.';
    }
  }

  /**
   * 접근성을 위한 ARIA 정보 생성
   */
  getAccessibilityInfo() {
    return {
      role: 'alert',
      'aria-live': 'assertive',
      'aria-label': `오류 발생: ${this.getUserFriendlyMessage()}`
    };
  }
}

/**
 * 교육과정 배정 특화 요청 데이터
 */
export interface CurriculumAssignmentRequest extends BaseAIGenerationRequest {
  currentLevel: string;
  preferredSubjects: string[];
  learningPace: 'slow' | 'normal' | 'fast';
  targetSkills: string[];
}

/**
 * 교육계획 수립 특화 요청 데이터
 */
export interface LessonPlanRequest extends BaseAIGenerationRequest {
  targetSkills: string[];
  teachingMethods: string[];
  sessionDuration: number;
  materialsAvailable: string[];
  adaptations: string[];
}

/**
 * 교육평가 특화 요청 데이터
 */
export interface AssessmentRequest extends BaseAIGenerationRequest {
  assessmentType: 'formative' | 'summative' | 'diagnostic';
  targetAreas: string[];
  assessmentFormat: 'written' | 'practical' | 'observation' | 'portfolio';
  accommodations: string[];
}

/**
 * 행정문서 특화 요청 데이터
 */
export interface AdminDocumentRequest extends BaseAIGenerationRequest {
  documentType: 'report' | 'iep' | 'progress_note' | 'communication';
  targetAudience: 'parents' | 'administrators' | 'teachers' | 'students';
  formalityLevel: 'casual' | 'professional' | 'formal';
  includeData: boolean;
}

/**
 * 상담가이드 특화 요청 데이터
 */
export interface CounselingGuideRequest extends BaseAIGenerationRequest {
  behaviorPatterns: string[];
  emotionalState: 'stable' | 'anxious' | 'depressed' | 'excited' | 'confused';
  socialInteractions: string[];
  interventionGoals: string[];
}

// 유니온 타입으로 모든 요청 타입 결합
export type AIGenerationRequest = 
  | CurriculumAssignmentRequest 
  | LessonPlanRequest 
  | AssessmentRequest 
  | AdminDocumentRequest 
  | CounselingGuideRequest;

/**
 * AI 생성 상태
 */
export type AIGenerationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * AI 서비스 상태 인터페이스
 */
export interface AIServiceState {
  status: AIGenerationStatus;
  progress: number;
  currentStep: string;
  result: AIGenerationResult | null;
  error: AIGenerationError | null;
  isRetrying: boolean;
  retryCount: number;
}

/**
 * AI 생성 이력 인터페이스
 */
export interface AIGenerationHistory {
  id: string;
  studentId: string;
  userId: string;
  serviceType: AIServiceType;
  resultId: string;
  processingTime: number;
  qualityScore: number;
  confidenceLevel: number;
  createdAt: string;
}

/**
 * AI 서비스 설정 인터페이스
 */
export interface AIServiceConfig {
  apiBaseUrl: string;
  rateLimitWindow: number;
  maxRequestsPerWindow: number;
  requestTimeout: number;
  maxRetries: number;
  enableCaching: boolean;
  cacheTimeout: number;
}

/**
 * 학생 컨텍스트 인터페이스 (AI 생성용)
 */
export interface StudentContextForAI {
  profile: {
    id: string;
    name: string;
    grade: number;
    disabilityTypes: string[];
    integrationType: string;
  };
  currentLevels: Record<string, string | number>;
  recentActivities: Array<{
    type: string;
    description: string;
    date: string;
    outcome: string;
  }>;
  supportNeeds: string[];
  goals: {
    shortTerm: string[];
    longTerm: string[];
    targetSkills: string[];
  };
  preferences: {
    subjects: string[];
    teachingMethods: string[];
    sessionDuration: number;
  };
  analytics: {
    strengths: string[];
    improvements: string[];
    averagePace: string;
  };
  assessments: {
    recent: Array<{
      type: string;
      subject: string;
      score: number;
      date: string;
      notes: string;
    }>;
  };
  observations: {
    behaviors: string[];
    socialInteractions: string[];
    communicationPatterns: string[];
  };
  wellbeing: {
    currentState: string;
    concerns: string[];
    interventions: string[];
  };
}
