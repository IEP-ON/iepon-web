'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { 
  mockStudents, 
  mockIEPs, 
  mockEducationPlans, 
  getMockStudentsByTeacher,
  getMockIEPByStudentId,
  getMockEducationPlansByStudentId
} from '@/lib/mockData';
import { IEP, EducationPlan, Student, Goal } from '@/lib/types';
import { 
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Edit,
  Download,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Users,
  Award,
  X
} from 'lucide-react';

export default function EducationPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [ieps, setIEPs] = useState<IEP[]>([]);
  const [educationPlans, setEducationPlans] = useState<EducationPlan[]>([]);
  const [selectedIEP, setSelectedIEP] = useState<IEP | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<EducationPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 현재 교사의 학생들과 관련 계획들 로드
      const teacherStudents = getMockStudentsByTeacher('teacher-001');
      setStudents(teacherStudents);
      setIEPs(mockIEPs);
      setEducationPlans(mockEducationPlans);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getStatusBadge = (status: IEP['status'] | EducationPlan['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      finalized: 'bg-blue-100 text-blue-800 border-blue-200',
      distributed: 'bg-green-100 text-green-800 border-green-200'
    };

    const labels = {
      draft: '작성중',
      finalized: '확정됨',
      distributed: '배포됨'
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getGoalStatusBadge = (status: Goal['status']) => {
    const styles = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      not_started: '시작 전',
      in_progress: '진행중',
      completed: '완료',
      paused: '일시정지'
    };

    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Layout user={user}>
      <div className="container fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* 페이지 헤더 */}
        <div className="flex-between slide-up" style={{ marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 className="text-heading-1" style={{ marginBottom: 'var(--space-2)' }}>교육 계획 관리</h1>
            <p className="text-body" style={{ color: 'var(--color-neutral-600)' }}>
              학생별 개별화 교육 계획을 작성하고 관리하세요
            </p>
          </div>
          <button className="btn btn-primary btn-lg scale-in">
            <Plus className="w-5 h-5" />
            <span>새 계획 작성</span>
          </button>
        </div>

        {/* 통계 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div className="card card-interactive scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <p className="text-body-sm" style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>담당 학생</p>
                  <p className="text-heading-2" style={{ color: 'var(--color-neutral-900)' }}>{students.length}</p>
                </div>
                <div className="flex-center" style={{ 
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: 'var(--color-primary-100)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <p className="text-body-sm" style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>IEP 계획</p>
                  <p className="text-heading-2" style={{ color: 'var(--color-neutral-900)' }}>{ieps.length}</p>
                </div>
                <div className="flex-center" style={{ 
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: 'var(--color-success-100)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <FileText className="w-6 h-6" style={{ color: 'var(--color-success-600)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <p className="text-body-sm" style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>교육 계획</p>
                  <p className="text-heading-2" style={{ color: 'var(--color-neutral-900)' }}>{educationPlans.length}</p>
                </div>
                <div className="flex-center" style={{ 
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#f3e8ff',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Calendar className="w-6 h-6" style={{ color: '#9333ea' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <p className="text-body-sm" style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>활성 목표</p>
                  <p className="text-heading-2" style={{ color: 'var(--color-neutral-900)' }}>
                    {ieps.reduce((acc, iep) => 
                      acc + iep.annualGoals.filter(goal => goal.status === 'in_progress').length, 0
                    )}
                  </p>
                </div>
                <div className="flex-center" style={{ 
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: 'var(--color-warning-100)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Target className="w-6 h-6" style={{ color: 'var(--color-warning-600)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-body">
              <div className="flex-between">
                <div>
                  <p className="text-body-sm" style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>완료율</p>
                  <p className="text-heading-2" style={{ color: 'var(--color-neutral-900)' }}>
                    {ieps.length > 0 ? Math.round(
                      ieps.reduce((acc, iep) => {
                        const totalGoals = iep.annualGoals.length + iep.shortTermGoals.length;
                        const completedGoals = [...iep.annualGoals, ...iep.shortTermGoals]
                          .filter(goal => goal.status === 'completed').length;
                        return acc + (totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0);
                      }, 0) / ieps.length
                    ) : 0}%
                  </p>
                </div>
                <div className="flex-center" style={{ 
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#d1fae5',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Award className="w-6 h-6" style={{ color: '#059669' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IEP 목록 */}
        <div className="grid-cols-2" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="card-header">
              <h2 className="text-heading-3">개별화교육계획 (IEP)</h2>
              <p className="text-body-sm" style={{ color: 'var(--color-neutral-600)' }}>학생별 연간 교육 목표 및 계획</p>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="flex-center" style={{ padding: 'var(--space-8) 0' }}>
                  <div style={{ 
                    width: '1.5rem',
                    height: '1.5rem',
                    border: '2px solid var(--color-neutral-200)',
                    borderTop: '2px solid var(--color-primary-500)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: 'var(--space-3)'
                  }}></div>
                  <span style={{ color: 'var(--color-neutral-600)' }}>로딩중...</span>
                </div>
              ) : ieps.length === 0 ? (
                <div className="text-center" style={{ padding: 'var(--space-8) 0' }}>
                  <FileText className="w-12 h-12" style={{ color: 'var(--color-neutral-400)', margin: '0 auto var(--space-4)' }} />
                  <p style={{ color: 'var(--color-neutral-600)' }}>등록된 IEP가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ieps.map((iep) => {
                    const student = students.find(s => s.id === iep.studentId);
                    const totalGoals = iep.annualGoals.length + iep.shortTermGoals.length;
                    const progressGoals = [...iep.annualGoals, ...iep.shortTermGoals].filter(goal => goal.status === 'in_progress');
                    const avgProgress = totalGoals > 0 ? 
                      [...iep.annualGoals, ...iep.shortTermGoals].reduce((acc, goal) => acc + goal.progress, 0) / totalGoals : 0;

                    return (
                      <div key={iep.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{student?.name || '알 수 없음'}</h3>
                            <p className="text-sm text-gray-600">{iep.academicYear} {iep.semester}</p>
                          </div>
                          {getStatusBadge(iep.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">연간 목표</p>
                            <p className="text-sm font-medium">{iep.annualGoals.length}개</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">단기 목표</p>
                            <p className="text-sm font-medium">{iep.shortTermGoals.length}개</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">전체 진도</span>
                            <span className="text-xs font-medium">{Math.round(avgProgress)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full transition-all"
                              style={{ width: `${avgProgress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedIEP(iep)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 교육 계획 목록 */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-heading-3">교육 계획</h2>
              <p className="text-body-small text-gray-600">월간/주간 세부 교육 계획</p>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-spinner w-6 h-6 mr-3"></div>
                  <span className="text-gray-600">로딩중...</span>
                </div>
              ) : educationPlans.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">등록된 교육 계획이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {educationPlans.map((plan) => {
                    const student = students.find(s => s.id === plan.studentId);
                    
                    return (
                      <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{student?.name || '알 수 없음'}</h3>
                            <p className="text-sm text-gray-600">{plan.title}</p>
                          </div>
                          {getStatusBadge(plan.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">유형</p>
                            <p className="text-sm font-medium">{plan.type === 'monthly' ? '월간' : '주간'} 계획</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">기간</p>
                            <p className="text-sm font-medium">
                              {new Date(plan.period.startDate).toLocaleDateString('ko-KR', {month: 'short', day: 'numeric'})} ~ 
                              {new Date(plan.period.endDate).toLocaleDateString('ko-KR', {month: 'short', day: 'numeric'})}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-blue-600 font-medium">{plan.subjects.length}</p>
                            <p className="text-gray-600">과목</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-green-600 font-medium">{plan.activities.length}</p>
                            <p className="text-gray-600">활동</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-purple-600 font-medium">{plan.assessments.length}</p>
                            <p className="text-gray-600">평가</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card">
            <div className="card-body text-center">
              <Plus className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">IEP 작성</h3>
              <p className="text-sm text-gray-600 mb-4">새로운 개별화교육계획을 작성하세요</p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/education/create'}>
                작성하기
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">월별 평가</h3>
              <p className="text-sm text-gray-600 mb-4">개별화 기반 수행평가를 실시하세요</p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/education/evaluation'}>
                평가하기
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">현행수준</h3>
              <p className="text-sm text-gray-600 mb-4">학생의 현재 능력 수준을 평가하세요</p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/education/assessment'}>
                평가하기
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">진도 분석</h3>
              <p className="text-sm text-gray-600 mb-4">학생별 진도를 분석하고 리포트를 생성하세요</p>
              <Button variant="outline" className="w-full">
                분석하기
              </Button>
            </div>
          </div>
        </div>

        {/* IEP 상세 모달 */}
        {selectedIEP && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">개별화교육계획 (IEP) 상세</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {students.find(s => s.id === selectedIEP.studentId)?.name || '알 수 없음'} - {selectedIEP.academicYear} {selectedIEP.semester}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIEP(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">현재 수준</label>
                      <div className="mt-1 text-gray-900 space-y-1">
                        <p><span className="font-medium">인지:</span> {selectedIEP.currentLevel.cognitive}</p>
                        <p><span className="font-medium">언어:</span> {selectedIEP.currentLevel.language}</p>
                        <p><span className="font-medium">사회성:</span> {selectedIEP.currentLevel.social}</p>
                        <p><span className="font-medium">운동:</span> {selectedIEP.currentLevel.motor}</p>
                        <p><span className="font-medium">자조:</span> {selectedIEP.currentLevel.selfCare}</p>
                        <p><span className="font-medium">학습:</span> {selectedIEP.currentLevel.academic}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">상태</label>
                      <div className="mt-1">{getStatusBadge(selectedIEP.status)}</div>
                    </div>
                  </div>
                </div>

                {/* 연간 목표 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">연간 목표</h3>
                  <div className="space-y-4">
                    {selectedIEP.annualGoals.map((goal, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{goal.domain} - {goal.measurableObjective}</h4>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            <p className="text-xs text-gray-500 mt-1">목표 기간: {goal.timeframe}</p>
                            <p className="text-xs text-gray-500">평가 기준: {goal.criteria}</p>
                          </div>
                          <div className="ml-4">
                            {getGoalStatusBadge(goal.status)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">진도: {goal.progress}%</span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 단기 목표 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">단기 목표</h3>
                  <div className="space-y-4">
                    {selectedIEP.shortTermGoals.map((goal, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{goal.domain} - {goal.measurableObjective}</h4>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            <p className="text-xs text-gray-500 mt-1">목표 기간: {goal.timeframe}</p>
                            <p className="text-xs text-gray-500">평가 기준: {goal.criteria}</p>
                          </div>
                          <div className="ml-4">
                            {getGoalStatusBadge(goal.status)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">진도: {goal.progress}%</span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 교육 서비스 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">교육 서비스</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIEP.educationServices.map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{service.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{service.provider}</p>
                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                          <div className="flex justify-between">
                            <span>빈도: {service.frequency}</span>
                            <span>시간: {service.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>장소: {service.location}</span>
                            <span>기간: {new Date(service.startDate).toLocaleDateString('ko-KR')} ~ {new Date(service.endDate).toLocaleDateString('ko-KR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button variant="outline" onClick={() => setSelectedIEP(null)}>
                  닫기
                </Button>
                <Button variant="primary">
                  수정
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 교육 계획 상세 모달 */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">교육 계획 상세</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {students.find(s => s.id === selectedPlan.studentId)?.name || '알 수 없음'} - {selectedPlan.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">계획 유형</label>
                      <p className="mt-1 text-gray-900">{selectedPlan.type === 'monthly' ? '월간 계획' : '주간 계획'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">기간</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedPlan.period.startDate).toLocaleDateString('ko-KR')} ~ 
                        {new Date(selectedPlan.period.endDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">제목</label>
                      <p className="mt-1 text-gray-900">{selectedPlan.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">상태</label>
                      <div className="mt-1">{getStatusBadge(selectedPlan.status)}</div>
                    </div>
                  </div>
                </div>

                {/* 과목별 내용 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">과목별 내용</h3>
                  <div className="space-y-4">
                    {selectedPlan.subjects.map((subject, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{subject.subject}</h4>
                        <p className="text-sm text-gray-600 mb-2">{subject.content}</p>
                        <div className="text-xs text-gray-500">
                          목표: {subject.objectives} | 방법: {subject.methods.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 활동 계획 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">활동 계획</h3>
                  <div className="space-y-4">
                    {selectedPlan.activities.map((activity, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{activity.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="text-xs text-gray-500">
                          일시: {new Date(activity.date).toLocaleDateString('ko-KR')} | 
                          소요시간: {activity.duration}분
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 평가 계획 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">평가 계획</h3>
                  <div className="space-y-4">
                    {selectedPlan.assessments.map((assessment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{assessment.type}</h4>
                        <p className="text-sm text-gray-600 mb-2">{assessment.comments}</p>
                        <div className="text-xs text-gray-500">
                          평가일: {new Date(assessment.date).toLocaleDateString('ko-KR')} | 
                          방법: {assessment.method}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                  닫기
                </Button>
                <Button variant="primary">
                  수정
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
