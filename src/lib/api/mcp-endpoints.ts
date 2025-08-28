'use client';

import { Student } from '../types';
import { AIGenerationResult, AIServiceType, AI_SERVICE_TYPES } from '../ai-types';

/**
 * MCP 기반 API 엔드포인트 하드코딩 구현
 * 개발문서 07_API_설계.md 기반
 */

// Mock 응답 지연 시뮬레이션
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// UTF-8 안전성 검증
const validateUTF8 = (data: any): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    const encoded = new TextEncoder().encode(jsonString);
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
    return JSON.parse(decoded) !== null;
  } catch {
    return false;
  }
};

// 표준 API 응답 형식
interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// 표준 응답 생성기
const createResponse = <T>(success: boolean, data?: T, error?: any): MCPResponse<T> => ({
  success,
  data: success ? data : undefined,
  error: !success ? {
    code: error?.code || 'UNKNOWN_ERROR',
    message: error?.message || '알 수 없는 오류가 발생했습니다.',
    details: error?.details
  } : undefined,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    version: '1.0.0'
  }
});

/**
 * 학생 관리 API
 */
export class StudentAPI {
  private static mockStudents: Student[] = [
    {
      id: 'student-1',
      name: '김철수',
      birthDate: '2015-03-15',
      gender: '남성',
      schoolName: '서울특수학교',
      grade: 3,
      className: '3-1',
      homeTeacherName: '이선생',
      integrationType: '부분통합',
      integrationHours: 20,
      integrationSubjects: ['국어', '수학'],
      disabilityTypes: [
        { type: '지적장애', description: '경도 지적장애' },
        { type: '의사소통장애', description: '언어 발달 지연' }
      ],
      disabilityRegistrationDate: '2020-03-01',
      hasWelfareCard: true,
      disabilitySeverity: '경증',
      welfareSupports: ['재활치료', '교육지원'],
      treatmentSupports: ['언어치료', '인지치료'],
      assistantSupports: ['개별지원'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      status: 'active',
      teacherId: 'teacher-1'
    },
    {
      id: 'student-2',
      name: '박영희',
      birthDate: '2016-07-22',
      gender: '여성',
      schoolName: '서울특수학교',
      grade: 2,
      className: '2-2',
      homeTeacherName: '김선생',
      integrationType: '완전통합',
      integrationHours: 30,
      integrationSubjects: ['국어', '수학', '사회'],
      disabilityTypes: [
        { type: '자폐성장애', description: '고기능 자폐' }
      ],
      disabilityRegistrationDate: '2021-01-15',
      hasWelfareCard: true,
      disabilitySeverity: '중등도',
      welfareSupports: ['교육지원', '가족지원'],
      treatmentSupports: ['행동치료', '사회성훈련'],
      assistantSupports: ['또래지원'],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      status: 'active',
      teacherId: 'teacher-1'
    }
  ];

  static async getStudents(teacherId?: string): Promise<MCPResponse<Student[]>> {
    await mockDelay();

    try {
      let students = this.mockStudents;
      
      if (teacherId) {
        students = students.filter(student => student.teacherId === teacherId);
      }

      if (!validateUTF8(students)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      return createResponse(true, students);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'FETCH_STUDENTS_ERROR',
        message: '학생 목록을 가져오는데 실패했습니다.',
        details: error
      });
    }
  }

  static async getStudent(id: string): Promise<MCPResponse<Student>> {
    await mockDelay();

    try {
      const student = this.mockStudents.find(s => s.id === id);
      
      if (!student) {
        return createResponse(false, undefined, {
          code: 'STUDENT_NOT_FOUND',
          message: '해당 학생을 찾을 수 없습니다.'
        });
      }

      if (!validateUTF8(student)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      return createResponse(true, student);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'FETCH_STUDENT_ERROR',
        message: '학생 정보를 가져오는데 실패했습니다.',
        details: error
      });
    }
  }

  static async createStudent(studentData: Partial<Student>): Promise<MCPResponse<Student>> {
    await mockDelay(800);

    try {
      if (!studentData.name || !studentData.birthDate) {
        return createResponse(false, undefined, {
          code: 'VALIDATION_ERROR',
          message: '필수 정보가 누락되었습니다. (이름, 생년월일)'
        });
      }

      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: studentData.name,
        birthDate: studentData.birthDate,
        gender: studentData.gender || '남성',
        schoolName: studentData.schoolName || '',
        grade: studentData.grade || 1,
        className: studentData.className || '',
        homeTeacherName: studentData.homeTeacherName || '',
        integrationType: studentData.integrationType || '부분통합',
        integrationHours: studentData.integrationHours || 0,
        integrationSubjects: studentData.integrationSubjects || [],
        disabilityTypes: studentData.disabilityTypes || [],
        disabilityRegistrationDate: studentData.disabilityRegistrationDate || '',
        hasWelfareCard: studentData.hasWelfareCard || false,
        disabilitySeverity: studentData.disabilitySeverity || '경증',
        welfareSupports: studentData.welfareSupports || [],
        treatmentSupports: studentData.treatmentSupports || [],
        assistantSupports: studentData.assistantSupports || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        teacherId: studentData.teacherId || 'teacher-1'
      };

      if (!validateUTF8(newStudent)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      this.mockStudents.push(newStudent);
      return createResponse(true, newStudent);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'CREATE_STUDENT_ERROR',
        message: '학생 등록에 실패했습니다.',
        details: error
      });
    }
  }

  static async updateStudent(id: string, updates: Partial<Student>): Promise<MCPResponse<Student>> {
    await mockDelay(600);

    try {
      const index = this.mockStudents.findIndex(s => s.id === id);
      
      if (index === -1) {
        return createResponse(false, undefined, {
          code: 'STUDENT_NOT_FOUND',
          message: '해당 학생을 찾을 수 없습니다.'
        });
      }

      const updatedStudent = {
        ...this.mockStudents[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (!validateUTF8(updatedStudent)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      this.mockStudents[index] = updatedStudent;
      return createResponse(true, updatedStudent);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'UPDATE_STUDENT_ERROR',
        message: '학생 정보 수정에 실패했습니다.',
        details: error
      });
    }
  }

  static async deleteStudent(id: string): Promise<MCPResponse<{ id: string }>> {
    await mockDelay(400);

    try {
      const index = this.mockStudents.findIndex(s => s.id === id);
      
      if (index === -1) {
        return createResponse(false, undefined, {
          code: 'STUDENT_NOT_FOUND',
          message: '해당 학생을 찾을 수 없습니다.'
        });
      }

      this.mockStudents.splice(index, 1);
      return createResponse(true, { id });
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'DELETE_STUDENT_ERROR',
        message: '학생 삭제에 실패했습니다.',
        details: error
      });
    }
  }
}

/**
 * AI 생성 서비스 API
 */
export class AIGenerationAPI {
  private static mockResults: AIGenerationResult[] = [];

  static async generateContent(request: {
    studentId: string;
    serviceType: AIServiceType;
    additionalContext?: any;
  }): Promise<MCPResponse<AIGenerationResult>> {
    await mockDelay(2000 + Math.random() * 3000); // 2-5초 시뮬레이션

    try {
      if (!request.studentId || !request.serviceType) {
        return createResponse(false, undefined, {
          code: 'VALIDATION_ERROR',
          message: '필수 매개변수가 누락되었습니다. (studentId, serviceType)'
        });
      }

      // 학생 정보 검증
      const studentResponse = await StudentAPI.getStudent(request.studentId);
      if (!studentResponse.success || !studentResponse.data) {
        return createResponse(false, undefined, {
          code: 'STUDENT_NOT_FOUND',
          message: '해당 학생을 찾을 수 없습니다.'
        });
      }

      const student = studentResponse.data;
      const content = this.generateMockContent(request.serviceType, student, request.additionalContext);

      const result: AIGenerationResult = {
        id: `ai_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        serviceType: request.serviceType,
        studentId: request.studentId,
        generatedContent: content,
        metadata: {
          model: 'mock-ai-model-v1.0',
          temperature: 0.7,
          maxTokens: 2000,
          promptTokens: Math.floor(Math.random() * 500 + 100),
          completionTokens: Math.floor(Math.random() * 1500 + 300),
          totalTokens: 0,
          processingTime: Math.floor(Math.random() * 3000 + 2000),
          retryCount: 0,
          version: '1.0.0'
        },
        contextUsage: {
          dataSourcesUsed: ['student_profile', 'learning_history', 'support_needs'],
          contextCompleteness: Math.floor(Math.random() * 30 + 70),
          individualizedElements: ['disability_type', 'learning_pace', 'support_needs'],
          adaptationsApplied: ['visual_support', 'reduced_complexity'],
          supportNeedsAddressed: student.welfareSupports.slice(0, 3)
        },
        qualityScore: Math.floor(Math.random() * 20 + 80),
        confidenceLevel: Math.floor(Math.random() * 25 + 75),
        generatedAt: new Date().toISOString(),
        validatedAt: new Date().toISOString(),
        errors: [],
        warnings: []
      };

      result.metadata.totalTokens = result.metadata.promptTokens + result.metadata.completionTokens;

      if (!validateUTF8(result)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      this.mockResults.push(result);
      return createResponse(true, result);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'AI_GENERATION_ERROR',
        message: 'AI 콘텐츠 생성에 실패했습니다.',
        details: error
      });
    }
  }

  static async getGenerationHistory(studentId: string, limit: number = 10): Promise<MCPResponse<AIGenerationResult[]>> {
    await mockDelay();

    try {
      const results = this.mockResults
        .filter(result => result.studentId === studentId)
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
        .slice(0, limit);

      if (!validateUTF8(results)) {
        throw new Error('UTF-8 encoding validation failed');
      }

      return createResponse(true, results);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'FETCH_HISTORY_ERROR',
        message: '생성 기록을 가져오는데 실패했습니다.',
        details: error
      });
    }
  }

  private static generateMockContent(serviceType: AIServiceType, student: Student, context?: any): string {
    const studentName = student.name;
    const grade = student.grade;
    const disabilityTypes = student.disabilityTypes.map(d => d.type).join(', ');

    switch (serviceType) {
      case AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT:
        return `# ${studentName}님을 위한 개별화 교육과정 배정

## 학습자 분석
- 현재 학년: ${grade}학년
- 장애 유형: ${disabilityTypes}
- 통합교육 유형: ${student.integrationType}

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
${student.welfareSupports.map(support => `- ${support}`).join('\n')}

## 평가 계획
- 관찰 평가 중심
- 포트폴리오 평가
- 수행 평가 병행

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
${student.treatmentSupports.map(support => `- ${support}`).join('\n')}

## 평가 방법
- 수행 관찰 체크리스트
- 학습 결과물 수집
- 학부모 피드백`;

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
- 자립생활 기능 확장

## 권장사항
학부모와의 지속적인 소통을 통해 가정에서도 일관된 지원이 이루어질 수 있도록 협력이 필요합니다.`;

      default:
        return `# AI 생성 결과\n\n${studentName}님을 위한 맞춤형 콘텐츠가 생성되었습니다.\n\n생성 시간: ${new Date().toLocaleString('ko-KR')}`;
    }
  }
}

/**
 * 시스템 상태 API
 */
export class SystemAPI {
  static async getHealth(): Promise<MCPResponse<{ status: string; timestamp: string; services: any }>> {
    await mockDelay(200);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'operational',
        aiService: 'operational',
        fileStorage: 'operational',
        cache: 'operational'
      }
    };

    return createResponse(true, health);
  }

  static async getSystemInfo(): Promise<MCPResponse<{ version: string; environment: string; uptime: number }>> {
    await mockDelay(100);

    const info = {
      version: '1.0.0',
      environment: 'development',
      uptime: Date.now() - 1704067200000 // 2024-01-01 기준
    };

    return createResponse(true, info);
  }
}

/**
 * 통계 API
 */
export class StatisticsAPI {
  static async getStudentStats(teacherId?: string): Promise<MCPResponse<any>> {
    await mockDelay(800);

    try {
      const studentsResponse = await StudentAPI.getStudents(teacherId);
      if (!studentsResponse.success || !studentsResponse.data) {
        throw new Error('Failed to fetch students');
      }

      const students = studentsResponse.data;
      
      const stats = {
        totalStudents: students.length,
        activeStudents: students.filter(s => s.status === 'active').length,
        disabilityTypes: this.aggregateDisabilityTypes(students),
        integrationTypes: this.aggregateIntegrationTypes(students),
        supportTypes: this.aggregateSupportTypes(students),
        gradeDistribution: this.aggregateGradeDistribution(students)
      };

      return createResponse(true, stats);
    } catch (error) {
      return createResponse(false, undefined, {
        code: 'STATS_ERROR',
        message: '통계 데이터를 가져오는데 실패했습니다.',
        details: error
      });
    }
  }

  private static aggregateDisabilityTypes(students: Student[]): { [key: string]: number } {
    const types: { [key: string]: number } = {};
    students.forEach(student => {
      student.disabilityTypes.forEach(disability => {
        types[disability.type] = (types[disability.type] || 0) + 1;
      });
    });
    return types;
  }

  private static aggregateIntegrationTypes(students: Student[]): { [key: string]: number } {
    const types: { [key: string]: number } = {};
    students.forEach(student => {
      types[student.integrationType] = (types[student.integrationType] || 0) + 1;
    });
    return types;
  }

  private static aggregateSupportTypes(students: Student[]): { welfare: number; treatment: number; assistant: number } {
    return {
      welfare: students.reduce((sum, s) => sum + s.welfareSupports.length, 0),
      treatment: students.reduce((sum, s) => sum + s.treatmentSupports.length, 0),
      assistant: students.reduce((sum, s) => sum + s.assistantSupports.length, 0)
    };
  }

  private static aggregateGradeDistribution(students: Student[]): { [key: number]: number } {
    const distribution: { [key: number]: number } = {};
    students.forEach(student => {
      distribution[student.grade] = (distribution[student.grade] || 0) + 1;
    });
    return distribution;
  }
}

// API 클라이언트 래퍼
export const mcpAPI = {
  students: StudentAPI,
  aiGeneration: AIGenerationAPI,
  system: SystemAPI,
  statistics: StatisticsAPI
};
