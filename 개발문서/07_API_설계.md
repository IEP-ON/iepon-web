# 🔌 IEPON MCP API 설계 (HTMX + Alpine.js + MCP)

> **연결 문서**: [02_데이터베이스_설계.md](./02_데이터베이스_설계.md) | [06_상태_관리.md](./06_상태_관리.md) | [10_보안_권한.md](./10_보안_권한.md) | [08_환경_설정.md](./08_환경_설정.md) | [14_결제_설계.md](./14_결제_설계.md)
> 
> **기술 스택**: HTML5 + Alpine.js + HTMX + Supabase MCP + Toss Payments MCP

---

## 7.1 MCP 기반 API 아키텍처

### 7.1.1 Supabase MCP + HTMX 통신 구조
- **HTMX 요청**: `hx-get`, `hx-post`, `hx-put`, `hx-delete` 속성 기반 통신
- **Supabase MCP**: MCP 서버를 통한 PostgreSQL + Auth + Storage + Edge Functions 연동
- **Toss Payments MCP**: AI 에이전트 기반 자동 결제 처리
- **실시간 동기화**: MCP Realtime + Alpine.js 상태 업데이트
- **파일 업로드**: HTMX `hx-encoding="multipart/form-data"` + Supabase MCP Storage
- **인증 관리**: Supabase MCP Auth + HTMX 헤더 자동 처리
- **MCP 툴 연동**: window.mcp.callTool() 인터페이스 통합

### 7.1.2 HTMX 응답 표준화 (비전공자 친화적)

#### HTML 응답 패턴
```html
<!-- ✅ 성공 응답: 학생 정보 업데이트 -->
<div id="student-info" class="success-update">
  <div class="alert alert-success" role="alert">
    ✅ 학생 정보가 성공적으로 저장되었습니다.
  </div>
  <div class="student-details">
    <h3>김철수</h3>
    <p>학급: 3학년 2반</p>
    <!-- 업데이트된 내용 표시 -->
  </div>
</div>

<!-- ❌ 오류 응답: 입력값 검증 실패 -->
<div id="student-form" class="error-state">
  <div class="alert alert-danger" role="alert">
    ❌ 입력하신 정보를 다시 확인해 주세요.
  </div>
  <ul class="error-list">
    <li>학생 이름은 필수 입력 사항입니다.</li>
    <li>생년월일 형식이 올바르지 않습니다.</li>
  </ul>
</div>
```

#### JSON 응답 구조 (Supabase Edge Functions 용)
```javascript
// ✅ 성공 응답 생성 함수 (단순화)
function createSuccessResponse(data, message = '처리 완료') {
  return new Response(JSON.stringify({
    success: true,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// ❌ 오류 응답 생성 함수 (한글 메시지)
function createErrorResponse(message, details = null) {
  return new Response(JSON.stringify({
    success: false,
    message: message,
    details: details,
    timestamp: new Date().toISOString()
  }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

---

## 7.2 Alpine.js 데이터 구조 (비전공자 친화적)

### 7.2.1 학생 정보 데이터 구조

#### 기본 데이터 타입 정의 (JavaScript 객체 기반)
```javascript
// 🎯 학생 기본 정보 구조
const studentBasicInfo = {
  name: '',           // 학생 이름
  birthDate: '',      // 생년월일
  schoolName: '',     // 학교명
  grade: 0,           // 학년
  className: '',      // 반
  teacherName: '',    // 담임교사명
  inclusionType: '',  // 통합교육 유형
  disabilityTypes: [], // 장애 유형 목록
  status: 'active'    // 상태 (활성/비활성)
};

// 📋 복지 정보 구조 (이해하기 쉬운 명명)
const welfareInfo = {
  disabilityAllowance: false,     // 장애수당 여부
  mobilityAllowance: false,       // 이동수당 여부
  rehabilitationService: false,   // 재활서비스 여부
  otherBenefits: [],             // 기타 혜택 목록
  notes: ''                      // 비고사항
};

// 🏥 치료 지원 구조
const therapyInfo = {
  speechTherapy: {
    enabled: false,
    frequency: '',    // 주 2회, 월 8회 등
    duration: '',     // 30분, 1시간 등
    provider: '',     // 치료사/기관명
    notes: ''
  },
  occupationalTherapy: {
    enabled: false,
    frequency: '',
    duration: '',
    provider: '',
    notes: ''
  },
  physicalTherapy: {
    enabled: false,
    frequency: '',
    duration: '',
    provider: '',
    notes: ''
  }
};

// 👥 보조 지원 구조
const assistantInfo = {
  personalAssistant: {
    enabled: false,
    type: '',         // 전일제, 시간제, 필요시
    hoursPerWeek: 0,
    provider: '',
    notes: ''
  },
  transportSupport: {
    enabled: false,
    type: '',         // 학교버스, 택시, 개인차량
    provider: '',
    notes: ''
  }
};
```

// 📜 작업 기록 및 접근 로그 구조
const historyEntryTemplate = {
  id: '',
  action: '',          // '등록', '수정', '삭제', '상태변경'
  description: '',     // '학생 정보를 수정했습니다'
  changedFields: [],   // ['이름', '생년월일']
  oldValues: {},       // 수정 전 값들
  newValues: {},       // 수정 후 값들
  timestamp: '',       // '수정 시간'
  userId: '',
  userName: ''         // '김선생'
};

const accessLogTemplate = {
  id: '',
  action: '',          // '조회', '편집', '삭제', '다운로드', '내보내기'
  resourceType: '',    // '학생정보', '교육계획'
  resourceId: '',      // 대상 ID
  ipAddress: '',
  userAgent: '',
  timestamp: '',
  userId: '',
  success: true,       // 성공 여부
  errorMessage: ''     // 오류 시 메시지
};

// 👨‍🏫 학생별 작업 기록 구조
const studentHistoryTemplate = {
  ...historyEntryTemplate,
  studentId: '',
  category: ''         // '기본정보', '교육가계획', '평가', '첨부파일'
};

// 🔍 상세 접근 로그 구조
const detailedAccessLog = {
  ...accessLogTemplate,
  details: {
    sectionAccessed: '', // '기본정보 탭', '교육계획 탭'
    durationSeconds: 0,  // 사용 시간(초)
    actionsPerformed: [] // 수행한 작업 목록
  }
};

```

#### 💰 복지 지원 정보 구조 (사용자 친화적)
```javascript
// 복지 지원 상태 관리 (Alpine.js 상태)
const welfareStatusData = {
  disabilityAllowance: false,     // 장애수당 수급 여부
  mobilityAllowance: false,       // 이동수당 수급 여부
  rehabilitationService: false,   // 재활서비스 이용 여부
  otherBenefits: [],             // 기탄 혜택 목록
  notes: '',                     // 추가 설명
  
  // HTMX 실시간 업데이트를 위한 상태
  isUpdating: false,
  lastUpdated: '',
  hasChanges: false
};

// 복지 지원 옵션 목록 (선택 가능한 항목)
const welfareOptions = {
  allowanceTypes: [
    { value: 'disability', label: '장애수당' },
    { value: 'mobility', label: '이동수당' },
    { value: 'caregiver', label: '돌봄수당' }
  ],
  serviceTypes: [
    { value: 'rehabilitation', label: '재활서비스' },
    { value: 'counseling', label: '상담서비스' },
    { value: 'education', label: '교육지원' }
  ]
};

#### 🏥 치료 지원 정보 구조 (치료 진행 상황 관리)
```javascript
// 치료 지원 현황 데이터
const therapySupportData = {
  speechTherapy: {
    enabled: false,      // 언어치료 여부
    frequency: '',       // '주 2회', '월 8회'
    duration: '',        // '30분', '1시간'
    provider: '',        // '김언어치료사', 'OO병원'
    notes: '',          // 추가 설명
    progress: ''         // '진행중', '완료', '중단'
  },
  occupationalTherapy: {
    enabled: false,      // 작업치료 여부
    frequency: '',
    duration: '',
    provider: '',
    notes: '',
    progress: ''
  },
  physicalTherapy: {
    enabled: false,      // 물리치료 여부
    frequency: '',
    duration: '',
    provider: '',
    notes: '',
    progress: ''
  },
  behavioralTherapy: {
    enabled: false,      // 행동치료 여부
    frequency: '',
    duration: '',
    provider: '',
    notes: '',
    progress: ''
  },
  
  // 추가 치료 목록
  otherTherapies: [],
  
  // HTMX 실시간 업데이트를 위한 상태
  isUpdating: false,
  lastUpdated: '',
  totalTherapyCount: 0 // 전체 치료 갯수
};

// 치료 빈도 옵션
const therapyFrequencyOptions = [
  { value: 'weekly-1', label: '주 1회' },
  { value: 'weekly-2', label: '주 2회' },
  { value: 'weekly-3', label: '주 3회' },
  { value: 'monthly-4', label: '월 4회' },
  { value: 'monthly-8', label: '월 8회' }
];

// 치료 시간 옵션
const therapyDurationOptions = [
  { value: '30min', label: '30분' },
  { value: '45min', label: '45분' },
  { value: '1hour', label: '1시간' },
  { value: '1.5hour', label: '1시간 30분' }
];

#### 👥 보조 지원 정보 구조 (일상 지원 현황)
```javascript
// 보조 지원 현황 데이터 (Alpine.js 상태 관리)
const assistantSupportData = {
  personalAssistant: {
    enabled: false,
    type: '',            // '전일제', '시간제', '필요시'
    hoursPerWeek: 0,     // 주간 지원 시간
    provider: '',        // 지원 기관/담당자
    notes: ''
  },
  educationalAssistant: {
    enabled: false,
    type: '',            // '전담', '공동', '순회'
    hoursPerWeek: 0,
    provider: '',
    notes: ''
  },
  transportSupport: {
    enabled: false,
    type: '',            // '학교버스', '택시', '개인차량'
    provider: '',        // 운송업체/기관
    routeInfo: '',       // 노선 정보
    notes: ''
  },
  equipmentSupport: {
    enabled: false,
    items: [],           // 지원 장비 목록
    provider: '',        // 지원 기관
    maintenanceDate: '', // 점검 날짜
    notes: ''
  },
  
  // HTMX 실시간 업데이트 상태
  isUpdating: false,
  lastUpdated: '',
  totalSupportCount: 0  // 전체 지원 항목 수
};

// 보조 지원 유형 옵션
const assistantTypeOptions = {
  personal: [
    { value: 'fulltime', label: '전일제' },
    { value: 'parttime', label: '시간제' },
    { value: 'ondemand', label: '필요시' }
  ],
  educational: [
    { value: 'dedicated', label: '전담' },
    { value: 'shared', label: '공동' },
    { value: 'visiting', label: '순회' }
  ],
  transport: [
    { value: 'school_bus', label: '학교버스' },
    { value: 'taxi', label: '택시' },
    { value: 'private', label: '개인차량' }
  ]
};

```

#### 👨‍👩‍👧‍👦 보호자 정보 구조 (가족 연락처 관리)
```javascript
// 보호자 정보 데이터 (Alpine.js 상태 관리)
const guardianInfoData = {
  id: '',
  name: '',               // 보호자 성명
  relationship: '',       // 관계 ('부모', '조부모', '형제자매', '기타')
  phone: '',             // 휴대폰 번호
  email: '',             // 이메일 주소
  address: '',           // 주소
  isPrimary: false,      // 주 보호자 여부
  isEmergencyContact: false, // 긴급연락처 여부
  occupation: '',        // 직업
  workPhone: '',         // 직장 전화번호
  notes: '',            // 특이사항
  
  // HTMX 실시간 업데이트 상태
  isUpdating: false,
  lastUpdated: '',
  isValidated: false     // 연락처 검증 상태
};

// 보호자 관계 옵션
const guardianRelationshipOptions = [
  { value: 'father', label: '아버지' },
  { value: 'mother', label: '어머니' },
  { value: 'grandfather', label: '할아버지' },
  { value: 'grandmother', label: '할머니' },
  { value: 'sibling', label: '형제/자매' },
  { value: 'relative', label: '친척' },
  { value: 'guardian', label: '후견인' },
  { value: 'other', label: '기타' }
];

#### 🏠 일상생활 정보 구조 (자립도 평가 및 지원 현황)
```javascript
// 일상생활 능력 평가 데이터 (Alpine.js 상태 관리)
const dailyLifeInfoData = {
  mobility: {
    level: '',           // 이동능력 ('독립', '부분지원', '전적지원')
    aids: [],           // 보조기구 목록 (['휠체어', '보행기'])
    indoorLevel: '',    // 실내 이동 능력
    outdoorLevel: '',   // 실외 이동 능력
    notes: ''
  },
  communication: {
    level: '',          // 의사소통 능력
    methods: [],        // 소통 방법 (['말하기', '수어', '그림카드'])
    understandingLevel: '', // 이해 능력
    expressionLevel: '',    // 표현 능력
    notes: ''
  },
  selfCare: {
    level: '',          // 자기관리 능력
    areas: [],          // 지원 필요 영역 (['식사', '위생', '옷입기'])
    eatingLevel: '',    // 식사 자립도
    hygieneLevel: '',   // 위생 자립도
    dressingLevel: '',  // 옷입기 자립도
    notes: ''
  },
  socialInteraction: {
    level: '',          // 사회적 상호작용 능력
    preferences: [],    // 선호하는 활동
    peerInteraction: '', // 또래 관계
    adultInteraction: '', // 성인과의 관계
    groupActivity: '',   // 집단 활동 참여도
    notes: ''
  },
  learning: {
    level: '',          // 학습 능력
    methods: [],        // 효과적인 학습 방법
    attention: '',      // 주의집중력
    memory: '',         // 기억력
    comprehension: '',  // 이해력
    preferredStyle: '', // 선호하는 학습 스타일
    notes: ''
  },
  
  // HTMX 실시간 업데이트 상태
  isUpdating: false,
  lastUpdated: '',
  overallScore: 0,    // 전체 자립도 점수
  assessmentDate: ''  // 평가일
};

// 자립도 레벨 옵션
const independenceLevels = [
  { value: 'independent', label: '독립', score: 3 },
  { value: 'partial_support', label: '부분지원', score: 2 },
  { value: 'full_support', label: '전적지원', score: 1 }
];

#### 💾 자동저장 상태 구조 (HTMX 실시간 저장)
```javascript
// 자동저장 상태 데이터 (Alpine.js 상태 관리)
const autosaveStateData = {
  lastSavedAt: '',           // 마지막 저장 시간
  draftData: {
    tempFields: {},          // 임시 저장된 필드들
    validationErrors: [],    // 유효성 검사 오류 목록
    unsavedChanges: false    // 저장되지 않은 변경사항 여부
  },
  completionPercentage: 0,   // 입력 완성도 (0-100)
  currentSection: '',        // 현재 작업 중인 섹션
  validationErrors: [],      // 전체 유효성 검사 오류
  
  // HTMX 자동저장 설정
  autoSaveEnabled: true,     // 자동저장 활성화 여부
  saveInterval: 30,          // 자동저장 간격(초)
  isAutoSaving: false,       // 자동저장 진행 중 여부
  lastAutoSaveAt: ''         // 마지막 자동저장 시간
};

```

### 7.2.2 전체 학생 정보 통합 구조 (Alpine.js 메인 데이터)

#### 🎓 학생 메인 데이터 구조 (모든 정보 통합)
```javascript
// 학생 전체 정보 통합 데이터 (Alpine.js 메인 상태)
const studentMainData = {
  // 기본 정보
  id: '',
  userId: '',              // 담당 교사 ID
  name: '',               // 학생 이름
  birthDate: '',          // 생년월일
  ageKorean: 0,          // 한국 나이 (자동 계산)
  ageInternational: 0,    // 만 나이 (자동 계산)
  
  // 학교 정보
  schoolName: '',         // 학교명
  grade: 0,              // 학년
  classNum: '',          // 반
  homeroomTeacher: '',   // 담임교사명
  inclusionType: '',     // 통합교육 유형
  
  // 장애 정보
  disabilityTypes: [],    // 장애 유형 목록 (필수)
  disabilityDate: '',     // 진단일
  hasDisabilityCard: false, // 장애인등록증 여부
  
  // 세부 정보 (위에서 정의한 구조들 포함)
  welfareInfo: { ...welfareStatusData },
  therapyInfo: { ...therapySupportData },
  assistantInfo: { ...assistantSupportData },
  guardiansList: [],      // 보호자 목록
  dailyLifeInfo: { ...dailyLifeInfoData },
  
  // 추가 정보
  likes: [],              // 좋아하는 것들
  sensitivities: [],      // 민감한 사항들
  assistiveDevices: [],   // 보조기구 목록
  diagnosisFiles: [],     // 진단서 파일 목록
  
  // HTMX 상태 관리
  autosaveState: { ...autosaveStateData },
  status: 'active',       // 상태 ('활성', '비활성', '졸업')
  isUpdating: false,      // 업데이트 진행 중 여부
  lastUpdated: '',        // 마지막 업데이트 시간
  
  // 이력 및 로그
  recentHistory: [],      // 최근 변경 이력
  accessLogs: []          // 접근 로그
};

// 학생 정보 입력 폼 데이터 (간소화)
const studentFormData = {
  name: '',
  birthDate: '',
  schoolName: '',
  grade: 0,
  classNum: '',
  homeroomTeacher: '',
  inclusionType: '',
  disabilityTypes: [],
  disabilityDate: '',
  hasDisabilityCard: false,
  
  // 폼 상태 관리
  isSubmitting: false,
  validationErrors: [],
  currentStep: 1,         // 다단계 폼의 현재 단계
  totalSteps: 5           // 전체 단계 수
};



### 7.2.3 교육 관련 데이터 구조 (교육과정 및 평가)

#### 📊 현재 수준 평가 구조 (학기별 학습 현황)
```javascript
// 현재 수준 평가 데이터 (Alpine.js 상태 관리)
const currentLevelData = {
  id: '',
  studentId: '',           // 학생 ID
  userId: '',             // 평가 교사 ID
  semester: '',           // 학기 ('2024-1학기')
  
  // 과목별 요약 평가
  languageSummary: '',    // 국어 영역 요약
  mathSummary: '',        // 수학 영역 요약
  behaviorSummary: '',    // 행동 영역 요약
  
  // 세부 평가 항목들
  languageDetails: {
    readingLevel: '',     // 읽기 수준
    writingLevel: '',     // 쓰기 수준
    listeningLevel: '',   // 듣기 수준
    speakingLevel: '',    // 말하기 수준
    comprehension: '',    // 이해도
    notes: ''
  },
  mathDetails: {
    numberConcept: '',    // 수 개념
    calculation: '',      // 계산 능력
    problemSolving: '',   // 문제 해결
    spatialSense: '',     // 공간 감각
    measurement: '',      // 측정
    notes: ''
  },
  behaviorDetails: {
    attention: '',        // 주의집중
    participation: '',    // 수업 참여도
    socialSkills: '',     // 사회성
    selfControl: '',      // 자기조절
    independence: '',     // 독립성
    notes: ''
  },
  
  // HTMX 상태 관리
  autosaveState: { ...autosaveStateData },
  status: 'draft',        // 상태 ('작성중', '완료', '승인됨')
  isUpdating: false,
  lastUpdated: '',
  assessmentDate: '',     // 평가 완료일
  
  // 이력 관리
  recentChanges: [],
  accessHistory: []
};

#### 📅 월별 교육계획 구조 (한 달 단위 교육 목표 및 방법)
```javascript
// 월별 교육계획 데이터 (Alpine.js 상태 관리)
const monthlyPlanData = {
  id: '',
  studentId: '',           // 대상 학생 ID
  userId: '',             // 작성 교사 ID
  semester: '',           // 학기 ('2024-1학기')
  month: '',              // 월 ('3월', '4월')
  subject: '',            // 과목 ('국어', '수학')
  
  // 교육과정 연결
  unitId: '',             // 해당 단원 ID
  standards: [],          // 성취기준 목록
  contents: [],           // 교육내용 목록
  
  // 교육계획 핵심 요소
  planGoal: '',           // 월별 교육 목표
  planMethods: [],        // 교육 방법 목록
  planEvaluation: '',     // 평가 계획
  
  // 일정 관리
  mainDates: {
    startDate: '',        // 시작일
    endDate: '',          // 종료일
    reviewDates: [],      // 복습일 목록
    milestones: {}        // 주요 이정표 날짜들
  },
  schoolDays: 0,          // 해당 월 수업일수
  
  // 세부 계획 정보
  weeklyGoals: [],        // 주차별 목표
  activities: [],         // 주요 활동 목록
  materials: [],          // 필요 교구/자료
  assessmentPlan: '',     // 평가 방식
  
  // HTMX 상태 관리
  autosaveState: { ...autosaveStateData },
  status: 'draft',        // 상태 ('작성중', '검토중', '승인됨')
  isUpdating: false,
  lastUpdated: '',
  approvalDate: '',       // 승인일
  
  // 이력 관리
  recentChanges: [],
  accessHistory: []
};

#### 📊 월별 평가 구조 (교육계획 실행 결과 평가)
```javascript
// 월별 평가 데이터 (Alpine.js 상태 관리)
const monthlyEvaluationData = {
  id: '',
  studentId: '',           // 평가 대상 학생 ID
  userId: '',             // 평가 교사 ID
  semester: '',           // 학기
  month: '',              // 평가 월
  subject: '',            // 평가 과목
  
  // 계획과의 연결
  planId: '',             // 해당 월별계획 ID
  planGoal: '',           // 원래 목표 (참조용)
  
  // 평가 결과
  achievementScore: 0,     // 목표 달성도 점수 (0-100)
  teacherEvaluation: '',   // 교사 평가 의견
  aiEvaluation: '',        // AI 생성 평가 (있는 경우)
  evidenceFiles: [],       // 증거 자료 파일 목록
  
  // 세부 평가 항목
  detailedAssessment: {
    goalAchievement: '',   // 목표 달성 정도
    participationLevel: '', // 참여도
    improvementAreas: [],  // 개선이 필요한 영역
    strongPoints: [],      // 강점 영역
    nextMonthFocus: ''     // 다음 달 중점 사항
  },
  
  // 정량적 평가
  scoreBreakdown: {
    understanding: 0,      // 이해도 점수
    application: 0,        // 적용 능력 점수
    participation: 0,      // 참여도 점수
    improvement: 0         // 향상도 점수
  },
  
  // HTMX 상태 관리
  autosaveState: { ...autosaveStateData },
  status: 'draft',        // 상태 ('작성중', '완료', '확정됨')
  isUpdating: false,
  lastUpdated: '',
  evaluationDate: '',     // 평가 완료일
  
  // 이력 관리
  recentChanges: [],
  accessHistory: []
};
```

```

### 7.2.4 결제 관련 데이터 구조 (간편결제 시스템)

#### 💳 결제 정보 구조 (Toss Payments 연동)
```javascript
// 결제 정보 데이터 (Alpine.js 상태 관리)
const paymentData = {
  id: '',
  userId: '',              // 결제한 사용자 ID
  amount: 0,              // 결제 금액
  
  // 결제 방식 (사용자 친화적 명명)
  paymentMethod: '',      // '카드결제', '계좌이체', '카카오페이', '토스페이'
  paymentStatus: '',      // '결제대기', '결제완료', '결제실패', '결제취소', '환불완료'
  
  // PG사 정보
  pgName: '',             // '토스페이먼츠', '카카오페이', '나이스페이', '이니시스'
  pgTransactionId: '',    // PG사 거래번호
  receiptUrl: '',         // 영수증 URL
  
  // 실패/환불 정보
  failureReason: '',      // 결제 실패 사유
  refundAmount: 0,        // 환불 금액
  refundReason: '',       // 환불 사유
  
  // 부가 정보
  productName: '',        // 상품명 ('IEPON 프리미엄 플랜')
  subscriptionPeriod: '', // 구독 기간 ('1개월', '1년')
  discountAmount: 0,      // 할인 금액
  
  // HTMX 상태 관리
  isProcessing: false,    // 결제 처리 중 여부
  lastUpdated: '',
  createdAt: '',          // 결제 시도 시간
  completedAt: '',        // 결제 완료 시간
  
  // 결제 위젯 상태
  widgetStatus: 'ready',  // '준비중', '결제중', '완료', '오류'
  errorMessage: ''        // 오류 메시지 (한글)
};

// 결제 옵션 설정
const paymentOptions = {
  methods: [
    { value: 'card', label: '신용/체크카드', icon: '💳' },
    { value: 'transfer', label: '계좌이체', icon: '🏦' },
    { value: 'kakao_pay', label: '카카오페이', icon: '💛' },
    { value: 'toss_pay', label: '토스페이', icon: '💙' }
  ],
  statusLabels: {
    pending: { label: '결제 대기중', color: 'warning' },
    completed: { label: '결제 완료', color: 'success' },
    failed: { label: '결제 실패', color: 'danger' },
    cancelled: { label: '결제 취소', color: 'secondary' },
    refunded: { label: '환불 완료', color: 'info' }
  }
};

#### 📚 교육과정 단원 구조 (과목별 단원 데이터)
```javascript
// 교육과정 단원 데이터 (Alpine.js 상태 관리)
const curriculumUnitData = {
  id: '',
  userId: '',              // 등록한 교사 ID
  subject: '',            // 과목 ('국어', '수학')
  grade: 0,               // 학년 (1-6)
  semester: 0,            // 학기 (1-2)
  unitNumber: 0,          // 단원 번호
  unitTitle: '',          // 단원명
  
  // 성취기준 데이터
  achievementStandards: [], // 성취기준 목록
  
  // 교육내용 세부 사항
  educationalContent: {
    mainTopics: [],       // 주요 주제들
    activities: [],       // 학습 활동 목록
    materials: [],        // 필요 교재/교구
    teachingMethods: [],  // 교수 방법
    timeAllocation: ''    // 수업 시간 배당
  },
  
  // 평가 계획
  evaluationPlan: {
    methods: [],          // 평가 방법
    criteria: [],         // 평가 기준
    tools: [],            // 평가 도구
    frequency: '',        // 평가 빈도
    rubric: ''           // 평가 루브릭
  },
  
  // 데이터 출처 및 상태
  uploadSource: '',       // '직접입력', '엑셀업로드', 'CSV업로드'
  isActive: true,         // 활성 상태
  
  // HTMX 상태 관리
  autosaveState: { ...autosaveStateData },
  status: 'draft',        // 상태 ('작성중', '검토중', '승인됨')
  isUpdating: false,
  lastUpdated: '',
  
  // 이력 관리
  recentChanges: [],
  accessHistory: []
};

// 교육과정 엑셀 업로드 데이터 (단순화)
const curriculumUploadData = {
  subject: '',            // 과목 선택
  grade: 0,              // 학년 선택
  semester: 0,           // 학기 선택
  
  // 업로드할 단원 목록
  units: [],
  
  // 업로드 상태 관리
  isUploading: false,
  uploadProgress: 0,      // 업로드 진행률 (0-100)
  validationErrors: [],   // 유효성 검사 오류
  successCount: 0,        // 성공한 단원 수
  failedCount: 0          // 실패한 단원 수
};

#### 📝 라이선스 관리 구조 (구독 및 사용권 관리)
```javascript
// 라이선스 정보 데이터 (Alpine.js 상태 관리)
const licenseData = {
  id: '',
  userId: '',              // 라이선스 소유자 ID
  licenseType: '',         // '월간구독', '연간구독', '체험판'
  status: '',             // '결제대기', '이용중', '만료', '취소됨', '환불됨'
  
  // 결제 연결 정보
  paymentId: '',          // 관련 결제 ID
  serialCodeId: '',       // 시리얼 코드 ID (있는 경우)
  
  // 이용 기간
  startDate: '',          // 시작일
  endDate: '',            // 종료일
  remainingDays: 0,       // 남은 이용일수 (자동 계산)
  
  // 자동 갱신 설정
  autoRenewal: false,     // 자동 갱신 여부
  renewalDate: '',        // 다음 갱신일
  
  // 이용 현황
  usageStats: {
    studentsCount: 0,     // 등록된 학생 수
    plansCount: 0,        // 작성된 계획 수
    aiGenerationsCount: 0 // AI 생성 사용 수
  },
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: '',
  statusMessage: ''       // 상태 메시지 (한글)
};

#### 🔗 빠른 링크 구조 (대시보드 바로가기)
```javascript
// 빠른 링크 데이터 (Alpine.js 상태 관리)
const quickLinkData = {
  id: '',
  title: '',              // 링크 제목
  description: '',        // 설명
  icon: '',               // 아이콘 이름
  color: '',              // 대시보드 색상
  url: '',                // 이동할 URL
  
  // 표시 설정
  isActive: true,         // 활성 상태
  displayOrder: 0,        // 표시 순서
  isVisible: true,        // 표시 여부
  
  // 통계 정보
  clickCount: 0,          // 클릭 수
  lastClickedAt: '',      // 마지막 클릭 시간
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};

// 빠른 링크 옵션 (기본 설정)
const quickLinkOptions = {
  defaultIcons: [
    { value: 'user-group', label: '학생 관리', icon: '👥' },
    { value: 'document-text', label: '계획 작성', icon: '📄' },
    { value: 'chart-bar', label: '통계 조회', icon: '📊' },
    { value: 'cog', label: '설정', icon: '⚙️' }
  ],
  colorOptions: [
    { value: 'blue', label: '파랑', hex: '#3B82F6' },
    { value: 'green', label: '초록', hex: '#10B981' },
    { value: 'purple', label: '보라', hex: '#8B5CF6' },
    { value: 'red', label: '빨강', hex: '#EF4444' }
  ]
};
```

### 7.2.4 🤖 AI 관련 데이터 구조 (Alpine.js 상태 관리)

#### 🔄 AI 생성 이력 구조
```javascript
// AI 생성 이력 데이터 (Alpine.js 상태 관리)
const aiGenerationHistoryData = {
  id: '',
  userId: '',               // 사용자 ID
  studentId: '',            // 학생 ID (선택)
  generationType: '',       // 생성 유형
  referenceId: '',          // 참조 데이터 ID
  referenceTable: '',       // 참조 테이블명
  promptTemplateId: '',     // 프롬프트 템플릿 ID
  
  // 요청 및 응답 데이터
  requestData: {},          // 요청 데이터
  responseData: {},         // AI 응답 데이터
  
  // 모델 정보
  modelName: '',            // 사용된 모델명
  modelVersion: '',         // 모델 버전
  confidenceScore: 0,       // 신뢰도 점수 (0-100)
  
  // 성능 정보
  tokenUsage: {
    promptTokens: 0,        // 프롬프트 토큰 수
    completionTokens: 0,    // 완성 토큰 수
    totalTokens: 0          // 총 토큰 수
  },
  processingTimeMs: 0,      // 처리 시간 (밀리초)
  
  // 상태 정보
  status: '',               // 처리 상태
  statusText: '',           // 상태 텍스트 (한글)
  errorMessage: '',         // 오류 메시지 (한글)
  
  // 사용자 피드백
  userFeedback: {
    rating: 0,              // 평점 (1-5)
    comment: '',            // 피드백 내용
    isHelpful: null         // 도움 여부
  },
  
  // HTMX 상태 관리
  isGenerating: false,      // 생성 중 여부
  lastUpdated: '',          // 마지막 업데이트
  progressPercent: 0        // 진행률 (0-100)
};

// AI 생성 유형 옵션
const aiGenerationTypes = {
  education_plan: '교육 계획',
  school_opinion: '학교 의견서',
  counseling_guide: '상담 가이드',
  admin_document: '관리 문서'
};

// 처리 상태 옵션 (비전공자 친화적)
const aiStatusOptions = {
  pending: '대기 중',
  processing: '생성 중',
  completed: '완료됨',
  failed: '실패함',
  rejected: '거부됨'
};
```

#### 📝 AI 프롬프트 템플릿 구조
```javascript
// AI 프롬프트 템플릿 데이터 (Alpine.js 상태 관리)
const aiPromptTemplateData = {
  id: '',
  templateType: '',         // 템플릿 유형
  templateName: '',         // 템플릿 이름
  systemPrompt: '',         // 시스템 프롬프트
  userPromptTemplate: '',   // 사용자 프롬프트 템플릿
  
  // 변수 설정
  variables: {},            // 템플릿 변수들
  
  // 모델 설정
  modelSettings: {
    temperature: 0.7,       // 창의성 (0.0-1.0)
    maxTokens: 1000,        // 최대 토큰 수
    topP: 1.0,              // 토큰 선택 범위
    frequencyPenalty: 0,    // 빈도 페널티
    presencePenalty: 0      // 존재 페널티
  },
  
  // 버전 및 상태
  version: '1.0',           // 템플릿 버전
  isActive: true,           // 활성 상태
  
  // 사용 통계
  usageCount: 0,            // 사용 횟수
  successRate: 0,           // 성공률 (0-100)
  averageConfidence: 0,     // 평균 신뢰도
  
  // 메타데이터
  createdBy: '',            // 생성자
  createdAt: '',            // 생성일시
  updatedAt: '',            // 수정일시
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};
```

#### 📋 학교 의견서 구조
```javascript
// 학교 의견서 데이터 (Alpine.js 상태 관리)
const schoolOpinionData = {
  id: '',
  studentId: '',            // 학생 ID
  userId: '',               // 작성자 ID
  
  // 의견서 기본 정보
  opinionType: '',          // 의견서 유형
  opinionTypeText: '',      // 의견서 유형 (한글)
  academicYear: '',         // 학년도
  semester: '',             // 학기
  
  // 의견서 내용
  opinionContent: '',       // 의견서 내용
  reason: '',               // 근거/이유
  supportingData: {},       // 근거 자료
  
  // AI 생성 관련
  aiGenerated: false,       // AI 생성 여부
  aiGenerationId: '',       // AI 생성 ID
  aiConfidence: 0,          // AI 신뢰도 (0-100)
  
  // 승인 및 상태
  status: '',               // 처리 상태
  statusText: '',           // 상태 텍스트 (한글)
  approvedBy: '',           // 승인자
  approvedAt: '',           // 승인일시
  documentNumber: '',       // 문서번호
  
  // 첨부파일
  attachments: [],          // 첨부파일 목록
  
  // 메타데이터
  createdAt: '',            // 생성일시
  updatedAt: '',            // 수정일시
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};

// 의견서 유형 옵션
const opinionTypeOptions = {
  new_placement: '신규 배치',
  reselection: '재선정',
  replacement: '대체 배치',
  cancellation: '취소'
};
```

#### 💬 상담 기록 구조
```javascript
// 상담 기록 데이터 (Alpine.js 상태 관리)
const counselingRecordData = {
  id: '',
  studentId: '',            // 학생 ID
  userId: '',               // 상담자 ID
  
  // 상담 기본 정보
  counselingDate: '',       // 상담일시
  counselingType: '',       // 상담 유형
  counselingTypeText: '',   // 상담 유형 (한글)
  counselingMethod: '',     // 상담 방법
  counselingMethodText: '', // 상담 방법 (한글)
  
  // 참가자 및 관심사
  participants: [],         // 참가자 목록
  mainConcerns: [],         // 주요 관심사
  
  // 상담 내용
  counselingContent: '',    // 상담 내용
  actionItems: [],          // 조치 사항
  
  // 후속 조치
  followUpRequired: false,  // 후속 조치 필요
  followUpDate: '',         // 후속 조치 날짜
  
  // AI 가이드
  aiGeneratedGuide: false,  // AI 가이드 사용
  aiGuideContent: '',       // AI 가이드 내용
  aiGenerationId: '',       // AI 생성 ID
  aiConfidence: 0,          // AI 신뢰도
  
  // 기밀성 및 첨부파일
  isConfidential: false,    // 기밀 여부
  attachments: [],          // 첨부파일
  
  // 메타데이터
  createdAt: '',            // 생성일시
  updatedAt: '',            // 수정일시
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};

// 상담 유형 옵션
const counselingTypeOptions = {
  parent: '학부모 상담',
  student: '학생 상담',
  behavior: '행동 상담',
  academic: '학습 상담',
  career: '진로 상담'
};

// 상담 방법 옵션
const counselingMethodOptions = {
  face_to_face: '대면 상담',
  phone: '전화 상담',
  online: '온라인 상담',
  written: '서면 상담'
};
```

#### 📄 관리 문서 구조
```javascript
// 관리 문서 데이터 (Alpine.js 상태 관리)
const adminDocumentData = {
  id: '',
  userId: '',               // 작성자 ID
  
  // 문서 기본 정보
  documentType: '',         // 문서 유형
  documentTypeText: '',     // 문서 유형 (한글)
  documentTitle: '',        // 문서 제목
  documentContent: '',      // 문서 내용
  
  // 대상 기간
  targetPeriodStart: '',    // 대상 기간 시작
  targetPeriodEnd: '',      // 대상 기간 종료
  relatedStudents: [],      // 관련 학생들
  
  // AI 생성 관련
  aiGenerated: false,       // AI 생성 여부
  aiGenerationId: '',       // AI 생성 ID
  aiConfidence: 0,          // AI 신뢰도
  templateId: '',           // 템플릿 ID
  
  // 문서 상태 및 배포
  status: '',               // 문서 상태
  statusText: '',           // 상태 텍스트 (한글)
  distributionDate: '',     // 배포일
  recipients: {},           // 수신자 정보
  
  // 첨부파일 및 메타데이터
  attachments: [],          // 첨부파일
  metadata: {},             // 추가 메타데이터
  
  // 메타데이터
  createdAt: '',            // 생성일시
  updatedAt: '',            // 수정일시
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};

// 문서 유형 옵션
const documentTypeOptions = {
  weekly_plan: '주간 계획서',
  monthly_report: '월간 보고서',
  assessment_report: '평가 보고서',
  meeting_minutes: '회의록',
  parent_notice: '가정 통신문'
};

// 문서 상태 옵션
const documentStatusOptions = {
  draft: '초안',
  finalized: '완성',
  distributed: '배포됨'
};
```

### 7.2.5 📚 교육과정 관련 데이터 구조 (Alpine.js 상태 관리)

#### 📖 교육과정 단원 구조
```javascript
// 교육과정 단원 데이터 (Alpine.js 상태 관리)
const curriculumUnitData = {
  id: '',
  
  // 기본 분류
  subject: '',              // 과목 (국어/수학)
  subjectText: '',          // 과목명 (한글)
  gradeLevel: '',           // 학년
  gradeLevelText: '',       // 학년 (한글)
  semester: '',             // 학기
  semesterText: '',         // 학기 (한글)
  
  // 단원 정보
  unitNumber: 0,            // 단원 번호
  unitName: '',             // 단원명
  
  // 교육 목표 (성취기준)
  learningObjectives: [],   // 학습 목표 목록
  achievementStandards: [], // 성취 기준 목록
  
  // 교육 내용
  learningContents: [],     // 학습 내용 목록
  keyConcepts: [],          // 핵심 개념 목록
  
  // 평가 계획
  assessmentPlan: '',       // 평가 계획
  evaluationMethods: [],    // 평가 방법 목록
  evaluationCriteria: [],   // 평가 기준 목록
  
  // 메타데이터
  version: '1.0',           // 버전
  isActive: true,           // 활성 상태
  createdBy: '',            // 생성자
  createdAt: '',            // 생성일시
  updatedAt: '',            // 수정일시
  
  // HTMX 상태 관리
  isUpdating: false,
  lastUpdated: ''
};

// 과목 옵션
const subjectOptions = {
  korean: '국어',
  math: '수학'
};

// 학년 옵션
const gradeLevelOptions = {
  grade1: '1학년',
  grade2: '2학년',
  grade3: '3학년',
  grade4: '4학년',
  grade5: '5학년',
  grade6: '6학년'
};

// 학기 옵션
const semesterOptions = {
  first: '1학기',
  second: '2학기'
};
```

#### 📝 교육과정 단원 폼 구조
```javascript
// 교육과정 단원 폼 데이터 (Alpine.js 폼 관리)
const curriculumUnitFormData = {
  // 기본 분류
  subject: '',              // 과목
  gradeLevel: '',           // 학년
  semester: '',             // 학기
  
  // 단원 정보
  unitNumber: '',           // 단원 번호 (문자열로 입력)
  unitName: '',             // 단원명
  
  // 교육 목표 (성취기준)
  learningObjectives: [''], // 학습 목표 (동적 배열)
  achievementStandards: [''], // 성취 기준 (동적 배열)
  
  // 교육 내용
  learningContents: [''],   // 학습 내용 (동적 배열)
  keyConcepts: [''],        // 핵심 개념 (동적 배열)
  
  // 평가 계획
  assessmentPlan: '',       // 평가 계획
  evaluationMethods: [''],  // 평가 방법 (동적 배열)
  evaluationCriteria: [''], // 평가 기준 (동적 배열)
  
  // 폼 상태
  isSubmitting: false,      // 제출 중 여부
  errors: {},               // 폼 에러
  hasChanges: false         // 변경 사항 여부
};

// 폼 입력 도우미 함수
const curriculumFormHelpers = {
  // 배열 항목 추가
  addItem: (fieldName) => {
    curriculumUnitFormData[fieldName].push('');
  },
  
  // 배열 항목 삭제
  removeItem: (fieldName, index) => {
    if (curriculumUnitFormData[fieldName].length > 1) {
      curriculumUnitFormData[fieldName].splice(index, 1);
    }
  },
  
  // 폼 초기화
  resetForm: () => {
    Object.keys(curriculumUnitFormData).forEach(key => {
      if (Array.isArray(curriculumUnitFormData[key])) {
        curriculumUnitFormData[key] = [''];
      } else if (typeof curriculumUnitFormData[key] === 'string') {
        curriculumUnitFormData[key] = '';
      } else if (typeof curriculumUnitFormData[key] === 'boolean') {
        curriculumUnitFormData[key] = false;
      }
    });
    curriculumUnitFormData.errors = {};
  }
};
```

#### 📤 교육과정 업로드 결과 구조
```javascript
// 교육과정 업로드 결과 데이터 (Alpine.js 상태 관리)
const curriculumUploadResult = {
  // 처리 통계
  totalProcessed: 0,        // 총 처리된 수
  successfulImports: 0,     // 성공적으로 가져온 수
  failedImports: 0,         // 실패한 수
  
  // 오류 정보
  errors: [],               // 오류 목록
  hasErrors: false,         // 오류 존재 여부
  
  // 가져온 단원들
  importedUnits: [],        // 성공적으로 가져온 단원들
  
  // 업로드 상태
  isUploading: false,       // 업로드 중 여부
  uploadProgress: 0,        // 업로드 진행률 (0-100)
  statusMessage: '',        // 상태 메시지 (한글)
  
  // HTMX 상태 관리
  lastUpdated: ''
};

// 업로드 에러 구조
const uploadErrorStructure = {
  row: 0,                   // 행 번호
  field: '',                // 필드명
  message: '',              // 오류 메시지 (한글)
  severity: ''              // 심각도 (error/warning)
};

// 업로드 상태 옵션 (비전공자 친화적)
const uploadStatusOptions = {
  idle: '대기 중',
  uploading: '업로드 중',
  processing: '처리 중',
  validating: '검증 중',
  importing: '가져오는 중',
  completed: '완료됨',
  failed: '실패함'
};
```

---

## 7.3 👥 학생 관리 API (HTMX + Supabase Edge Functions)

### 7.3.1 📋 학생 목록 조회 (HTMX 패턴)
```html
<!-- HTMX 요청 패턴 -->
<div hx-get="/api/students" 
     hx-trigger="load"
     hx-target="#students-list"
     hx-indicator="#loading-students"
     class="students-container">
  <div id="loading-students" class="loading-indicator">학생 목록을 불러오는 중...</div>
  <div id="students-list"></div>
</div>
```

```javascript
// Supabase Edge Function: /functions/get-students/index.js
Deno.serve(async (req) => {
  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // JWT 토큰에서 사용자 확인
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: '인증이 필요합니다.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 학생 목록 조회 (사용자별 필터링)
    const { data: students, error } = await supabaseClient
      .from('students')
      .select(`
        id, name, birth_date, gender, grade, class_name, 
        status, disability_type, created_at
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;

    // HTMX HTML 응답 생성 (UTF-8 안전)
    const studentsHtml = students.map(student => {
      // UTF-8 안전한 텍스트 처리
      const safeName = encodeURIComponent(student.name).replace(/%/g, '').substring(0, 50);
      const safeClassName = student.class_name ? encodeURIComponent(student.class_name) : '';
      
      return `
      <div class="student-card" data-student-id="${student.id}">
        <div class="student-header">
          <h3>${student.name}</h3>
          <span class="student-status ${student.status}">
            ${student.status === 'active' ? '활성' : '비활성'}
          </span>
        </div>
        <div class="student-info">
          <p><strong>학년:</strong> ${student.grade}학년 ${student.class_name || ''}</p>
          <p><strong>생년월일:</strong> ${student.birth_date}</p>
          <p><strong>장애유형:</strong> ${student.disability_type || '미등록'}</p>
        </div>
        <div class="student-actions">
          <button 
            hx-get="/functions/get-student-detail?id=${student.id}" 
            hx-target="#student-detail-modal"
            class="btn btn-primary btn-sm"
            type="button"
            aria-label="${student.name} 상세정보 보기">
            상세보기
          </button>
          <button 
            hx-get="/functions/get-student-edit-form?id=${student.id}" 
            hx-target="#student-edit-modal"
            class="btn btn-secondary btn-sm"
            type="button"
            aria-label="${student.name} 정보 수정">
            수정
          </button>
        </div>
      </div>`;
    }).join('');

    return new Response(studentsHtml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'studentsLoaded'
      }
    });

  } catch (error) {
    console.error('학생 목록 조회 오류:', error);
    return new Response(
      '<div class="error-message">학생 목록을 불러오는데 실패했습니다.</div>',
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}
```

### 7.3.2 🔍 학생 상세 조회 (HTMX 패턴)
```html
<!-- HTMX 요청 패턴 -->
<div hx-get="/api/students/{id}" 
     hx-trigger="load"
     hx-target="#student-detail"
     hx-indicator="#loading-student"
     class="student-detail-container">
  <div id="loading-student" class="loading-indicator">학생 정보를 불러오는 중...</div>
  <div id="student-detail"></div>
</div>
```

```javascript
// Supabase Edge Function: /functions/get-student-detail/index.js
Deno.serve(async (req) => {
  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // URL에서 학생 ID 추출
    const url = new URL(req.url);
    const studentId = url.searchParams.get('id');
    
    if (!studentId) {
      return new Response(
        '<div class="error-message">학생 ID가 필요합니다.</div>',
        { 
          status: 400,
      );
    }

    // 학생 상세 정보 조회 (권한 확인 포함)
    const { data: student, error } = await supabaseClient
      .from('students')
      .select(`
        id, name, birth_date, gender, grade, class_name,
        school_name, teacher_name, disability_type, status,
        welfare_info, therapy_info, assistant_info, 
        daily_life_info, guardian_info, created_at
      `)
      .eq('id', studentId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!student) {
      return new Response(
        '<div class="error-message">학생을 찾을 수 없거나 조회 권한이 없습니다.</div>',
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // HTMX HTML 응답 생성 (상세 정보)
    const studentDetailHtml = `
      <div class="student-profile" data-student-id="${student.id}">
        <div class="profile-header">
          <h2>${escapeHtml(student.name)} 학생 프로필</h2>
          <div class="profile-actions">
            <button hx-get="/students/${student.id}/edit" 
                    hx-target="#main-content"
                    class="btn btn-primary">수정</button>
            <button hx-get="/students" 
                    hx-target="#main-content"
                    class="btn btn-secondary">목록으로</button>
          </div>
        </div>
        
        <div class="profile-sections">
          <section class="basic-info">
            <h3>기본 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>이름:</label>
                <span>${escapeHtml(student.name)}</span>
              </div>
              <div class="info-item">
                <label>생년월일:</label>
                <span>${formatDate(student.birth_date)}</span>
              </div>
              <div class="info-item">
                <label>성별:</label>
                <span>${student.gender === 'male' ? '남성' : '여성'}</span>
              </div>
              <div class="info-item">
                <label>학년/반:</label>
                <span>${escapeHtml(student.grade)}학년 ${escapeHtml(student.class_name)}반</span>
              </div>
              <div class="info-item">
                <label>장애유형:</label>
                <span>${escapeHtml(student.disability_type)}</span>
              </div>
            </div>
          </section>
          
          <section class="welfare-info">
            <h3>복지 정보</h3>
            <div class="info-content">
              ${student.welfare_info ? Object.entries(student.welfare_info).map(
                ([key, value]) => `<p><strong>${key}:</strong> ${escapeHtml(String(value))}</p>`
              ).join('') : '<p>복지 정보가 없습니다.</p>'}
            </div>
          </section>
          
          <section class="therapy-info">
            <h3>치료 정보</h3>
            <div class="info-content">
              ${student.therapy_info ? Object.entries(student.therapy_info).map(
                ([key, value]) => `<p><strong>${key}:</strong> ${escapeHtml(String(value))}</p>`
              ).join('') : '<p>치료 정보가 없습니다.</p>'}
            </div>
          </section>
        </div>
      </div>
    `;

    return new Response(studentDetailHtml, {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'studentDetailLoaded'
      }
    });

  } catch (error) {
    console.error('학생 상세 조회 오류:', error);
    return new Response(
      '<div class="error-message">학생 정보를 불러오는데 실패했습니다.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});
```

### 7.3.3 ✏️ 학생 생성 (HTMX 폼 패턴)
```html
<!-- HTMX 폼 요청 패턴 -->
<form hx-post="/api/students" 
      hx-target="#student-form-result"
      hx-indicator="#saving-student"
      x-data="studentFormData"
      class="student-form">
  
  <div id="saving-student" class="loading-indicator">학생 정보를 저장하는 중...</div>
  
  <div class="form-group">
    <label for="name">학생 이름 *</label>
    <input type="text" 
           id="name" 
           name="name" 
           x-model="name"
           required 
           maxlength="50"
           class="form-control">
    <div x-show="errors.name" class="error-text" x-text="errors.name"></div>
  </div>
  
  <div class="form-group">
    <label for="birth_date">생년월일 *</label>
    <input type="date" 
           id="birth_date" 
           name="birth_date" 
           x-model="birthDate"
           required 
           class="form-control">
  </div>
  
  <div class="form-group">
    <label for="gender">성별 *</label>
    <select id="gender" 
            name="gender" 
            x-model="gender"
            required 
            class="form-control">
      <option value="">선택하세요</option>
      <option value="male">남성</option>
      <option value="female">여성</option>
    </select>
  </div>
  
  <div class="form-actions">
    <button type="submit" class="btn btn-primary">저장</button>
    <button type="button" 
            hx-get="/students" 
            hx-target="#main-content"
            class="btn btn-secondary">취소</button>
  </div>
  
  <div id="student-form-result"></div>
</form>
```

```javascript
// Supabase Edge Function: /functions/create-student/index.js
Deno.serve(async (req) => {
  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        '<div class="error-message">POST 요청만 지원됩니다.</div>',
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // JWT 토큰에서 사용자 확인
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        '<div class="error-message">인증이 필요합니다.</div>',
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const formData = await req.formData();
    const studentData = {
      name: formData.get('name')?.toString().trim(),
      birth_date: formData.get('birth_date')?.toString(),
      gender: formData.get('gender')?.toString(),
      grade: formData.get('grade')?.toString(),
      class_name: formData.get('class_name')?.toString().trim(),
      disability_type: formData.get('disability_type')?.toString().trim(),
      user_id: user.id,
      status: 'active'
    };

    // UTF-8 인코딩 검증 (안전한 방식)
    const validateUTF8Text = (text) => {
      if (!text) return true;
      try {
        const encoded = new TextEncoder().encode(text);
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
        return decoded === text;
      } catch {
        return false;
      }
    };

    if (!validateUTF8Text(studentData.name) || !validateUTF8Text(studentData.class_name)) {
      return new Response(
        '<div class="error-message">한글 입력에 오류가 있습니다. 다시 확인해주세요.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 입력 유효성 검증 (간소화)
    const errors = [];
    if (!studentData.name || studentData.name.length < 1) {
      errors.push('학생 이름은 필수 입력 사항입니다.');
    }
    if (!studentData.birth_date) {
      errors.push('생년월일은 필수 입력 사항입니다.');
    }
    if (!studentData.gender) {
      errors.push('성별은 필수 입력 사항입니다.');
    }
    
    if (errors.length > 0) {
      const errorsHtml = errors.map(error => 
        `<div class="field-error">${error}</div>`
      ).join('');
      
      return new Response(
        `<div class="error-messages">${errorsHtml}</div>`,
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 학생 정보 생성
    const { data: student, error } = await supabaseClient
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) throw error;

    // 성공 응답 (목록으로 리다이렉트)
    return new Response('', {
      status: 200,
      headers: {
        ...corsHeaders,
        'HX-Redirect': '/students',
        'HX-Trigger': JSON.stringify({
          'showNotification': {
            message: `${student.name} 학생이 성공적으로 등록되었습니다.`,
            type: 'success'
          }
        })
      }
    });

  } catch (error) {
    console.error('학생 생성 오류:', error);
    return new Response(
      '<div class="error-message">학생 정보 저장에 실패했습니다. 다시 시도해주세요.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});
```

### 7.3.4 📝 학생 수정 (HTMX 폼 패턴)
```javascript
// Supabase Edge Function: /functions/update-student/index.js
Deno.serve(async (req) => {
  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'PUT, PATCH, OPTIONS'
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return new Response(
        '<div class="error-message">PUT 또는 PATCH 요청만 지원됩니다.</div>',
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // JWT 토큰에서 사용자 확인
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        '<div class="error-message">인증이 필요합니다.</div>',
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // URL에서 학생 ID 추출
    const url = new URL(req.url);
    const studentId = url.searchParams.get('id');
    
    if (!studentId) {
      return new Response(
        '<div class="error-message">학생 ID가 필요합니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    const formData = await req.formData();
    
    // 업데이트할 데이터 구성
    const updates = {
      name: formData.get('name')?.toString().trim(),
      birth_date: formData.get('birth_date')?.toString(),
      gender: formData.get('gender')?.toString(),
      grade: formData.get('grade')?.toString(),
      class_name: formData.get('class_name')?.toString().trim(),
      disability_type: formData.get('disability_type')?.toString().trim(),
      updated_at: new Date().toISOString()
    };

    // UTF-8 인코딩 검증 (안전한 방식)
    const validateUTF8Text = (text) => {
      if (!text) return true;
      try {
        const encoded = new TextEncoder().encode(text);
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
        return decoded === text;
      } catch {
        return false;
      }
    };

    if (!validateUTF8Text(updates.name) || !validateUTF8Text(updates.class_name) || 
        !validateUTF8Text(updates.disability_type)) {
      return new Response(
        '<div class="error-message">한글 입력에 오류가 있습니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 학생 정보 업데이트 (권한 확인 포함)
    const { data: student, error } = await supabaseClient
      .from('students')
      .update(updates)
      .eq('id', studentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!student) {
      return new Response(
        '<div class="error-message">학생을 찾을 수 없거나 수정 권한이 없습니다.</div>',
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 성공 응답
    return new Response('', {
      status: 200,
      headers: {
        ...corsHeaders,
        'HX-Redirect': `/students/${student.id}`,
        'HX-Trigger': JSON.stringify({
          'showNotification': {
            message: `${student.name} 학생 정보가 성공적으로 수정되었습니다.`,
            type: 'success'
          },
          'studentUpdated': { studentId: student.id }
        })
      }
    });

  } catch (error) {
    console.error('학생 수정 오류:', error);
    return new Response(
      '<div class="error-message">학생 정보 수정에 실패했습니다.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});
```
```

---

## 7.4 📚 교육 관리 API (HTMX + Supabase Edge Functions)

### 7.4.1 📊 현행수준 관리 (HTMX 패턴)
```html
<!-- HTMX 현행수준 조회 패턴 -->
<div hx-get="/api/current-levels/{studentId}" 
     hx-trigger="load"
     hx-target="#current-levels"
     hx-indicator="#loading-levels"
     class="current-levels-container">
  <div id="loading-levels" class="loading-indicator">현행수준을 불러오는 중...</div>
  <div id="current-levels"></div>
</div>
```

```javascript
// Supabase Edge Function: /functions/get-current-levels/index.js
Deno.serve(async (req) => {
  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // JWT 토큰에서 사용자 확인
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        '<div class="error-message">인증이 필요합니다.</div>',
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // URL에서 학생 ID 추출
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');
    
    if (!studentId) {
      return new Response(
        '<div class="error-message">학생 ID가 필요합니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 현행수준 조회 (사용자 권한 확인)
    const { data: levels, error } = await supabaseClient
      .from('current_levels')
      .select(`
        id, student_id, semester, grade_level,
        lang_reading, lang_writing, lang_speaking, lang_listening, lang_summary,
        math_number, math_calculation, math_figure, math_measure, math_data, math_summary,
        created_at, updated_at
      `)
      .eq('student_id', studentId)
      .eq('user_id', user.id)
      .order('semester');

    if (error) throw error;

    if (!levels || levels.length === 0) {
      return new Response(
        '<div class="no-data-message">현행수준 데이터가 없습니다. <button hx-get="/functions/create-current-level-form?studentId=' + studentId + '" hx-target="#main-content" class="btn btn-primary">새로 작성</button></div>',
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // HTMX HTML 응답 생성 (UTF-8 안전)
    const levelsHtml = levels.map(level => `
      <div class="level-card" data-level-id="${level.id}">
        <div class="level-header">
          <h3>${level.semester || '미지정'} - ${level.grade_level || '미지정'}</h3>
          <div class="level-actions">
            <button hx-get="/functions/edit-current-level?id=${level.id}" 
                    hx-target="#main-content"
                    class="btn btn-sm btn-secondary">수정</button>
          </div>
        </div>
        
        <div class="level-content">
          <section class="language-levels">
            <h4>국어 영역</h4>
            <div class="skills-grid">
              <div class="skill-item">
                <label>읽기:</label>
                <span class="skill-level">${level.lang_reading || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>쓰기:</label>
                <span class="skill-level">${level.lang_writing || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>말하기:</label>
                <span class="skill-level">${level.lang_speaking || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>듣기:</label>
                <span class="skill-level">${level.lang_listening || '미평가'}</span>
              </div>
            </div>
            <div class="summary">
              <p><strong>종합:</strong> ${level.lang_summary || '작성되지 않음'}</p>
            </div>
          </section>
          
          <section class="math-levels">
            <h4>수학 영역</h4>
            <div class="skills-grid">
              <div class="skill-item">
                <label>수와 연산:</label>
                <span class="skill-level">${level.math_number || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>계산:</label>
                <span class="skill-level">${level.math_calculation || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>도형:</label>
                <span class="skill-level">${level.math_figure || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>측정:</label>
                <span class="skill-level">${level.math_measure || '미평가'}</span>
              </div>
              <div class="skill-item">
                <label>자료와 가능성:</label>
                <span class="skill-level">${level.math_data || '미평가'}</span>
              </div>
            </div>
            <div class="summary">
              <p><strong>종합:</strong> ${level.math_summary || '작성되지 않음'}</p>
            </div>
          </section>
        </div>
        
        <div class="level-footer">
          <small>작성일: ${new Date(level.created_at).toLocaleDateString('ko-KR')}</small>
          ${level.updated_at !== level.created_at ? `<small>수정일: ${new Date(level.updated_at).toLocaleDateString('ko-KR')}</small>` : ''}
        </div>
      </div>
    `).join('');

    const responseHtml = `
      <div class="current-levels-list">
        ${levelsHtml}
        <div class="add-level-section">
          <button hx-get="/functions/new-current-level-form?studentId=${studentId}" 
                  hx-target="#main-content"
                  class="btn btn-primary">새 현행수준 추가</button>
        </div>
      </div>
    `;

    return new Response(responseHtml, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'currentLevelsLoaded'
      }
    });

  } catch (error) {
    console.error('현행수준 조회 오류:', error);
    return new Response(
      '<div class="error-message">현행수준을 불러오는데 실패했습니다.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}
```

```javascript
// Supabase Edge Function: POST /functions/create-current-level
import { corsHeaders } from '../_shared/cors.js';
import { validateObjectUTF8 } from '../_shared/utils.js';

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );

  // JWT 토큰에서 사용자 정보 추출
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      '<div class="error-message">로그인이 필요합니다.</div>',
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    return new Response(
      '<div class="error-message">인증에 실패했습니다.</div>',
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
  try {
    if (req.method !== 'POST') {
      return createMethodNotAllowedResponse();
    }

    const formData = await req.formData();
    const levelData = {
      student_id: formData.get('student_id')?.toString(),
      semester: formData.get('semester')?.toString(),
      grade_level: formData.get('grade_level')?.toString(),
      
      // 국어 영역
      lang_reading: formData.get('lang_reading')?.toString().trim(),
      lang_writing: formData.get('lang_writing')?.toString().trim(),
      lang_speaking: formData.get('lang_speaking')?.toString().trim(),
      lang_listening: formData.get('lang_listening')?.toString().trim(),
      lang_summary: formData.get('lang_summary')?.toString().trim(),
      
      // 수학 영역
      math_number: formData.get('math_number')?.toString().trim(),
      math_calculation: formData.get('math_calculation')?.toString().trim(),
      math_figure: formData.get('math_figure')?.toString().trim(),
      math_measure: formData.get('math_measure')?.toString().trim(),
      math_data: formData.get('math_data')?.toString().trim(),
      math_summary: formData.get('math_summary')?.toString().trim(),
      
      user_id: user.id
    };

    // UTF-8 인코딩 검증
    if (!validateObjectUTF8(levelData)) {
      return new Response(
        '<div class="error-message">한글 입력에 오류가 있습니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 현행수준 저장 (upsert 방식)
    const { data: level, error } = await supabaseClient
      .from('current_levels')
      .upsert([levelData], {
        onConflict: 'student_id,semester,user_id'
      })
      .select()
      .single();

    if (error) throw error;

    // 성공 응답 (학생 상세 페이지로 리다이렉트)
    return new Response('', {
      status: 200,
      headers: {
        ...corsHeaders,
        'HX-Redirect': `/students/${level.student_id}`,
        'HX-Trigger': JSON.stringify({
          'showNotification': {
            message: '현행수준이 성공적으로 저장되었습니다.',
            type: 'success'
          },
          'currentLevelSaved': { levelId: level.id }
        })
      }
    });

  } catch (error) {
    console.error('현행수준 저장 오류:', error);
    return new Response(
      '<div class="error-message">현행수준 저장에 실패했습니다.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}
```
```

### 7.4.2 📋 통합 학생 컨텍스트 관리 (HTMX 패턴)
```html
<!-- HTMX 통합 컨텍스트 조회 패턴 -->
<div hx-get="/functions/student-context/{studentId}" 
     hx-trigger="load"
     hx-target="#student-context"
     hx-indicator="#loading-context"
     class="student-context-container">
  <div id="loading-context" class="loading-indicator">학생 컨텍스트를 불러오는 중...</div>
  <div id="student-context"></div>
</div>
```

```javascript
// Supabase Edge Function: GET /functions/student-context/[studentId]
import { corsHeaders } from '../_shared/cors.js';
import { validateUTF8Text } from '../_shared/utils.js';

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );

  // JWT 토큰에서 사용자 정보 추출
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      '<div class="error-message">로그인이 필요합니다.</div>',
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (authError || !user) {
    return new Response(
      '<div class="error-message">인증에 실패했습니다.</div>',
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  try {
    // URL 파라미터에서 학생 ID 추출
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const studentId = pathParts[pathParts.length - 1];
    
    if (!studentId) {
      return new Response(
        '<div class="error-message">학생 ID가 필요합니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    // 캐시된 컨텍스트 확인
    const { data: cachedContext, error: cacheError } = await supabaseClient
      .from('student_context_cache')
      .select('context_data, expires_at')
      .eq('student_id', studentId)
      .eq('user_id', user.id)
      .eq('is_valid', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    let contextData;
    
    if (cachedContext && !cacheError) {
      contextData = cachedContext.context_data;
    } else {
      // 캐시가 없으면 새로 구축
      contextData = await buildStudentContext(supabaseClient, studentId, user.id);
      
      // 캐시에 저장 (1시간 유효)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await supabaseClient
        .from('student_context_cache')
        .upsert({
          student_id: studentId,
          user_id: user.id,
          context_data: contextData,
          expires_at: expiresAt.toISOString(),
          is_valid: true
        });
    }

    // HTMX HTML 응답 생성
    const contextHtml = `
      <div class="student-context-summary" data-student-id="${studentId}">
        <div class="context-header">
          <h3>통합 학습 컨텍스트</h3>
          <button hx-post="/functions/student-context-refresh/${studentId}" 
                  hx-target="#student-context"
                  hx-indicator="#loading-context"
                  class="btn btn-sm btn-secondary">새로고침</button>
        </div>
        
        <div class="context-sections">
          <section class="individualization-summary">
            <h4>개별화 특성</h4>
            <div class="characteristics-grid">
              <div class="characteristic-group">
                <label>강점:</label>
                <div class="tags">
                  ${contextData.individualization.strengths.map(strength => 
                    `<span class="tag strength">${strength}</span>`
                  ).join('')}
                </div>
              </div>
              <div class="characteristic-group">
                <label>도전 영역:</label>
                <div class="tags">
                  ${contextData.individualization.challenges.map(challenge => 
                    `<span class="tag challenge">${challenge}</span>`
                  ).join('')}
                </div>
              </div>
              <div class="characteristic-group">
                <label>지원 요구:</label>
                <div class="tags">
                  ${contextData.individualization.supportNeeds.map(need => 
                    `<span class="tag support">${need}</span>`
                  ).join('')}
                </div>
              </div>
              <div class="characteristic-group">
                <label>보조 기기:</label>
                <div class="tags">
                  ${contextData.individualization.accommodations.map(acc => 
                    `<span class="tag accommodation">${acc}</span>`
                  ).join('')}
                </div>
              </div>
            </div>
          </section>
          
          <section class="recent-assessments">
            <h4>최근 평가 이력 (3개월)</h4>
            <div class="assessment-list">
              ${contextData.recentAssessments.length > 0 ? 
                contextData.recentAssessments.slice(0, 3).map(assessment => `
                  <div class="assessment-item">
                    <div class="assessment-header">
                      <span class="assessment-date">${new Date(assessment.created_at).toLocaleDateString('ko-KR')}</span>
                      <span class="assessment-type">${assessment.month}월 평가</span>
                    </div>
                    <div class="assessment-summary">
                      <p>국어: ${assessment.lang_achievement_summary || '평가 없음'}</p>
                      <p>수학: ${assessment.math_achievement_summary || '평가 없음'}</p>
                    </div>
                  </div>
                `).join('') : 
                '<p class="no-data">최근 3개월 내 평가 데이터가 없습니다.</p>'
              }
            </div>
          </section>
          
          <section class="counseling-history">
            <h4>상담 이력 (6개월)</h4>
            <div class="counseling-list">
              ${contextData.counselingHistory.length > 0 ?
                contextData.counselingHistory.slice(0, 3).map(record => `
                  <div class="counseling-item">
                    <div class="counseling-header">
                      <span class="counseling-date">${new Date(record.counseling_date).toLocaleDateString('ko-KR')}</span>
                      <span class="counseling-type">${getCounselingTypeText(record.counseling_type)}</span>
                    </div>
                    <div class="counseling-summary">
                      ${record.counseling_content.substring(0, 100)}${record.counseling_content.length > 100 ? '...' : ''}
                    </div>
                  </div>
                `).join('') :
                '<p class="no-data">최근 6개월 내 상담 기록이 없습니다.</p>'
              }
            </div>
          </section>
        </div>
        
        <div class="context-footer">
          <small>마지막 업데이트: ${new Date().toLocaleString('ko-KR')}</small>
        </div>
      </div>
    `;

    return new Response(contextHtml, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'studentContextLoaded'
      }
    });

  } catch (error) {
    console.error('학생 컨텍스트 조회 오류:', error);
    return new Response(
      '<div class="error-message">학생 컨텍스트를 불러오는데 실패했습니다.</div>',
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}

// 학생 컨텍스트 구축 함수 (Edge Function 내부 유틸리티)
async function buildStudentContext(supabase, studentId, userId) {
  try {
    const [profileResult, levelsResult, assessmentsResult, counselingResult] = await Promise.all([
      // 학생 프로필
      supabase.from('students')
        .select('*')
        .eq('id', studentId)
        .eq('user_id', userId)
        .single(),
      
      // 현행수준 (최신)
      supabase.from('current_levels')
        .select('*')
        .eq('student_id', studentId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1),
      
      // 최근 평가 (3개월)
      supabase.from('monthly_evaluations')
        .select('*')
        .eq('student_id', studentId)
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false }),
      
      // 상담 이력 (6개월)
      supabase.from('counseling_records')
        .select('*')
        .eq('student_id', studentId)
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
    ]);

    const profile = profileResult.data;
    const levels = levelsResult.data || [];
    const assessments = assessmentsResult.data || [];
    const counseling = counselingResult.data || [];

    // 개별화 특성 추출
    const individualization = extractIndividualizationData(profile, levels, assessments);

    return {
      profile,
      currentLevels: levels,
      recentAssessments: assessments,
      individualization,
      counselingHistory: counseling,
      medicalInfo: extractMedicalInfo(profile)
    };
  } catch (error) {
    console.error('컨텍스트 구축 오류:', error);
    throw error;
  }
}

// 개별화 데이터 추출 함수
function extractIndividualizationData(profile, levels, assessments) {
  const strengths = [];
  const challenges = [];
  const supportNeeds = [];
  const accommodations = [];

  // 프로필에서 추출
  if (profile?.disability_type) {
    supportNeeds.push(profile.disability_type);
  }
  if (profile?.therapy_info?.strengths) {
    strengths.push(...profile.therapy_info.strengths);
  }
  if (profile?.therapy_info?.challenges) {
    challenges.push(...profile.therapy_info.challenges);
  }
  if (profile?.assistant_support?.devices) {
    accommodations.push(...profile.assistant_support.devices);
  }

  // 현행수준에서 추출
  levels.forEach(level => {
    if (level.lang_summary) {
      const langKeywords = extractKeywords(level.lang_summary);
      strengths.push(...langKeywords.positive);
      challenges.push(...langKeywords.negative);
    }
    if (level.math_summary) {
      const mathKeywords = extractKeywords(level.math_summary);
      strengths.push(...mathKeywords.positive);
      challenges.push(...mathKeywords.negative);
    }
  });

  return {
    learningStyle: [],
    strengths: [...new Set(strengths)],
    challenges: [...new Set(challenges)],
    supportNeeds: [...new Set(supportNeeds)],
    accommodations: [...new Set(accommodations)]
  };
}

// 의료 정보 추출
function extractMedicalInfo(profile) {
  return {
    diagnosis: profile?.disability_type ? [profile.disability_type] : [],
    recommendations: profile?.therapy_info?.recommendations || [],
    medications: profile?.medical_info?.medications || []
  };
}
```

```javascript
// Supabase Edge Function: POST /api/student-context/refresh/[studentId]
export default async function handler(req, { supabase, user, params }) {
  try {
    if (req.method !== 'POST') {
      return createMethodNotAllowedResponse();
    }

    const studentId = params.studentId;
    
    // 기존 캐시 무효화
    await supabase
      .from('student_context_cache')
      .update({ is_valid: false })
      .eq('student_id', studentId)
      .eq('user_id', user.id);

    // 새 컨텍스트 구축
    const contextData = await buildStudentContext(supabase, studentId, user.id);
    
    // 새 캐시 저장
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await supabase
      .from('student_context_cache')
      .insert({
        student_id: studentId,
        user_id: user.id,
        context_data: contextData,
        expires_at: expiresAt.toISOString(),
        is_valid: true
      });

    // 성공 응답 (컨텍스트 다시 로드)
    return new Response('', {
      status: 200,
      headers: {
        'HX-Trigger': JSON.stringify({
          'showNotification': {
            message: '학생 컨텍스트가 새로고침되었습니다.',
            type: 'success'
          },
          'refreshContext': { studentId }
        }),
        'HX-Refresh': 'true'
      }
    });

  } catch (error) {
    console.error('컨텍스트 새로고침 오류:', error);
    return new Response(
      '<div class="error-message">컨텍스트 새로고침에 실패했습니다.</div>',
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});

// 7.5 결제 관리 API

// 7.5.1 MCP 기반 결제 처리 (Toss Payments MCP + HTMX)

// 7.5.2 MCP 결제 처리 워크플로우

// MCP 결제 폼 컴포넌트
// 결제 폼 (Alpine.js + HTMX + MCP)
<div x-data="paymentForm()" x-init="initPayment()">
  <form 
    hx-post="/functions/payments-process" 
    hx-target="#payment-result"
    hx-indicator="#payment-loading"
    hx-trigger="submit"
    @submit.prevent="processPayment($event)"
    class="payment-form"
  >
    <!-- 결제 금액 -->
    <div class="form-group">
      <label for="license-type">라이선스 유형</label>
      <select 
        id="license-type" 
        name="licenseType" 
        x-model="payment.licenseType"
        @change="updateAmount()"
        class="form-control"
        required
      >
        <option value="">선택해주세요</option>
        <option value="basic">베이직 (9,900원/월)</option>
        <option value="pro">프로 (19,900원/월)</option>
        <option value="premium">프리미엄 (39,900원/월)</option>
      </select>
    </div>
    
    <!-- 결제 금액 표시 -->
    <div class="payment-amount">
      <h3>결제 금액: <span x-text="formatAmount(payment.amount)">₩0</span></h3>
    </div>
    
    <!-- 결제 방법 -->
    <div class="form-group">
      <label>결제 방법</label>
      <div class="payment-methods">
        <label class="payment-method-option">
          <input 
            type="radio" 
            name="paymentMethod" 
            value="card" 
            x-model="payment.paymentMethod"
            required
          >
          <span class="method-icon card"></span>
          신용카드
        </label>
        <label class="payment-method-option">
          <input 
            type="radio" 
            name="paymentMethod" 
            value="transfer" 
            x-model="payment.paymentMethod"
          >
          <span class="method-icon transfer"></span>
          계좌이체
        </label>
        <label class="payment-method-option">
          <input 
            type="radio" 
            name="paymentMethod" 
            value="phone" 
            x-model="payment.paymentMethod"
          >
          <span class="method-icon phone"></span>
          핸드폰 결제
        </label>
      </div>
    </div>
    
    <!-- 이용약관 동의 -->
    <div class="form-group">
      <label class="checkbox-label">
        <input 
          type="checkbox" 
          name="agreeTerms" 
          x-model="payment.agreeTerms"
          required
        >
        <span class="checkmark"></span>
        <a href="/terms" target="_blank">이용약관</a> 및 <a href="/privacy" target="_blank">개인정보처리방침</a>에 동의합니다.
      </label>
    </div>
    
    <!-- 결제 버튼 -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn btn-primary btn-lg"
        :disabled="!canSubmit() || loading"
        x-text="loading ? '결제 진행 중...' : `₩${formatAmount(payment.amount)} 결제하기`"
      >
        결제하기
      </button>
    </div>
    
    <!-- 로딩 상태 -->
    <div id="payment-loading" class="htmx-indicator">
      <div class="loading-spinner">결제를 처리하는 중...</div>
    </div>
    
    <!-- 결제 결과 -->
    <div id="payment-result" class="payment-result"></div>
  </form>
</div>

<script>
function paymentForm() {
  return {
    payment: {
      licenseType: '',
      amount: 0,
      paymentMethod: 'card',
      agreeTerms: false
    },
    loading: false,
    
    initPayment() {
      // 결제 폼 초기화
      this.updateAmount();
    },
    
    updateAmount() {
      const prices = {
        basic: 9900,
        pro: 19900,
        premium: 39900
      };
      this.payment.amount = prices[this.payment.licenseType] || 0;
    },
    
    canSubmit() {
      return this.payment.licenseType && 
             this.payment.paymentMethod && 
             this.payment.agreeTerms && 
             this.payment.amount > 0;
    },
    
    formatAmount(amount) {
      return new Intl.NumberFormat('ko-KR').format(amount || 0);
    },
    
    async processPayment(event) {
      // HTMX가 처리하도록 함
      return true;
    }
  }
}
</script>
```

#### Supabase Edge Function: 결제 처리
```javascript
// Supabase Edge Function: POST /functions/payments-process
import { corsHeaders } from '../_shared/cors.js';
import { validateUTF8Text } from '../_shared/utils.js';

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      '<div class="alert alert-error">POST 요청만 지원됩니다.</div>',
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );

  try {
    // JWT 토큰에서 사용자 정보 추출
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        '<div class="alert alert-error">로그인이 필요합니다.</div>',
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        '<div class="alert alert-error">인증에 실패했습니다.</div>',
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    const formData = await req.formData();
    const paymentData = {
      licenseType: formData.get('licenseType'),
      paymentMethod: formData.get('paymentMethod'),
      agreeTerms: formData.get('agreeTerms') === 'on'
    };
    
    // 데이터 검증
    if (!paymentData.licenseType || !paymentData.paymentMethod || !paymentData.agreeTerms) {
      return new Response(
        '<div class="alert alert-error">모든 필수 항목을 입력해주세요.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    // 결제 금액 계산
    const prices = {
      basic: 9900,
      pro: 19900,
      premium: 39900
    };
    const amount = prices[paymentData.licenseType];
    
    if (!amount) {
      return new Response(
        '<div class="alert alert-error">잘못된 라이선스 유형입니다.</div>',
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    // Toss Payments 결제 요청 데이터
    const orderData = {
      amount: amount,
      orderId: `order_${user.id}_${Date.now()}`,
      orderName: `IEPON ${paymentData.licenseType.toUpperCase()} 라이선스`,
      customerName: user.user_metadata?.full_name || '사용자',
      customerEmail: user.email,
      successUrl: `${new URL(req.url).origin}/payment/success`,
      failUrl: `${new URL(req.url).origin}/payment/fail`
    };
    
    // 결제 요청 데이터베이스 저장
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount: amount,
        status: 'pending',
        payment_method: paymentData.paymentMethod,
        license_type: paymentData.licenseType,
        order_id: orderData.orderId,
        order_name: orderData.orderName
      })
      .select()
      .single();
      
    if (paymentError) {
      console.error('결제 데이터 저장 오류:', paymentError);
      throw paymentError;
    }
    
    // Toss Payments 위젯 설정 스크립트 반환
    return new Response(`
      <div class="payment-widget-container">
        <div id="payment-widget"></div>
        <script src="https://js.tosspayments.com/v1/payment-widget"></script>
        <script>
          const clientKey = '${Deno.env.get('TOSS_PAYMENTS_CLIENT_KEY')}';
          const paymentWidget = PaymentWidget(clientKey, PaymentWidget.ANONYMOUS);
          
          paymentWidget.renderPaymentMethods('#payment-widget', ${JSON.stringify(orderData)});
          
          // 결제 진행
          document.getElementById('confirm-payment').onclick = function() {
            paymentWidget.requestPayment({
              orderId: '${orderData.orderId}',
              orderName: '${orderData.orderName}',
              successUrl: '${orderData.successUrl}',
              failUrl: '${orderData.failUrl}'
            });
          };
        </script>
        
        <div class="widget-actions">
          <button id="confirm-payment" class="btn btn-primary btn-lg">
            ₩${new Intl.NumberFormat('ko-KR').format(amount)} 결제하기
          </button>
        </div>
      </div>
    `, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'payment-widget-loaded'
      }
    });
  } catch (error) {
    console.error('결제 처리 오류:', error);
    return new Response(
      '<div class="alert alert-error">결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.</div>',
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});
```

### 7.5.3 HTMX 라이선스 상태 확인

#### 라이선스 상태 컴포넌트
```html
<!-- 라이선스 상태 표시 (Alpine.js + HTMX) -->
<div 
  x-data="licenseStatus()" 
  x-init="loadLicense()"
  hx-get="/functions/licenses-current" 
  hx-trigger="load, license-updated from:body"
  hx-target="#license-info"
  hx-indicator="#license-loading"
>
  <div class="license-status-card">
    <div id="license-loading" class="htmx-indicator">
      <div class="loading-spinner">라이선스 정보를 불러오는 중...</div>
    </div>
    
    <div id="license-info">
      <!-- HTMX로 동적 로드될 라이선스 정보 -->
    </div>
  </div>
</div>

<script>
function licenseStatus() {
  return {
    license: null,
    loading: false,
    
    async loadLicense() {
      // HTMX가 처리하므로 별도 처리 불필요
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ko-KR');
    },
    
    getLicenseStatusBadge(status) {
      const badges = {
        active: 'success',
        expired: 'danger',
        cancelled: 'warning'
      };
      return badges[status] || 'secondary';
    }
  }
}
</script>
```

#### Supabase Edge Function: 라이선스 조회
```javascript
// Supabase Edge Function: GET /functions/licenses-current
import { corsHeaders } from '../_shared/cors.js';

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      '<div class="license-info error">지원되지 않는 요청 방식입니다.</div>',
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  );
  
  try {
    // JWT 토큰에서 사용자 정보 추출
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        '<div class="license-info no-auth"><p>로그인이 필요합니다.</p><a href="/login" class="btn btn-primary">로그인</a></div>',
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        '<div class="license-info no-auth"><p>인증에 실패했습니다.</p><a href="/login" class="btn btn-primary">로그인</a></div>',
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    
    const { data, error } = await supabaseClient
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('라이선스 조회 오류:', error);
      throw error;
    }
    
    // 라이선스 정보 HTML 생성
    if (!data) {
      return new Response(`
        <div class="license-info no-license">
          <div class="license-status-badge status-inactive">비활성</div>
          <h3>활성된 라이선스가 없습니다</h3>
          <p>IEPON의 모든 기능을 이용하려면 라이선스를 구매해주세요.</p>
          <div class="license-actions">
            <a href="/pricing" class="btn btn-primary">라이선스 구매</a>
            <a href="/trial" class="btn btn-secondary">무료 체험</a>
          </div>
        </div>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 라이선스 만료일 계산
    const endDate = new Date(data.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    const statusBadge = daysRemaining > 7 ? 'success' : 
                       daysRemaining > 0 ? 'warning' : 'danger';
    
    const statusText = daysRemaining > 0 ? `${daysRemaining}일 남음` : '만료됨';
    
    return new Response(`
      <div class="license-info active">
        <div class="license-header">
          <div class="license-status-badge status-${statusBadge}">활성</div>
          <div class="license-type">${data.license_type.toUpperCase()}</div>
        </div>
        
        <div class="license-details">
          <div class="license-period">
            <span class="label">이용 기간:</span>
            <span class="value">
              ${new Date(data.start_date).toLocaleDateString('ko-KR')} ~ 
              ${endDate.toLocaleDateString('ko-KR')}
            </span>
          </div>
          
          <div class="license-remaining">
            <span class="label">남은 기간:</span>
            <span class="value status-${statusBadge}">${statusText}</span>
          </div>
          
          <div class="license-features">
            <span class="label">이용 가능 기능:</span>
            <div class="features-list">
              <span class="feature">학생 관리</span>
              <span class="feature">교육계획 생성</span>
              ${data.license_type !== 'basic' ? '<span class="feature">AI 기능</span>' : ''}
              ${data.license_type === 'premium' ? '<span class="feature">고급 분석</span>' : ''}
            </div>
          </div>
        </div>
        
        <div class="license-actions">
          ${daysRemaining <= 7 ? `
            <button 
              hx-get="/pricing" 
              hx-target="#main-content"
              class="btn btn-primary"
            >
              갱신하기
            </button>
          ` : ''}
          <button 
            hx-get="/functions/licenses-history" 
            hx-target="#license-history"
            hx-trigger="click"
            class="btn btn-secondary"
          >
            이용 내역
          </button>
        </div>
      </div>
      
      <div id="license-history" class="license-history"></div>
    `, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'license-loaded'
      }
    });
  } catch (error) {
    console.error('라이선스 조회 오류:', error);
    return new Response(
      '<div class="license-info error"><div class="error-message">라이선스 정보를 불러올 수 없습니다.</div><button onclick="htmx.trigger(\"#license-info\", \"license-updated\")" class="btn btn-sm btn-secondary">다시 시도</button></div>',
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
});
```

---

## 7.6 파일 관리 API

### 7.6.1 HTMX 파일 업로드

#### 파일 업로드 컴포넌트
```html
<!-- 파일 업로드 폼 (Alpine.js + HTMX) -->
<div x-data="fileUploader()">
  <form 
    hx-post="/functions/files-upload" 
    hx-target="#upload-result"
    hx-encoding="multipart/form-data"
    class="file-upload-form"
  >
    <div class="form-group">
      <label for="file-input" class="file-input-label">
        <div class="file-drop-zone" :class="{ 'has-file': selectedFile }">
          <div class="file-icon" x-show="!selectedFile">
            📁
          </div>
          <div class="file-info" x-show="selectedFile">
            <div x-text="selectedFile?.name"></div>
            <div x-text="formatFileSize(selectedFile?.size)"></div>
          </div>
          <div class="upload-text">
            <span x-show="!selectedFile">파일을 클릭하여 선택하세요</span>
            <span x-show="selectedFile">다른 파일로 변경하려면 클릭하세요</span>
          </div>
          <input 
            type="file" 
            id="file-input"
            name="file"
            @change="handleFileSelect($event)"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.hwp"
            required
          >
        </div>
      </label>
    </div>
    
    <div class="form-group">
      <label>저장 위치</label>
      <select name="folder" class="form-control">
        <option value="general">일반 파일</option>
        <option value="students">학생 자료</option>
        <option value="curriculum">교육과정</option>
        <option value="reports">보고서</option>
      </select>
    </div>
    
    <button type="submit" class="btn btn-primary" :disabled="!selectedFile">
      파일 업로드
    </button>
    
    <div id="upload-result"></div>
  </form>
</div>

<script>
function fileUploader() {
  return {
    selectedFile: null,
    
    handleFileSelect(event) {
      this.selectedFile = event.target.files[0];
    },
    
    formatFileSize(bytes) {
      if (!bytes) return '0 B';
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
  }
}
</script>
```

#### Edge Function: 파일 업로드
```javascript
// Edge Functions: files-upload
serve(async (req) => {
  try {
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
    if (!user) {
      return new Response(`<div class="alert alert-error">로그인이 필요합니다.</div>`, { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'general';
    
    if (!file || !(file instanceof File)) {
      return new Response(`<div class="alert alert-error">파일을 선택해주세요.</div>`, { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 파일명 생성
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('files')
      .upload(filePath, file);

    if (error) throw error;
    
    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);
    
    return new Response(`
      <div class="alert alert-success">
        <h4>파일 업로드 완료</h4>
        <p>파일명: ${file.name}</p>
        <p>크기: ${Math.round(file.size / 1024)} KB</p>
        <a href="${publicUrl}" target="_blank">파일 보기</a>
      </div>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return new Response(`<div class="alert alert-error">업로드 실패</div>`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
```

### 7.6.2 HTMX 파일 삭제

#### 파일 삭제 버튼
```html
<button 
  hx-delete="/functions/files-delete" 
  hx-vals='js:{"filePath": "${filePath}"}'
  hx-target="closest .file-item"
  hx-confirm="정말로 이 파일을 삭제하시겠습니까?"
  class="btn btn-danger btn-sm"
>
  삭제
</button>
```

#### Edge Function: 파일 삭제
```javascript
// Edge Functions: files-delete
serve(async (req) => {
  try {
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
    if (!user) {
      return new Response(`<div class="alert alert-error">로그인이 필요합니다.</div>`, { 
        status: 401
      });
    }
    
    const { filePath } = await req.json();
    
    // Storage에서 파일 삭제
    const { error } = await supabase.storage
      .from('files')
      .remove([filePath]);

    if (error) throw error;

    // 성공 시 빈 응답 (HTMX가 요소를 제거)
    return new Response('', {
      headers: { ...corsHeaders, 'HX-Trigger': 'file-deleted' }
    });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return new Response(`<div class="alert alert-error">삭제 실패</div>`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
```
```

---

## 7.7 AI 통합 API

### 7.7.1 HTMX 교육목표 자동 생성

#### IEP 생성 컴포넌트
```html
<!-- IEP 생성 폼 (Alpine.js + HTMX) -->
<div x-data="iepGenerator()" x-init="init()">
  <form 
    hx-post="/functions/ai-generate-iep" 
    hx-target="#iep-result"
    hx-indicator="#iep-loading"
    @submit.prevent="generateIEP($event)"
    class="iep-generation-form"
  >
    <!-- 학생 선택 -->
    <div class="form-group">
      <label for="student-select">학생 선택</label>
      <select 
        id="student-select" 
        name="studentId" 
        x-model="form.studentId"
        class="form-control"
        required
      >
        <option value="">학생을 선택하세요</option>
        <template x-for="student in students" :key="student.id">
          <option :value="student.id" x-text="student.name"></option>
        </template>
      </select>
    </div>
    
    <!-- 학년도 및 학기 -->
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="academic-year">학년도</label>
        <input 
          type="number" 
          id="academic-year"
          name="academicYear"
          x-model="form.academicYear"
          min="2024" max="2030"
          class="form-control"
          required
        >
      </div>
      <div class="form-group col-md-6">
        <label for="semester">학기</label>
        <select 
          id="semester"
          name="semester"
          x-model="form.semester"
          class="form-control"
          required
        >
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>
      </div>
    </div>
    
    <!-- 교과목 선택 -->
    <div class="form-group">
      <label>교과목 선택 (여러개 선택 가능)</label>
      <div class="checkbox-group">
        <template x-for="subject in availableSubjects" :key="subject">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              :value="subject"
              x-model="form.subjects"
            >
            <span x-text="subject"></span>
          </label>
        </template>
      </div>
    </div>
    
    <!-- 장애 유형 -->
    <div class="form-group">
      <label for="disability-type">장애 유형</label>
      <select 
        id="disability-type"
        name="disabilityType"
        x-model="form.disabilityType"
        class="form-control"
        required
      >
        <option value="">장애 유형을 선택하세요</option>
        <option value="지적장애">지적장애</option>
        <option value="자폐성장애">자폐성장애</option>
        <option value="발달지연">발달지연</option>
        <option value="학습장애">학습장애</option>
        <option value="주의력결핑">주의력결핑</option>
      </select>
    </div>
    
    <!-- 현재 수준 설명 -->
    <div class="form-group">
      <label for="current-level">학생의 현재 수준 설명</label>
      <textarea 
        id="current-level"
        name="currentLevel"
        x-model="form.currentLevel"
        rows="4"
        class="form-control"
        placeholder="학생의 현재 학습 수준, 강점, 개선이 필요한 영역 등을 상세히 설명해주세요"
        required
      ></textarea>
    </div>
    
    <!-- 교사 선호도 -->
    <div class="form-group">
      <label for="teacher-preferences">교사 선호도 (선택사항)</label>
      <textarea 
        id="teacher-preferences"
        name="teacherPreferences"
        x-model="form.teacherPreferences"
        rows="3"
        class="form-control"
        placeholder="선호하는 교수법, 평가 방식, 주의사항 등"
      ></textarea>
    </div>
    
    <!-- 생성 버튼 -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn btn-primary btn-lg"
        :disabled="generating || !canGenerate"
        x-text="generating ? 'AI 생성 중...' : 'IEP 자동 생성'"
      >
        IEP 자동 생성
      </button>
    </div>
    
    <!-- 로딩 표시 -->
    <div id="iep-loading" class="htmx-indicator loading-container" x-show="generating">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">
          <h4>AI가 개별화 교육계획을 생성하고 있습니다...</h4>
          <p>잠시만 기다려주세요. (30초 ~ 2분)</p>
        </div>
      </div>
    </div>
    
    <!-- IEP 결과 -->
    <div id="iep-result" class="iep-result"></div>
  </form>
</div>

<script>
function iepGenerator() {
  return {
    students: [],
    availableSubjects: ['국어', '수학', '사회', '과학', '예체', '예술', '실과', '도덕'],
    generating: false,
    form: {
      studentId: '',
      academicYear: new Date().getFullYear(),
      semester: 1,
      subjects: [],
      disabilityType: '',
      currentLevel: '',
      teacherPreferences: ''
    },
    
    init() {
      this.loadStudents();
    },
    
    get canGenerate() {
      return this.form.studentId && 
             this.form.subjects.length > 0 && 
             this.form.disabilityType && 
             this.form.currentLevel.trim();
    },
    
    async loadStudents() {
      try {
        const response = await fetch('/functions/students', {
          headers: {
            'Authorization': `Bearer ${Alpine.store('auth').token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.students = data.students || [];
        }
      } catch (error) {
        console.error('학생 목록 로드 오류:', error);
      }
    },
    
    generateIEP(event) {
      this.generating = true;
      // HTMX가 요청을 처리하도록 함
      return true;
    }
  }
}
</script>
```

#### Edge Function: IEP 생성
```javascript
// Edge Functions: ai-generate-iep
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
    if (!user) {
      return new Response(`<div class="alert alert-error">로그인이 필요합니다.</div>`, { 
        status: 401
      });
    }
    
    const formData = await req.formData();
    const requestData = {
      studentId: formData.get('studentId'),
      academicYear: formData.get('academicYear'),
      semester: formData.get('semester'),
      subjects: formData.getAll('subjects'),
      disabilityType: formData.get('disabilityType'),
      currentLevel: formData.get('currentLevel'),
      teacherPreferences: formData.get('teacherPreferences')
    };
    
    // 입력 검증
    if (!requestData.studentId || !requestData.subjects.length || !requestData.disabilityType) {
      return new Response(`
        <div class="alert alert-error">
          필수 정보를 모두 입력해주세요.
        </div>
      `, { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    const startTime = Date.now();
    
    // OpenAI API 호출
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: `당신은 특수교육 전문가입니다. 개별화교육계획(IEP)을 생성해주세요.`
        }, {
          role: 'user',
          content: `
학생 ID: ${requestData.studentId}
학년도: ${requestData.academicYear}
학기: ${requestData.semester}
교과목: ${requestData.subjects.join(', ')}
장애유형: ${requestData.disabilityType}
현재수준: ${requestData.currentLevel}
교사선호도: ${requestData.teacherPreferences || '없음'}

위 정보를 바탕으로 한국의 특수교육 법령에 따른 IEP를 생성해주세요.
          `
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    const aiResult = await aiResponse.json();
    const generatedContent = aiResult.choices[0]?.message?.content;
    
    // AI 생성 이력 저장
    const { data: historyData } = await supabase
      .from('ai_generation_history')
      .insert({
        user_id: user.id,
        student_id: requestData.studentId,
        generation_type: 'complete_iep',
        request_data: requestData,
        response_data: { content: generatedContent },
        model_name: 'gpt-4',
        confidence_score: 0.9,
        processing_time_ms: Date.now() - startTime,
        status: 'completed'
      })
      .select()
      .single();
    
    // IEP 문서 DB 저장
    const { data: iepData } = await supabase
      .from('individualized_education_plans')
      .insert({
        student_id: requestData.studentId,
        academic_year: parseInt(requestData.academicYear),
        semester: parseInt(requestData.semester),
        subjects: requestData.subjects,
        iep_document: generatedContent,
        ai_generated: true,
        ai_generation_id: historyData?.id,
        ai_confidence: 0.9,
        status: 'draft'
      })
      .select()
      .single();
    
    // 성공 응답 HTML 반환
    return new Response(`
      <div class="alert alert-success iep-success">
        <div class="success-header">
          <h3>🎉 IEP 생성 완료!</h3>
          <p>개별화교육계획이 성공적으로 생성되었습니다.</p>
        </div>
        
        <div class="iep-content">
          <h4>생성된 IEP 내용</h4>
          <div class="iep-document">
            ${generatedContent.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div class="iep-actions">
          <a href="/iep/${iepData?.id}/edit" class="btn btn-primary">수정하기</a>
          <a href="/iep/${iepData?.id}/download" class="btn btn-secondary">다운로드</a>
          <button 
            hx-post="/functions/iep-approve"
            hx-vals='js:{"iepId": "${iepData?.id}"}'' 
            hx-target="closest .iep-success"
            class="btn btn-success"
          >
            승인하기
          </button>
        </div>
      </div>
      
      <script>
        // 생성 완료 후 폼 리셋
        setTimeout(() => {
          const generator = Alpine.store('iepGenerator');
          if (generator) generator.generating = false;
        }, 1000);
      </script>
    `, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'iep-generated'
      }
    });
  } catch (error) {
    console.error('IEP 생성 오류:', error);
    return new Response(`
      <div class="alert alert-error">
        IEP 생성 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
```

### 7.7.2 HTMX 교육과정 생성

#### 교육과정 생성 컴포넌트
```html
<!-- 교육과정 생성 폼 (Alpine.js + HTMX) -->
<div x-data="curriculumGenerator()" x-init="init()">
  <form 
    hx-post="/functions/ai-generate-curriculum" 
    hx-target="#curriculum-result"
    hx-indicator="#curriculum-loading"
    @submit.prevent="generateCurriculum($event)"
    class="curriculum-generation-form"
  >
    <!-- 교과목 선택 -->
    <div class="form-group">
      <label for="subject-select">교과목</label>
      <select 
        id="subject-select" 
        name="subject" 
        x-model="form.subject"
        class="form-control"
        required
      >
        <option value="">교과목을 선택하세요</option>
        <option value="국어">국어</option>
        <option value="수학">수학</option>
        <option value="사회">사회</option>
        <option value="과학">과학</option>
      </select>
    </div>
    
    <!-- 학년 및 학기 -->
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="grade">학년</label>
        <select 
          id="grade"
          name="grade"
          x-model="form.grade"
          class="form-control"
          required
        >
          <option value="">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
          <option value="4">4학년</option>
          <option value="5">5학년</option>
          <option value="6">6학년</option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <label for="semester">학기</label>
        <select 
          id="semester"
          name="semester"
          x-model="form.semester"
          class="form-control"
          required
        >
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>
      </div>
    </div>
    
    <!-- 단원 정보 -->
    <div class="form-row">
      <div class="form-group col-md-4">
        <label for="unit-number">단원 번호</label>
        <input 
          type="number" 
          id="unit-number"
          name="unitNumber"
          x-model="form.unitNumber"
          min="1" max="20"
          class="form-control"
          required
        >
      </div>
      <div class="form-group col-md-8">
        <label for="unit-title">단원명</label>
        <input 
          type="text" 
          id="unit-title"
          name="unitTitle"
          x-model="form.unitTitle"
          class="form-control"
          placeholder="예: 수와 연산, 문학의 갈래"
          required
        >
      </div>
    </div>
    
    <!-- 성취기준 -->
    <div class="form-group">
      <label for="achievement-standards">성취기준</label>
      <textarea 
        id="achievement-standards"
        name="achievementStandards"
        x-model="form.achievementStandards"
        rows="3"
        class="form-control"
        placeholder="단원의 주요 성취기준을 입력하세요"
      ></textarea>
    </div>
    
    <!-- 교육내용 -->
    <div class="form-group">
      <label for="educational-content">교육내용</label>
      <textarea 
        id="educational-content"
        name="educationalContent"
        x-model="form.educationalContent"
        rows="4"
        class="form-control"
        placeholder="단원에서 다룰 주요 내용을 입력하세요"
      ></textarea>
    </div>
    
    <!-- 수업 시간 -->
    <div class="form-group">
      <label for="duration">수업 시간 (차시)</label>
      <input 
        type="number" 
        id="duration"
        name="duration"
        x-model="form.duration"
        min="1" max="50"
        class="form-control"
        placeholder="10"
      >
    </div>
    
    <!-- 장애 고려사항 -->
    <div class="form-group">
      <label for="disability-considerations">장애 고려사항</label>
      <textarea 
        id="disability-considerations"
        name="disabilityConsiderations"
        x-model="form.disabilityConsiderations"
        rows="3"
        class="form-control"
        placeholder="특수교육 대상자를 위한 고려사항을 입력하세요"
      ></textarea>
    </div>
    
    <!-- 생성 버튼 -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn btn-primary btn-lg"
        :disabled="generating || !canGenerate"
        x-text="generating ? 'AI 생성 중...' : '교육과정 자동 생성'"
      >
        교육과정 자동 생성
      </button>
    </div>
    
    <!-- 로딩 표시 -->
    <div id="curriculum-loading" class="htmx-indicator loading-container" x-show="generating">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">
          <h4>AI가 교육과정을 생성하고 있습니다...</h4>
          <p>잠시만 기다려주세요. (1~3분)</p>
        </div>
      </div>
    </div>
    
    <!-- 교육과정 결과 -->
    <div id="curriculum-result" class="curriculum-result"></div>
  </form>
</div>

<script>
function curriculumGenerator() {
  return {
    generating: false,
    form: {
      subject: '',
      grade: '',
      semester: 1,
      unitNumber: '',
      unitTitle: '',
      achievementStandards: '',
      educationalContent: '',
      duration: 10,
      disabilityConsiderations: ''
    },
    
    init() {
      // 초기화 로직
    },
    
    get canGenerate() {
      return this.form.subject && 
             this.form.grade && 
             this.form.unitNumber && 
             this.form.unitTitle.trim();
    },
    
    generateCurriculum(event) {
      this.generating = true;
      // HTMX가 요청을 처리하도록 함
      return true;
    }
  }
}
</script>
```

#### Edge Function: 교육과정 생성
```javascript
// Edge Functions: ai-generate-curriculum
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
    if (!user) {
      return new Response(`<div class="alert alert-error">로그인이 필요합니다.</div>`, { 
        status: 401
      });
    }
    
    const formData = await req.formData();
    const requestData = {
      subject: formData.get('subject'),
      grade: parseInt(formData.get('grade')),
      semester: parseInt(formData.get('semester')),
      unitNumber: parseInt(formData.get('unitNumber')),
      unitTitle: formData.get('unitTitle'),
      achievementStandards: formData.get('achievementStandards'),
      educationalContent: formData.get('educationalContent'),
      duration: parseInt(formData.get('duration')) || 10,
      disabilityConsiderations: formData.get('disabilityConsiderations')
    };
    
    const startTime = Date.now();
    
    // OpenAI API 호출
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: `당신은 초등교육 전문가입니다. 교육과정 단원을 생성해주세요.`
        }, {
          role: 'user',
          content: `
교과목: ${requestData.subject}
학년: ${requestData.grade}학년
학기: ${requestData.semester}학기
단원번호: ${requestData.unitNumber}
단원명: ${requestData.unitTitle}
성취기준: ${requestData.achievementStandards || '미입력'}
교육내용: ${requestData.educationalContent || '미입력'}
수업시간: ${requestData.duration}차시
장애고려사항: ${requestData.disabilityConsiderations || '미입력'}

위 정보를 바탕으로 상세한 교육과정 단원을 생성해주세요.
          `
        }],
        temperature: 0.7,
        max_tokens: 2500
      })
    });
    
    const aiResult = await aiResponse.json();
    const generatedContent = aiResult.choices[0]?.message?.content;
    
    // AI 생성 이력 저장
    const { data: historyData } = await supabase
      .from('ai_generation_history')
      .insert({
        user_id: user.id,
        generation_type: 'curriculum_unit',
        request_data: requestData,
        response_data: { content: generatedContent },
        model_name: 'gpt-4',
        confidence_score: 0.88,
        processing_time_ms: Date.now() - startTime,
        status: 'completed'
      })
      .select()
      .single();
    
    // 교육과정 단원 DB 저장
    const { data: curriculumData } = await supabase
      .from('curriculum_units')
      .insert({
        subject: requestData.subject,
        grade: requestData.grade,
        semester: requestData.semester,
        unit_number: requestData.unitNumber,
        unit_title: requestData.unitTitle,
        achievement_standards: requestData.achievementStandards || '',
        educational_content: generatedContent,
        evaluation_plan: '수행평가, 과제평가, 관찰평가',
        duration: requestData.duration,
        ai_generated: true,
        ai_generation_id: historyData?.id,
        ai_confidence: 0.88,
        status: 'draft'
      })
      .select()
      .single();
    
    // 성공 응답 HTML 반환
    return new Response(`
      <div class="alert alert-success curriculum-success">
        <div class="success-header">
          <h3>🎉 교육과정 생성 완료!</h3>
          <p>${requestData.subject} ${requestData.grade}학년 ${requestData.unitNumber}단원 '${requestData.unitTitle}'이 성공적으로 생성되었습니다.</p>
        </div>
        
        <div class="curriculum-content">
          <h4>생성된 교육과정 내용</h4>
          <div class="curriculum-document">
            ${generatedContent.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div class="curriculum-actions">
          <a href="/curriculum/${curriculumData?.id}/edit" class="btn btn-primary">수정하기</a>
          <a href="/curriculum/${curriculumData?.id}/download" class="btn btn-secondary">다운로드</a>
          <button 
            hx-post="/functions/curriculum-approve"
            hx-vals='js:{"curriculumId": "${curriculumData?.id}"}'' 
            hx-target="closest .curriculum-success"
            class="btn btn-success"
          >
            승인하기
          </button>
        </div>
      </div>
      
      <script>
        // 생성 완료 후 폼 리셋
        setTimeout(() => {
          const generator = Alpine.store('curriculumGenerator');
          if (generator) generator.generating = false;
        }, 1000);
      </script>
    `, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'curriculum-generated'
      }
    });
  } catch (error) {
    console.error('교육과정 생성 오류:', error);
    return new Response(`
      <div class="alert alert-error">
        교육과정 생성 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
```

### 7.7.3 HTMX 교육과정 배정 관리

#### 교육과정 배정 컴포넌트
```html
<!-- 교육과정 배정 폼 (Alpine.js + HTMX) -->
<div x-data="curriculumAssigner()" x-init="init()">
  <form 
    hx-post="/functions/curriculum-assignments" 
    hx-target="#assignment-result"
    hx-indicator="#assignment-loading"
    @submit.prevent="assignCurriculum($event)"
    class="curriculum-assignment-form"
  >
    <!-- 학생 선택 -->
    <div class="form-group">
      <label for="student-select">학생 선택</label>
      <select 
        id="student-select" 
        name="studentId" 
        x-model="form.studentId"
        class="form-control"
        multiple
        size="5"
        required
      >
        <template x-for="student in students" :key="student.id">
          <option :value="student.id" x-text="`${student.name} (${student.grade}학년)`"></option>
        </template>
      </select>
      <small class="help-text">여러 학생을 동시에 선택하려면 Ctrl/Cmd + 클릭하세요</small>
    </div>
    
    <!-- 교육과정 단원 선택 -->
    <div class="form-group">
      <label for="curriculum-select">교육과정 단원</label>
      <select 
        id="curriculum-select" 
        name="curriculumUnitId" 
        x-model="form.curriculumUnitId"
        class="form-control"
        required
      >
        <option value="">교육과정 단원을 선택하세요</option>
        <template x-for="unit in curriculumUnits" :key="unit.id">
          <option :value="unit.id" x-text="`${unit.subject} ${unit.grade}학년 - ${unit.unit_title}`"></option>
        </template>
      </select>
    </div>
    
    <!-- 학년도 및 학기 -->
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="academic-year">학년도</label>
        <input 
          type="number" 
          id="academic-year"
          name="academicYear"
          x-model="form.academicYear"
          min="2024" max="2030"
          class="form-control"
          required
        >
      </div>
      <div class="form-group col-md-6">
        <label for="semester">학기</label>
        <select 
          id="semester"
          name="semester"
          x-model="form.semester"
          class="form-control"
          required
        >
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>
      </div>
    </div>
    
    <!-- 배정 월 -->
    <div class="form-group">
      <label>배정 월 (여러개 선택 가능)</label>
      <div class="checkbox-group">
        <template x-for="month in months" :key="month.value">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              :value="month.value"
              x-model="form.assignedMonths"
            >
            <span x-text="month.label"></span>
          </label>
        </template>
      </div>
    </div>
    
    <!-- 배정 사유 -->
    <div class="form-group">
      <label for="assignment-reason">배정 사유</label>
      <textarea 
        id="assignment-reason"
        name="assignmentReason"
        x-model="form.assignmentReason"
        rows="3"
        class="form-control"
        placeholder="이 교육과정을 배정하는 이유를 설명해주세요"
        required
      ></textarea>
    </div>
    
    <!-- 난이도 수준 -->
    <div class="form-group">
      <label for="difficulty-level">난이도 수준</label>
      <select 
        id="difficulty-level"
        name="difficultyLevel"
        x-model="form.difficultyLevel"
        class="form-control"
      >
        <option value="easy">쉬움</option>
        <option value="medium">보통</option>
        <option value="hard">어려움</option>
      </select>
    </div>
    
    <!-- 개별화 주의사항 -->
    <div class="form-group">
      <label for="individualization-notes">개별화 주의사항</label>
      <textarea 
        id="individualization-notes"
        name="individualizationNotes"
        x-model="form.individualizationNotes"
        rows="3"
        class="form-control"
        placeholder="학생 개별 특성에 따른 주의사항을 입력하세요"
      ></textarea>
    </div>
    
    <!-- 배정 버튼 -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn btn-primary btn-lg"
        :disabled="assigning || !canAssign"
        x-text="assigning ? '배정 중...' : '교육과정 배정'"
      >
        교육과정 배정
      </button>
    </div>
    
    <!-- 로딩 표시 -->
    <div id="assignment-loading" class="htmx-indicator loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">
          <h4>교육과정을 배정하고 있습니다...</h4>
        </div>
      </div>
    </div>
    
    <!-- 배정 결과 -->
    <div id="assignment-result" class="assignment-result"></div>
  </form>
</div>

<script>
function curriculumAssigner() {
  return {
    students: [],
    curriculumUnits: [],
    assigning: false,
    months: [
      { value: 3, label: '3월' }, { value: 4, label: '4월' }, { value: 5, label: '5월' },
      { value: 6, label: '6월' }, { value: 7, label: '7월' }, { value: 9, label: '9월' },
      { value: 10, label: '10월' }, { value: 11, label: '11월' }, { value: 12, label: '12월' },
      { value: 1, label: '1월' }, { value: 2, label: '2월' }
    ],
    form: {
      studentId: [],
      curriculumUnitId: '',
      academicYear: new Date().getFullYear(),
      semester: 1,
      assignedMonths: [],
      assignmentReason: '',
      difficultyLevel: 'medium',
      individualizationNotes: ''
    },
    
    init() {
      this.loadStudents();
      this.loadCurriculumUnits();
    },
    
    get canAssign() {
      return this.form.studentId.length > 0 && 
             this.form.curriculumUnitId && 
             this.form.assignedMonths.length > 0 && 
             this.form.assignmentReason.trim();
    },
    
    async loadStudents() {
      try {
        const response = await fetch('/functions/students');
        if (response.ok) {
          const data = await response.json();
          this.students = data.students || [];
        }
      } catch (error) {
        console.error('학생 목록 로드 오류:', error);
      }
    },
    
    async loadCurriculumUnits() {
      try {
        const response = await fetch('/functions/curriculum-units');
        if (response.ok) {
          const data = await response.json();
          this.curriculumUnits = data.units || [];
        }
      } catch (error) {
        console.error('교육과정 목록 로드 오류:', error);
      }
    },
    
    assignCurriculum(event) {
      this.assigning = true;
      return true;
    }
  }
}
</script>
```

#### Edge Function: 교육과정 배정
```javascript
// Edge Functions: curriculum-assignments
serve(async (req) => {
  try {
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
    if (!user) {
      return new Response(`<div class="alert alert-error">로그인이 필요합니다.</div>`, { 
        status: 401
      });
    }
    
    if (req.method === 'POST') {
      // 배정 생성
      const formData = await req.formData();
      const studentIds = formData.getAll('studentId');
      const assignmentData = {
        curriculumUnitId: formData.get('curriculumUnitId'),
        academicYear: parseInt(formData.get('academicYear')),
        semester: parseInt(formData.get('semester')),
        assignedMonths: formData.getAll('assignedMonths').map(m => parseInt(m)),
        assignmentReason: formData.get('assignmentReason'),
        difficultyLevel: formData.get('difficultyLevel') || 'medium',
        individualizationNotes: formData.get('individualizationNotes')
      };
      
      const results = {
        success_count: 0,
        failed_assignments: [],
        created_assignments: []
      };
      
      // 각 학생에 대해 배정 생성
      for (const studentId of studentIds) {
        try {
          // 중복 배정 검사
          const { data: existing } = await supabase
            .from('curriculum_assignments')
            .select('id')
            .eq('student_id', studentId)
            .eq('curriculum_unit_id', assignmentData.curriculumUnitId)
            .eq('academic_year', assignmentData.academicYear)
            .eq('semester', assignmentData.semester)
            .eq('is_active', true)
            .single();
            
          if (existing) {
            results.failed_assignments.push({
              student_id: studentId,
              error: '이미 배정된 교육과정입니다.'
            });
            continue;
          }
          
          // 배정 생성
          const { data, error } = await supabase
            .from('curriculum_assignments')
            .insert({
              student_id: studentId,
              curriculum_unit_id: assignmentData.curriculumUnitId,
              academic_year: assignmentData.academicYear,
              semester: assignmentData.semester,
              assigned_months: assignmentData.assignedMonths,
              assignment_reason: assignmentData.assignmentReason,
              difficulty_level: assignmentData.difficultyLevel,
              individualization_notes: assignmentData.individualizationNotes,
              user_id: user.id,
              created_by: user.id,
              progress_status: 'assigned',
              progress_percentage: 0
            })
            .select(`
              *,
              students!inner(id, name, grade),
              curriculum_units!inner(id, unit_title, subject, grade)
            `)
            .single();
            
          if (error) throw error;
          
          results.created_assignments.push(data);
          results.success_count++;
        } catch (error) {
          results.failed_assignments.push({
            student_id: studentId,
            error: error.message || '알 수 없는 오류가 발생했습니다.'
          });
        }
      }
      
      // 결과 HTML 반환
      let resultHtml = `
        <div class="alert ${
          results.success_count > 0 ? 'alert-success' : 'alert-error'
        }">
          <h4>배정 결과</h4>
          <p>성공: ${results.success_count}건, 실패: ${results.failed_assignments.length}건</p>
      `;
      
      if (results.created_assignments.length > 0) {
        resultHtml += `
          <h5>성공적으로 배정된 학생</h5>
          <ul>
        `;
        results.created_assignments.forEach(assignment => {
          resultHtml += `<li>${assignment.students.name} - ${assignment.curriculum_units.unit_title}</li>`;
        });
        resultHtml += '</ul>';
      }
      
      if (results.failed_assignments.length > 0) {
        resultHtml += `
          <h5>배정에 실패한 학생</h5>
          <ul>
        `;
        results.failed_assignments.forEach(failed => {
          resultHtml += `<li>학생 ID ${failed.student_id}: ${failed.error}</li>`;
        });
        resultHtml += '</ul>';
      }
      
      resultHtml += '</div>';
      
      return new Response(resultHtml, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8', 'HX-Trigger': 'assignment-completed' }
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('교육과정 배정 오류:', error);
    return new Response(`<div class="alert alert-error">배정 중 오류가 발생했습니다.</div>`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});
```

    return createSuccessResponse(results);
  } catch (error) {
    return createErrorResponse(
      'BULK_ASSIGNMENT_ERROR',
      '대량 배정 생성에 실패했습니다.',
      error
    );
  }
};

#### 7.7.3 교육과정 배정 조회 API

**프론트엔드 (Alpine.js + HTMX 컴포넌트)**
```html
<!-- 교육과정 배정 목록 조회 컴포넌트 -->
<div x-data="curriculumAssignmentsList()" class="assignment-list-container">
  <!-- 필터 및 검색 폼 -->
  <form hx-get="/functions/curriculum-assignments" 
        hx-target="#assignments-results"
        hx-trigger="change, submit">
    <div class="filter-row">
      <select name="student_id" x-model="filters.student_id">
        <option value="">전체 학생</option>
        <template x-for="student in students" :key="student.id">
          <option :value="student.id" x-text="student.name"></option>
        </template>
      </select>
      
      <select name="progress_status" x-model="filters.progress_status">
        <option value="">전체 진행상태</option>
        <option value="not_started">시작 전</option>
        <option value="in_progress">진행중</option>
        <option value="completed">완료</option>
        <option value="on_hold">보류</option>
      </select>
      
      <button type="submit" class="btn-primary">
        <i class="fas fa-search"></i> 조회
      </button>
    </div>
  </form>
  
  <!-- 결과 영역 -->
  <div id="assignments-results" class="mt-4">
    <!-- Edge Function에서 반환되는 HTML 컨텐츠 -->
  </div>
</div>

<script>
function curriculumAssignmentsList() {
  return {
    students: [],
    filters: {
      student_id: '',
      progress_status: ''
    },
    
    init() {
      this.loadStudents();
      this.loadAssignments();
    },
    
    loadStudents() {
      fetch('/functions/students?limit=1000')
        .then(response => response.json())
        .then(data => {
          if (data.success) this.students = data.data.students || [];
        });
    },
    
    loadAssignments() {
      const form = this.$el.querySelector('form');
      htmx.trigger(form, 'submit');
    }
  };
}
</script>
```

**백엔드 (Supabase Edge Function)**
```javascript
// Edge Functions: curriculum-assignments-get
serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // 인증 확인
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);
    if (!user.user) {
      return new Response(
        JSON.stringify({ success: false, error: '인증이 필요합니다.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const url = new URL(req.url);
    const params = {
      student_id: url.searchParams.get('student_id') || '',
      curriculum_unit_id: url.searchParams.get('curriculum_unit_id') || '',
      progress_status: url.searchParams.get('progress_status') || '',
      limit: parseInt(url.searchParams.get('limit') || '20'),
      offset: parseInt(url.searchParams.get('offset') || '0')
    };
    
    // 쿼리 구성
    let query = supabase
      .from('curriculum_assignments')
      .select(`
        *,
        students!inner(id, name, grade, school_name),
        curriculum_units!inner(id, unit_title, subject, grade),
        user_profiles!curriculum_assignments_created_by_fkey(full_name)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('user_id', user.user.id);
    
    // 동적 필터링
    if (params.student_id) query = query.eq('student_id', params.student_id);
    if (params.curriculum_unit_id) query = query.eq('curriculum_unit_id', params.curriculum_unit_id);
    if (params.progress_status) query = query.eq('progress_status', params.progress_status);
    
    // 페이지네이션 및 정렬
    query = query
      .range(params.offset, params.offset + params.limit - 1)
      .order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // HTMX 호출인 경우 HTML 반환
    const isHTMX = req.headers.get('HX-Request') === 'true';
    
    if (isHTMX) {
      const assignmentsHTML = generateAssignmentsHTML(data || []);
      return new Response(assignmentsHTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // JSON API 호출인 경우
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          assignments: data || [],
          total: count || 0,
          has_more: (count || 0) > params.offset + params.limit
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    console.error('교육과정 배정 조회 오류:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '교육과정 배정 목록 조회에 실패했습니다.',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
});

function generateAssignmentsHTML(assignments) {
  if (assignments.length === 0) {
    return `<div class="no-data-message">조건에 맞는 교육과정 배정이 없습니다.</div>`;
  }
  
  return `
    <table class="assignments-table">
      <thead>
        <tr>
          <th>학생</th>
          <th>교육과정</th>
          <th>진행 상태</th>
          <th>생성일</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        ${assignments.map(assignment => `
          <tr>
            <td>${assignment.students.name}</td>
            <td>${assignment.curriculum_units.unit_title}</td>
            <td><span class="status-${assignment.progress_status}">${getStatusText(assignment.progress_status)}</span></td>
            <td>${new Date(assignment.created_at).toLocaleDateString('ko-KR')}</td>
            <td>
              <button hx-get="/api/curriculum-assignments/${assignment.id}/edit" 
                      hx-target="#edit-modal" class="btn-sm">수정</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function getStatusText(status) {
  const statusMap = {
    'not_started': '시작 전',
    'in_progress': '진행중', 
    'completed': '완료',
    'on_hold': '보류'
  };
  return statusMap[status] || status;
}
```

#### 7.7.4 교육과정 배정 수정 API

**프론트엔드 (Alpine.js + HTMX 컴포넌트)**
```html
<!-- 교육과정 배정 수정 폼 -->
<div x-data="assignmentEditForm()" class="assignment-edit-modal">
  <form hx-put="/api/curriculum-assignments" 
        hx-target="#assignment-update-result"
        hx-trigger="submit"
        @submit="validateForm">
    
    <input type="hidden" name="id" x-model="assignment.id">
    
    <div class="form-group">
      <label for="progress_status">진행 상태</label>
      <select name="progress_status" 
              id="progress_status" 
              x-model="assignment.progress_status" 
              required>
        <option value="not_started">시작 전</option>
        <option value="in_progress">진행중</option>
        <option value="completed">완료</option>
        <option value="on_hold">보류</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="notes">배정 메모</label>
      <textarea name="notes" 
                id="notes" 
                x-model="assignment.notes" 
                rows="3" 
                placeholder="배정에 대한 메모를 입력하세요"></textarea>
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn-primary" :disabled="loading">
        <span x-show="loading">수정중...</span>
        <span x-show="!loading">배정 수정</span>
      </button>
      
      <button type="button" 
              @click="closeModal()" 
              class="btn-secondary">
        취소
      </button>
    </div>
  </form>
  
  <div id="assignment-update-result" class="mt-3"></div>
</div>

<script>
function assignmentEditForm() {
  return {
    loading: false,
    assignment: {
      id: '',
      progress_status: 'not_started',
      notes: ''
    },
    
    init() {
      // HTMX 이벤트 리스너
      this.$el.addEventListener('htmx:beforeRequest', () => {
        this.loading = true;
      });
      
      this.$el.addEventListener('htmx:afterRequest', (event) => {
        this.loading = false;
        if (event.detail.xhr.status === 200) {
          // 성공 시 목록 새로고침
          this.refreshAssignmentsList();
        }
      });
    },
    
    validateForm(event) {
      if (!this.assignment.progress_status) {
        event.preventDefault();
        alert('진행 상태를 선택해주세요.');
        return false;
      }
    },
    
    refreshAssignmentsList() {
      // 부모 목록 컴포넌트 새로고침 트리거
      const listContainer = document.querySelector('#assignments-results');
      if (listContainer) {
        htmx.trigger(listContainer.closest('form'), 'submit');
      }
    },
    
    closeModal() {
      // 모달 닫기 로직
      this.$el.closest('.modal').style.display = 'none';
    }
  };
}
</script>
```

**백엔드 (Supabase Edge Function)**
```javascript
// supabase/functions/curriculum-assignments-update/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'PUT') {
    return new Response(
      JSON.stringify({ success: false, error: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // 인증 확인
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);
    if (!user.user) {
      return new Response(
        JSON.stringify({ success: false, error: '인증이 필요합니다.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 폼 데이터 파싱
    const formData = await req.formData();
    const assignmentId = formData.get('id')?.toString();
    const progressStatus = formData.get('progress_status')?.toString();
    const notes = formData.get('notes')?.toString() || '';
    
    if (!assignmentId) {
      return new Response(
        JSON.stringify({ success: false, error: '배정 ID가 필요합니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 배정 정보 업데이트
    const { data, error } = await supabase
      .from('curriculum_assignments')
      .update({
        progress_status: progressStatus,
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', assignmentId)
      .eq('user_id', user.user.id) // 소유자만 수정 가능
      .select(`
        *,
        students!inner(id, name, grade),
        curriculum_units!inner(id, unit_title, subject, grade)
      `)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '배정을 찾을 수 없거나 수정 권한이 없습니다.'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // HTMX 호출인 경우 HTML 응답 반환
    const isHTMX = req.headers.get('HX-Request') === 'true';
    
    if (isHTMX) {
      const successHTML = `
        <div class="alert alert-success" role="alert">
          <i class="fas fa-check-circle"></i>
          <strong>성공!</strong> ${data.students.name}의 교육과정 배정이 수정되었습니다.
          <div class="mt-2">
            <small>
              상태: <strong>${getStatusText(data.progress_status)}</strong><br>
              수정일: <strong>${new Date(data.updated_at).toLocaleString('ko-KR')}</strong>
            </small>
          </div>
        </div>
      `;
      
      return new Response(successHTML, {
        status: 200,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'HX-Trigger': 'assignmentUpdated' // Alpine.js 이벤트 트리거
        }
      });
    }
    
    // JSON API 호출인 경우
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: '교육과정 배정이 수정되었습니다.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    console.error('교육과정 배정 수정 오류:', error);
    
    const errorHTML = `
      <div class="alert alert-error" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        <strong>오류!</strong> 교육과정 배정 수정에 실패했습니다.
        <div class="mt-1">
          <small>${error.message}</small>
        </div>
      </div>
    `;
    
    return new Response(
      req.headers.get('HX-Request') === 'true' ? errorHTML : 
      JSON.stringify({
        success: false,
        error: '교육과정 배정 수정에 실패했습니다.',
        details: error.message
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': req.headers.get('HX-Request') === 'true' ? 
            'text/html; charset=utf-8' : 'application/json; charset=utf-8'
        }
      }
    );
  }
});

function getStatusText(status) {
  const statusMap = {
    'not_started': '시작 전',
    'in_progress': '진행중',
    'completed': '완료',
    'on_hold': '보류',
    'cancelled': '취소'
  };
  return statusMap[status] || status;
}
```

#### 7.7.5 교육과정 배정 삭제 API

**프론트엔드 (Alpine.js + HTMX 컴포넌트)**
```html
<!-- 교육과정 배정 삭제 버튼 (목록에서) -->
<button class="btn-sm btn-danger" 
        hx-delete="/api/curriculum-assignments" 
        hx-vals='js:{"id": "{{assignment.id}}"}'
        hx-target="closest tr"
        hx-swap="outerHTML"
        hx-confirm="정말로 이 배정을 취소하시겠습니까?\n학생: {{assignment.students.name}}\n교육과정: {{assignment.curriculum_units.unit_title}}"
        x-data
        @click="confirmDelete($event)">
  <i class="fas fa-trash"></i> 삭제
</button>

<script>
function confirmDelete(event) {
  // 추가적인 확인 로직이 필요한 경우
  const button = event.target.closest('button');
  const row = button.closest('tr');
  
  // 삭제 후 목록 새로고침을 위한 이벤트 리스너
  row.addEventListener('htmx:afterRequest', (event) => {
    if (event.detail.xhr.status === 200) {
      // 성공적으로 삭제된 경우 알림 표시
      showNotification('교육과정 배정이 취소되었습니다.', 'success');
    }
  });
}

function showNotification(message, type = 'info') {
  // 알림 표시 함수 (구현 필요)
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} notification`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
</script>
```

**백엔드 (Supabase Edge Function)**
```javascript
// supabase/functions/curriculum-assignments-delete/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== 'DELETE') {
    return new Response(
      JSON.stringify({ success: false, error: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // 인증 확인
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);
    if (!user.user) {
      return new Response(
        JSON.stringify({ success: false, error: '인증이 필요합니다.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 요청 데이터 파싱
    const requestData = await req.json();
    const assignmentId = requestData.id;
    
    if (!assignmentId) {
      return new Response(
        JSON.stringify({ success: false, error: '배정 ID가 필요합니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 소프트 삭제 (is_active = false, progress_status = 'cancelled')
    const { data, error } = await supabase
      .from('curriculum_assignments')
      .update({ 
        is_active: false,
        progress_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', assignmentId)
      .eq('user_id', user.user.id) // 소유자만 삭제 가능
      .select(`
        *,
        students!inner(name),
        curriculum_units!inner(unit_title)
      `)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '배정을 찾을 수 없거나 삭제 권한이 없습니다.'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // HTMX 호출인 경우 빈 응답 반환 (행 제거를 위해)
    const isHTMX = req.headers.get('HX-Request') === 'true';
    
    if (isHTMX) {
      // 빈 문자열 반환하여 해당 행 제거
      return new Response('', {
        status: 200,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'HX-Trigger': JSON.stringify({
            assignmentDeleted: {
              id: assignmentId,
              studentName: data.students.name,
              curriculumTitle: data.curriculum_units.unit_title
            }
          })
        }
      });
    }
    
    // JSON API 호출인 경우
    return new Response(
      JSON.stringify({
        success: true,
        message: '교육과정 배정이 취소되었습니다.',
        data: {
          id: assignmentId,
          student_name: data.students.name,
          curriculum_title: data.curriculum_units.unit_title
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    console.error('교육과정 배정 삭제 오류:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: '교육과정 배정 취소에 실패했습니다.',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
});
```

### 7.8.2 배정 대시보드 및 통계

// GET /api/curriculum-assignments/dashboard
const getAssignmentDashboard = async (params) => {
  try {
    let baseQuery = supabase
      .from('curriculum_assignments')
      .select(`
        *,
        students!inner(id, name, grade),
        curriculum_units!inner(id, unit_title, subject, grade)
      `)
      .eq('is_active', true);

    // 필터링
    if (params.student_id) baseQuery = baseQuery.eq('student_id', params.student_id);
    if (params.academic_year) baseQuery = baseQuery.eq('academic_year', params.academic_year);
    if (params.semester) baseQuery = baseQuery.eq('semester', params.semester);

    const { data: assignments, error } = await baseQuery;

    if (error) throw error;

    // 통계 데이터 생성
    const stats = {
      total_assignments: assignments?.length || 0,
      by_status: {},
      by_month: {},
      by_subject: {},
      recent_assignments: assignments?.slice(0, 5) || [],
      overdue_assignments: []
    };

    assignments?.forEach(assignment => {
      // 상태별 통계
      stats.by_status[assignment.progress_status] = (stats.by_status[assignment.progress_status] || 0) + 1;
      
      // 월별 통계
      assignment.assigned_months?.forEach(month => {
        const monthKey = `${month}월`;
        stats.by_month[monthKey] = (stats.by_month[monthKey] || 0) + 1;
      });
      
      // 과목별 통계
      const subject = assignment.curriculum_units?.subject;
      if (subject) {
        stats.by_subject[subject] = (stats.by_subject[subject] || 0) + 1;
      }
      
      // 지연된 배정 찾기 (예상 완료일이 지난 경우)
      if (assignment.completion_date && new Date(assignment.completion_date) < new Date() && assignment.progress_status !== 'completed') {
        stats.overdue_assignments.push(assignment);
      }
    });

    return createSuccessResponse(stats);
  } catch (error) {
    return createErrorResponse(
      'ASSIGNMENT_DASHBOARD_ERROR',
      '배정 대시보드 데이터 조회에 실패했습니다.',
      error
    );
  }
};

### 7.8.3 AI 기반 배정 추천

// POST /api/curriculum-assignments/ai-recommend
const getAIRecommendedAssignments = async (requestData) => {
  try {
    // 학생 정보 및 현재 수준 조회
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        current_levels(*)
      `)
      .eq('id', requestData.student_id)
      .single();

    if (studentError) throw studentError;

    // 기존 배정 조회
    const { data: existingAssignments } = await supabase
      .from('curriculum_assignments')
      .select('curriculum_unit_id')
      .eq('student_id', requestData.student_id)
      .eq('academic_year', requestData.academic_year)
      .eq('semester', requestData.semester)
      .eq('is_active', true);

    const assignedUnitIds = existingAssignments?.map(a => a.curriculum_unit_id) || [];

    // 가능한 교육과정 단원 조회
    let query = supabase
      .from('curriculum_units')
      .select('*')
      .eq('is_active', true);

    // 제외 과목 필터링
    if (requestData.preferences?.exclude_subjects?.length) {
      query = query.not('subject', 'in', `(${requestData.preferences.exclude_subjects.join(',')})`);
    }

    // 이미 배정된 단원 제외
    if (assignedUnitIds.length > 0) {
      query = query.not('id', 'in', `(${assignedUnitIds.join(',')})`);
    }

    const { data: availableUnits, error: unitsError } = await query;

    if (unitsError) throw unitsError;

    // AI 추천 로직 (실제로는 OpenAI API 호출)
    const recommendations = availableUnits?.map(unit => {
      // 간단한 추천 로직 (실제로는 더 복잡한 AI 모델 사용)
      let confidence = 0.7;
      let reason = '기본 추천';
      
      // 학생 학년과 단원 학년 비교
      if (unit.grade === student.grade) {
        confidence += 0.2;
        reason = '학생 학년과 일치하는 교육과정';
      } else if (Math.abs(unit.grade - student.grade) === 1) {
        confidence += 0.1;
        reason = '학생 학년과 비슷한 수준의 교육과정';
      }
      
      // 선호 난이도 반영
      if (requestData.preferences?.difficulty_preference) {
        confidence += 0.05;
      }
      
      // 집중 영역 반영
      if (requestData.preferences?.focus_areas?.some(area => 
        unit.achievement_standards?.includes(area) || 
        unit.educational_content?.includes(area)
      )) {
        confidence += 0.1;
        reason += ', 집중 학습 영역과 일치';
      }
      
      return {
        curriculum_unit: unit,
        confidence_score: Math.min(confidence, 1.0),
        recommendation_reason: reason,
        suggested_months: requestData.target_months.slice(0, 2), // 처음 2개월 추천
        estimated_duration: Math.ceil(unit.unit_number * 4) // 단원 번호 기반 예상 시간
      };
    })
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, 10); // 상위 10개 추천

    return createSuccessResponse({
      recommendations: recommendations || []
    });
  } catch (error) {
    return createErrorResponse(
      'AI_RECOMMENDATION_ERROR',
      'AI 배정 추천에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-lesson-plan
const generateLessonPlan = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출 - 교수학습 계획안 생성
    const response = await fetch('/api/ai/generate-lesson-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    if (result.success) {
      // AI 생성 이력 저장
      const { data: historyData } = await supabase
        .from('ai_generation_history')
        .insert({
          user_id: supabase.auth.user()?.id,
          student_id: requestData.studentId,
          generation_type: 'lesson_plan',
          request_data: requestData,
          response_data: result.data,
          model_name: 'gpt-4',
          confidence_score: result.data?.confidence || 0.87,
          processing_time_ms: Date.now() - startTime,
          status: 'completed'
        })
        .select()
        .single();
      
      // 교수학습 계획안 저장 (단순화된 구조 + AI 확장 필드)
      const { data: lessonData } = await supabase
        .from('lesson_plans')
        .insert({
          student_id: requestData.studentId,
          subject: requestData.subject,
          topic: requestData.topic,
          duration: requestData.duration,
          
          // AI 생성 기본 필드 (요약 버전)
          lesson_plan_summary: result.data.lessonPlan || '',
          objectives_summary: requestData.objectives?.join(', ') || '',
          activities_summary: result.data.activities?.map(a => a.name || a.title).join(', ') || '',
          materials_summary: requestData.materials?.join(', ') || '',
          assessment_summary: requestData.assessmentMethods?.join(', ') || '',
          
          // AI 생성 상세 필드
          ai_detailed_objectives: requestData.objectives,
          ai_detailed_activities: result.data.activities,
          ai_detailed_materials: requestData.materials,
          ai_detailed_assessment: {
            methods: requestData.assessmentMethods,
            timeline: result.data.timeline,
            differentiation: result.data.differentiation
          },
          
          // 메타데이터
          ai_generated: true,
          ai_generation_id: historyData?.id,
          ai_confidence: result.data?.confidence || 0.87,
          status: 'draft'
        })
        .select()
        .single();
        
      return createSuccessResponse({
        lessonPlanId: lessonData?.id,
        lessonPlan: result.data.lessonPlan,
        activities: result.data.activities,
        timeline: result.data.timeline,
        differentiation: result.data.differentiation,
        confidence: result.data?.confidence || 0.87,
        generationId: historyData?.id
      });
    }
    
    return result;
  } catch (error) {
    return createErrorResponse(
      'AI_LESSON_PLAN_ERROR',
      'AI 교수학습 계획안 생성에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-assessment-report
const generateAssessmentReport = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출 - 평가 보고서 생성
    const response = await fetch('/api/ai/generate-assessment-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    if (result.success) {
      // AI 생성 이력 저장
      const { data: historyData } = await supabase
        .from('ai_generation_history')
        .insert({
          user_id: supabase.auth.user()?.id,
          student_id: requestData.studentId,
          generation_type: 'assessment_report',
          request_data: requestData,
          response_data: result.data,
          model_name: 'gpt-4',
          confidence_score: result.data?.confidence || 0.89,
          processing_time_ms: Date.now() - startTime,
          status: 'completed'
        })
        .select()
        .single();
      
      // 평가 보고서 저장 (단순화된 구조 + AI 확장 필드)
      const { data: reportData } = await supabase
        .from('assessment_reports')
        .insert({
          student_id: requestData.studentId,
          assessment_type: requestData.assessmentType,
          assessment_period: requestData.period,
          subject: requestData.subjects?.[0] || null,
          
          // AI 생성 기본 필드 (요약 버전)
          report_summary: result.data.report || '',
          strengths_summary: result.data.strengths?.join(', ') || '',
          improvements_summary: result.data.improvements?.join(', ') || '',
          recommendations_summary: result.data.recommendations?.join(', ') || '',
          
          // AI 생성 상세 필드
          ai_detailed_analysis: {
            assessment_data: requestData.assessmentData,
            subjects: requestData.subjects,
            full_report: result.data.report
          },
          ai_detailed_strengths: result.data.strengths,
          ai_detailed_improvements: result.data.improvements,
          ai_detailed_recommendations: {
            recommendations: result.data.recommendations,
            next_steps: result.data.nextSteps
          },
          
          // 메타데이터
          ai_generated: true,
          ai_generation_id: historyData?.id,
          ai_confidence: result.data?.confidence || 0.89,
          status: 'draft'
        })
        .select()
        .single();
        
      return createSuccessResponse({
        reportId: reportData?.id,
        report: result.data.report,
        recommendations: result.data.recommendations,
        nextSteps: result.data.nextSteps,
        confidence: result.data?.confidence || 0.89,
        generationId: historyData?.id
      });
    }
    
    return result;
  } catch (error) {
    return createErrorResponse(
      'AI_ASSESSMENT_REPORT_ERROR',
      'AI 평가 보고서 생성에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-goal
const generateEducationGoal = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출
    const response = await fetch('/api/ai/generate-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    // AI 생성 이력 저장
    const { data: historyData, error: historyError } = await supabase
      .from('ai_generation_history')
      .insert({
        user_id: supabase.auth.user()?.id,
        student_id: requestData.studentId,
        generation_type: 'education_plan',
        request_data: requestData,
        response_data: result.data,
        model_name: 'gpt-4',
        model_version: '2024-01',
        confidence_score: result.data?.confidence || 0.85,
        processing_time_ms: Date.now() - startTime,
        status: result.success ? 'completed' : 'failed',
        error_message: result.error?.message
      })
      .select()
      .single();

    if (historyError) {
      console.error('AI 이력 저장 실패:', historyError);
    }

    return {
      ...result,
      data: {
        ...result.data,
        generationId: historyData?.id,
        confidence: result.data?.confidence || 0.85
      }
    };
  } catch (error) {
    return createErrorResponse(
      'AI_GENERATE_ERROR',
      'AI 생성에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-opinion
const generateSchoolOpinion = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출
    const response = await fetch('/api/ai/generate-opinion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    if (result.success) {
      // AI 생성 이력 저장
      const { data: historyData } = await supabase
        .from('ai_generation_history')
        .insert({
          user_id: supabase.auth.user()?.id,
          student_id: requestData.studentId,
          generation_type: 'school_opinion',
          request_data: requestData,
          response_data: result.data,
          model_name: 'gpt-4',
          confidence_score: result.data?.confidence || 0.9,
          processing_time_ms: Date.now() - startTime,
          status: 'completed'
        })
        .select()
        .single();
      
      // 학교장 의견서 저장 (단순화된 구조 + AI 확장 필드)
      const { data: opinionData } = await supabase
        .from('school_opinions')
        .insert({
          student_id: requestData.studentId,
          user_id: supabase.auth.user()?.id,
          opinion_type: requestData.opinionType,
          academic_year: parseInt(requestData.academicYear),
          semester: parseInt(requestData.semester),
          
          // AI 생성 기본 필드 (요약 버전)
          opinion_summary: result.data.opinion || '',
          student_overview: result.data.studentOverview || '',
          strengths_summary: result.data.strengths?.join(', ') || '',
          recommendations_summary: result.data.recommendations?.join(', ') || '',
          
          // AI 생성 상세 필드
          ai_detailed_opinion: {
            full_opinion: result.data.opinion,
            analysis: result.data.analysis
          },
          ai_detailed_analysis: result.data.detailedAnalysis,
          ai_detailed_recommendations: {
            recommendations: result.data.recommendations,
            next_steps: result.data.nextSteps
          },
          
          // 메타데이터
          ai_generated: true,
          ai_generation_id: historyData?.id,
          ai_confidence: result.data?.confidence || 0.9,
          status: 'draft'
        })
        .select()
        .single();
        
      return createSuccessResponse({
        opinionId: opinionData?.id,
        opinion: result.data.opinion,
        confidence: result.data?.confidence || 0.9,
        generationId: historyData?.id
      });
    }
    
    return result;
  } catch (error) {
    return createErrorResponse(
      'AI_GENERATE_ERROR',
      'AI 의견서 생성에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-counseling
const generateCounselingGuide = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출
    const response = await fetch('/api/ai/generate-counseling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    if (result.success) {
      // AI 생성 이력 저장
      const { data: historyData } = await supabase
        .from('ai_generation_history')
        .insert({
          user_id: supabase.auth.user()?.id,
          student_id: requestData.studentId,
          generation_type: 'counseling_guide',
          request_data: requestData,
          response_data: result.data,
          model_name: 'gpt-4',
          confidence_score: result.data?.confidence || 0.87,
          processing_time_ms: Date.now() - startTime,
          status: 'completed'
        })
        .select()
        .single();
      
      // 상담 기록 저장 (실제 테이블 구조에 맞춤)
      const { data: counselingData } = await supabase
        .from('counseling_records')
        .insert({
          student_id: requestData.studentId,
          user_id: supabase.auth.user()?.id,
          counseling_date: requestData.counselingDate,
          counseling_type: requestData.counselingType,
          participants: requestData.participants || [],
          main_topic: requestData.mainConcerns?.[0] || '상담 가이드 AI 생성',
          discussion_content: result.data.guide,
          agreements: result.data.actionItems || [],
          follow_up_actions: result.data.followUpSuggestions || [],
          next_meeting_date: null,
          attachments: [],
          autosave_state: {
            ai_generated: true,
            ai_generation_id: historyData?.id,
            ai_confidence: result.data?.confidence || 0.87,
            generation_timestamp: new Date().toISOString()
          },
          status: 'draft'
        })
        .select()
        .single();
        
      return createSuccessResponse({
        counselingId: counselingData?.id,
        guide: result.data.guide,
        actionItems: result.data.actionItems || [],
        followUpSuggestions: result.data.followUpSuggestions || [],
        generationId: historyData?.id,
        confidence: result.data?.confidence || 0.87
      });
    }
    
    return result;
  } catch (error) {
    return createErrorResponse(
      'AI_COUNSELING_ERROR',
      '상담 가이드 생성에 실패했습니다.',
      error
    );
  }
};

// POST /api/ai/generate-admin-document
const generateAdminDocument = async (requestData) => {
  try {
    const startTime = Date.now();
    
    // AI API 호출
    const response = await fetch('/api/ai/generate-admin-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    if (result.success) {
      // AI 생성 이력 저장
      const { data: historyData } = await supabase
        .from('ai_generation_history')
        .insert({
          user_id: supabase.auth.user()?.id,
          generation_type: 'admin_document',
          request_data: requestData,
          response_data: result.data,
          model_name: 'gpt-4',
          confidence_score: result.data?.confidence || 0.88,
          processing_time_ms: Date.now() - startTime,
          status: 'completed'
        })
        .select()
        .single();
      
      // 행정 문서 저장
      const { data: documentData } = await supabase
        .from('admin_documents')
        .insert({
          user_id: supabase.auth.user()?.id,
          document_type: requestData.documentType,
          document_title: requestData.documentTitle,
          document_content: result.data.document,
          target_period_start: requestData.targetPeriodStart,
          target_period_end: requestData.targetPeriodEnd,
          related_students: requestData.relatedStudents,
          ai_generated: true,
          ai_generation_id: historyData?.id,
          ai_confidence: result.data?.confidence || 0.88,
          template_id: requestData.templateId,
          status: 'draft',
          metadata: requestData.metadata
        })
        .select()
        .single();
        
      return createSuccessResponse({
        documentId: documentData?.id,
        document: result.data.document,
        generationId: historyData?.id,
        confidence: result.data?.confidence || 0.88
      });
    }
    
    return result;
  } catch (error) {
    return createErrorResponse(
      'AI_ADMIN_DOC_ERROR',
      '행정문서 생성에 실패했습니다.',
      error
    );
  }
};

### 7.8.4 AI 프롬프트 관리 API

#### AI 프롬프트 템플릿 조회
```javascript
// GET /api/ai/prompts
const getAIPrompts = async (params) => {
  try {
    let query = supabase
      .from('ai_prompt_templates')
      .select('*');

    if (params?.type) {
      query = query.eq('prompt_type', params.type);
    }
    if (params?.active !== undefined) {
      query = query.eq('is_active', params.active);
    }

    const { data, error, count } = await query
      .range(
        ((params?.page || 1) - 1) * (params?.limit || 20),
        (params?.page || 1) * (params?.limit || 20) - 1
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return createSuccessResponse({
      prompts: data || [],
      total: count || 0
    });
  } catch (error) {
    return createErrorResponse('AI_PROMPTS_FETCH_ERROR', 'AI 프롬프트 조회 실패', error);
  }
};

// PUT /api/ai/prompts/[id]
const updateAIPrompt = async (promptId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('ai_prompt_templates')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', promptId)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('AI_PROMPT_UPDATE_ERROR', 'AI 프롬프트 수정 실패', error);
  }
};
```

#### AI 응답 검증 및 품질 관리
```javascript
// POST /api/ai/validate-response
const validateAIResponse = async (requestData) => {
  try {
    // AI 응답 품질 검증
    const qualityCheck = await validateContentQuality(requestData.content, requestData.expectedType);
    
    // 검증 결과 저장
    const { data: validationData, error } = await supabase
      .from('ai_response_validations')
      .insert({
        generation_id: requestData.generationId,
        content_type: requestData.expectedType,
        quality_score: qualityCheck.score,
        is_valid: qualityCheck.isValid,
        validation_criteria: qualityCheck.criteria,
        suggestions: qualityCheck.suggestions,
        user_rating: requestData.userFeedback?.rating,
        user_comments: requestData.userFeedback?.comments,
        user_accuracy_rating: requestData.userFeedback?.isAccurate,
        user_usefulness_rating: requestData.userFeedback?.isUseful
      })
      .select()
      .single();

    if (error) throw error;

    // AI 생성 이력에 품질 점수 업데이트
    await supabase
      .from('ai_generation_history')
      .update({
        quality_score: qualityCheck.score,
        validation_status: qualityCheck.isValid ? 'validated' : 'rejected',
        user_feedback: requestData.userFeedback
      })
      .eq('id', requestData.generationId);

    return createSuccessResponse({
      isValid: qualityCheck.isValid,
      qualityScore: qualityCheck.score,
      suggestions: qualityCheck.suggestions,
      validationId: validationData.id
    });
  } catch (error) {
    return createErrorResponse('AI_VALIDATION_ERROR', 'AI 응답 검증 실패', error);
  }
};

// 컨텐츠 품질 검증 함수
const validateContentQuality = async (content, expectedType) => {
  const criteria = {
    hasMinimumLength: content.length >= 100,
    hasProperStructure: checkStructure(content, expectedType),
    hasRelevantKeywords: checkKeywords(content, expectedType),
    hasNoHarmfulContent: !checkHarmfulContent(content),
    hasEducationalValue: checkEducationalValue(content)
  };

  const score = Object.values(criteria).filter(Boolean).length / Object.keys(criteria).length;
  const isValid = score >= 0.8;

  const suggestions = [];
  if (!criteria.hasMinimumLength) suggestions.push('내용이 너무 짧습니다. 더 상세한 설명이 필요합니다.');
  if (!criteria.hasProperStructure) suggestions.push('문서 구조를 개선해주세요.');
  if (!criteria.hasRelevantKeywords) suggestions.push('관련 키워드를 추가해주세요.');
  if (!criteria.hasEducationalValue) suggestions.push('교육적 가치를 높이는 내용을 추가해주세요.');

  return { isValid, score, criteria, suggestions };
};
```

### 7.8.5 AI 성능 모니터링 API

#### AI 사용 통계
```javascript
// GET /api/ai/analytics
const getAIAnalytics = async (params) => {
  try {
    const { data, error } = await supabase.rpc('get_ai_analytics', {
      p_start_date: params?.start_date,
      p_end_date: params?.end_date,
      p_user_id: params?.user_id,
      p_generation_type: params?.generation_type
    });

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('AI_ANALYTICS_ERROR', 'AI 분석 데이터 조회 실패', error);
  }
};

#### 7.8.5 AI 성능 모니터링 API

**프론트엔드 (Alpine.js + HTMX 컴포넌트)**
```html
<!-- AI 성능 대시보드 컴포넌트 -->
<div x-data="aiPerformanceDashboard()" class="ai-performance-dashboard">
  <div class="dashboard-header">
    <h3>AI 시스템 성능 모니터링</h3>
    <button @click="refreshData()" 
            class="btn-secondary" 
            :disabled="loading">
      <i class="fas fa-refresh" :class="{'fa-spin': loading}"></i> 
      새로고침
    </button>
  </div>
  
  <!-- 실시간 업데이트 영역 -->
  <div hx-get="/api/ai/performance" 
       hx-target="#performance-content"
       hx-trigger="load, every 30s, refreshData from:body"
       hx-indicator="#loading-indicator">
    
    <div id="loading-indicator" class="loading-state htmx-indicator">
      <i class="fas fa-spinner fa-spin"></i> AI 성능 데이터 로드 중...
    </div>
    
    <div id="performance-content">
      <!-- Edge Function에서 반환되는 HTML 컨텐츠 -->
    </div>
  </div>
  
  <!-- 성능 설정 및 알림 -->
  <div class="performance-settings" x-show="showSettings">
    <h4>성능 알림 설정</h4>
    <form @submit="saveSettings" class="settings-form">
      <div class="form-group">
        <label>응답 시간 임계값 (ms)</label>
        <input type="number" 
               x-model="settings.responseTimeThreshold" 
               min="100" 
               step="100">
      </div>
      
      <div class="form-group">
        <label>오류율 임계값 (%)</label>
        <input type="number" 
               x-model="settings.errorRateThreshold" 
               min="1" 
               max="100" 
               step="0.1">
      </div>
      
      <button type="submit" class="btn-primary">설정 저장</button>
    </form>
  </div>
</div>

<script>
function aiPerformanceDashboard() {
  return {
    loading: false,
    showSettings: false,
    performanceData: null,
    settings: {
      responseTimeThreshold: 2000,
      errorRateThreshold: 5.0
    },
    
    init() {
      // HTMX 이벤트 리스너
      this.$el.addEventListener('htmx:beforeRequest', () => {
        this.loading = true;
      });
      
      this.$el.addEventListener('htmx:afterRequest', (event) => {
        this.loading = false;
        if (event.detail.xhr.status === 200) {
          this.handlePerformanceData(event.detail.xhr.response);
        }
      });
      
      // 성능 설정 로드
      this.loadSettings();
    },
    
    refreshData() {
      // 사용자 정의 이벤트 트리거
      this.$dispatch('refreshData');
    },
    
    handlePerformanceData(responseHTML) {
      // HTML 응답에서 성능 데이터 추출 및 알림 체크
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseHTML, 'text/html');
        const dataElement = doc.querySelector('[data-performance]');
        
        if (dataElement) {
          const data = JSON.parse(dataElement.getAttribute('data-performance'));
          this.performanceData = data;
          this.checkPerformanceAlerts(data);
        }
      } catch (error) {
        console.warn('성능 데이터 파싱 실패:', error);
      }
    },
    
    checkPerformanceAlerts(data) {
      // 성능 임계값 초과 시 알림
      if (data.systemHealth) {
        const { apiResponseTime, errorRate } = data.systemHealth;
        
        if (apiResponseTime > this.settings.responseTimeThreshold) {
          this.showAlert(`응답 시간이 임계값을 초과했습니다: ${apiResponseTime}ms`, 'warning');
        }
        
        if (errorRate > this.settings.errorRateThreshold) {
          this.showAlert(`오류율이 임계값을 초과했습니다: ${errorRate}%`, 'danger');
        }
      }
    },
    
    showAlert(message, type = 'info') {
      // 알림 표시 함수
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} performance-alert`;
      alert.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      document.querySelector('.ai-performance-dashboard').prepend(alert);
      
      // 5초 후 자동 제거
      setTimeout(() => {
        if (alert.parentElement) alert.remove();
      }, 5000);
    },
    
    loadSettings() {
      // 로컬 스토리지에서 설정 로드
      const saved = localStorage.getItem('aiPerformanceSettings');
      if (saved) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        } catch (error) {
          console.warn('설정 로드 실패:', error);
        }
      }
    },
    
    saveSettings(event) {
      event.preventDefault();
      
      // 로컬 스토리지에 설정 저장
      localStorage.setItem('aiPerformanceSettings', JSON.stringify(this.settings));
      
      this.showAlert('성능 알림 설정이 저장되었습니다.', 'success');
      this.showSettings = false;
    }
  };
}
</script>
```

**백엔드 (Supabase Edge Function)**
```javascript
// supabase/functions/ai-performance-get/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // 인증 확인 (관리자 권한 필요)
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);
    if (!user.user) {
      return new Response(
        JSON.stringify({ success: false, error: '인증이 필요합니다.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 사용자 권한 확인 (관리자만 접근 가능)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.user.id)
      .single();
    
    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: '관리자 권한이 필요합니다.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // AI 모델 성능 데이터 조회
    const { data: modelStats, error: modelError } = await supabase
      .rpc('get_ai_model_performance');
    
    // AI 시스템 상태 데이터 조회
    const { data: systemStats, error: systemError } = await supabase
      .rpc('get_ai_system_health');
    
    if (modelError || systemError) {
      throw new Error(modelError?.message || systemError?.message || 'RPC 호출 실패');
    }
    
    const performanceData = {
      modelPerformance: modelStats || [],
      systemHealth: systemStats || {
        apiResponseTime: 0,
        errorRate: 0,
        throughput: 0
      },
      timestamp: new Date().toISOString()
    };
    
    // HTMX 호출인 경우 HTML 반환
    const isHTMX = req.headers.get('HX-Request') === 'true';
    
    if (isHTMX) {
      const performanceHTML = generatePerformanceHTML(performanceData);
      return new Response(performanceHTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // JSON API 호출인 경우
    return new Response(
      JSON.stringify({
        success: true,
        data: performanceData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    console.error('AI 성능 데이터 조회 오류:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'AI 성능 데이터 조회에 실패했습니다.',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
});

function generatePerformanceHTML(data) {
  return `
    <div class="performance-content" data-performance='${JSON.stringify(data)}'>
      <!-- 시스템 상태 카드 -->
      <div class="performance-cards">
        <div class="performance-card ${
          data.systemHealth.apiResponseTime > 2000 ? 'status-warning' : 'status-good'
        }">
          <div class="card-header">
            <h4>API 응답 시간</h4>
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-value">
            <span class="value">${data.systemHealth.apiResponseTime}</span>
            <span class="unit">ms</span>
          </div>
          <div class="card-trend">
            ${data.systemHealth.apiResponseTime > 2000 ? 
              '<span class="trend-warning">⚠️ 임계값 초과</span>' : 
              '<span class="trend-good">✅ 정상</span>'
            }
          </div>
        </div>
        
        <div class="performance-card ${
          data.systemHealth.errorRate > 5.0 ? 'status-danger' : 'status-good'
        }">
          <div class="card-header">
            <h4>오류율</h4>
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="card-value">
            <span class="value">${data.systemHealth.errorRate.toFixed(1)}</span>
            <span class="unit">%</span>
          </div>
          <div class="card-trend">
            ${data.systemHealth.errorRate > 5.0 ? 
              '<span class="trend-danger">🚫 높음</span>' : 
              '<span class="trend-good">✅ 낮음</span>'
            }
          </div>
        </div>
        
        <div class="performance-card status-info">
          <div class="card-header">
            <h4>처리량</h4>
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="card-value">
            <span class="value">${data.systemHealth.throughput}</span>
            <span class="unit">req/min</span>
          </div>
          <div class="card-trend">
            <span class="trend-info">📊 모니터링</span>
          </div>
        </div>
      </div>
      
      <!-- AI 모델별 성능 테이블 -->
      <div class="model-performance-section">
        <h4>AI 모델별 성능</h4>
        <div class="performance-table-container">
          ${data.modelPerformance.length === 0 ? 
            '<p class="no-data">모델 성능 데이터가 없습니다.</p>' :
            `<table class="performance-table">
              <thead>
                <tr>
                  <th>모델명</th>
                  <th>평균 점수</th>
                  <th>총 사용량</th>
                  <th>오류율</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                ${data.modelPerformance.map(model => `
                  <tr>
                    <td class="model-name">
                      <i class="fas fa-robot"></i>
                      ${model.model}
                    </td>
                    <td class="score ${
                      model.averageScore >= 8.0 ? 'score-excellent' :
                      model.averageScore >= 6.0 ? 'score-good' : 'score-poor'
                    }">
                      ${model.averageScore.toFixed(1)}
                    </td>
                    <td class="usage">
                      ${model.totalUsage.toLocaleString()}
                    </td>
                    <td class="error-rate ${
                      model.errorRate > 5.0 ? 'error-high' : 'error-low'
                    }">
                      ${model.errorRate.toFixed(1)}%
                    </td>
                    <td class="status">
                      ${getModelStatus(model)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
          }
        </div>
      </div>
      
      <!-- 마지막 업데이트 시간 -->
      <div class="update-timestamp">
        <small>
          <i class="fas fa-clock"></i>
          마지막 업데이트: ${new Date(data.timestamp).toLocaleString('ko-KR')}
        </small>
      </div>
    </div>
  `;
}

function getModelStatus(model) {
  if (model.errorRate > 10.0) {
    return '<span class="status-badge status-danger">🚫 문제</span>';
  } else if (model.errorRate > 5.0) {
    return '<span class="status-badge status-warning">⚠️ 주의</span>';
  } else if (model.averageScore >= 8.0) {
    return '<span class="status-badge status-excellent">🌟 우수</span>';
  } else {
    return '<span class="status-badge status-good">✅ 양호</span>';
  }
}
```
```

### 7.8.6 AI 백업 및 재시도 시스템
```typescript
// POST /api/ai/retry-generation
const retryAIGeneration = async (requestData: {
  originalGenerationId: string;
  retryReason?: string;
  adjustedParameters?: {
    temperature?: number;
    maxTokens?: number;
    customPrompt?: string;
  };
}) {
  newGenerationId: string;
  content: string;
  confidence: number;
}>> => {
  try {
    // 원본 생성 정보 조회
    const { data: originalGeneration, error: fetchError } = await supabase
      .from('ai_generation_history')
      .select('*')
      .eq('id', requestData.originalGenerationId)
      .single();

    if (fetchError || !originalGeneration) {
      throw new Error('원본 생성 정보를 찾을 수 없습니다');
    }

    // 재시도 매개변수 준비
    const retryParams = {
      ...originalGeneration.request_data,
      ...requestData.adjustedParameters,
      isRetry: true,
      originalGenerationId: requestData.originalGenerationId
    };

    // AI 재생성 실행
    const retryResult = await generateWithAI(retryParams, originalGeneration.generation_type);

    // 재시도 이력 저장
    const { data: retryHistory } = await supabase
      .from('ai_generation_history')
      .insert({
        ...originalGeneration,
        id: undefined, // 새 ID 생성
        request_data: retryParams,
        response_data: retryResult.data,
        is_retry: true,
        original_generation_id: requestData.originalGenerationId,
        retry_reason: requestData.retryReason,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    return createSuccessResponse({
      newGenerationId: retryHistory?.id,
      content: retryResult.data.content,
      confidence: retryResult.data.confidence
    });
  } catch (error) {
    return createErrorResponse('AI_RETRY_ERROR', 'AI 재생성 실패', error);
  }
};

// 백업 응답 시스템
const getFallbackResponse = async (
  generationType: string,
  context: any
}) => {
  const fallbackTemplates = {
    monthly_plan: '기본 월별 계획 템플릿을 사용하여 계획을 작성해주세요.',
    evaluation: '평가 기준에 따라 체계적으로 평가해주세요.',
    counseling: '상담 가이드라인에 따라 진행해주세요.',
    admin_document: '행정 문서 양식에 맞춰 작성해주세요.'
  };

  return fallbackTemplates[generationType] || '기본 응답을 사용해주세요.';
};

// ...

// GET /api/curriculum-units
const getCurriculumUnits = async (params) => {
  try {
    let query = supabase
      .from('curriculum_units')
      .select('*')
      .order('subject')
      .order('grade_level')
      .order('semester')
      .order('unit_number');

    if (params?.subject) {
      query = query.eq('subject', params.subject);
    }
    if (params?.grade_level) {
      query = query.eq('grade_level', params.grade_level);
    }
    if (params?.semester) {
      query = query.eq('semester', params.semester);
    }
    if (params?.is_active !== undefined) {
      query = query.eq('is_active', params.is_active);
    }

    const { data, error } = await query;

    if (error) throw error;

    return createSuccessResponse(data || []);
  } catch (error) {
    return createErrorResponse(
      'FETCH_CURRICULUM_ERROR',
      '교육과정 목록 조회에 실패했습니다.',
      error
    );
  }
};

// ...

// POST /api/curriculum-units/upload
const uploadCurriculumUnits = async (
  file: File
}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/curriculum-units/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: formData
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || '파일 업로드 실패');
    }

    return createSuccessResponse(result.data);
  } catch (error) {
    return createErrorResponse(
      'UPLOAD_CURRICULUM_ERROR',
      '교육과정 업로드에 실패했습니다.',
      error
    );
  }
};

// GET /api/curriculum-units/template
const downloadCurriculumTemplate = async () => {
  try {
    const response = await fetch('/api/curriculum-units/template', {
      headers: {
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('템플릿 다운로드 실패');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '교육과정_업로드_템플릿.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('템플릿 다운로드 실패:', error);
  }
};
```

### 7.8.4 교육과정 검색
```javascript
// GET /api/curriculum-units/search
const searchCurriculumUnits = async (params = {}) => {
  try {
    let query = supabase
      .from('curriculum_units')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // 텍스트 검색
    if (params.query) {
      query = query.or(
        `unit_name.ilike.%${params.query}%,` +
        `learning_objectives.cs.{"${params.query}"},` +
        `learning_contents.cs.{"${params.query}"}`
      );
    }

    // 필터링
    if (params.subject) query = query.eq('subject', params.subject);
    if (params.grade_level) query = query.eq('grade_level', params.grade_level);
    if (params.semester) query = query.eq('semester', params.semester);

    // 페이지네이션
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    query = query.range(offset, offset + limit - 1);

    // 정렬
    query = query.order('subject').order('grade_level').order('unit_number');

    const { data, error, count } = await query;

    if (error) throw error;

    return createSuccessResponse({
      units: data || [],
      total: count || 0,
      has_more: (count || 0) > offset + limit
    });
  } catch (error) {
    return createErrorResponse(
      'SEARCH_CURRICULUM_ERROR',
      '교육과정 검색에 실패했습니다.',
      error
    );
  }
};
```

---

## 7.9 실시간 API

### 7.9.1 실시간 구독 설정
```javascript
// 학생 데이터 실시간 구독
const subscribeToStudents = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('students')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'students',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
};

// 교육계획 실시간 구독
const subscribeToEducationPlans = (
  studentId: string, 
  callback: (payload: any) => void
) => {
  return supabase
    .channel('monthly_plans')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'monthly_plans',
      filter: `student_id=eq.${studentId}`
    }, callback)
    .subscribe();
};
```

---

## 7.9 관리자 관리 API

### 7.9.1 관리자 계정 생성
```typescript
// supabase/functions/admin-users-create/index.ts
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const { email, password, role, displayName } = await req.json();
    
    // 관리자 권한 확인
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user || !await isAdmin(user.id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'UNAUTHORIZED', message: '관리자 권한이 필요합니다.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 새 관리자 계정 생성
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        display_name: displayName,
        is_admin: true,
        created_by: user.id
      }
    });

    if (error) {
      return Response.json(
        createErrorResponse('ADMIN_CREATE_ERROR', '관리자 계정 생성에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(createSuccessResponse(data));
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.9.2 사용자 관리
```typescript
// supabase/functions/admin-user-get/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PARAMS', message: '사용자 ID가 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.', details: error }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: user }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'INTERNAL_ERROR', message: '서버 내부 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
```

---

## 7.10 결제 시스템 API

> **참고**: 결제 시스템의 상세 설계 및 토스페이먼츠 연동 구현은 [14_결제_설계.md](./14_결제_설계.md) 문서를 참조하세요.

### 7.10.1 결제 요청 생성 (Payment Request)
```javascript
// supabase/functions/create-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// 결제 요청 데이터 검증 함수
function validatePaymentData(data) {
  const errors = [];
  
  if (!data.user_id || typeof data.user_id !== 'string') {
    errors.push('사용자 ID는 필수입니다');
  }
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('결제 금액은 0보다 큰 숫자여야 합니다');
  }
  if (!['card', 'bank_transfer', 'kakao_pay', 'toss_pay'].includes(data.payment_method)) {
    errors.push('지원되지 않는 결제 방법입니다');
  }
  if (!['toss', 'kakao', 'naver'].includes(data.provider)) {
    data.provider = 'toss'; // 기본값 설정
  }
  if (!['premium', 'school', 'enterprise'].includes(data.plan)) {
    data.plan = 'premium'; // 기본값 설정
  }
  
  return { isValid: errors.length === 0, errors, validatedData: data };
}

/**
 * 결제 요청 생성 API
 * 
 * 클라이언트에서 결제 요청 시 호출되며, PG사 결제창으로 리다이렉트할 URL과 주문번호를 반환합니다.
 * 실제 결제 승인은 /payments/confirm 엔드포인트에서 처리됩니다.
 */
serve(async (req) => {
  // CORS 헤더 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Supabase 클라이언트 초기화
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
    const body = await req.json();
    const { isValid, errors, validatedData } = validatePaymentData(body);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'VALIDATION_ERROR', message: '입력 데이터가 올바르지 않습니다.', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 주문번호 생성 (UUID + 타임스탬프)
    const orderId = `IEPON-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;
    
    // 결제 레코드 생성 (pending 상태)
    const { data: paymentRecord, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: validatedData.user_id,
        order_id: orderId,
        provider: validatedData.provider,
        method: validatedData.payment_method,
        amount: validatedData.amount,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ success: false, error: 'DATABASE_ERROR', message: '결제 정보 저장에 실패했습니다.', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Provider Adapter를 통한 결제 요청 URL 생성
      const paymentRequestResult = await createPaymentRequest({
        provider: validatedData.provider,
        orderId: orderId,
        amount: validatedData.amount,
        paymentMethod: validatedData.payment_method,
        successUrl: validatedData.success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success`,
        failUrl: validatedData.fail_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payments/fail`,
        userInfo: {
          userId: validatedData.user_id
        }
      });

      // 결제 요청 정보 업데이트
      await supabase
        .from('payments')
        .update({
          raw_payload: paymentRequestResult.rawPayload
        })
        .eq('id', paymentRecord.id);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            payment_id: paymentRecord.id,
            order_id: orderId,
            redirect_url: paymentRequestResult.redirectUrl,
            provider: validatedData.provider
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (paymentError) {
      // 결제 처리 중 오류 발생 시 상태 업데이트
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          failure_reason: paymentError instanceof Error ? paymentError.message : '결제 요청 중 오류 발생'
        })
        .eq('id', paymentRecord.id);

      return new Response(
        JSON.stringify({ success: false, error: 'PAYMENT_ERROR', message: '결제 요청 중 오류가 발생했습니다.', details: paymentError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'INTERNAL_ERROR', message: '서버 내부 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```
```

### 7.10.2 환불 처리
```javascript
// supabase/functions/process-refund/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// 환불 요청 데이터 검증 함수
function validateRefundData(data) {
  const errors = [];
  
  if (!data.payment_id || typeof data.payment_id !== 'string') {
    errors.push('결제 ID는 필수입니다');
  }
  if (data.refund_amount !== undefined && (typeof data.refund_amount !== 'number' || data.refund_amount <= 0)) {
    errors.push('환불 금액은 0보다 큰 숫자여야 합니다');
  }
  if (!data.refund_reason || typeof data.refund_reason !== 'string' || data.refund_reason.length < 2 || data.refund_reason.length > 100) {
    errors.push('환불 사유는 2-100자 사이여야 합니다');
  }
  
  return { isValid: errors.length === 0, errors, validatedData: data };
}

/**
 * 환불 처리 API
 * 
 * 관리자 권한 필요. 환불 시 payments 테이블 상태 변경 및 subscriptions 비활성화
 */
serve(async (req) => {
  // CORS 헤더 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Supabase 클라이언트 초기화
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
  try {
    const body = await req.json();
    const { isValid, errors, validatedData } = validateRefundData(body);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'VALIDATION_ERROR', message: '입력 데이터가 올바르지 않습니다.', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 결제 정보 조회
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', validatedData.payment_id)
      .eq('status', 'done') // 완료된 결제만 환불 가능
      .single();

    if (fetchError || !payment) {
      return new Response(
        JSON.stringify({ success: false, error: 'PAYMENT_NOT_FOUND', message: '환불 가능한 결제 정보를 찾을 수 없습니다.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 관련 구독 정보 조회
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('payment_id', validatedData.payment_id)
      .eq('status', 'active')
      .single();

    // 트랜잭션 시작
    const { error: txnError } = await supabase.rpc('begin_transaction');
    if (txnError) {
      return new Response(
        JSON.stringify({ success: false, error: 'TRANSACTION_ERROR', message: '환불 처리를 시작할 수 없습니다.', details: txnError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Provider Adapter를 통한 환불 요청
      const refundResult = await processRefund({
        provider: payment.provider,
        orderId: payment.order_id,
        amount: validatedData.refund_amount || payment.amount, // 전체 환불 또는 부분 환불
        reason: validatedData.refund_reason
      });

      if (refundResult.success) {
        // 환불 정보 업데이트
        await supabase
          .from('payments')
          .update({
            status: 'refunded',
            refund_amount: validatedData.refund_amount || payment.amount,
            refund_reason: validatedData.refund_reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', validatedData.payment_id);

        // 구독 비활성화
        if (subscription) {
          await supabase
            .from('subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString() 
            })
            .eq('payment_id', validatedData.payment_id);
        }
        
        // 트랜잭션 완료
        await supabase.rpc('commit_transaction');

        return new Response(
          JSON.stringify({
            success: true,
            data: { 
              refund_success: true,
              refund_amount: validatedData.refund_amount || payment.amount,
              order_id: payment.order_id
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // 환불 실패 시 트랜잭션 롤백
        await supabase.rpc('rollback_transaction');
        
        return new Response(
          JSON.stringify({ success: false, error: 'REFUND_FAILED', message: '환불 처리가 실패했습니다.', details: refundResult.error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      // 오류 발생 시 트랜잭션 롤백
      await supabase.rpc('rollback_transaction');
      
      throw error;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'REFUND_ERROR', message: '환불 처리 중 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```
```

### 7.10.3 결제 내역 조회
```javascript
// supabase/functions/get-payments/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // CORS 헤더 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Supabase 클라이언트 초기화
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // 권한 검사 - 관리자가 아니면 자신의 결제만 조회 가능
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user?.id)
      .single();
      
    const isAdmin = userProfile?.role === 'admin';
    
    if (!isAdmin && userId !== user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'FORBIDDEN', message: '다른 사용자의 결제 내역을 조회할 권한이 없습니다.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 쿼리 구성
    let query = supabase
      .from('payments')
      .select(`
        *,
        subscriptions(id, status, plan, started_at, expired_at)
      `, { count: 'exact' });

    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // 페이지네이션
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end).order('created_at', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'PAYMENTS_FETCH_ERROR', message: '결제 내역 조회 실패', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payments: data || [],
          total: count || 0,
          page,
          limit,
          has_more: count ? start + data.length < count : false
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'PAYMENTS_FETCH_ERROR', message: '결제 내역 조회 실패', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

// GET /api/payments/[id]
const getPayment = async (paymentId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        licenses(license_type, status, start_date, end_date)
      `)
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('결제 정보를 찾을 수 없습니다');

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('PAYMENT_NOT_FOUND', '결제 정보를 찾을 수 없습니다', error);
  }
};

// supabase/functions/get-payment-detail/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

/**
 * 단일 결제 조회 API
 */
serve(async (req) => {
  // CORS 헤더 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Supabase 클라이언트 초기화
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
  try {
    const url = new URL(req.url);
    const paymentId = url.pathname.split('/').pop(); // URL에서 마지막 세그먼트(ID) 추출
    
    if (!paymentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PAYMENT_ID', message: '결제 ID가 제공되지 않았습니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 권한 검사 - 관리자가 아니면 자신의 결제만 조회 가능
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user?.id)
      .single();
      
    const isAdmin = userProfile?.role === 'admin';
    
    // 결제 조회
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscriptions(id, status, plan, started_at, expired_at)
      `)
      .eq('id', paymentId)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, error: 'PAYMENT_NOT_FOUND', message: '결제 정보를 찾을 수 없습니다', details: error }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 권한 검사
    if (!isAdmin && data.user_id !== user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'FORBIDDEN', message: '다른 사용자의 결제 정보를 조회할 권한이 없습니다.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'PAYMENT_FETCH_ERROR', message: '결제 정보 조회 중 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

// supabase/functions/update-payment-status/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// 결제 상태 업데이트 데이터 검증 함수
function validateStatusUpdateData(data) {
  const errors = [];
  
  if (!data.status || !['pending', 'done', 'failed', 'refunded'].includes(data.status)) {
    errors.push('유효한 결제 상태가 필요합니다: pending, done, failed, refunded');
  }
  // metadata는 선택사항이므로 별도 검증 없음
  
  return { isValid: errors.length === 0, errors, validatedData: data };
}

/**
 * 결제 상태 업데이트 API
 * 
 * 관리자 권한 필요. 결제 상태 변경 및 구독 상태 연동 처리
 */
serve(async (req) => {
  // CORS 헤더 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Supabase 클라이언트 초기화
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
  try {
    const url = new URL(req.url);
    const paymentId = url.pathname.split('/').pop()?.split('?')[0]; // URL에서 마지막 세그먼트(ID) 추출
    
    if (!paymentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PAYMENT_ID', message: '결제 ID가 제공되지 않았습니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const body = await req.json();
    const { isValid, errors, validatedData } = validateStatusUpdateData(body);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'VALIDATION_ERROR', message: '입력 데이터가 올바르지 않습니다.', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 권한 검사 - 관리자만 가능
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user?.id)
      .single();
      
    if (userProfile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'FORBIDDEN', message: '결제 상태를 변경할 권한이 없습니다.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 트랜잭션 시작
    const { error: txnError } = await supabase.rpc('begin_transaction');
    if (txnError) {
      return new Response(
        JSON.stringify({ success: false, error: 'TRANSACTION_ERROR', message: '결제 상태 변경을 시작할 수 없습니다.', details: txnError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
      // 결제 상태 업데이트
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: validatedData.status,
          ...(validatedData.metadata || {}),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        await supabase.rpc('rollback_transaction');
        return Response.json(
          createErrorResponse('DATABASE_ERROR', '결제 상태 업데이트 실패', error),
          { status: 500 }
        );
      }

      // 구독 정보 조회
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      // 결제 완료 시 구독 활성화
      if (validatedData.status === 'done') {
        if (subscription) {
          // 기존 구독 업데이트
          await supabase
            .from('subscriptions')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString() 
            })
            .eq('id', subscription.id);
        } else {
          // 새 구독 생성
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1); // 기본 1개월
          
          await supabase.from('subscriptions').insert({
            user_id: data.user_id,
            payment_id: paymentId,
            plan: 'premium',
            status: 'active',
            started_at: new Date().toISOString(),
            expired_at: expiryDate.toISOString(),
            amount: data.amount
          });
        }
      }

      // 결제 실패/환불 시 구독 비활성화
      if ((validatedData.status === 'failed' || validatedData.status === 'refunded') && subscription) {
        await supabase
          .from('subscriptions')
          .update({ 
            status: validatedData.status === 'failed' ? 'error' : 'cancelled',
            updated_at: new Date().toISOString() 
          })
          .eq('id', subscription.id);
      }
      
      // 트랜잭션 완료
      await supabase.rpc('commit_transaction');

      return Response.json(createSuccessResponse(data));
    } catch (error) {
      // 오류 발생 시 트랜잭션 롤백
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        createErrorResponse('VALIDATION_ERROR', '입력 데이터가 올바르지 않습니다.', error.errors),
        { status: 400 }
      );
    }
    
    return Response.json(
      createErrorResponse('STATUS_UPDATE_ERROR', '결제 상태 업데이트 중 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}

// supabase/functions/payments-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature'
};

/**
 * 결제 웹훅 처리 API
 * 
 * PG사에서 결제 상태 변경 시 호출되는 웹훅 엔드포인트입니다.
 * 서명 검증 후 결제 상태를 업데이트하고 필요한 후속 처리를 수행합니다.
 */
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const body = await req.json();
    const signature = req.headers.get('x-webhook-signature');
    
    // 웹훅 서명 검증
    if (!verifyWebhookSignature(body, signature)) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_SIGNATURE', message: '유효하지 않은 서명입니다.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 결제 정보 조회
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', body.orderId)
      .single();
      
    if (error || !payment) {
      return Response.json(
        createErrorResponse('PAYMENT_NOT_FOUND', '결제 정보를 찾을 수 없습니다.'),
        { status: 404 }
      );
    }

    // 트랜잭션 시작
    const { error: txnError } = await supabase.rpc('begin_transaction');
    if (txnError) {
      return Response.json(
        createErrorResponse('TRANSACTION_ERROR', '웹훅 처리를 시작할 수 없습니다.', txnError),
        { status: 500 }
      );
    }

    try {
      // 결제 상태 업데이트
      if (body.status === 'DONE') {
        await supabase
          .from('payments')
          .update({
            status: 'done',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            raw_response: body
          })
          .eq('id', payment.id);
          
        // 구독 생성
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (payment.period_months || 1));
        
        await supabase.from('subscriptions').insert({
          user_id: payment.user_id,
          payment_id: payment.id,
          plan: payment.plan,
          status: 'active',
          started_at: new Date().toISOString(),
          expired_at: expiryDate.toISOString(),
          amount: payment.amount
        });
      } else if (body.status === 'CANCELED' || body.status === 'FAILED') {
        await supabase
          .from('payments')
          .update({
            status: body.status === 'CANCELED' ? 'cancelled' : 'failed',
            failure_reason: body.message || '결제 실패',
            updated_at: new Date().toISOString(),
            raw_response: body
          })
          .eq('id', payment.id);

        // 기존 구독이 있다면 비활성화
        await supabase
          .from('subscriptions')
          .update({ status: 'inactive' })
          .eq('payment_id', payment.id);
      }

      // 트랜잭션 완료
      await supabase.rpc('commit_transaction');
      
      return Response.json(createSuccessResponse({ success: true }));
    } catch (error) {
      // 오류 발생 시 트랜잭션 롤백
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    return Response.json(
      createErrorResponse('WEBHOOK_PROCESSING_ERROR', '웹훅 처리 중 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.10.4 결제 확인 (Payment Confirmation)
```typescript
// supabase/functions/payments-confirm/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// 데이터 검증 함수
function validateConfirmData(data) {
  const errors = [];
  
  if (!data.payment_key || typeof data.payment_key !== 'string') {
    errors.push('결제 키가 필요합니다.');
  }
  
  if (!data.order_id || typeof data.order_id !== 'string') {
    errors.push('주문 ID가 필요합니다.');
  }
  
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push('유효한 결제 금액이 필요합니다.');
  }
  
  const validProviders = ['toss', 'kakao', 'naver'];
  if (data.provider && !validProviders.includes(data.provider)) {
    errors.push('유효한 결제 서비스를 선택해주세요.');
  }
  
  return errors;
}

/**
 * 결제 확인 API
 * 
 * PG사 결제 성공 후 리다이렉트되는 페이지에서 호출되며, 결제 승인을 요청합니다.
 * 결제 승인이 완료되면 구독 정보를 생성하고 결제 상태를 업데이트합니다.
 */
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const body = await req.json();
    const validationErrors = validateConfirmData(body);
    
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'VALIDATION_ERROR', 
          message: '입력 데이터가 올바르지 않습니다.', 
          details: validationErrors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const validatedData = {
      provider: body.provider || 'toss',
      payment_key: body.payment_key,
      order_id: body.order_id,
      amount: body.amount
    };

    // 결제 정보 조회
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', validatedData.order_id)
      .eq('status', 'pending')
      .single();

    if (fetchError || !payment) {
      return Response.json(
        createErrorResponse('PAYMENT_NOT_FOUND', '결제 정보를 찾을 수 없거나 이미 처리된 결제입니다.'),
        { status: 404 }
      );
    }

    // 결제 금액 검증
    if (payment.amount !== validatedData.amount) {
      return Response.json(
        createErrorResponse('AMOUNT_MISMATCH', '결제 금액이 일치하지 않습니다.'),
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    const { error: txnError } = await supabase.rpc('begin_transaction');
    if (txnError) {
      return Response.json(
        createErrorResponse('TRANSACTION_ERROR', '결제 확인을 시작할 수 없습니다.', txnError),
        { status: 500 }
      );
    }

    try {
      // Provider Adapter를 통한 결제 확인
      const confirmResult = await confirmPayment({
        provider: validatedData.provider,
        paymentKey: validatedData.payment_key,
        orderId: validatedData.order_id,
        amount: validatedData.amount
      });

      if (confirmResult.success) {
        // 결제 정보 업데이트
        await supabase
          .from('payments')
          .update({
            status: 'done',
            provider_payment_id: validatedData.payment_key,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            raw_response: confirmResult.rawResponse
          })
          .eq('id', payment.id);

        // 구독 생성
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + payment.period_months || 1);

        await supabase.from('subscriptions').insert({
          user_id: payment.user_id,
          payment_id: payment.id,
          plan: payment.plan,
          status: 'active',
          started_at: new Date().toISOString(),
          expired_at: expiryDate.toISOString(),
          amount: payment.amount
        });

        // 트랜잭션 완료
        await supabase.rpc('commit_transaction');

        return Response.json(createSuccessResponse({
          payment_id: payment.id,
          status: 'done',
          subscription_active: true
        }));
      } else {
        // 결제 확인 실패 시 상태 업데이트
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            failure_reason: confirmResult.errorMessage || '결제 승인 실패',
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id);

        // 트랜잭션 완료
        await supabase.rpc('commit_transaction');

        return Response.json(
          createErrorResponse('PAYMENT_CONFIRMATION_FAILED', '결제 승인에 실패했습니다.', {
            message: confirmResult.errorMessage,
            code: confirmResult.errorCode
          }),
          { status: 400 }
        );
      }
    } catch (error) {
      // 오류 발생 시 트랜잭션 롤백
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        createErrorResponse('VALIDATION_ERROR', '입력 데이터가 올바르지 않습니다.', error.errors),
        { status: 400 }
      );
    }

    return Response.json(
      createErrorResponse('PAYMENT_CONFIRMATION_ERROR', '결제 확인 중 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}

### 7.10.5 결제 검증 및 보안
```typescript
// 결제 검증 함수
const verifyPayment = async (paymentId, userId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('user_id, status')
      .eq('id', paymentId)
      .single();

    if (error || !data) return false;
    
    return data.user_id === userId && data.status === 'done';
  } catch {
    return false;
  }
};

// 중복 결제 방지
const checkDuplicatePayment = async (userId, amount) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', userId)
      .eq('amount', amount)
      .gte('created_at', fiveMinutesAgo)
      .limit(1);

    return (data?.length || 0) > 0;
  } catch {
    return false;
  }
};

// 웹훅 서명 검증
const verifyWebhookSignature = (payload: any, signature: string | null): boolean => {
  if (!signature) return false;
  
  const crypto = require('crypto');
  const secret = process.env.WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

---

## 7.11 파일 업로드/다운로드 API

### 7.11.1 파일 업로드
```typescript
// supabase/functions/files-upload/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'];

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('user_id');
    const linkTable = formData.get('link_table');
    const linkId = formData.get('link_id');

    if (!file || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'MISSING_REQUIRED_FIELDS', message: '파일과 사용자 ID는 필수입니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: 'FILE_TOO_LARGE', message: '파일 크기가 너무 큽니다. (10MB 이하)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_FILE_TYPE', message: '허용되지 않는 파일 형식입니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = `uploads/${userId}/${fileName}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return Response.json(
        createErrorResponse('UPLOAD_ERROR', '파일 업로드에 실패했습니다.', uploadError),
        { status: 500 }
      );
    }

    // 파일 정보 DB에 저장
    const { data: fileRecord, error: dbError } = await supabase
      .from('file_uploads')
      .insert({
        user_id: userId,
        filename: file.name,
        storage_path: storagePath,
        file_type: file.type,
        file_size: file.size,
        mime_type: file.type,
        link_table: linkTable,
        link_id: linkId
      })
      .select()
      .single();

    if (dbError) {
      // DB 저장 실패 시 업로드된 파일 삭제
      await supabase.storage.from('files').remove([storagePath]);
      
      return new Response(
        JSON.stringify({ success: false, error: 'DATABASE_ERROR', message: '파일 정보 저장에 실패했습니다.', details: dbError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: fileRecord }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'INTERNAL_ERROR', message: '서버 내부 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
```

### 7.11.2 파일 다운로드
```typescript
// supabase/functions/files-download/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PARAMS', message: '파일 ID가 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // 파일 정보 조회
    const { data: fileInfo, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !fileInfo) {
      return Response.json(
        createErrorResponse('FILE_NOT_FOUND', '파일을 찾을 수 없습니다.'),
        { status: 404 }
      );
    }

    // 다운로드 권한 확인 (RLS 정책으로 처리)
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('files')
      .createSignedUrl(fileInfo.storage_path, 3600); // 1시간 유효

    if (urlError) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL_GENERATION_ERROR', message: '다운로드 URL 생성에 실패했습니다.', details: urlError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 다운로드 횟수 증가
    await supabase
      .from('file_uploads')
      .update({ download_count: fileInfo.download_count + 1 })
      .eq('id', id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          download_url: signedUrl.signedUrl,
          filename: fileInfo.filename,
          file_size: fileInfo.file_size
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'INTERNAL_ERROR', message: '서버 내부 오류가 발생했습니다.', details: error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 7.12 상담 기록 관리 API

### 7.12.1 상담 기록 생성
```typescript
// supabase/functions/counseling-create/index.ts
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const {
      student_id,
      user_id,
      counseling_date,
      counseling_type,
      participants,
      main_topic,
      discussion_content,
      agreements,
      follow_up_actions,
      next_meeting_date,
      attachments
    } = await req.json();

    const { data, error } = await supabase
      .from('counseling_records')
      .insert({
        student_id,
        user_id,
        counseling_date,
        counseling_type,
        participants,
        main_topic,
        discussion_content,
        agreements,
        follow_up_actions,
        next_meeting_date,
        attachments,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'DATABASE_ERROR', message: '상담 기록 저장에 실패했습니다.', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.12.2 상담 기록 조회
```typescript
// supabase/functions/counseling-get/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const url = new URL(req.url);
    const studentId = url.pathname.split('/').pop();
    
    if (!studentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PARAMS', message: '학생 ID가 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { searchParams } = url;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('counseling_records')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .order('counseling_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'DATABASE_ERROR', message: '상담 기록 조회에 실패했습니다.', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        meta: {
          total: count || 0,
          page,
          limit
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

---

## 7.13 교육과정 관리 API

### 7.13.1 교육과정 업로드 (일괄)
```typescript
// supabase/functions/curriculum-upload/index.ts
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const uploadData = await req.json();
    
    // 데이터 검증
    if (!uploadData.subject || !uploadData.grade || !uploadData.semester || !uploadData.units) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_DATA', message: '필수 데이터가 누락되었습니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 기존 데이터 확인 및 중복 방지
    const { data: existingUnits } = await supabase
      .from('curriculum_units')
      .select('unit_number')
      .eq('subject', uploadData.subject)
      .eq('grade', uploadData.grade)
      .eq('semester', uploadData.semester);

    const existingUnitNumbers = existingUnits?.map(unit => unit.unit_number) || [];
    
    // 새로운 단원만 필터링
    const newUnits = uploadData.units.filter(
      unit => !existingUnitNumbers.includes(unit.unit_number)
    );

    if (newUnits.length === 0) {
      return Response.json(
        createErrorResponse('NO_NEW_UNITS', '새로 추가할 단원이 없습니다.'),
        { status: 400 }
      );
    }

    // 데이터베이스에 삽입
    const insertData = newUnits.map(unit => ({
      subject: uploadData.subject,
      grade: uploadData.grade,
      semester: uploadData.semester,
      unit_number: unit.unit_number,
      unit_title: unit.unit_title,
      achievement_standards: unit.achievement_standards,
      educational_content: unit.educational_content,
      evaluation_plan: unit.evaluation_plan,
      upload_source: 'manual',
      is_active: true,
      status: 'active'
    }));

    const { data, error } = await supabase
      .from('curriculum_units')
      .insert(insertData)
      .select();

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '교육과정 업로드에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(
      createSuccessResponse(data, { 
        uploaded_count: data.length,
        skipped_count: uploadData.units.length - data.length 
      }),
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.13.2 교육과정 조회
```typescript
// supabase/functions/curriculum-units/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const semester = searchParams.get('semester');
    const unitNumber = searchParams.get('unit_number');
    
    let query = supabase
      .from('curriculum_units')
      .select('*')
      .eq('is_active', true)
      .order('unit_number', { ascending: true });

    // 필터 적용
    if (subject) query = query.eq('subject', subject);
    if (grade) query = query.eq('grade', parseInt(grade));
    if (semester) query = query.eq('semester', parseInt(semester));
    if (unitNumber) query = query.eq('unit_number', parseInt(unitNumber));

    const { data, error } = await query;

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '교육과정 조회에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(
      createSuccessResponse(data, {
        total: data.length,
        filters: { subject, grade, semester, unit_number: unitNumber }
      })
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.13.3 교육과정 Excel 업로드
```typescript
// supabase/functions/curriculum-upload-excel/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;
    const grade = parseInt(formData.get('grade') as string);
    const semester = parseInt(formData.get('semester') as string);
    
    if (!file || !subject || !grade || !semester) {
      return Response.json(
        createErrorResponse('MISSING_DATA', '필수 데이터가 누락되었습니다.'),
        { status: 400 }
      );
    }

    // Excel 파일 읽기
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // 데이터 변환 및 검증 (단순화된 구조)
    const units = jsonData.map((row: any) => ({
      unit_number: parseInt(row['단원번호']),
      unit_title: row['단원명'],
      achievement_standards: row['단원 교육목표(성취기준)'] || '',
      educational_content: row['단원 교육내용'] || '',
      evaluation_plan: row['평가계획(참고용)'] || ''
    }));
    
    // 데이터 유효성 검증
    const validUnits = units.filter(unit => 
      unit.unit_number && 
      unit.unit_title && 
      unit.achievement_standards
    );

    // 데이터베이스에 삽입
    const insertData = validUnits.map(unit => ({
      subject,
      grade,
      semester,
      ...unit,
      upload_source: 'excel',
      is_active: true,
      status: 'active'
    }));
    
    if (insertData.length === 0) {
      return Response.json(
        createErrorResponse('NO_VALID_DATA', '유효한 데이터가 없습니다.'),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('curriculum_units')
      .upsert(insertData, { 
        onConflict: 'subject,grade,semester,unit_number',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', 'Excel 업로드에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(
      createSuccessResponse(data, { 
        uploaded_count: data.length,
        source: 'excel'
      }),
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.13.4 교육과정 단원 수정
```typescript
// supabase/functions/curriculum-unit-update/index.ts
serve(async (req) => {
  if (req.method !== 'PUT') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'INVALID_PARAMS', message: '단원 ID가 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const updateData = await req.json();
    
    const { data, error } = await supabase
      .from('curriculum_units')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '교육과정 수정에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(createSuccessResponse(data));
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

---

## 7.14 퀴링크/외부 툴 관리 API

### 7.13.1 퀴링크 조회
```typescript
// supabase/functions/tool-links/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return Response.json(
        createErrorResponse('MISSING_USER_ID', '사용자 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tool_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '퀴링크 조회에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(createSuccessResponse(data));
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
      .insert({
        user_id: user.id,
        amount: validatedData.amount,
        payment_method: validatedData.payment_method,
        status: 'pending',
        plan: validatedData.plan,
        period_months: validatedData.period_months,
        provider: 'toss',  // 현재 기본 결제 제공자
        metadata: validatedData.metadata || {}
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '결제 정보 생성 실패', error),
        { status: 500 }
      );
    }

    // 결제 제공자 연동
    const paymentProvider: PaymentProvider = new TossPaymentsProvider();
---

## 7.14 라이선스 관리 API

### 7.14.1 라이선스 상태 확인
```typescript
// supabase/functions/license-status/index.ts
serve(async (req) => {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'MISSING_USER_ID', message: '사용자 ID가 필요합니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 활성 라이선스 조회
    const { data: activeLicense, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows returned
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '라이선스 조회에 실패했습니다.', error),
        { status: 500 }
      );
    }

    const hasActiveLicense = !!activeLicense;
    const daysRemaining = activeLicense 
      ? Math.ceil((new Date(activeLicense.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return Response.json(
      createSuccessResponse({
        has_active_license: hasActiveLicense,
        license: activeLicense,
        days_remaining: daysRemaining,
        expires_soon: daysRemaining <= 7 && daysRemaining > 0
      })
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

### 7.14.2 라이선스 갱신
```typescript
// supabase/functions/license-renew/index.ts
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED', message: '지원되지 않는 메소드입니다.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const { user_id, license_type, payment_id } = await req.json();

    // 기존 라이선스 조회
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    // 새 라이선스 시작일 계산
    const startDate = existingLicense && new Date(existingLicense.end_date) > new Date()
      ? new Date(existingLicense.end_date)
      : new Date();

    const endDate = new Date(startDate);
    if (license_type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (license_type === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 새 라이선스 생성
    const { data: newLicense, error } = await supabase
      .from('licenses')
      .insert({
        user_id,
        license_type,
        payment_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        auto_renewal: false
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        createErrorResponse('DATABASE_ERROR', '라이선스 갱신에 실패했습니다.', error),
        { status: 500 }
      );
    }

    return Response.json(
      createSuccessResponse(newLicense),
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      createErrorResponse('INTERNAL_ERROR', '서버 내부 오류가 발생했습니다.', error),
      { status: 500 }
    );
  }
}
```

---

## 7.15 실시간 알림 시스템 (Alpine.js + HTMX)

### 7.15.1 Alpine.js 실시간 알림 스토어
```javascript
// 실시간 알림 관리 (Alpine.js 스토어)
Alpine.store('notifications', {
  // 알림 데이터 구조
  list: [],
  unreadCount: 0,
  subscription: null,
  isPermissionGranted: false,
  
  // 알림 상태 및 필터
  filters: {
    type: 'all',      // 'all', 'info', 'warning', 'error', 'success'
    read: 'all',      // 'all', 'read', 'unread'
    priority: 'all'   // 'all', 'low', 'medium', 'high'
  },
  
  // 알림 유틀리티
  async init() {
    // 브라우저 알림 권한 요청
    await this.requestNotificationPermission();
    
    // 초기 알림 로드
    await this.loadNotifications();
    
    // 실시간 구독 시작
    this.setupRealtimeSubscription();
  },
  
  // 브라우저 알림 권한 요청
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.isPermissionGranted = permission === 'granted';
      
      if (this.isPermissionGranted) {
        console.log('🔔 브라우저 알림 권한이 허용되었습니다.');
      }
    }
  },
  
  // 초기 알림 로드
  async loadNotifications() {
    try {
      const user = await window.supabase.auth.getUser();
      if (!user.data.user) return;
      
      const { data, error } = await window.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      this.list = data || [];
      this.updateUnreadCount();
      
    } catch (error) {
      console.error('알림 로드 실패:', error);
      
      // UI 스토어에 에러 알림 추가
      if (Alpine.store('ui')) {
        Alpine.store('ui').addNotification({
          message: '알림을 불러오는 데 실패했습니다.',
          type: 'error'
        });
      }
    }
  },
  
  // 실시간 구독 설정
  setupRealtimeSubscription() {
    if (this.subscription) {
      window.supabase.removeChannel(this.subscription);
    }
    
    const user = window.supabase.auth.getUser();
    if (!user) return;
    
    this.subscription = window.supabase
      .channel(`notifications_${user.id || 'anonymous'}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        this.handleNewNotification(payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        this.handleNotificationUpdate(payload.new);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('🔄 실시간 알림 구독 시작되었습니다.');
        }
      });
  },
  
  // 새 알림 처리
  handleNewNotification(notification) {
    // UTF-8 안전성 검증
    if (!this.validateUTF8(notification.message) || !this.validateUTF8(notification.title)) {
      console.error('알림 UTF-8 인코딩 오류:', notification);
      return;
    }
    
    // 알림 리스트에 추가 (맨 앞에 삽입)
    this.list.unshift(notification);
    
    // 알림 수 업데이트
    this.updateUnreadCount();
    
    // 브라우저 알림 표시
    this.showBrowserNotification(notification);
    
    // HTMX로 UI 업데이트 트리거
    document.body.dispatchEvent(new CustomEvent('notification:new', {
      detail: notification
    }));
    
    // 알림 사운드 재생
    this.playNotificationSound();
  },
  
  // 알림 업데이트 처리
  handleNotificationUpdate(updatedNotification) {
    const index = this.list.findIndex(n => n.id === updatedNotification.id);
    if (index > -1) {
      this.list[index] = updatedNotification;
      this.updateUnreadCount();
    }
  },
  
  // 브라우저 알림 표시
  showBrowserNotification(notification) {
    if (!this.isPermissionGranted) return;
    
    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: `iepon-${notification.id}`,
        requireInteraction: notification.type === 'error',
        silent: notification.type === 'info'
      });
      
      // 5초 후 자동 닫기
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
      
    } catch (error) {
      console.error('브라우저 알림 표시 실패:', error);
    }
  },
  
  // 알림 사운드 재생
  playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => {
        console.log('사운드 재생 실패 (사용자 상호작용 필요):', e);
      });
    } catch (error) {
      console.error('알림 사운드 재생 실패:', error);
    }
  },
  
  // 읽지 않은 알림 수 업데이트
  updateUnreadCount() {
    this.unreadCount = this.list.filter(n => !n.is_read).length;
  },
  
  // UTF-8 검증
  validateUTF8(text) {
    if (typeof text !== 'string') return true;
    
    try {
      const encoded = new TextEncoder().encode(text);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      return decoded === text;
    } catch (error) {
      return false;
    }
  },
  
  // 알림 읽음 처리
  async markAsRead(notificationId) {
    try {
      const { error } = await window.supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // 로컬 상태 업데이트
      const notification = this.list.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
        this.updateUnreadCount();
      }
      
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  },
  
  // 모든 알림 읽음 처리
  async markAllAsRead() {
    try {
      const user = await window.supabase.auth.getUser();
      if (!user.data.user) return;
      
      const { error } = await window.supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.data.user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // 로컬 상태 업데이트
      this.list.forEach(notification => {
        if (!notification.is_read) {
          notification.is_read = true;
          notification.read_at = new Date().toISOString();
        }
      });
      
      this.updateUnreadCount();
      
    } catch (error) {
      console.error('전체 알림 읽음 처리 실패:', error);
    }
  },
  
  // 알림 삭제
  async deleteNotification(notificationId) {
    try {
      const { error } = await window.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // 로컬 상태에서 제거
      this.list = this.list.filter(n => n.id !== notificationId);
      this.updateUnreadCount();
      
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  },
  
  // 필터링된 알림 목록 반환
  get filteredNotifications() {
    return this.list.filter(notification => {
      // 타입 필터
      if (this.filters.type !== 'all' && notification.type !== this.filters.type) {
        return false;
      }
      
      // 읽음 상태 필터
      if (this.filters.read === 'read' && !notification.is_read) {
        return false;
      }
      if (this.filters.read === 'unread' && notification.is_read) {
        return false;
      }
      
      // 우선순위 필터
      if (this.filters.priority !== 'all' && notification.priority !== this.filters.priority) {
        return false;
      }
      
      return true;
    });
  },
  
  // 구독 종료
  cleanup() {
    if (this.subscription) {
      window.supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }
});
```

#### 알림 조회
```javascript
const getNotifications = async (
  userId,
  filters
) => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.isRead !== undefined) {
      query = query.eq('is_read', filters.isRead);
    }
    if (filters?.type) {
      query = query.eq('notification_type', filters.type);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query;

    if (error) throw error;

    return createSuccessResponse(data || []);
  } catch (error) {
    return createErrorResponse(
      'NOTIFICATIONS_FETCH_ERROR',
      '알림 조회 중 오류가 발생했습니다',
      error
    );
  }
};
```

#### 알림 읽음 처리
```javascript
const markNotificationAsRead = async (
  notificationId
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(
      'NOTIFICATION_UPDATE_ERROR',
      '알림 상태 업데이트 중 오류가 발생했습니다',
      error
    );
  }
};
```

---

## 7.9 관리자 시스템 API

### 7.9.1 관리자 프로필 관리 API

#### 관리자 프로필 조회
```javascript
// GET /api/admin/profiles
const getAdminProfiles = async (params?: {
  role?: 'teacher' | 'admin' | 'super_admin';
  status?: 'active' | 'inactive' | 'suspended';
  page?: number;
  limit?: number;
}) {
  profiles: UserProfile[];
  total: number;
}>> => {
  try {
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        auth.users!inner(email, created_at)
      `);

    if (params?.role) {
      query = query.eq('role', params.role);
    }
    if (params?.status) {
      query = query.eq('status', params.status);
    }

    const { data, error, count } = await query
      .range(
        ((params?.page || 1) - 1) * (params?.limit || 20),
        (params?.page || 1) * (params?.limit || 20) - 1
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return createSuccessResponse({
      profiles: data || [],
      total: count || 0
    });
  } catch (error) {
    return createErrorResponse('ADMIN_PROFILES_FETCH_ERROR', '관리자 프로필 조회 실패', error);
  }
};

// GET /api/admin/profiles/[id]
const getAdminProfile = async (id) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        auth.users!inner(email, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('프로필을 찾을 수 없습니다');

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('ADMIN_PROFILE_NOT_FOUND', '관리자 프로필을 찾을 수 없습니다', error);
  }
};
```

#### 관리자 프로필 생성/수정
```javascript
// POST /api/admin/profiles
const createAdminProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        ...profileData,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('ADMIN_PROFILE_CREATE_ERROR', '관리자 프로필 생성 실패', error);
  }
};

// PUT /api/admin/profiles/[id]
const updateAdminProfile = async (
  id,
  updateData
) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('ADMIN_PROFILE_UPDATE_ERROR', '관리자 프로필 수정 실패', error);
  }
};
```

### 7.9.2 관리자 로그인 로그 API

#### 로그인 로그 조회
```javascript
// GET /api/admin/login-logs
const getLoginLogs = async (params?: {
  user_id?: string;
  success?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}) {
  logs: AdminLoginLog[];
  total: number;
}>> => {
  try {
    let query = supabase
      .from('admin_login_logs')
      .select(`
        *,
        user_profiles!inner(display_name, role)
      `);

    if (params?.user_id) {
      query = query.eq('user_id', params.user_id);
    }
    if (params?.success !== undefined) {
      query = query.eq('success', params.success);
    }
    if (params?.start_date) {
      query = query.gte('login_time', params.start_date);
    }
    if (params?.end_date) {
      query = query.lte('login_time', params.end_date);
    }

    const { data, error, count } = await query
      .range(
        ((params?.page || 1) - 1) * (params?.limit || 50),
        (params?.page || 1) * (params?.limit || 50) - 1
      )
      .order('login_time', { ascending: false });

    if (error) throw error;

    return createSuccessResponse({
      logs: data || [],
      total: count || 0
    });
  } catch (error) {
    return createErrorResponse('LOGIN_LOGS_FETCH_ERROR', '로그인 로그 조회 실패', error);
  }
};

// POST /api/admin/login-logs
const logAdminLogin = async (logData: {
  user_id: string;
  ip_address: string;
  user_agent: string;
  login_method?: 'email' | 'oauth' | 'sso';
  success: boolean;
  failure_reason?: string;
}) { log_id: string }>> => {
  try {
    const { data, error } = await supabase.rpc('log_admin_login', {
      p_user_id: logData.user_id,
      p_ip_address: logData.ip_address,
      p_user_agent: logData.user_agent,
      p_login_method: logData.login_method || 'email',
      p_success: logData.success,
      p_failure_reason: logData.failure_reason
    });

    if (error) throw error;

    return createSuccessResponse({ log_id: data });
  } catch (error) {
    return createErrorResponse('LOGIN_LOG_CREATE_ERROR', '로그인 로그 기록 실패', error);
  }
};
```

### 7.9.3 시스템 통계 API

#### 대시보드 통계 데이터 구조
```javascript
// HTMX를 통한 대시보드 통계 로드
// HTML: hx-get="/api/admin/dashboard/stats" hx-target="#dashboard-stats"

// Edge Functions: dashboard-stats
const dashboardStatsResponse = {
  users: {
    total: 0,
    active: 0,
    new_this_month: 0
  },
  students: {
    total: 0,
    active: 0,
    new_this_month: 0
  },
  plans: {
    total: 0,
    this_month: 0,
    completed: 0
  },
  payments: {
    total_revenue: 0,
    this_month_revenue: 0,
    active_licenses: 0
  }
};

// Edge Function 구현
serve(async (req) => {
  try {
    const [usersStats, studentsStats, plansStats, paymentsStats] = await Promise.all([
      // 사용자 통계
      supabase.rpc('get_users_stats'),
      // 학생 통계
      supabase.rpc('get_students_stats'),
      // 계획 통계
      supabase.rpc('get_plans_stats'),
      // 결제 통계
      supabase.rpc('get_payments_stats')
    ]);

    // UTF-8 검증된 응답 반환
    return new Response(JSON.stringify({
      success: true,
      data: {
        users: usersStats.data || { total: 0, active: 0, new_this_month: 0 },
        students: studentsStats.data || { total: 0, active: 0, new_this_month: 0 },
        plans: plansStats.data || { total: 0, this_month: 0, completed: 0 },
        payments: paymentsStats.data || { total_revenue: 0, this_month_revenue: 0, active_licenses: 0 }
      }
    }), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'HX-Trigger': 'dashboard-stats-loaded'
      }
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '대시보드 통계를 불러올 수 없습니다.'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
});
```

#### Alpine.js 대시보드 통계 컴포넌트
```html
<!-- 대시보드 통계 섹션 -->
<div x-data="dashboardStats()" x-init="loadStats()" id="dashboard-stats">
  <div class="stats-grid">
    <!-- 사용자 통계 카드 -->
    <div class="stat-card">
      <h3>사용자 현황</h3>
      <div class="stat-numbers">
        <span class="total" x-text="stats.users.total">0</span>
        <span class="active">활성: <span x-text="stats.users.active">0</span></span>
        <span class="new">신규: <span x-text="stats.users.new_this_month">0</span></span>
      </div>
    </div>
    
    <!-- 학생 통계 카드 -->
    <div class="stat-card">
      <h3>학생 현황</h3>
      <div class="stat-numbers">
        <span class="total" x-text="stats.students.total">0</span>
        <span class="active">활성: <span x-text="stats.students.active">0</span></span>
        <span class="new">신규: <span x-text="stats.students.new_this_month">0</span></span>
      </div>
    </div>
    
    <!-- 교육계획 통계 카드 -->
    <div class="stat-card">
      <h3>교육계획 현황</h3>
      <div class="stat-numbers">
        <span class="total" x-text="stats.plans.total">0</span>
        <span class="monthly">이달: <span x-text="stats.plans.this_month">0</span></span>
        <span class="completed">완료: <span x-text="stats.plans.completed">0</span></span>
      </div>
    </div>
    
    <!-- 결제 통계 카드 -->
    <div class="stat-card">
      <h3>결제 현황</h3>
      <div class="stat-numbers">
        <span class="revenue">총 수익: ₩<span x-text="formatMoney(stats.payments.total_revenue)">0</span></span>
        <span class="monthly">이달: ₩<span x-text="formatMoney(stats.payments.this_month_revenue)">0</span></span>
        <span class="licenses">활성 라이선스: <span x-text="stats.payments.active_licenses">0</span></span>
      </div>
    </div>
  </div>
</div>

<script>
function dashboardStats() {
  return {
    stats: {
      users: { total: 0, active: 0, new_this_month: 0 },
      students: { total: 0, active: 0, new_this_month: 0 },
      plans: { total: 0, this_month: 0, completed: 0 },
      payments: { total_revenue: 0, this_month_revenue: 0, active_licenses: 0 }
    },
    loading: false,
    
    async loadStats() {
      this.loading = true;
      try {
        const response = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${Alpine.store('auth').token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('통계 데이터 로드 실패');
        }
        
        const result = await response.json();
        if (result.success) {
          this.stats = result.data;
          // Alpine.js UI 스토어에 통계 로드 완료 알림
          Alpine.store('ui').showNotification('대시보드 통계가 업데이트되었습니다.', 'success');
        }
      } catch (error) {
        console.error('통계 로드 오류:', error);
        Alpine.store('ui').showNotification('통계 데이터를 불러올 수 없습니다.', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    formatMoney(amount) {
      return new Intl.NumberFormat('ko-KR').format(amount || 0);
    }
  }
}
</script>
```

### 7.9.4 사용자 관리 API

#### HTMX 사용자 목록 조회
```html
<!-- HTMX 사용자 목록 테이블 -->
<div 
  hx-get="/api/admin/users" 
  hx-trigger="load, user-list-refresh from:body"
  hx-target="#user-list"
  hx-indicator="#users-loading"
  hx-vals='js:{search: document.getElementById("user-search").value, status: document.getElementById("status-filter").value}'
>
  <div id="users-loading" class="htmx-indicator">
    <div class="loading-spinner">사용자 목록을 불러오는 중...</div>
  </div>
  
  <div id="user-list">
    <!-- HTMX로 동적 로드될 사용자 목록 -->
  </div>
</div>
```

#### Edge Function: 사용자 목록 조회
```javascript
// Edge Functions: admin-users
serve(async (req) => {
  try {
    const url = new URL(req.url);
    const searchParams = {
      search: url.searchParams.get('search') || '',
      status: url.searchParams.get('status') || '',
      has_license: url.searchParams.get('has_license') === 'true',
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '20')
    };
    
    // UTF-8 안전성 검증
    if (!validateUTF8(searchParams.search)) {
      return new Response(JSON.stringify({
        success: false,
        error: '검색어에 잘못된 문자가 포함되어 있습니다.'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    let query = supabase
      .from('user_profiles')
      .select(`
        id, full_name, email, phone, role, status, created_at,
        auth.users!inner(email, created_at),
        licenses!left(status, expires_at)
      `);

    // 검색 필터 적용
    if (searchParams.search) {
      const searchTerm = `%${searchParams.search}%`;
      query = query.or(`full_name.ilike.${searchTerm},email.ilike.${searchTerm}`);
    }
    
    // 상태 필터 적용
    if (searchParams.status) {
      query = query.eq('status', searchParams.status);
    }
    
    // 라이선스 필터 적용
    if (searchParams.has_license) {
      query = query.not('licenses', 'is', null);
    }

    // 페이지네이션 및 정렬 적용
    const offset = (searchParams.page - 1) * searchParams.limit;
    const { data, error, count } = await query
      .range(offset, offset + searchParams.limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('사용자 목록 조회 오류:', error);
      throw error;
    }

    // HTMX 응답 반환 (HTML 테이블 형태)
    const userListHTML = generateUserListHTML(data || [], count || 0, searchParams);
    
    return new Response(userListHTML, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'user-list-loaded'
      }
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return new Response(`
      <div class="error-message">
        <p>사용자 목록을 불러올 수 없습니다.</p>
        <button onclick="htmx.trigger('#user-list', 'user-list-refresh')">다시 시도</button>
      </div>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

});

// 사용자 목록 HTML 생성 함수
function generateUserListHTML(users, total, searchParams) {
  let html = `
    <div class="user-list-container">
      <div class="user-list-header">
        <span class="total-count">총 ${total}명의 사용자</span>
        <div class="pagination-info">
          페이지 ${searchParams.page} / ${Math.ceil(total / searchParams.limit)}
        </div>
      </div>
      
      <table class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>역할</th>
            <th>상태</th>
            <th>라이선스</th>
            <th>가입일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  users.forEach(user => {
    const hasActiveLicense = user.licenses && user.licenses.length > 0 && 
                            user.licenses.some(l => l.status === 'active');
    const statusBadge = user.status === 'active' ? 'success' : 
                       user.status === 'inactive' ? 'warning' : 'danger';
                       
    html += `
      <tr>
        <td>${user.full_name || '-'}</td>
        <td>${user.email}</td>
        <td><span class="role-badge role-${user.role}">${user.role}</span></td>
        <td><span class="status-badge status-${statusBadge}">${user.status}</span></td>
        <td>${hasActiveLicense ? '<span class="license-active">활성</span>' : '<span class="license-inactive">비활성</span>'}</td>
        <td>${new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
        <td>
          <div class="action-buttons">
            <button 
              hx-put="/api/admin/users/${user.id}/status" 
              hx-vals='{"status": "${user.status === 'active' ? 'inactive' : 'active'}"}'  
              hx-target="closest tr"
              hx-confirm="사용자 상태를 변경하시겠습니까?"
              class="btn-sm btn-${user.status === 'active' ? 'warning' : 'success'}"
            >
              ${user.status === 'active' ? '비활성화' : '활성화'}
            </button>
            <button 
              hx-get="/api/admin/users/${user.id}/details" 
              hx-target="#user-details-modal .modal-content"
              hx-trigger="click"
              class="btn-sm btn-info"
              onclick="document.getElementById('user-details-modal').style.display = 'block'"
            >
              상세
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
      
      <!-- 페이지네이션 -->
      <div class="pagination">
        ${generatePaginationHTML(searchParams.page, Math.ceil(total / searchParams.limit))}
      </div>
    </div>
  `;
  
  return html;
}

// 페이지네이션 HTML 생성
function generatePaginationHTML(currentPage, totalPages) {
  let html = '<div class="pagination-buttons">';
  
  if (currentPage > 1) {
    html += `
      <button 
        hx-get="/api/admin/users" 
        hx-target="#user-list"
        hx-vals='js:{page: ${currentPage - 1}, search: document.getElementById("user-search").value}'
        class="btn btn-sm"
      >
        이전
      </button>
    `;
  }
  
  // 페이지 번호 버튼들
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button 
        hx-get="/api/admin/users" 
        hx-target="#user-list"
        hx-vals='js:{page: ${i}, search: document.getElementById("user-search").value}'
        class="btn btn-sm ${i === currentPage ? 'btn-primary' : ''}"
      >
        ${i}
      </button>
    `;
  }
  
  if (currentPage < totalPages) {
    html += `
      <button 
        hx-get="/api/admin/users" 
        hx-target="#user-list"
        hx-vals='js:{page: ${currentPage + 1}, search: document.getElementById("user-search").value}'
        class="btn btn-sm"
      >
        다음
      </button>
    `;
  }
  
  html += '</div>';
  return html;
}
```

#### HTMX 사용자 상태 업데이트
```javascript
// Edge Functions: admin-user-status
serve(async (req) => {
  if (req.method !== 'PUT') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const url = new URL(req.url);
    const userId = url.pathname.split('/')[4]; // /api/admin/users/[id]/status
    const { status } = await req.json();
    
    // 상태 값 검증
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return new Response(JSON.stringify({
        success: false,
        error: '잘못된 상태 값입니다.'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    
    // 사용자 상태 업데이트
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select(`
        id, full_name, email, phone, role, status, created_at,
        licenses!left(status, expires_at)
      `)
      .single();

    if (error) {
      console.error('사용자 상태 업데이트 오류:', error);
      throw error;
    }
    
    // 업데이트된 사용자 로우 HTML 반환
    const updatedRowHTML = generateUserRowHTML(data);
    
    return new Response(updatedRowHTML, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'HX-Trigger': 'user-status-updated'
      }
    });
  } catch (error) {
    console.error('사용자 상태 변경 오류:', error);
    return new Response(`
      <td colspan="7" class="error-cell">
        사용자 상태를 변경할 수 없습니다. 다시 시도해주세요.
      </td>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
});

// 사용자 로우 HTML 생성 함수
function generateUserRowHTML(user) {
  const hasActiveLicense = user.licenses && user.licenses.length > 0 && 
                          user.licenses.some(l => l.status === 'active');
  const statusBadge = user.status === 'active' ? 'success' : 
                     user.status === 'inactive' ? 'warning' : 'danger';
                     
  return `
    <td>${user.full_name || '-'}</td>
    <td>${user.email}</td>
    <td><span class="role-badge role-${user.role}">${user.role}</span></td>
    <td><span class="status-badge status-${statusBadge}">${user.status}</span></td>
    <td>${hasActiveLicense ? '<span class="license-active">활성</span>' : '<span class="license-inactive">비활성</span>'}</td>
    <td>${new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
    <td>
      <div class="action-buttons">
        <button 
          hx-put="/api/admin/users/${user.id}/status" 
          hx-vals='{"status": "${user.status === 'active' ? 'inactive' : 'active'}"}'  
          hx-target="closest tr"
          hx-confirm="사용자 상태를 변경하시겠습니까?"
          class="btn-sm btn-${user.status === 'active' ? 'warning' : 'success'}"
        >
          ${user.status === 'active' ? '비활성화' : '활성화'}
        </button>
        <button 
          hx-get="/api/admin/users/${user.id}/details" 
          hx-target="#user-details-modal .modal-content"
          hx-trigger="click"
          class="btn-sm btn-info"
          onclick="document.getElementById('user-details-modal').style.display = 'block'"
        >
          상세
        </button>
      </div>
    </td>
  `;
}
```

### 7.9.5 시스템 설정 API

#### HTMX 시스템 설정 폼
```html
<!-- 시스템 설정 폼 -->
<div x-data="systemSettings()" x-init="loadSettings()">
  <form 
    hx-put="/api/admin/settings" 
    hx-target="#settings-status"
    hx-indicator="#settings-loading"
    hx-trigger="submit"
    @submit.prevent="submitSettings($event)"
    class="system-settings-form"
  >
    <div class="settings-section">
      <h3>일반 설정</h3>
      
      <!-- 유지보수 모드 -->
      <div class="form-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            name="maintenance_mode" 
            x-model="settings.maintenance_mode"
            @change="settingsChanged = true"
          >
          <span class="toggle-slider"></span>
          유지보수 모드 활성화
        </label>
        <p class="help-text">유지보수 모드 중에는 관리자만 접속 가능합니다.</p>
      </div>
      
      <!-- 사용자 등록 허용 -->
      <div class="form-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            name="registration_enabled" 
            x-model="settings.registration_enabled"
            @change="settingsChanged = true"
          >
          <span class="toggle-slider"></span>
          새 사용자 등록 허용
        </label>
      </div>
      
      <!-- 사용자별 최대 학생 수 -->
      <div class="form-group">
        <label for="max_students">사용자별 최대 학생 수</label>
        <input 
          type="number" 
          id="max_students"
          name="max_students_per_user" 
          x-model="settings.max_students_per_user"
          @input="settingsChanged = true"
          min="1" 
          max="100"
          class="form-control"
        >
      </div>
      
      <!-- AI 생성 서비스 -->
      <div class="form-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            name="ai_generation_enabled" 
            x-model="settings.ai_generation_enabled"
            @change="settingsChanged = true"
          >
          <span class="toggle-slider"></span>
          AI 교육계획 생성 활성화
        </label>
      </div>
      
      <!-- 파일 업로드 최대 크기 -->
      <div class="form-group">
        <label for="file_upload_size">파일 업로드 최대 크기 (MB)</label>
        <input 
          type="number" 
          id="file_upload_size"
          name="file_upload_max_size_mb" 
          x-model="settings.file_upload_max_size_mb"
          @input="settingsChanged = true"
          min="1" 
          max="100"
          class="form-control"
        >
      </div>
      
      <!-- 세션 타임아웃 -->
      <div class="form-group">
        <label for="session_timeout">세션 타임아웃 (분)</label>
        <select 
          id="session_timeout"
          name="session_timeout_minutes"
          x-model="settings.session_timeout_minutes"
          @change="settingsChanged = true"
          class="form-control"
        >
          <option value="30">30분</option>
          <option value="60">1시간</option>
          <option value="120">2시간</option>
          <option value="240">4시간</option>
          <option value="480">8시간</option>
        </select>
      </div>
    </div>
    
    <!-- 저장 버튼 -->
    <div class="form-actions">
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="!settingsChanged || loading"
        x-text="loading ? '저장 중...' : '설정 저장'"
      >
        설정 저장
      </button>
      
      <button 
        type="button" 
        @click="resetSettings()"
        class="btn btn-secondary"
        :disabled="loading"
      >
        초기화
      </button>
    </div>
    
    <!-- 로딩 및 상태 메시지 -->
    <div id="settings-loading" class="htmx-indicator">
      <div class="loading-spinner">설정을 저장하는 중...</div>
    </div>
    
    <div id="settings-status" class="status-message"></div>
  </form>
</div>

<script>
function systemSettings() {
  return {
    settings: {
      maintenance_mode: false,
      registration_enabled: true,
      max_students_per_user: 50,
      ai_generation_enabled: true,
      file_upload_max_size_mb: 10, // MB 단위
      session_timeout_minutes: 60 // 분 단위
    },
    originalSettings: {},
    settingsChanged: false,
    loading: false,
    
    async loadSettings() {
      this.loading = true;
      try {
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${Alpine.store('auth').token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('설정 로드 실패');
        }
        
        const result = await response.json();
        if (result.success) {
          // MB 단위로 변환
          this.settings = {
            ...result.data,
            file_upload_max_size_mb: Math.floor(result.data.file_upload_max_size / 1048576),
            session_timeout_minutes: Math.floor(result.data.session_timeout / 60)
          };
          this.originalSettings = { ...this.settings };
          this.settingsChanged = false;
        }
      } catch (error) {
        console.error('시스템 설정 로드 오류:', error);
        Alpine.store('ui').showNotification('시스템 설정을 불러올 수 없습니다.', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    async submitSettings(event) {
      // HTMX가 처리하도록 함
      return true;
    },
    
    resetSettings() {
      this.settings = { ...this.originalSettings };
      this.settingsChanged = false;
    }
  }
}
</script>
```

#### Edge Function: 시스템 설정 조회
```javascript
// Edge Functions: admin-settings (GET)
serve(async (req) => {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      // 데이터가 없으면 기본값 반환
      if (error && error.code === 'PGRST116') {
        const defaultSettings = {
          maintenance_mode: false,
          registration_enabled: true,
          max_students_per_user: 50,
          ai_generation_enabled: true,
          file_upload_max_size: 10485760, // 10MB
          session_timeout: 3600 // 1시간
        };
        
        return new Response(JSON.stringify({
          success: true,
          data: defaultSettings
        }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
      }
      
      if (error) {
        console.error('시스템 설정 조회 오류:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        data: data
      }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    } catch (error) {
      console.error('시스템 설정 조회 오류:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '시스템 설정을 불러올 수 없습니다.'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
  }
  
  // PUT 요청 처리
  if (req.method === 'PUT') {
    try {
      const formData = await req.formData();
      
      // 폼 데이터를 설정 객체로 변환
      const settings = {
        maintenance_mode: formData.get('maintenance_mode') === 'on',
        registration_enabled: formData.get('registration_enabled') === 'on',
        max_students_per_user: parseInt(formData.get('max_students_per_user') || '50'),
        ai_generation_enabled: formData.get('ai_generation_enabled') === 'on',
        file_upload_max_size: parseInt(formData.get('file_upload_max_size_mb') || '10') * 1048576, // MB를 bytes로
        session_timeout: parseInt(formData.get('session_timeout_minutes') || '60') * 60, // 분을 초로
        updated_at: new Date().toISOString()
      };
      
      // UTF-8 안전성 검증 (만약 텍스트 필드가 있다면)
      const textFields = [];
      for (const field of textFields) {
        if (settings[field] && !validateUTF8(settings[field])) {
          return new Response(`
            <div class="alert alert-error">
              ${field} 필드에 잘못된 문자가 포함되어 있습니다.
            </div>
          `, { 
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      }
      
      const { data, error } = await supabase
        .from('system_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) {
        console.error('시스템 설정 업데이트 오류:', error);
        throw error;
      }

      // HTMX 성공 응답 반환
      return new Response(`
        <div class="alert alert-success">
          <i class="icon-check"></i>
          시스템 설정이 성공적으로 업데이트되었습니다.
        </div>
      `, {
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'HX-Trigger': 'settings-updated'
        }
      });
    } catch (error) {
      console.error('시스템 설정 업데이트 오류:', error);
      return new Response(`
        <div class="alert alert-error">
          <i class="icon-error"></i>
          시스템 설정 업데이트에 실패했습니다. 다시 시도해주세요.
        </div>
      `, {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
      .select()
      .single();

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('SYSTEM_SETTINGS_UPDATE_ERROR', '시스템 설정 수정 실패', error);
  }
};
```

---

## 📋 **체크리스트**

### API 구현 상태
- [x] 학생 관리 CRUD API 구현
- [x] 교육 관리 API 구현 (현행수준, 계획, 평가)
- [x] 결제 및 라이선스 API 구현
- [x] 파일 업로드 및 관리 API 구현
- [x] AI 기반 자동 생성 API 구현
- [x] 교육과정 관리 API 구현
- [x] 실시간 업데이트 API 구현
- [x] 관리자 시스템 API 구현 (사용자 관리, 시스템 설정, 로그 조회 등)

### 7.9.6 관리자 통계 API (누락된 API 함수들)

#### 사용자 통계 조회
```javascript
// GET /api/admin/stats/users
const getUsersStats = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_users_stats');

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('USER_STATS_ERROR', '사용자 통계 조회 실패', error);
  }
};

// GET /api/admin/stats/students
const getStudentsStats = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_students_stats');

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('STUDENT_STATS_ERROR', '학생 통계 조회 실패', error);
  }
};

// GET /api/admin/stats/system
const getSystemStats = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_system_stats');

    if (error) throw error;

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('SYSTEM_STATS_ERROR', '시스템 통계 조회 실패', error);
  }
};
```

#### 통계 데이터 구조
```javascript
/**
 * 사용자 통계 데이터 구조
 * @typedef {Object} UserStats
 * @property {number} total_users - 전체 사용자 수
 * @property {number} active_users - 활성 사용자 수
 * @property {number} premium_users - 프리미엄 사용자 수
 * @property {number} monthly_registrations - 월별 신규 가입자 수
 * @property {number} daily_active_users - 일일 활성 사용자 수
 * @property {number} weekly_active_users - 주간 활성 사용자 수
 * @property {number} monthly_active_users - 월간 활성 사용자 수
 */

/**
 * 학생 통계 데이터 구조
 * @typedef {Object} StudentStats
 * @property {number} total_students - 전체 학생 수
 * @property {number} active_students - 활성 학생 수
 * @property {Object} students_by_grade - 학년별 학생 수
 * @property {Object} students_by_disability - 장애유형별 학생 수
 * @property {number} students_with_current_levels - 현행수준 보유 학생 수
 * @property {number} students_with_monthly_plans - 월별 계획 보유 학생 수
 * @property {number} recent_evaluations - 최근 평가 수
 */

/**
 * 시스템 통계 데이터 구조
 * @typedef {Object} SystemStats
 * @property {string} database_size - 데이터베이스 크기
 * @property {number} total_tables - 전체 테이블 수
 * @property {number} ai_generations_today - 오늘 AI 생성 수
 * @property {number} ai_generations_this_month - 이달 AI 생성 수
 * @property {number} file_uploads_today - 오늘 파일 업로드 수
 * @property {number} storage_usage_mb - 스토리지 사용량(MB)
 * @property {number} active_sessions - 활성 세션 수
 */
```

### 7.9.7 UTF-8 인코딩 검증 유틸리티

#### 인코딩 검증 함수
```javascript
/**
 * UTF-8 인코딩 검증 및 정제 함수
 * @param text 검증할 텍스트
 * @returns 검증된 UTF-8 텍스트
 * @throws Error UTF-8 인코딩 오류 시
 */
const validateUTF8 = (text: string): string => {
  try {
    // UTF-8 인코딩 검증
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const encoded = encoder.encode(text);
    const decoded = decoder.decode(encoded);
    
    // 원본과 인코딩/디코딩 결과 비교
    if (decoded !== text) {
      throw new Error('UTF-8 인코딩 불일치');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`UTF-8 인코딩 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

/**
 * 객체 내 모든 문자열 필드 UTF-8 검증
 * @param obj 검증할 객체
 * @returns 검증된 객체
 */
const validateObjectUTF8 = <T extends Record<string, any>>(obj: T): T => {
  const validated = { ...obj };
  
  for (const [key, value] of Object.entries(validated)) {
    if (typeof value === 'string') {
      validated[key] = validateUTF8(value);
    } else if (Array.isArray(value)) {
      validated[key] = value.map(item => 
        typeof item === 'string' ? validateUTF8(item) : item
      );
    } else if (value && typeof value === 'object') {
      validated[key] = validateObjectUTF8(value);
    }
  }
  
  return validated;
};

/**
 * 파일 업로드 시 UTF-8 검증
 * @param file 업로드할 파일
 * @returns 검증 결과
 */
const validateFileUTF8 = async (file) => {
  try {
    // 텍스트 파일인 경우에만 검증
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const text = await file.text();
      validateUTF8(text);
    }
    
    // 파일명 UTF-8 검증
    validateUTF8(file.name);
    
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : '파일 인코딩 검증 실패'
    };
  }
};
```

### 추가 구현 필요
- [x] 알림 시스템 API 구현 (알림 전송, 조회, 읽음 처리 등)
- [x] 관리자 대시보드 통계 함수 구현 (get_users_stats, get_students_stats 등)
- [x] UTF-8 인코딩 검증 유틸리티 함수 구현
- [x] system_settings 테이블 생성 (데이터베이스 설계에 추가 완료)

### 7.9.8 보안 및 검증

#### API 인증 및 권한 검증 (Supabase RLS 기반)
```javascript
// 🔐 HTMX 요청 시 인증 헤더 자동 추가
const setupHTMXAuth = () => {
  // Alpine.js 전역 설정
  document.addEventListener('alpine:init', () => {
    // HTMX 요청 전 인증 헤더 추가
    document.body.addEventListener('htmx:configRequest', (event) => {
      const token = Alpine.store('auth').token;
      if (token) {
        event.detail.headers['Authorization'] = `Bearer ${token}`;
        event.detail.headers['apikey'] = SUPABASE_ANON_KEY;
      }
    });
    
    // 401 오류 시 자동 로그인 페이지 이동
    document.body.addEventListener('htmx:responseError', (event) => {
      if (event.detail.xhr.status === 401) {
        Alpine.store('auth').logout();
        window.location.href = '/login.html';
      }
    });
  });
};

// 🛡️ 권한 검증 함수 (Alpine.js용)
const checkPermission = (requiredRole, userRole) => {
  const roleHierarchy = {
    'student': 1,
    'teacher': 2, 
    'admin': 3,
    'super_admin': 4
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// 🔒 Supabase Edge Function 권한 검증
const verifyUserPermission = async (userId, requiredRole) => {
  try {
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('role, status')
      .eq('user_id', userId)
      .single();
    
    if (error || !user) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }
    
    if (user.status !== 'active') {
      throw new Error('비활성화된 사용자입니다.');
    }
    
    if (!checkPermission(requiredRole, user.role)) {
      throw new Error('접근 권한이 없습니다.');
    }
    
    return { valid: true, user };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message || '권한 검증 실패'
    };
  }
};
```

#### 입력 데이터 유효성 검사
```javascript
// 📝 학생 정보 유효성 검사 스키마
const studentValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[가-힣a-zA-Z\s]+$/,
    message: '학생 이름은 2-50자의 한글 또는 영문으로 입력해주세요.'
  },
  birthDate: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    custom: (value) => {
      const date = new Date(value);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 25, 0, 1);
      const maxDate = new Date(now.getFullYear() - 3, 11, 31);
      return date >= minDate && date <= maxDate;
    },
    message: '올바른 생년월일을 입력해주세요. (3-25세)'
  },
  grade: {
    required: true,
    type: 'number',
    min: 1,
    max: 12,
    message: '학년은 1-12 사이의 숫자여야 합니다.'
  }
};

// ✅ 유효성 검사 실행 함수
const validateInput = (data, schema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // 필수 필드 검사
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field}은(는) 필수 입력 사항입니다.`;
      continue;
    }
    
    if (!value) continue; // 선택적 필드이고 값이 없으면 스킵
    
    // UTF-8 인코딩 검사
    if (typeof value === 'string') {
      try {
        validateUTF8(value);
      } catch (error) {
        errors[field] = `${field}의 인코딩이 올바르지 않습니다.`;
        continue;
      }
    }
    
    // 길이 검사
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field}은(는) 최소 ${rules.minLength}자 이상이어야 합니다.`;
      continue;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field}은(는) 최대 ${rules.maxLength}자까지 입력 가능합니다.`;
      continue;
    }
    
    // 패턴 검사
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `${field} 형식이 올바르지 않습니다.`;
      continue;
    }
    
    // 숫자 범위 검사
    if (rules.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors[field] = `${field}은(는) 숫자여야 합니다.`;
        continue;
      }
      
      if (rules.min !== undefined && numValue < rules.min) {
        errors[field] = `${field}은(는) ${rules.min} 이상이어야 합니다.`;
        continue;
      }
      
      if (rules.max !== undefined && numValue > rules.max) {
        errors[field] = `${field}은(는) ${rules.max} 이하여야 합니다.`;
        continue;
      }
    }
    
    // 커스텀 검사
    if (rules.custom && !rules.custom(value)) {
      errors[field] = rules.message || `${field}이(가) 올바르지 않습니다.`;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// 🎯 Alpine.js 컴포넌트에서 사용 예시
const studentFormValidation = {
  errors: {},
  
  validateField(field, value) {
    const schema = { [field]: studentValidationSchema[field] };
    const result = validateInput({ [field]: value }, schema);
    
    if (result.valid) {
      delete this.errors[field];
    } else {
      this.errors[field] = result.errors[field];
    }
    
    return result.valid;
  },
  
  validateAll(data) {
    const result = validateInput(data, studentValidationSchema);
    this.errors = result.errors;
    return result.valid;
  }
};
```

#### 에러 처리 및 로깅
```javascript
// 📊 중앙화된 에러 로깅 시스템
const errorLogger = {
  // Supabase Edge Function에 에러 로그 전송
  async logError(error, context = {}) {
    try {
      const errorData = {
        message: error.message || '알 수 없는 오류',
        stack: error.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: Alpine.store('auth')?.user?.id || null,
        context: context
      };
      
      // UTF-8 인코딩 검증
      const validatedData = validateObjectUTF8(errorData);
      
      await supabase.functions.invoke('log-error', {
        body: validatedData
      });
    } catch (logError) {
      console.error('에러 로깅 실패:', logError);
    }
  },
  
  // HTMX 에러 자동 로깅
  setupHTMXErrorLogging() {
    document.body.addEventListener('htmx:responseError', (event) => {
      const error = new Error(`HTMX 요청 실패: ${event.detail.xhr.status}`);
      this.logError(error, {
        type: 'htmx_error',
        url: event.detail.requestConfig.path,
        method: event.detail.requestConfig.verb,
        status: event.detail.xhr.status,
        response: event.detail.xhr.responseText
      });
    });
  }
};

// 🚨 Alpine.js 글로벌 에러 핸들러
window.addEventListener('alpine:init', () => {
  // 전역 에러 처리
  window.addEventListener('error', (event) => {
    errorLogger.logError(event.error, {
      type: 'javascript_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  // Promise 에러 처리
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(event.reason, {
      type: 'promise_rejection'
    });
  });
  
  // HTMX 에러 로깅 설정
  errorLogger.setupHTMXErrorLogging();
});

// 📱 사용자 친화적 에러 표시 함수
const showUserError = (message, type = 'error') => {
  // UTF-8 메시지 검증
  const safeMessage = validateUTF8(message);
  
  // Alpine.js 알림 시스템에 에러 추가
  Alpine.store('notifications').add({
    type: type,
    title: type === 'error' ? '오류 발생' : '알림',
    message: safeMessage,
    duration: 5000
  });
};

// 🔧 Supabase Edge Function 에러 핸들러 템플릿
const handleEdgeFunctionError = (error, context) => {
  console.error('Edge Function 오류:', error);
  
  // 로그 기록
  errorLogger.logError(error, {
    type: 'edge_function_error',
    ...context
  });
  
  // 사용자에게 친화적인 메시지 표시
  let userMessage = '처리 중 오류가 발생했습니다.';
  
  if (error.message?.includes('permission')) {
    userMessage = '접근 권한이 없습니다.';
  } else if (error.message?.includes('validation')) {
    userMessage = '입력하신 정보를 다시 확인해주세요.';
  } else if (error.message?.includes('network')) {
    userMessage = '네트워크 연결을 확인해주세요.';
  }
  
  showUserError(userMessage);
  
  return createErrorResponse(
    'INTERNAL_ERROR',
    userMessage,
    process.env.NODE_ENV === 'development' ? error : null
  );
};
```

### 7.9.9 성능 최적화

#### 쿼리 최적화 및 인덱스 활용
```javascript
// 🔍 효율적인 학생 검색 쿼리 (인덱스 활용)
const optimizedStudentSearch = async (searchParams) => {
  let query = supabase
    .from('students')
    .select(`
      id, name, grade, class_name,
      basic_info, 
      current_levels:current_levels(subject, level),
      monthly_plans:monthly_plans(year, month, status)
    `, { count: 'exact' });
  
  // 인덱스를 활용한 검색 조건 (students_search_idx 활용)
  if (searchParams.name) {
    query = query.ilike('name', `%${searchParams.name}%`);
  }
  
  if (searchParams.grade) {
    query = query.eq('grade', searchParams.grade);
  }
  
  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }
  
  // 페이지네이션으로 메모리 사용량 최적화
  const page = searchParams.page || 1;
  const limit = Math.min(searchParams.limit || 20, 100); // 최대 100개로 제한
  const offset = (page - 1) * limit;
  
  query = query
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);
  
  try {
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return createSuccessResponse({
      students: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return handleEdgeFunctionError(error, {
      operation: 'student_search',
      params: searchParams
    });
  }
};

// 📊 통계 쿼리 최적화 (materialized view 활용)
const getCachedStats = async () => {
  try {
    // materialized view를 통한 빠른 통계 조회
    const { data, error } = await supabase
      .from('dashboard_stats_view') // 미리 계산된 뷰 활용
      .select('*')
      .single();
    
    if (error) throw error;
    
    return createSuccessResponse(data);
  } catch (error) {
    // 뷰가 없거나 오류 시 실시간 계산으로 폴백
    return await calculateStatsRealtime();
  }
};

// 🎯 배치 처리를 통한 다중 업데이트 최적화
const batchUpdateStudents = async (updates) => {
  try {
    // 트랜잭션으로 묶어서 처리
    const { data, error } = await supabase.rpc('batch_update_students', {
      updates: updates
    });
    
    if (error) throw error;
    
    return createSuccessResponse({
      updated_count: data.length,
      updated_ids: data.map(s => s.id)
    });
  } catch (error) {
    return handleEdgeFunctionError(error, {
      operation: 'batch_update',
      count: updates.length
    });
  }
};
```

#### 캐싱 전략 구현
```javascript
// 🗄️ Alpine.js 클라이언트 사이드 캐싱
const cacheManager = {
  cache: new Map(),
  ttl: new Map(), // Time To Live 관리
  
  // 캐시 설정 (기본 5분)
  set(key, data, ttlMinutes = 5) {
    const safeKey = validateUTF8(key);
    this.cache.set(safeKey, data);
    this.ttl.set(safeKey, Date.now() + (ttlMinutes * 60 * 1000));
  },
  
  // 캐시 조회
  get(key) {
    const safeKey = validateUTF8(key);
    
    // TTL 확인
    if (this.ttl.has(safeKey) && Date.now() > this.ttl.get(safeKey)) {
      this.delete(safeKey);
      return null;
    }
    
    return this.cache.get(safeKey) || null;
  },
  
  // 캐시 삭제
  delete(key) {
    const safeKey = validateUTF8(key);
    this.cache.delete(safeKey);
    this.ttl.delete(safeKey);
  },
  
  // 패턴별 캐시 무효화
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.delete(key);
      }
    }
  },
  
  // 캐시 크기 관리 (최대 100개 항목)
  cleanup() {
    if (this.cache.size > 100) {
      const oldestKeys = [...this.ttl.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, 20)
        .map(entry => entry[0]);
      
      oldestKeys.forEach(key => this.delete(key));
    }
  }
};

// 🚀 HTMX 요청 캐싱 인터셉터
const setupHTMXCaching = () => {
  document.body.addEventListener('htmx:configRequest', (event) => {
    const url = event.detail.path;
    const method = event.detail.verb;
    
    // GET 요청만 캐싱
    if (method === 'GET') {
      const cacheKey = `htmx_${url}`;
      const cached = cacheManager.get(cacheKey);
      
      if (cached) {
        // 캐시된 응답으로 즉시 처리
        event.detail.target.innerHTML = cached;
        event.preventDefault();
        return;
      }
    }
  });
  
  // 응답 캐싱
  document.body.addEventListener('htmx:afterRequest', (event) => {
    const url = event.detail.pathInfo.requestPath;
    const method = event.detail.requestConfig.verb;
    
    if (method === 'GET' && event.detail.successful) {
      const cacheKey = `htmx_${url}`;
      const response = event.target.innerHTML;
      
      // 캐시 가능한 응답인지 확인
      if (!response.includes('error-state') && response.trim().length > 0) {
        cacheManager.set(cacheKey, response, 3); // 3분 캐싱
      }
    }
  });
};

// 🔄 Supabase 쿼리 결과 캐싱
const cachedQuery = async (queryKey, queryFn, ttlMinutes = 5) => {
  // 캐시 확인
  const cached = cacheManager.get(queryKey);
  if (cached) {
    return cached;
  }
  
  try {
    // 쿼리 실행
    const result = await queryFn();
    
    // 성공 시에만 캐싱
    if (result.success) {
      cacheManager.set(queryKey, result, ttlMinutes);
    }
    
    return result;
  } catch (error) {
    return handleEdgeFunctionError(error, { queryKey });
  }
};
```

#### 실시간 구독 관리
```javascript
// 📡 Supabase Realtime 최적화된 구독 관리
const realtimeManager = {
  subscriptions: new Map(),
  
  // 구독 생성 (중복 방지)
  subscribe(tableName, filter, callback) {
    const subscriptionKey = `${tableName}_${JSON.stringify(filter)}`;
    
    // 이미 구독 중이면 콜백만 추가
    if (this.subscriptions.has(subscriptionKey)) {
      const existingSub = this.subscriptions.get(subscriptionKey);
      existingSub.callbacks.push(callback);
      return subscriptionKey;
    }
    
    // 새 구독 생성
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: filter
      }, (payload) => {
        // 모든 콜백 실행
        const sub = this.subscriptions.get(subscriptionKey);
        if (sub) {
          sub.callbacks.forEach(cb => {
            try {
              cb(payload);
            } catch (error) {
              console.error('Realtime callback 오류:', error);
            }
          });
        }
      })
      .subscribe();
    
    this.subscriptions.set(subscriptionKey, {
      subscription,
      callbacks: [callback],
      tableName,
      filter
    });
    
    return subscriptionKey;
  },
  
  // 구독 해제
  unsubscribe(subscriptionKey) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (sub) {
      sub.subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  },
  
  // 특정 테이블의 모든 구독 해제
  unsubscribeTable(tableName) {
    for (const [key, sub] of this.subscriptions.entries()) {
      if (sub.tableName === tableName) {
        this.unsubscribe(key);
      }
    }
  },
  
  // 모든 구독 해제
  unsubscribeAll() {
    for (const [key] of this.subscriptions.entries()) {
      this.unsubscribe(key);
    }
  }
};

// 🎯 Alpine.js 컴포넌트에서 실시간 구독 사용
const realtimeStudentList = {
  subscriptionKey: null,
  
  init() {
    // 학생 목록 실시간 업데이트 구독
    this.subscriptionKey = realtimeManager.subscribe(
      'students',
      null,
      (payload) => this.handleStudentUpdate(payload)
    );
  },
  
  handleStudentUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        this.students.push(newRecord);
        break;
      case 'UPDATE':
        const index = this.students.findIndex(s => s.id === newRecord.id);
        if (index !== -1) {
          this.students[index] = newRecord;
        }
        break;
      case 'DELETE':
        this.students = this.students.filter(s => s.id !== oldRecord.id);
        break;
    }
    
    // 캐시 무효화
    cacheManager.invalidatePattern('students');
  },
  
  destroy() {
    if (this.subscriptionKey) {
      realtimeManager.unsubscribe(this.subscriptionKey);
    }
  }
};
```

#### API 응답 시간 모니터링
```javascript
// ⏱️ 성능 모니터링 시스템
const performanceMonitor = {
  metrics: [],
  
  // API 호출 성능 측정
  async measureAPICall(apiName, apiCall) {
    const startTime = performance.now();
    const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const metric = {
        apiName,
        duration: Math.round(endTime - startTime),
        memoryUsed: endMemory - startMemory,
        timestamp: new Date().toISOString(),
        success: true
      };
      
      this.recordMetric(metric);
      
      // 느린 API 경고 (3초 이상)
      if (metric.duration > 3000) {
        console.warn(`⚠️ 느린 API 호출: ${apiName} (${metric.duration}ms)`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      this.recordMetric({
        apiName,
        duration: Math.round(endTime - startTime),
        memoryUsed: 0,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });
      
      throw error;
    }
  },
  
  // 메트릭 기록 (최대 1000개 유지)
  recordMetric(metric) {
    this.metrics.push(metric);
    
    // 메모리 관리를 위해 오래된 메트릭 제거
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }
  },
  
  // 성능 통계 생성
  getPerformanceStats() {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - new Date(m.timestamp).getTime() < 3600000 // 최근 1시간
    );
    
    const successful = recentMetrics.filter(m => m.success);
    const failed = recentMetrics.filter(m => !m.success);
    
    const durations = successful.map(m => m.duration);
    const avgDuration = durations.length > 0 ? 
      durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    
    return {
      totalCalls: recentMetrics.length,
      successfulCalls: successful.length,
      failedCalls: failed.length,
      successRate: recentMetrics.length > 0 ? 
        (successful.length / recentMetrics.length * 100).toFixed(2) + '%' : '0%',
      averageResponseTime: Math.round(avgDuration) + 'ms',
      slowestCall: durations.length > 0 ? Math.max(...durations) + 'ms' : '0ms',
      fastestCall: durations.length > 0 ? Math.min(...durations) + 'ms' : '0ms'
    };
  },
  
  // HTMX 요청 모니터링 설정
  setupHTMXMonitoring() {
    document.body.addEventListener('htmx:beforeRequest', (event) => {
      event.detail.startTime = performance.now();
    });
    
    document.body.addEventListener('htmx:afterRequest', (event) => {
      if (event.detail.startTime) {
        const duration = performance.now() - event.detail.startTime;
        const url = event.detail.pathInfo.requestPath;
        
        this.recordMetric({
          apiName: `HTMX_${url}`,
          duration: Math.round(duration),
          memoryUsed: 0,
          timestamp: new Date().toISOString(),
          success: event.detail.successful
        });
      }
    });
  }
};

// 🚨 성능 알람 시스템
const performanceAlert = {
  thresholds: {
    slowAPI: 5000,        // 5초 이상
    highFailureRate: 10,  // 10% 이상
    highMemoryUsage: 50 * 1024 * 1024  // 50MB 이상
  },
  
  // 주기적 성능 체크 (1분마다)
  startMonitoring() {
    setInterval(() => {
      this.checkPerformance();
    }, 60000);
  },
  
  checkPerformance() {
    const stats = performanceMonitor.getPerformanceStats();
    const recentMetrics = performanceMonitor.metrics.slice(-100); // 최근 100개
    
    // 느린 API 체크
    const slowAPIs = recentMetrics.filter(
      m => m.duration > this.thresholds.slowAPI
    );
    
    if (slowAPIs.length > 0) {
      console.warn('🐌 성능 경고: 느린 API 호출 감지', {
        count: slowAPIs.length,
        apis: slowAPIs.map(m => m.apiName)
      });
    }
    
    // 실패율 체크
    const failureRate = recentMetrics.length > 0 ?
      (recentMetrics.filter(m => !m.success).length / recentMetrics.length * 100) : 0;
    
    if (failureRate > this.thresholds.highFailureRate) {
      console.error('💥 성능 경고: 높은 API 실패율', {
        failureRate: failureRate.toFixed(2) + '%',
        threshold: this.thresholds.highFailureRate + '%'
      });
    }
    
    // 메모리 사용량 체크
    if (performance.memory && 
        performance.memory.usedJSHeapSize > this.thresholds.highMemoryUsage) {
      console.warn('🧠 메모리 경고: 높은 메모리 사용량', {
        current: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        threshold: Math.round(this.thresholds.highMemoryUsage / 1024 / 1024) + 'MB'
      });
      
      // 캐시 정리
      cacheManager.cleanup();
    }
  }
};

// 🎬 초기화 및 설정
window.addEventListener('alpine:init', () => {
  // HTMX 캐싱 설정
  setupHTMXCaching();
  
  // 성능 모니터링 시작
  performanceMonitor.setupHTMXMonitoring();
  performanceAlert.startMonitoring();
  
  console.log('🚀 IEPON API 성능 최적화 시스템 시작됨');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  realtimeManager.unsubscribeAll();
});
```

---

## 🔗 **관련 문서**

- **[02_데이터베이스_설계.md](./02_데이터베이스_설계.md)**: 데이터 모델 및 스키마
- **[06_상태_관리.md](./06_상태_관리.md)**: 클라이언트 상태와 API 연동
- **[10_보안_권한.md](./10_보안_권한.md)**: API 보안 정책
- **[12_개발_가이드.md](./12_개발_가이드.md)**: API 개발 가이드라인
