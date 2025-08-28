'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { BookOpen, Plus, FileText, Search, Calendar, Download, Eye } from 'lucide-react';

interface SemesterPlan {
  id: string;
  studentId: string;
  studentName: string;
  semester: '1학기' | '2학기';
  year: number;
  subject: string;
  title: string;
  overallGoals: string[];
  monthlyBreakdown: {
    month: string;
    goals: string[];
    activities: string[];
  }[];
  evaluationCriteria: string[];
  requiredResources: string[];
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const mockSemesterPlans: SemesterPlan[] = [
  {
    id: '1',
    studentId: 'student-1',
    studentName: '김민수',
    semester: '1학기',
    year: 2024,
    subject: '국어',
    title: '1학기 종합 언어능력 향상 계획',
    overallGoals: ['기초 문해력 완성', '의사소통 능력 향상', '창의적 표현력 개발'],
    monthlyBreakdown: [
      {
        month: '3월',
        goals: ['한글 완전 습득'],
        activities: ['한글 카드 게임', '받아쓰기']
      },
      {
        month: '4월',
        goals: ['단어 확장'],
        activities: ['어휘 학습', '단어 만들기']
      },
      {
        month: '5월',
        goals: ['문장 구성'],
        activities: ['문장 완성', '일기 쓰기']
      }
    ],
    evaluationCriteria: ['읽기 유창성', '쓰기 정확성', '말하기 자신감'],
    requiredResources: ['한글 교구', '동화책', '쓰기 도구'],
    status: 'approved',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-28'
  },
  {
    id: '2',
    studentId: 'student-2',
    studentName: '이소영',
    semester: '1학기',
    year: 2024,
    subject: '수학',
    title: '1학기 기초 수학 개념 정립',
    overallGoals: ['수 개념 이해', '기본 연산 능력', '문제해결 사고력'],
    monthlyBreakdown: [
      {
        month: '3월',
        goals: ['1-20 수 개념'],
        activities: ['수 세기', '수 카드']
      },
      {
        month: '4월',
        goals: ['덧셈 개념'],
        activities: ['구체물 덧셈', '덧셈 게임']
      },
      {
        month: '5월',
        goals: ['뺄셈 개념'],
        activities: ['구체물 뺄셈', '뺄셈 놀이']
      }
    ],
    evaluationCriteria: ['수 개념 이해도', '연산 정확성', '문제해결 능력'],
    requiredResources: ['수 교구', '계산기', '워크북'],
    status: 'in_progress',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-01'
  }
];

export default function SemesterEducationPage() {
  const [plans, setPlans] = useState<SemesterPlan[]>(mockSemesterPlans);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const subjects = ['국어', '수학', '사회', '과학', '예체능', '생활기능'];
  const statuses = [
    { value: 'draft', label: '작성중' },
    { value: 'approved', label: '승인됨' },
    { value: 'in_progress', label: '진행중' },
    { value: 'completed', label: '완료됨' }
  ];

  const filteredPlans = plans.filter(plan => {
    return (
      (!selectedSemester || plan.semester === selectedSemester) &&
      (!selectedSubject || plan.subject === selectedSubject) &&
      (!selectedStatus || plan.status === selectedStatus) &&
      (!searchTerm || plan.studentName.includes(searchTerm) || plan.title.includes(searchTerm))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    return statuses.find(s => s.value === status)?.label || status;
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">학기별 교육계획 수립</h1>
                <p className="text-gray-600">학생별 학기 단위 종합 교육계획을 작성하고 관리합니다</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 학기계획 작성
                </button>
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI IEP 생성
                </button>
              </div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학기 선택</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 학기</option>
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 과목</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 상태</option>
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학생/제목 검색</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="학생명 또는 계획명 검색"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedSemester('');
                    setSelectedSubject('');
                    setSelectedStatus('');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{plans.length}</p>
                  <p className="text-gray-600">총 학기계획</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {plans.filter(p => p.status === 'approved').length}
                  </p>
                  <p className="text-gray-600">승인된 계획</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {plans.filter(p => p.status === 'in_progress').length}
                  </p>
                  <p className="text-gray-600">진행중인 계획</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {plans.filter(p => p.status === 'completed').length}
                  </p>
                  <p className="text-gray-600">완료된 계획</p>
                </div>
              </div>
            </div>
          </div>

          {/* 학기계획 목록 */}
          <div className="space-y-6">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span className="mr-4">{plan.studentName}</span>
                        <span className="mr-4">{plan.year}년 {plan.semester}</span>
                        <span className="mr-4">{plan.subject}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                          {getStatusText(plan.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 학기 목표 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">학기 목표</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.overallGoals.map((goal, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 월별 세부계획 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">월별 세부계획</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plan.monthlyBreakdown.map((month, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <h5 className="font-medium text-gray-900 mb-1">{month.month}</h5>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">목표:</span> {month.goals.join(', ')}</p>
                            <p><span className="font-medium">활동:</span> {month.activities.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 평가기준 및 필요자원 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">평가 기준</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plan.evaluationCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">필요 자원</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plan.requiredResources.map((resource, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      편집
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPlans.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">학기계획이 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">새로운 학기별 교육계획을 작성해보세요.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    학기계획 작성하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 새 학기계획 작성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">새 학기별 교육계획 작성</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학생명</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">학생 선택</option>
                      <option value="김민수">김민수</option>
                      <option value="이소영">이소영</option>
                      <option value="박준호">박준호</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학기</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="1학기">1학기</option>
                      <option value="2학기">2학기</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">과목</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">계획 제목</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="학기별 교육계획 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학기 전체 목표</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="학기 전체 목표를 줄바꿈으로 구분하여 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">월별 세부 계획</label>
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                    {['3월', '4월', '5월', '6월', '7월'].map((month, index) => (
                      <div key={month} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-2">{month}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">목표</label>
                            <textarea
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`${month} 목표`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">활동</label>
                            <textarea
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`${month} 활동`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평가 기준</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="평가 기준을 줄바꿈으로 구분하여 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">필요 자원</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="교구, 교재 등 필요한 자원을 입력하세요"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    계획 저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI IEP 생성 모달 */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI 개별화 교육계획(IEP) 생성</h3>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학생 선택</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">학생 선택</option>
                      <option value="김민수">김민수</option>
                      <option value="이소영">이소영</option>
                      <option value="박준호">박준호</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대상 학기</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="1학기">1학기</option>
                      <option value="2학기">2학기</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">장애 유형 및 특성</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="학생의 장애 유형, 현재 수준, 특성 등을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">우선 교육 영역</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['인지능력', '의사소통', '사회적응', '자립기능', '감각운동', '직업기초'].map(area => (
                      <label key={area} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 목표 우선순위</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="학생에게 가장 중요한 교육 목표들을 우선순위대로 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">지원 요구사항</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="보조 기구, 교사 지원, 환경 조정 등 필요한 지원사항"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAIModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI로 IEP 생성하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
