import { NextRequest, NextResponse } from 'next/server';
import { CurriculumItem, CurriculumStats, ApiResponse } from '@/lib/types/curriculum';

// 모의 데이터
const mockCurriculums: CurriculumItem[] = [
  {
    id: '1',
    title: '2024 개정 특수교육 교육과정 - 국어',
    grade: 1,
    subject: '국어',
    category: '국가교육과정',
    description: '2024년 개정된 특수교육 국어과 교육과정 지침서',
    uploadedAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    status: 'active',
    downloadCount: 45,
    userId: 'admin-1'
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
  },
  {
    id: '4',
    title: '통합교육 과학 실험 가이드',
    grade: 4,
    subject: '과학',
    category: '학교교육과정',
    description: '통합학급에서 활용 가능한 과학 실험 가이드',
    uploadedAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    status: 'archived',
    downloadCount: 67,
    userId: 'admin-1'
  },
  {
    id: '5',
    title: '특수교육 체육 프로그램',
    grade: 1,
    subject: '체육',
    category: '국가교육과정',
    description: '특수교육 대상 학생을 위한 체육 프로그램',
    uploadedAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    status: 'active',
    downloadCount: 23,
    userId: 'admin-2'
  }
];

// GET: 교육과정 통계 조회
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 통계 계산
    const totalCount = mockCurriculums.length;
    const activeCount = mockCurriculums.filter(c => c.status === 'active').length;
    const pendingCount = mockCurriculums.filter(c => c.status === 'pending').length;
    const archivedCount = mockCurriculums.filter(c => c.status === 'archived').length;
    const totalDownloads = mockCurriculums.reduce((sum, c) => sum + c.downloadCount, 0);
    
    // 최근 7일 업로드 수 계산
    const recentUploads = mockCurriculums.filter(c => {
      const uploadDate = new Date(c.uploadedAt);
      return uploadDate >= sevenDaysAgo;
    }).length;

    const stats: CurriculumStats = {
      totalCount,
      activeCount,
      pendingCount,
      archivedCount,
      totalDownloads,
      recentUploads
    };

    // 카테고리별 통계
    const categoryStats = {
      국가교육과정: mockCurriculums.filter(c => c.category === '국가교육과정').length,
      지역교육과정: mockCurriculums.filter(c => c.category === '지역교육과정').length,
      학교교육과정: mockCurriculums.filter(c => c.category === '학교교육과정').length
    };

    // 과목별 통계
    const subjectStats = mockCurriculums.reduce((acc, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 학년별 통계
    const gradeStats = mockCurriculums.reduce((acc, curr) => {
      const grade = `${curr.grade}학년`;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 최근 다운로드 순위 (상위 5개)
    const topDownloaded = [...mockCurriculums]
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        downloadCount: c.downloadCount,
        category: c.category,
        subject: c.subject
      }));

    const response: ApiResponse<{
      overview: CurriculumStats;
      categoryStats: Record<string, number>;
      subjectStats: Record<string, number>;
      gradeStats: Record<string, number>;
      topDownloaded: Array<{
        id: string;
        title: string;
        downloadCount: number;
        category: string;
        subject: string;
      }>;
    }> = {
      success: true,
      message: '교육과정 통계를 성공적으로 조회했습니다.',
      data: {
        overview: stats,
        categoryStats,
        subjectStats,
        gradeStats,
        topDownloaded
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: '교육과정 통계 조회 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 500 });
  }
}
