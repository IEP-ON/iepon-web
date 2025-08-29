// IEPON 시스템 타입 정의 (개발문서 기반)

// 공통 상태 타입
export type Status = 'active' | 'expired' | 'pending' | 'cancelled' | 'error';
export type DocumentStatus = 'draft' | 'finalized' | 'distributed';

// 학생 기본 정보 (04_주요_기능_명세.md 기반)
export interface Student {
  id: string;
  // 기본 정보
  name: string;
  birthDate: string;
  gender?: '남성' | '여성';
  
  // 학교 정보
  schoolName: string;
  grade: number; // 1-12학년
  className: string;
  homeTeacherName: string;
  
  // 통합교육 정보
  integrationType: '완전통합' | '부분통합';
  integrationHours: number; // 주당 통합 시간
  integrationSubjects: string[]; // 통합 과목들
  
  // 장애 정보
  disabilityTypes: DisabilityType[];
  disabilityRegistrationDate: string;
  hasWelfareCard: boolean;
  disabilitySeverity: '경증' | '중증';
  
  // 지원 정보
  welfareSupports: string[];
  treatmentSupports: string[];
  assistantSupports: string[];
  
  // 가족 정보
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
  
  // 복지/치료 정보
  hasDisabilityAllowance?: boolean;
  hasCaregiver?: boolean;
  hasSpeechTherapy?: boolean;
  hasOccupationalTherapy?: boolean;
  hasPhysicalTherapy?: boolean;
  hasPsychotherapy?: boolean;
  
  // 메모
  notes?: string;
  
  // 시스템 정보
  createdAt: string;
  updatedAt: string;
  status: Status;
  teacherId: string;
}

// 장애 유형
export interface DisabilityType {
  type: '지적장애' | '자폐성장애' | '정서행동장애' | '의사소통장애' | '학습장애' | '건강장애' | '발달지체' | '기타';
  description?: string;
}

// 복지 지원
export interface WelfareSupport {
  id: string;
  type: '장애인연금' | '장애수당' | '장애아동수당' | '보육료지원' | '방과후돌봄' | '기타';
  agency: string;
  content: string;
  startDate: string;
  endDate?: string;
  status: Status;
}

// 치료 지원
export interface TreatmentSupport {
  id: string;
  type: '언어치료' | '작업치료' | '물리치료' | '심리치료' | '놀이치료' | '기타';
  frequency: '주1회' | '주2회' | '주3회' | '월1회' | '월2회' | '기타';
  agency: string;
  therapistName: string;
  therapistContact: string;
  startDate: string;
  endDate?: string;
  status: Status;
}

// 보조인력 지원
export interface AssistantSupport {
  id: string;
  type: '특수교육실무사' | '사회복무요원' | '자원봉사자' | '기타';
  hoursPerWeek: number;
  name: string;
  contact: string;
  startDate: string;
  endDate?: string;
  status: Status;
}

// 개별화 교육 계획 (IEP)
export interface IEP {
  id: string;
  studentId: string;
  title: string;
  academicYear: string;
  semester: '1학기' | '2학기';
  
  // 현재 수준
  currentLevel: {
    cognitive: string;
    language: string;
    social: string;
    motor: string;
    selfCare: string;
    academic: string;
  };
  
  // 연간 목표
  annualGoals: Goal[];
  
  // 단기 목표
  shortTermGoals: Goal[];
  
  // 교육 서비스
  educationServices: EducationService[];
  
  // 평가 계획
  assessmentPlan: AssessmentPlan;
  
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 교육 목표
export interface Goal {
  id: string;
  domain: '인지' | '언어' | '사회성' | '운동' | '자조' | '학습';
  description: string;
  measurableObjective: string;
  criteria: string;
  timeframe: string;
  progress: number; // 0-100%
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

// 교육 서비스
export interface EducationService {
  id: string;
  type: '특수교육' | '치료지원' | '진로직업교육' | '상담지원';
  provider: string;
  frequency: string;
  duration: string;
  location: string;
  startDate: string;
  endDate: string;
}

// 평가 계획
export interface AssessmentPlan {
  methods: string[];
  schedule: string;
  criteria: string;
  responsibilities: string;
}

// 월간/주간 교육 계획
export interface EducationPlan {
  id: string;
  studentId: string;
  type: 'monthly' | 'weekly';
  title: string;
  period: {
    startDate: string;
    endDate: string;
  };
  
  subjects: SubjectPlan[];
  activities: Activity[];
  assessments: Assessment[];
  
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 과목별 계획
export interface SubjectPlan {
  id: string;
  subject: string;
  objectives: string[];
  content: string;
  methods: string[];
  materials: string[];
  evaluation: string;
}

// 활동 계획
export interface Activity {
  id: string;
  name: string;
  type: '개별활동' | '그룹활동' | '통합활동';
  description: string;
  duration: number; // 분 단위
  materials: string[];
  objectives: string[];
  date: string;
  time: string;
}

// 평가 정보
export interface Assessment {
  id: string;
  studentId: string;
  type: '진단평가' | '형성평가' | '총합평가';
  subject: string;
  method: string;
  date: string;
  score?: number;
  grade?: string;
  comments: string;
  recommendations: string[];
  assessorId: string;
}

// AI 분석 결과
export interface AIAnalysis {
  id: string;
  studentId: string;
  type: 'learning_progress' | 'behavior_pattern' | 'recommendation' | 'curriculum';
  title: string;
  
  // 분석 결과
  summary: string;
  strengths: string[];
  challenges: string[];
  recommendations: Recommendation[];
  
  // 데이터 기반
  dataSource: string[];
  analysisDate: string;
  confidence: number; // 0-100%
  
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  createdBy: string;
}

// AI 추천사항
export interface Recommendation {
  id: string;
  category: '교육방법' | '교육내용' | '평가방법' | '지원서비스';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedOutcome: string;
  implementation: string;
  timeframe: string;
}

// 사용자 정보 (특수교사)
export interface Teacher {
  id: string;
  email: string;
  name: string;
  school: string;
  department: string;
  certification: string;
  phone: string;
  joinDate: string;
  lastLogin?: string;
  status: Status;
  
  // 담당 학생들
  students: string[]; // student IDs
  
  // 권한
  permissions: Permission[];
}

// 권한 관리
export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  granted: boolean;
}

// 관리자 통계
export interface AdminStats {
  totalTeachers: number;
  totalStudents: number;
  activeIEPs: number;
  completedAssessments: number;
  pendingTasks: number;
  systemUsage: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    featureUsage: Record<string, number>;
  };
}

// 알림
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 파일 업로드
export interface FileUpload {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  category: 'document' | 'image' | 'video' | 'audio';
}

// API 응답 형태
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 페이지네이션
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 검색 필터
export interface SearchFilter {
  query?: string;
  status?: Status;
  dateRange?: {
    start: string;
    end: string;
  };
  category?: string;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// 교육과정 단원
export interface CurriculumUnit {
  id: string;
  unitName: string; // 단원명
  unitNumber: string; // 단원번호
  unitObjectives: string; // 단원목표(성취기준)
  educationContent: string; // 단원 교육내용(개요)
  teachingMethods: string[]; // 교육방법 (선택된 방법들)
  evaluationPlan?: string; // 평가계획 (선택사항)
  subject: string;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // 관리자 ID
}

// 교육방법 옵션
export const TEACHING_METHODS = [
  { id: 'modeling', name: '모델링', description: '교사가 직접 시범을 보이며 학습 과정을 보여주는 방법' },
  { id: 'demonstration', name: '시범보이기', description: '구체적인 기술이나 절차를 단계별로 보여주는 방법' },
  { id: 'guided_practice', name: '안내된 연습', description: '교사의 지도 하에 학생이 연습하는 방법' },
  { id: 'independent_practice', name: '독립적 연습', description: '학생이 스스로 연습하고 적용하는 방법' },
  { id: 'cooperative_learning', name: '협동학습', description: '학생들이 소그룹으로 협력하여 학습하는 방법' },
  { id: 'inquiry_learning', name: '탐구학습', description: '학생이 스스로 질문하고 답을 찾아가는 학습 방법' },
  { id: 'problem_solving', name: '문제해결학습', description: '실제 문제를 해결하면서 학습하는 방법' },
  { id: 'role_playing', name: '역할놀이', description: '특정 역할을 맡아 상황을 연출하며 학습하는 방법' },
  { id: 'storytelling', name: '스토리텔링', description: '이야기를 통해 개념이나 내용을 전달하는 방법' },
  { id: 'visual_learning', name: '시각적 학습', description: '그림, 도표, 영상 등을 활용한 학습 방법' }
] as const;

export interface CurriculumAssignment {
  id: string;
  studentId: string;
  unitId: string;
  assignedBy: string;
  assignmentReason: string;
  assignedMonths: string[]; // ['2024-03', '2024-04']
  
  // AI 기반 개별화 설정
  difficultyAdjustment: 'easy' | 'normal' | 'hard' | 'customized';
  individualizedGoals: string[];
  estimatedSessionTime: number; // 분 단위
  supportMaterials: string[];
  specialConsiderations: string;
  
  // 진도 추적
  progressStatus: 'assigned' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  progressPercentage: number;
  startDate?: string;
  completionDate?: string;
  progressNotes: string;
  
  // 적합성 분석
  levelCompatibility: number; // 0-100%
  learningLoad: number; // 월별 학습 부하량
  successPrediction: number; // 0-100%
  
  createdAt: string;
  updatedAt: string;
  status: Status;
}

// AI 기반 교육과정 추천
export interface CurriculumRecommendation {
  unitId: string;
  unitName: string;
  subject: string;
  confidence: number; // 0.0-1.0
  reason: string;
  expectedLearningSpeed: string;
  estimatedCompletionTime: string;
  supportNeeds: string[];
}

// 교사 개별화 선호도 설정 (09_AI_생성_서비스_통합.md 기반)
export interface TeacherPreferences {
  id: string;
  teacherId: string;
  
  // AI 생성 관련 선호도
  educationPhilosophy: string; // 교육 철학
  preferredMethods: string[]; // 선호 교수법 ['개별화', '협력학습', '체험학습']
  writingStyle: 'formal' | 'casual' | 'friendly' | 'professional'; // 문체 설정
  tone: 'polite' | 'encouraging' | 'directive' | 'supportive'; // 어투
  aiIntensity: 'high' | 'medium' | 'low' | 'none'; // AI 강도 (80%/50%/20%/0%)
  
  // 언어 및 표현 선호도
  preferredLanguage: 'ko' | 'en';
  formalityLevel: 'very_formal' | 'formal' | 'moderate' | 'casual';
  detailLevel: 'brief' | 'moderate' | 'detailed' | 'comprehensive';
  includeExamples: boolean;
  
  // 개별화 설정
  focusAreas: string[]; // ['인지발달', '언어발달', '사회성발달']
  avoidTerms: string[]; // 사용하지 않을 용어들
  customInstructions: string; // 사용자 지정 지침
  
  // 생성 선호도
  preferredContentLength: 'short' | 'medium' | 'long';
  includeVisualAids: boolean;
  emphasizePositiveAspects: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// AI 생성 요청 기본 구조 (09_AI_생성_서비스_통합.md 기반)
export interface AIGenerationRequest {
  id: string;
  studentId: string;
  serviceType: 'curriculum_assignment' | 'lesson_plan' | 'assessment' | 'admin_document' | 'counseling_guide';
  requestId: string;
  priority: 'high' | 'normal' | 'low';
  deadline?: string;
  additionalContext: Record<string, any>;
  teacherPreferences?: TeacherPreferences;
  
  // 요청 상태
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  requestedBy: string;
}

// AI 생성 결과
export interface AIGenerationResult {
  id: string;
  requestId: string;
  serviceType: string;
  studentId: string;
  generatedContent: any;
  
  // 메타데이터
  metadata: {
    model: string;
    temperature: number;
    maxTokens: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    processingTime: number;
    retryCount: number;
    version: string;
  };
  
  // 컨텍스트 사용 정보
  contextUsage: {
    dataSourcesUsed: string[];
    contextCompleteness: number;
    individualizedElements: string[];
    adaptationsApplied: string[];
    supportNeedsAddressed: string[];
  };
  
  qualityScore: number; // 0-100
  confidenceLevel: number; // 0-100
  generatedAt: string;
  validatedAt?: string;
  errors: string[];
  warnings: string[];
}

// 월별 교육계획 (개발문서 기반으로 업데이트)
export interface MonthlyPlan {
  id: string;
  studentId: string;
  academicYear: string;
  month: string; // '2024-03'
  subject: string;
  
  // 배정된 교육과정 연동
  assignedUnits: string[]; // CurriculumAssignment IDs
  
  // 계획 내용
  planTitle: string;
  educationGoals: string[];
  teachingMethods: string[];
  learningActivities: string[];
  evaluationMethods: string[];
  supportPlans: string[];
  
  // 개별화 요소
  individualizedGoals: string[];
  adaptiveStrategies: string[];
  supportNeeds: string[];
  
  // 일정
  startDate: string;
  endDate: string;
  keyDates: Array<{
    date: string;
    event: string;
    description: string;
  }>;
  
  // AI 생성 여부 및 메타데이터
  isAiGenerated: boolean;
  aiGenerationId?: string;
  teacherPreferencesUsed?: TeacherPreferences;
  
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
