import { NextRequest, NextResponse } from 'next/server';
import { CurriculumItem, ApiResponse } from '@/lib/types/curriculum';

// 모의 데이터 (실제로는 데이터베이스에서 가져옴)
const mockCurriculums: CurriculumItem[] = [
  {
    id: '1',
    title: '2024 개정 특수교육 교육과정 - 국어',
    grade: 1,
    subject: '국어',
    category: '국가교육과정',
    description: '2024년 개정된 특수교육 국어과 교육과정 지침서',
    fileName: '2024_특수교육_국어_교육과정.pdf',
    filePath: '/uploads/curriculum/2024_특수교육_국어_교육과정.pdf',
    fileSize: 2048576,
    mimeType: 'application/pdf',
    uploadedAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    status: 'active',
    downloadCount: 45,
    userId: 'admin-1',
    approvedBy: 'super-admin-1',
    approvedAt: '2024-03-01T10:00:00Z',
    tags: ['국어', '기초', '읽기', '쓰기']
  },
  {
    id: '2',
    title: '서울시 특수교육 수학과 교육과정',
    grade: 2,
    subject: '수학',
    category: '지역교육과정',
    description: '서울시교육청 특수교육 수학과 지침',
    fileName: '서울시_특수교육_수학.xlsx',
    filePath: '/uploads/curriculum/서울시_특수교육_수학.xlsx',
    fileSize: 1024000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedAt: '2024-02-15T14:30:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    status: 'active',
    downloadCount: 32,
    userId: 'admin-2',
    approvedBy: 'super-admin-1',
    approvedAt: '2024-02-16T09:00:00Z',
    tags: ['수학', '연산', '도형']
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
    userId: 'admin-3',
    tags: ['사회', '지역사회', '생활']
  }
];

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: 특정 교육과정 조회
export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const curriculum = mockCurriculums.find(c => c.id === id);
    
    if (!curriculum) {
      const response: ApiResponse<null> = {
        success: false,
        message: '교육과정을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<CurriculumItem> = {
      success: true,
      message: '교육과정을 성공적으로 조회했습니다.',
      data: curriculum,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT: 교육과정 수정
export async function PUT(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const curriculumIndex = mockCurriculums.findIndex(c => c.id === id);
    
    if (curriculumIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        message: '교육과정을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 교육과정 업데이트
    const updatedCurriculum = {
      ...mockCurriculums[curriculumIndex],
      ...body,
      id, // ID는 변경 불가
      updatedAt: new Date().toISOString()
    };

    mockCurriculums[curriculumIndex] = updatedCurriculum;

    const response: ApiResponse<CurriculumItem> = {
      success: true,
      message: '교육과정이 성공적으로 수정되었습니다.',
      data: updatedCurriculum,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 수정 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE: 교육과정 삭제
export async function DELETE(
  request: NextRequest, 
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const curriculumIndex = mockCurriculums.findIndex(c => c.id === id);
    
    if (curriculumIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        message: '교육과정을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 교육과정 삭제
    const deletedCurriculum = mockCurriculums.splice(curriculumIndex, 1)[0];

    const response: ApiResponse<CurriculumItem> = {
      success: true,
      message: '교육과정이 성공적으로 삭제되었습니다.',
      data: deletedCurriculum,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 삭제 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}
