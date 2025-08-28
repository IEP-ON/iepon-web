import { NextRequest, NextResponse } from 'next/server';
import { CurriculumItem, CurriculumFilter, CurriculumStats, ApiResponse, PaginatedResponse } from '@/lib/types/curriculum';

// 모의 교육과정 데이터
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
  },
  {
    id: '4',
    title: '통합교육 과학 실험 가이드',
    grade: 4,
    subject: '과학',
    category: '학교교육과정',
    description: '통합학급에서 활용 가능한 과학 실험 가이드',
    fileName: '통합교육_과학실험_가이드.docx',
    filePath: '/uploads/curriculum/통합교육_과학실험_가이드.docx',
    fileSize: 3145728,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    status: 'archived',
    downloadCount: 67,
    userId: 'admin-1',
    approvedBy: 'super-admin-1',
    approvedAt: '2024-01-11T08:30:00Z',
    tags: ['과학', '실험', '통합교육']
  }
];

// GET: 교육과정 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') as CurriculumFilter['category'];
    const grade = searchParams.get('grade') ? parseInt(searchParams.get('grade')!) : undefined;
    const subject = searchParams.get('subject') || undefined;
    const status = searchParams.get('status') as CurriculumFilter['status'];
    const searchQuery = searchParams.get('q') || '';

    // 필터링
    let filteredCurriculums = [...mockCurriculums];

    if (category) {
      filteredCurriculums = filteredCurriculums.filter(c => c.category === category);
    }

    if (grade) {
      filteredCurriculums = filteredCurriculums.filter(c => c.grade === grade);
    }

    if (subject) {
      filteredCurriculums = filteredCurriculums.filter(c => c.subject === subject);
    }

    if (status) {
      filteredCurriculums = filteredCurriculums.filter(c => c.status === status);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCurriculums = filteredCurriculums.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.tags && c.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // 페이지네이션
    const total = filteredCurriculums.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCurriculums = filteredCurriculums.slice(startIndex, endIndex);

    const response: PaginatedResponse<CurriculumItem> = {
      success: true,
      message: '교육과정 목록을 성공적으로 조회했습니다.',
      data: paginatedCurriculums,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 목록 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST: 새 교육과정 업로드
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const grade = parseInt(formData.get('grade') as string);
    const subject = formData.get('subject') as string;
    const category = formData.get('category') as CurriculumItem['category'];
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];

    // 유효성 검사
    if (!title || !grade || !subject || !category || !description) {
      const response: ApiResponse<null> = {
        success: false,
        message: '필수 입력 항목이 누락되었습니다.',
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 파일 업로드 시뮬레이션
    let fileName: string | undefined;
    let filePath: string | undefined;
    let fileSize: number | undefined;
    let mimeType: string | undefined;

    if (file) {
      fileName = file.name;
      filePath = `/uploads/curriculum/${file.name}`;
      fileSize = file.size;
      mimeType = file.type;
    }

    // 새 교육과정 생성
    const newCurriculum: CurriculumItem = {
      id: `curriculum-${Date.now()}`,
      title,
      grade,
      subject,
      category,
      description,
      fileName,
      filePath,
      fileSize,
      mimeType,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending', // 기본적으로 승인 대기 상태
      downloadCount: 0,
      userId: 'admin-1', // 실제로는 JWT에서 추출
      tags
    };

    // 모의 데이터에 추가
    mockCurriculums.unshift(newCurriculum);

    const response: ApiResponse<CurriculumItem> = {
      success: true,
      message: '교육과정이 성공적으로 업로드되었습니다.',
      data: newCurriculum,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 업로드 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}
