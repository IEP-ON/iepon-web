/**
 * AI 생성 서비스 타입 정의
 * 개발문서 09_AI_생성_서비스_통합.md 기반 구현
 */

// AI 서비스 타입 열거형
export enum AIServiceType {
  CURRICULUM_ASSIGNMENT = 'curriculum_assignment',
  LESSON_PLAN = 'lesson_plan',
  ASSESSMENT = 'assessment',
  ADMIN_DOCUMENT = 'admin_document',
  COUNSELING_GUIDE = 'counseling_guide'
}

// AI 서비스 한글 라벨
export const AI_SERVICE_LABELS: Record<AIServiceType, string> = {
  [AIServiceType.CURRICULUM_ASSIGNMENT]: '교육과정 배정',
  [AIServiceType.LESSON_PLAN]: '교육계획 수립',
  [AIServiceType.ASSESSMENT]: '교육평가',
  [AIServiceType.ADMIN_DOCUMENT]: '행정문서',
  [AIServiceType.COUNSELING_GUIDE]: '상담가이드'
};

// AI 서비스 설명
export const AI_SERVICE_DESCRIPTIONS: Record<AIServiceType, string> = {
  [AIServiceType.CURRICULUM_ASSIGNMENT]: '학생의 현행수준과 지원요구사항을 기반으로 개별화된 교육과정을 자동 배정합니다.',
  [AIServiceType.LESSON_PLAN]: '월간/주간 교육계획과 개별화교육계획(IEP)을 AI가 생성합니다.',
  [AIServiceType.ASSESSMENT]: '학생별 평가 기준과 관찰 기록지를 맞춤 생성합니다.',
  [AIServiceType.ADMIN_DOCUMENT]: '개별화교육지원팀 회의록, 전환계획서 등 행정문서를 작성합니다.',
  [AIServiceType.COUNSELING_GUIDE]: '학생과 가족을 위한 상담 가이드와 지원 계획을 제안합니다.'
};

// AI 생성 결과 메타데이터
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
}

// 컨텍스트 사용 정보
export interface ContextUsageInfo {
  dataSourcesUsed: string[];
  contextCompleteness: number;
  individualizedElements: string[];
  adaptationsApplied: string[];
  supportNeedsAddressed: string[];
}

// AI 생성 결과 기본 구조
export interface AIGenerationResult {
  id: string;
  serviceType: AIServiceType;
  studentId: string;
  generatedContent: any;
  metadata: AIGenerationMetadata;
  contextUsage: ContextUsageInfo;
  qualityScore: number;
  confidenceLevel: number;
  generatedAt: string;
  validatedAt?: string;
  errors: string[];
  warnings: string[];
}

// AI 생성 요청 기본 구조
export interface AIGenerationRequest {
  studentId: string;
  serviceType: AIServiceType;
  requestId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  deadline?: string;
  additionalContext: Record<string, any>;
  userPreferences?: UserPreferences;
}

// 사용자 선호도
export interface UserPreferences {
  language: string;
  tone: 'professional' | 'friendly' | 'formal';
  detailLevel: 'minimal' | 'moderate' | 'detailed';
  includeExamples: boolean;
  focusAreas: string[];
  avoidTerms: string[];
  customInstructions: string;
}

// 서비스별 특화 데이터 구조

// 교육과정 배정 결과
export interface CurriculumAssignmentResult extends AIGenerationResult {
  generatedContent: {
    assignedUnits: Array<{
      subject: string;
      grade: number;
      semester: number;
      unitNumber: number;
      unitTitle: string;
      achievementStandards: string[];
      adaptations: string[];
      supportNeeds: string[];
    }>;
    rationale: string;
    recommendations: string[];
    nextSteps: string[];
  };
}

// 교육계획 수립 결과
export interface LessonPlanResult extends AIGenerationResult {
  generatedContent: {
    planType: 'monthly' | 'weekly' | 'iep';
    period: string;
    goals: Array<{
      area: string;
      objective: string;
      criteria: string;
      methods: string[];
    }>;
    activities: Array<{
      title: string;
      description: string;
      duration: string;
      materials: string[];
      adaptations: string[];
    }>;
    assessment: {
      methods: string[];
      criteria: string[];
      schedule: string;
    };
  };
}

// 교육평가 결과
export interface AssessmentResult extends AIGenerationResult {
  generatedContent: {
    assessmentType: 'observation' | 'performance' | 'portfolio' | 'standardized';
    criteria: Array<{
      area: string;
      indicators: string[];
      rubric: Array<{
        level: string;
        description: string;
        points: number;
      }>;
    }>;
    observationSheet: {
      categories: string[];
      items: Array<{
        category: string;
        item: string;
        scale: string[];
      }>;
    };
    reportTemplate: string;
  };
}

// 행정문서 결과
export interface AdminDocumentResult extends AIGenerationResult {
  generatedContent: {
    documentType: 'iep_meeting' | 'transition_plan' | 'support_request' | 'progress_report';
    title: string;
    sections: Array<{
      heading: string;
      content: string;
      required: boolean;
    }>;
    formFields: Array<{
      label: string;
      type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date';
      options?: string[];
      required: boolean;
    }>;
    templates: Record<string, string>;
  };
}

// 상담가이드 결과
export interface CounselingGuideResult extends AIGenerationResult {
  generatedContent: {
    targetAudience: 'student' | 'parent' | 'teacher' | 'team';
    concerns: string[];
    strategies: Array<{
      area: string;
      approach: string;
      techniques: string[];
      resources: string[];
    }>;
    actionPlan: Array<{
      phase: string;
      timeline: string;
      activities: string[];
      responsible: string[];
      outcomes: string[];
    }>;
    resources: Array<{
      type: 'book' | 'website' | 'organization' | 'professional';
      title: string;
      description: string;
      url?: string;
    }>;
  };
}

// AI 생성 에러 클래스
export class AIGenerationError extends Error {
  public code: string;
  public serviceType: AIServiceType;
  public context: any;
  public timestamp: string;
  public retryable: boolean;

  constructor(
    message: string,
    serviceType: AIServiceType,
    code = 'GENERATION_FAILED',
    context: any = null,
    retryable = true
  ) {
    super(message);
    this.name = 'AIGenerationError';
    this.code = code;
    this.serviceType = serviceType;
    this.context = context;
    this.timestamp = new Date().toISOString();
    this.retryable = retryable;
  }

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
      case 'RATE_LIMITED':
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      default:
        return 'AI 생성 중 오류가 발생했습니다.';
    }
  }
}

// 유틸리티 함수들
export const aiServiceUtils = {
  validateUTF8: (text: string): boolean => {
    try {
      const encoded = new TextEncoder().encode(text);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      return decoded === text;
    } catch {
      return false;
    }
  },

  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  },

  generateRequestId: (): string => {
    return `ai-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  calculateQualityScore: (result: AIGenerationResult): number => {
    let score = 0;
    
    // 기본 점수
    score += result.confidenceLevel * 0.4;
    
    // 컨텍스트 활용도
    score += (result.contextUsage.contextCompleteness / 100) * 0.3;
    
    // 개별화 수준
    const individualizationCount = 
      result.contextUsage.individualizedElements.length +
      result.contextUsage.adaptationsApplied.length +
      result.contextUsage.supportNeedsAddressed.length;
    score += Math.min(individualizationCount / 10, 1) * 0.2;
    
    // 에러/경고 페널티
    const errorPenalty = (result.errors.length * 10) + (result.warnings.length * 5);
    score -= errorPenalty;
    
    return Math.max(0, Math.min(100, score));
  },

  formatProcessingTime: (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}초`;
    return `${Math.floor(milliseconds / 60000)}분 ${Math.floor((milliseconds % 60000) / 1000)}초`;
  }
};
