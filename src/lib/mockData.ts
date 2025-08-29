// IEPON 시스템 목업 데이터 (개발문서 기반)
import { Student, Teacher, IEP, EducationPlan, AIAnalysis, Assessment, Notification } from './types';

// 목업 특수교사 데이터
export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-001',
    email: 'kim.teacher@school.edu',
    name: '김특수',
    school: '서울특수학교',
    department: '특수교육과',
    certification: '특수교육교사 1급',
    phone: '010-1234-5678',
    joinDate: '2020-03-01',
    lastLogin: '2024-01-15T09:00:00Z',
    status: 'active',
    students: ['student-001', 'student-002'],
    permissions: [
      { id: 'perm-001', resource: 'students', action: 'read', granted: true },
      { id: 'perm-002', resource: 'students', action: 'update', granted: true },
      { id: 'perm-003', resource: 'iep', action: 'create', granted: true },
    ]
  },
  {
    id: 'teacher-002',
    email: 'lee.teacher@school.edu',
    name: '이교사',
    school: '서울특수학교',
    department: '특수교육과',
    certification: '특수교육교사 2급',
    phone: '010-9876-5432',
    joinDate: '2021-09-01',
    lastLogin: '2024-01-14T14:30:00Z',
    status: 'active',
    students: ['student-003'],
    permissions: [
      { id: 'perm-004', resource: 'students', action: 'read', granted: true },
      { id: 'perm-005', resource: 'students', action: 'update', granted: true },
    ]
  }
];

// 목업 학생 데이터 (상세 정보 포함)
export const mockStudents: Student[] = [
  {
    id: 'student-001',
    name: '김철수',
    birthDate: '2010-05-15',
    gender: '남성',
    
    // 학교 정보
    schoolName: '서울특수학교',
    grade: 8,
    className: '중2-1반',
    homeTeacherName: '김특수',
    
    // 통합교육 정보
    integrationType: '부분통합',
    integrationHours: 15,
    integrationSubjects: ['국어', '사회', '체육'],
    
    // 장애 정보
    disabilityTypes: [
      { type: '지적장애', description: '경도 지적장애' },
      { type: '자폐성장애', description: '고기능 자폐스펙트럼' }
    ],
    disabilityRegistrationDate: '2010-12-01',
    hasWelfareCard: true,
    disabilitySeverity: '중증',
    
    // 복지 지원
    welfareSupports: ['장애아동수당', '방과후돌봄'],
    
    // 치료 지원
    treatmentSupports: ['언어치료', '행동치료'],
    
    // 보조인력 지원
    assistantSupports: ['특수교육실무사'],
    
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    status: 'active',
    teacherId: 'teacher-001'
  },
  {
    id: 'student-002',
    name: '이영희',
    birthDate: '2011-08-22',
    gender: '여성',
    
    schoolName: '서울특수학교',
    grade: 7,
    className: '중1-2반',
    homeTeacherName: '김특수',
    
    integrationType: '완전통합',
    integrationHours: 30,
    integrationSubjects: ['국어', '수학', '영어', '과학', '사회'],
    
    disabilityTypes: [
      { type: '학습장애', description: '읽기 학습장애' }
    ],
    disabilityRegistrationDate: '2017-03-15',
    hasWelfareCard: false,
    disabilitySeverity: '경증',
    
    welfareSupports: ['보육료지원'],
    
    treatmentSupports: ['심리치료'],
    assistantSupports: [],
    
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
    status: 'active',
    teacherId: 'teacher-001'
  },
  {
    id: 'student-003',
    name: '박민수',
    birthDate: '2009-11-03',
    gender: '남성',
    
    schoolName: '서울특수학교',
    grade: 9,
    className: '중3-1반',
    homeTeacherName: '이교사',
    
    integrationType: '부분통합',
    integrationHours: 12,
    integrationSubjects: ['체육', '음악', '미술'],
    
    disabilityTypes: [
      { type: '정서행동장애', description: 'ADHD' },
      { type: '의사소통장애', description: '언어발달지체' }
    ],
    disabilityRegistrationDate: '2015-07-20',
    hasWelfareCard: true,
    disabilitySeverity: '중증',
    
    welfareSupports: ['장애인연금'],
    
    treatmentSupports: ['언어치료', '놀이치료'],
    
    assistantSupports: ['사회복무요원'],
    
    createdAt: '2023-03-10T08:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    status: 'active',
    teacherId: 'teacher-002'
  }
];

// 목업 IEP 데이터
export const mockIEPs: IEP[] = [
  {
    id: 'iep-001',
    studentId: 'student-001',
    title: '김철수 개별화교육계획',
    academicYear: '2024',
    semester: '1학기',
    
    currentLevel: {
      cognitive: '초등 4학년 수준의 인지능력, 집중시간 15-20분',
      language: '단어 수준의 표현, 2-3단어 조합 가능',
      social: '또래와의 상호작용 어려움, 성인과는 협력 가능',
      motor: '대근육 운동 양호, 소근육 조절 어려움',
      selfCare: '기본적 자조기능 독립적, 복잡한 과제 시 도움 필요',
      academic: '기초 읽기·쓰기 가능, 수학은 10 이내 연산 수준'
    },
    
    annualGoals: [
      {
        id: 'goal-001',
        domain: '언어',
        description: '의사표현 능력 향상',
        measurableObjective: '5단어 이상의 문장으로 요구사항 표현하기',
        criteria: '80% 정확도로 일주일에 3회 이상',
        timeframe: '2024년 12월까지',
        progress: 35,
        status: 'in_progress'
      },
      {
        id: 'goal-002',
        domain: '사회성',
        description: '또래와의 상호작용 능력 개발',
        measurableObjective: '또래와 10분 이상 협력활동 참여',
        criteria: '주 2회 이상 성공적 참여',
        timeframe: '2024년 12월까지',
        progress: 20,
        status: 'in_progress'
      }
    ],
    
    shortTermGoals: [
      {
        id: 'goal-003',
        domain: '학습',
        description: '집중시간 연장',
        measurableObjective: '25분 동안 과제에 집중하기',
        criteria: '주 4회 이상 달성',
        timeframe: '2024년 6월까지',
        progress: 60,
        status: 'in_progress'
      }
    ],
    
    educationServices: [
      {
        id: 'service-001',
        type: '특수교육',
        provider: '김특수 교사',
        frequency: '주 5회',
        duration: '40분',
        location: '특수학급',
        startDate: '2024-03-01',
        endDate: '2024-12-31'
      },
      {
        id: 'service-002',
        type: '치료지원',
        provider: '박언어 치료사',
        frequency: '주 2회',
        duration: '30분',
        location: '언어치료실',
        startDate: '2024-03-01',
        endDate: '2024-12-31'
      }
    ],
    
    assessmentPlan: {
      methods: ['관찰평가', '포트폴리오', '수행평가'],
      schedule: '월 1회 정기평가, 분기별 종합평가',
      criteria: '목표 달성도 80% 이상',
      responsibilities: '담임교사, 특수교사, 치료사 협력'
    },
    
    status: 'finalized',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    createdBy: 'teacher-001'
  }
];

// 목업 교육계획 데이터
export const mockEducationPlans: EducationPlan[] = [
  {
    id: 'plan-001',
    studentId: 'student-001',
    type: 'weekly',
    title: '1월 3주차 주간계획',
    period: {
      startDate: '2024-01-15',
      endDate: '2024-01-19'
    },
    
    subjects: [
      {
        id: 'subject-001',
        subject: '국어',
        objectives: ['글자 인식 능력 향상', '단어 읽기 연습'],
        content: '기본 한글 자모음 학습, 간단한 단어 읽기',
        methods: ['시각적 자료 활용', '반복 학습', '게임화 학습'],
        materials: ['한글카드', '태블릿', '교육용 앱'],
        evaluation: '단어 읽기 정확도 측정'
      },
      {
        id: 'subject-002',
        subject: '수학',
        objectives: ['10 이내 덧셈 이해', '구체물 활용 계산'],
        content: '구체물을 이용한 10 이내 덧셈',
        methods: ['조작 활동', '시각적 표현', '단계별 학습'],
        materials: ['블록', '계산판', '숫자카드'],
        evaluation: '문제 해결 과정 관찰'
      }
    ],
    
    activities: [
      {
        id: 'activity-001',
        name: '언어표현 활동',
        type: '개별활동',
        description: '일상생활 상황 역할놀이를 통한 언어표현 연습',
        duration: 30,
        materials: ['상황카드', '소품'],
        objectives: ['자발적 언어표현', '상황 이해력 향상'],
        date: '2024-01-16',
        time: '14:00'
      }
    ],
    
    assessments: [
      {
        id: 'assessment-001',
        studentId: 'student-001',
        type: '형성평가',
        subject: '국어',
        method: '관찰평가',
        date: '2024-01-19',
        comments: '단어 인식 능력이 향상되었으나 문장 읽기는 여전히 어려워함',
        recommendations: ['문장 읽기 단계적 접근', '시각적 단서 강화'],
        assessorId: 'teacher-001'
      }
    ],
    
    status: 'finalized',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T15:00:00Z',
    createdBy: 'teacher-001'
  }
];

// 목업 AI 분석 데이터
export const mockAIAnalyses: AIAnalysis[] = [
  {
    id: 'ai-001',
    studentId: 'student-001',
    type: 'learning_progress',
    title: '김철수 학습 진도 분석',
    
    summary: '최근 3개월 간 언어영역에서 지속적인 향상을 보이고 있으며, 특히 단어 인식 능력이 크게 개선되었습니다.',
    strengths: ['시각적 학습 선호', '반복 학습 효과 높음', '성인과의 상호작용 원활'],
    challenges: ['집중시간 단축', '복합 지시 이해 어려움', '또래 상호작용 제한'],
    
    recommendations: [
      {
        id: 'rec-001',
        category: '교육방법',
        priority: 'high',
        description: '시각적 단서를 활용한 단계별 학습 방법 적용',
        expectedOutcome: '과제 이해도 20% 향상 예상',
        implementation: '모든 교육 활동에 시각적 지원 도구 활용',
        timeframe: '4주'
      },
      {
        id: 'rec-002',
        category: '교육내용',
        priority: 'medium',
        description: '사회성 향상을 위한 소그룹 활동 증대',
        expectedOutcome: '또래 상호작용 시간 50% 증가',
        implementation: '주 2회 소그룹 협력 활동 진행',
        timeframe: '8주'
      }
    ],
    
    dataSource: ['IEP 진도 기록', '일일 관찰 노트', '평가 결과'],
    analysisDate: '2024-01-14',
    confidence: 85,
    
    status: 'completed',
    createdAt: '2024-01-14T16:00:00Z',
    createdBy: 'ai-system'
  }
];

// 목업 알림 데이터
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'teacher-001',
    type: 'warning',
    title: 'IEP 검토 기한 임박',
    message: '김철수 학생의 IEP 검토 기한이 3일 남았습니다.',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
    actionUrl: '/iep/iep-001'
  },
  {
    id: 'notif-002',
    userId: 'teacher-001',
    type: 'info',
    title: 'AI 분석 완료',
    message: '김철수 학생의 학습 진도 분석이 완료되었습니다.',
    isRead: false,
    createdAt: '2024-01-14T16:30:00Z',
    actionUrl: '/ai/ai-001'
  },
  {
    id: 'notif-003',
    userId: 'teacher-002',
    type: 'success',
    title: '주간계획 승인',
    message: '박민수 학생의 주간 교육계획이 승인되었습니다.',
    isRead: true,
    createdAt: '2024-01-12T14:00:00Z'
  }
];

// 유틸리티 함수들
export const getMockStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getMockStudentsByTeacher = (teacherId: string): Student[] => {
  return mockStudents.filter(student => student.teacherId === teacherId);
};

export const getMockIEPByStudentId = (studentId: string): IEP | undefined => {
  return mockIEPs.find(iep => iep.studentId === studentId);
};

export const getMockEducationPlansByStudentId = (studentId: string): EducationPlan[] => {
  return mockEducationPlans.filter(plan => plan.studentId === studentId);
};

export const getMockAIAnalysesByStudentId = (studentId: string): AIAnalysis[] => {
  return mockAIAnalyses.filter(analysis => analysis.studentId === studentId);
};

export const getMockNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(notif => notif.userId === userId);
};

// 통계 데이터 생성
export const generateMockStats = () => {
  return {
    totalStudents: mockStudents.length,
    activeIEPs: mockIEPs.filter(iep => iep.status === 'finalized').length,
    pendingAssessments: mockEducationPlans.reduce((acc, plan) => acc + plan.assessments.length, 0),
    completedAnalyses: mockAIAnalyses.filter(analysis => analysis.status === 'completed').length,
    treatmentSessions: mockStudents.reduce((acc, student) => acc + student.treatmentSupports.length, 0)
  };
};
