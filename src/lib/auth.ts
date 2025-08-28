// 프로토타입 테스트용 계정 데이터
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'special_teacher';
  phone: string;
  school: string;
  department: string;
  certification: string;
  joinDate: string;
  lastLogin?: string;
}

// 테스트용 계정 데이터 (특수교사 전용)
export const TEST_USERS: User[] = [
  {
    id: 'user_001',
    email: 'teacher.kim@test.com',
    password: 'iepon2024!',
    name: '김민지',
    role: 'special_teacher',
    phone: '010-1234-5678',
    school: '서울특수학교',
    department: '지적장애 교육과',
    certification: '특수교육 정교사 1급',
    joinDate: '2024-01-15',
    lastLogin: '2024-08-27'
  },
  {
    id: 'user_002', 
    email: 'teacher.park@test.com',
    password: 'teacher123!',
    name: '박선생',
    role: 'special_teacher',
    phone: '010-2345-6789',
    school: '경기특수학교',
    department: '자폐성장애 교육과',
    certification: '특수교육 정교사 2급',
    joinDate: '2024-03-10',
    lastLogin: '2024-08-26'
  },
  {
    id: 'user_003',
    email: 'teacher.lee@test.com', 
    password: 'special123!',
    name: '이영희',
    role: 'special_teacher',
    phone: '010-3456-7890',
    school: '부산특수학교',
    department: '시각장애 교육과',
    certification: '특수교육 정교사 1급',
    joinDate: '2024-05-20',
    lastLogin: '2024-08-25'
  }
];

// 로그인 검증 함수
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // 실제 환경에서는 API 호출
  await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
  
  const user = TEST_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date().toISOString().split('T')[0];
    return user;
  }
  
  return null;
};

// 세션 관리 (간단한 localStorage 사용)
export const saveUserSession = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('iepon_user', JSON.stringify(user));
    localStorage.setItem('iepon_token', `token_${user.id}_${Date.now()}`);
  }
};

export const getUserSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('iepon_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const clearUserSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('iepon_user');
    localStorage.removeItem('iepon_token');
  }
};

export const isAuthenticated = (): boolean => {
  return getUserSession() !== null;
};
