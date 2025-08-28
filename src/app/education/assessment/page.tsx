'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  User,
  Eye,
  Edit,
  Plus,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// 현행수준 평가 데이터 타입
interface CurrentLevelAssessment {
  id: string;
  studentId: string;
  studentName: string;
  semester: '1학기' | '2학기';
  academicYear: string;
  evaluationDate: string;
  
  // 언어 영역
  language: {
    receptive: string;    // 수용 언어 (200-500자)
    expressive: string;   // 표현 언어 (200-500자) 
    literacy: string;     // 문해 능력 (200-500자)
    communication: string; // 의사소통 방식
  };
  
  // 수리 영역
  math: {
    numberConcept: string;   // 수 개념
    calculation: string;     // 연산 능력
    problemSolving: string;  // 문제 해결
    realLifeApp: string;     // 실생활 적용
  };
  
  // 행동발달특성
  behavior: {
    social: string;      // 사회성
    emotional: string;   // 정서 발달
    behavioral: string;  // 행동 특성
    adaptive: string;    // 적응 행동
  };
  
  status: 'draft' | 'completed' | 'approved';
  lastModified: string;
}

// Mock 데이터
const mockAssessments: CurrentLevelAssessment[] = [
  {
    id: 'assess-1',
    studentId: 'student-1',
    studentName: '김민수',
    semester: '1학기',
    academicYear: '2024',
    evaluationDate: '2024-03-15',
    language: {
      receptive: '간단한 일상 지시어는 이해하나 복잡한 문장 구조는 어려워함. 시각적 단서가 있으면 이해도가 높아짐.',
      expressive: '단어 수준의 표현이 주를 이루며, 2-3어절 문장으로 의사 표현. 어휘력 부족으로 인한 의사소통 제한.',
      literacy: '한글 자모 인식은 가능하나 단어 읽기는 제한적. 쓰기는 이름과 간단한 단어 수준.',
      communication: '몸짓, 그림카드, 간단한 구어를 혼합하여 사용. AAC 도구 도입 필요.'
    },
    math: {
      numberConcept: '1-10까지 수 개념 형성됨. 구체물을 이용한 수세기 가능.',
      calculation: '한 자리 덧셈은 구체물 도움으로 가능. 뺄셈은 개념 형성 단계.',
      problemSolving: '일상생활 속 간단한 수학적 문제해결 가능. 단계별 안내 필요.',
      realLifeApp: '시계 보기, 돈 개념 등 실생활 수학 활용 제한적.'
    },
    behavior: {
      social: '또래와의 상호작용에 관심은 있으나 방법을 몰라 어려워함.',
      emotional: '감정 표현은 직접적이며 조절에 어려움. 좌절감 높을 때 문제행동 발생.',
      behavioral: '주의집중 시간 5-10분 정도. 구조화된 환경에서 안정적.',
      adaptive: '기본적 자조기능은 가능하나 복잡한 일상기능은 도움 필요.'
    },
    status: 'completed',
    lastModified: '2024-03-20T10:00:00Z'
  }
];

const AssessmentPage = () => {
  const [assessments, setAssessments] = useState<CurrentLevelAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<CurrentLevelAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr', 
    role: 'teacher' as const,
  };

  useEffect(() => {
    // Mock 데이터 로드
    setTimeout(() => {
      setAssessments(mockAssessments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: CurrentLevelAssessment['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      completed: '',
      approved: ''
    };
    
    const labels = {
      draft: '작성중',
      completed: '완료',
      approved: '승인됨'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStatusIcon = (status: CurrentLevelAssessment['status']) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
      case 'approved': return <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
    }
  };

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: 'var(--color-black)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">현행수준 평가</h1>
              <p className="text-gray-600">학생의 현재 발달수준을 체계적으로 평가합니다</p>
            </div>
          </div>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            새 평가 작성
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 평가</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
              <FileText className="w-8 h-8" style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">완료된 평가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'completed' || a.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">작성중인 평가</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'draft').length}
                </p>
              </div>
              <Clock className="w-8 h-8" style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">이번 학기</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.academicYear === '2024' && a.semester === '1학기').length}
                </p>
              </div>
              <Calendar className="w-8 h-8" style={{ color: 'var(--color-text-secondary)' }} />
            </div>
          </div>
        </div>

        {/* 평가 목록 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">현행수준 평가 목록</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">로딩중...</span>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">등록된 평가가 없습니다.</p>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(assessment.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {assessment.studentName}
                          </h3>
                          {getStatusBadge(assessment.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {assessment.academicYear} {assessment.semester} | 
                          평가일: {new Date(assessment.evaluationDate).toLocaleDateString('ko-KR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          최종 수정: {new Date(assessment.lastModified).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 상세 모달 */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">현행수준 평가 상세</h2>
                  <p className="text-sm text-gray-600">
                    {selectedAssessment.studentName} - {selectedAssessment.academicYear} {selectedAssessment.semester}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 언어 영역 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">언어 영역</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">수용 언어</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.language.receptive}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">표현 언어</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.language.expressive}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">문해 능력</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.language.literacy}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">의사소통 방식</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.language.communication}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 수리 영역 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">수리 영역</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">수 개념</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.math.numberConcept}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">연산 능력</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.math.calculation}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">문제 해결</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.math.problemSolving}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">실생활 적용</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.math.realLifeApp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 행동발달특성 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">행동발달특성</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">사회성</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.behavior.social}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">정서 발달</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.behavior.emotional}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">행동 특성</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.behavior.behavioral}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">적응 행동</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedAssessment.behavior.adaptive}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button variant="outline" onClick={() => setSelectedAssessment(null)}>
                  닫기
                </Button>
                <Button>
                  수정
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssessmentPage;
