import { NextRequest, NextResponse } from 'next/server';
import { CurriculumItem, ApiResponse } from '@/lib/types/curriculum';

// 모의 데이터
const mockCurriculums: CurriculumItem[] = [
  {
    id: '1',
    title: '2024 개정 특수교육 교육과정 - 국어',
    grade: 1,
    subject: '국어',
    category: '국가교육과정',
    description: '2024년 개정된 특수교육 국어과 교육과정 지침서',
    fileName: '2024_특수교육_국어_교육과정.pdf',
    uploadedAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    status: 'active',
    downloadCount: 45,
    userId: 'admin-1',
    approvedBy: 'super-admin-1',
    approvedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    title: '서울시 특수교육 수학과 교육과정',
    grade: 2,
    subject: '수학',
    category: '지역교육과정',
    description: '서울시교육청 특수교육 수학과 지침',
    uploadedAt: '2024-02-15T14:30:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    status: 'active',
    downloadCount: 32,
    userId: 'admin-2'
  },
  {
    id: '3',
    title: '개별화교육 사회과 프로그램',
    grade: 3,
    subject: '사회',
    category: '학교교육과정',
    description: '개별화교육을 위한 사회과 교육 프로그램',
    uploadedAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-20T11:15:00Z',
    status: 'pending',
    downloadCount: 18,
    userId: 'admin-3'
  }
];

interface RouteParams {
  params: {
    id: string;
  };
}

// POST: 교육과정 상태 변경
export async function POST(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const { status, reason } = await request.json();
    
    // 유효성 검사
    if (!status || !['active', 'pending', 'archived'].includes(status)) {
      const response: ApiResponse<null> = {
        success: false,
        message: '올바른 상태값을 입력해주세요. (active, pending, archived)',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 400 });
    }

    const curriculumIndex = mockCurriculums.findIndex(c => c.id === id);
    
    if (curriculumIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        message: '교육과정을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 404 });
    }

    const currentCurriculum = mockCurriculums[curriculumIndex];
    
    // 상태 변경 로직
    const updatedCurriculum: CurriculumItem = {
      ...currentCurriculum,
      status: status as CurriculumItem['status'],
      updatedAt: new Date().toISOString()
    };

    // 승인 상태로 변경하는 경우
    if (status === 'active' && currentCurriculum.status === 'pending') {
      updatedCurriculum.approvedBy = 'super-admin-1'; // 실제로는 JWT에서 추출
      updatedCurriculum.approvedAt = new Date().toISOString();
    }

    mockCurriculums[curriculumIndex] = updatedCurriculum;

    const statusMessages = {
      active: '승인',
      pending: '대기',
      archived: '보관'
    };

    const response: ApiResponse<CurriculumItem> = {
      success: true,
      message: `교육과정이 ${statusMessages[status]} 상태로 변경되었습니다.`,
      data: updatedCurriculum,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 상태 변경 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}
