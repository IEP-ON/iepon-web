'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Calendar, Plus, FileText, Search, Filter, Download } from 'lucide-react';

interface MonthlyPlan {
  id: string;
  studentName: string;
  month: string;
  subject: string;
  planTitle: string;
  goals: string[];
  activities: string[];
  evaluationMethods: string[];
  status: 'draft' | 'approved' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const mockMonthlyPlans: MonthlyPlan[] = [
  {
    id: '1',
    studentName: '김민수',
    month: '3월',
    subject: '수학',
    planTitle: '기초 수개념 익히기',
    goals: ['1-10 수 세기', '기본 덧셈 이해'],
    activities: ['구체물 활용 수 세기', '수 카드 게임', '일상생활 수학'],
    evaluationMethods: ['개별 평가', '관찰 평가', '포트폴리오'],
    status: 'approved',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05'
  },
  {
    id: '2',
    studentName: '이소영',
    month: '3월',
    subject: '국어',
    planTitle: '기본 의사소통 향상',
    goals: ['기본 인사말 표현', '간단한 요청하기'],
    activities: ['역할놀이', '그림카드 활용', '일상대화 연습'],
    evaluationMethods: ['구술 평가', '상호작용 관찰'],
    status: 'completed',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15'
  },
  {
    id: '3',
    studentName: '박준호',
    month: '4월',
    subject: '생활기능',
    planTitle: '자립생활 기술 습득',
    goals: ['스스로 옷 입기', '개인위생 관리'],
    activities: ['단계별 연습', '시각적 안내', '반복 훈련'],
    evaluationMethods: ['체크리스트', '실습 평가'],
    status: 'draft',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-22'
  }
];

export default function MonthlyEducationPage() {
  const [plans, setPlans] = useState<MonthlyPlan[]>(mockMonthlyPlans);
  const [selectedMonth, setSelectedMonth] = useState('');
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

  const months = ['3월', '4월', '5월', '6월', '7월', '9월', '10월', '11월', '12월'];
  const subjects = ['국어', '수학', '사회', '과학', '예체능', '생활기능'];

  const filteredPlans = plans.filter(plan => {
    return (
      (!selectedMonth || plan.month === selectedMonth) &&
      (!selectedSubject || plan.subject === selectedSubject) &&
      (!searchTerm || plan.studentName.includes(searchTerm) || plan.planTitle.includes(searchTerm))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '승인됨';
      case 'completed': return '완료됨';
      default: return '작성중';
    }
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">월별 교육계획 수립</h1>
                <p className="text-gray-600">학생별 월간 교육계획을 작성하고 관리합니다</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 월별계획 작성
                </button>
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI 교육계획 생성
                </button>
              </div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">월 선택</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 월</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
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
                    setSelectedMonth('');
                    setSelectedSubject('');
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
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{plans.length}</p>
                  <p className="text-gray-600">총 계획 수</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
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
                <FileText className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {plans.filter(p => p.status === 'draft').length}
                  </p>
                  <p className="text-gray-600">작성중인 계획</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {plans.filter(p => p.status === 'completed').length}
                  </p>
                  <p className="text-gray-600">완료된 계획</p>
                </div>
              </div>
            </div>
          </div>

          {/* 계획 목록 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">월별 교육계획 목록</h2>
            </div>
            
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      학생명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      월/과목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      계획 제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      목표 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.studentName}</div>
                        <div className="text-sm text-gray-500">2024년</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plan.month}</div>
                        <div className="text-sm text-gray-500">{plan.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{plan.planTitle}</div>
                        <div className="text-sm text-gray-500">
                          {plan.activities.length}개 활동
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.goals.length}개
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                          {getStatusText(plan.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            편집
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredPlans.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">계획이 없습니다</h3>
                  <p className="mt-1 text-sm text-gray-500">새로운 월별 교육계획을 작성해보세요.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      계획 작성하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 새 계획 작성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">새 월별 교육계획 작성</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">학생명</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">학생 선택</option>
                      <option value="김민수">김민수</option>
                      <option value="이소영">이소영</option>
                      <option value="박준호">박준호</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">월</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">과목</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">계획 제목</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="계획 제목을 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 목표</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="교육 목표를 줄바꿈으로 구분하여 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 활동</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="교육 활동을 줄바꿈으로 구분하여 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평가 방법</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="평가 방법을 줄바꿈으로 구분하여 입력하세요"
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

        {/* AI 교육계획 생성 모달 */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI 월별 교육계획 생성</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">대상 월</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">중점 교육 과목</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 중점사항</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="학생의 특성이나 중점적으로 교육하고 싶은 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학습 수준</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">수준 선택</option>
                    <option value="기초">기초 수준</option>
                    <option value="보통">보통 수준</option>
                    <option value="심화">심화 수준</option>
                  </select>
                </div>

                {/* 교사 개별화 설정 섹션 */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h4 className="text-sm font-medium text-gray-700">AI 생성 개별화 설정</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">문체 스타일</label>
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="professional">전문적</option>
                        <option value="formal">격식체</option>
                        <option value="friendly">친근한</option>
                        <option value="casual">캐주얼</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">어조</label>
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="encouraging">격려하는</option>
                        <option value="supportive">지지적인</option>
                        <option value="polite">정중한</option>
                        <option value="directive">지시적인</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">AI 강도</label>
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="medium">보통 (50%)</option>
                        <option value="high">높음 (80%)</option>
                        <option value="low">낮음 (20%)</option>
                        <option value="none">사용 안함</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">상세도</label>
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="moderate">보통</option>
                        <option value="detailed">상세한</option>
                        <option value="brief">간략한</option>
                        <option value="comprehensive">포괄적</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">추가 지침</label>
                    <textarea
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="AI 생성 시 특별히 고려할 사항을 입력하세요..."
                    />
                  </div>

                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    이 설정은 개별화 설정에서 변경할 수 있습니다
                  </div>
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
                    AI로 생성하기
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
