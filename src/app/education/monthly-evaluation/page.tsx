'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ClipboardCheck, Plus, FileText, Search, Star, TrendingUp, BarChart } from 'lucide-react';

interface MonthlyEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  subject: string;
  planId: string;
  planTitle: string;
  evaluationItems: {
    goal: string;
    achievement: 'exceeded' | 'achieved' | 'partially' | 'not_achieved';
    score: number;
    evidence: string;
    nextSteps: string;
  }[];
  overallAssessment: string;
  improvements: string[];
  challenges: string[];
  recommendations: string[];
  status: 'draft' | 'completed' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

const mockEvaluations: MonthlyEvaluation[] = [
  {
    id: '1',
    studentId: 'student-1',
    studentName: '김민수',
    month: '3월',
    year: 2024,
    subject: '국어',
    planId: 'plan-1',
    planTitle: '기초 문해력 향상 계획',
    evaluationItems: [
      {
        goal: '기본 한글 읽기',
        achievement: 'achieved',
        score: 85,
        evidence: '단어 읽기 85% 정확도, 문장 읽기 가능',
        nextSteps: '긴 문장 읽기 연습 필요'
      },
      {
        goal: '간단한 문장 쓰기',
        achievement: 'partially',
        score: 70,
        evidence: '5어절 문장까지 작성 가능',
        nextSteps: '맞춤법 교정 필요'
      }
    ],
    overallAssessment: '계획된 목표 대부분 달성, 지속적인 발전 확인',
    improvements: ['읽기 속도 향상', '어휘력 증가', '자신감 향상'],
    challenges: ['긴 문장 이해 어려움', '맞춤법 오류'],
    recommendations: ['독서 시간 확대', '맞춤법 집중 교육'],
    status: 'completed',
    createdAt: '2024-03-25',
    updatedAt: '2024-03-30'
  }
];

export default function MonthlyEvaluationPage() {
  const [evaluations, setEvaluations] = useState<MonthlyEvaluation[]>(mockEvaluations);
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

  const filteredEvaluations = evaluations.filter(evaluation => {
    return (
      (!selectedMonth || evaluation.month === selectedMonth) &&
      (!selectedSubject || evaluation.subject === selectedSubject) &&
      (!selectedStatus || evaluation.status === selectedStatus) &&
      (!searchTerm || evaluation.studentName.includes(searchTerm) || evaluation.planTitle.includes(searchTerm))
    );
  });

  const getAchievementColor = (achievement: string) => {
    switch (achievement) {
      case 'exceeded': return 'bg-green-100 text-green-800';
      case 'achieved': return 'bg-blue-100 text-blue-800';
      case 'partially': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getAchievementText = (achievement: string) => {
    switch (achievement) {
      case 'exceeded': return '초과달성';
      case 'achieved': return '달성';
      case 'partially': return '부분달성';
      default: return '미달성';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'reviewed': return '검토됨';
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">월별 교육평가 작성</h1>
                <p className="text-gray-600">월간 교육계획 실행 결과를 평가하고 분석합니다</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  새 평가 작성
                </button>
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI 교육평가 생성
                </button>
              </div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">과목</label>
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
                  <option value="draft">작성중</option>
                  <option value="completed">완료</option>
                  <option value="reviewed">검토됨</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="학생명 또는 계획명"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedMonth('');
                    setSelectedSubject('');
                    setSelectedStatus('');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <ClipboardCheck className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{evaluations.length}</p>
                  <p className="text-gray-600">총 평가</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {evaluations.filter(e => e.status === 'completed').length}
                  </p>
                  <p className="text-gray-600">완료된 평가</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round(evaluations.reduce((acc, e) => 
                      acc + e.evaluationItems.reduce((sum, item) => sum + item.score, 0) / e.evaluationItems.length, 0
                    ) / evaluations.length) || 0}
                  </p>
                  <p className="text-gray-600">평균 점수</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {evaluations.filter(e => e.status === 'reviewed').length}
                  </p>
                  <p className="text-gray-600">검토 완료</p>
                </div>
              </div>
            </div>
          </div>

          {/* 평가 목록 */}
          <div className="space-y-6">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{evaluation.planTitle}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span className="mr-4">{evaluation.studentName}</span>
                        <span className="mr-4">{evaluation.year}년 {evaluation.month}</span>
                        <span className="mr-4">{evaluation.subject}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(evaluation.status)}`}>
                          {getStatusText(evaluation.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        편집
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        상세보기
                      </button>
                    </div>
                  </div>

                  {/* 목표별 평가 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">목표별 성취도</h4>
                    <div className="space-y-3">
                      {evaluation.evaluationItems.map((item, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{item.goal}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900">{item.score}점</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAchievementColor(item.achievement)}`}>
                                {getAchievementText(item.achievement)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">근거:</span> {item.evidence}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">다음단계:</span> {item.nextSteps}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 종합 평가 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">개선사항</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {evaluation.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">도전과제</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {evaluation.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 권장사항 */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">권장사항</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {evaluation.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 종합 평가 */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">종합 평가</h4>
                    <p className="text-sm text-gray-600">{evaluation.overallAssessment}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEvaluations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">평가가 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">새로운 월별 평가를 작성해보세요.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    평가 작성하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 새 평가 작성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">새 월별 교육평가 작성</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">평가 월</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연결된 계획</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">계획 선택</option>
                      <option value="plan-1">기초 수개념 익히기</option>
                      <option value="plan-2">기본 의사소통 향상</option>
                      <option value="plan-3">자립생활 기술 습득</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육 목표별 평가</label>
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                    {[1, 2, 3].map((item, index) => (
                      <div key={item} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-3">목표 {item}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">목표 내용</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="평가할 목표를 입력하세요"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">달성도</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="exceeded">초과달성</option>
                              <option value="achieved">달성</option>
                              <option value="partially">부분달성</option>
                              <option value="not_achieved">미달성</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">점수 (0-100)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="점수"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">근거 자료</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="평가 근거"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">다음 단계</label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="다음에 필요한 학습 단계나 개선사항"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전반적 평가</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="학생의 전반적인 학습 상황과 발전사항을 기록하세요"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">개선사항</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="향상된 부분들을 기록하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">어려움/도전과제</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="어려웠던 부분이나 앞으로의 도전과제"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">권장사항</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="추후 교육 방향이나 권장사항을 입력하세요"
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
                    평가 저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI 교육평가 생성 모달 */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI 월별 교육평가 생성</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">평가 대상 월</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연결된 교육계획</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">계획 선택</option>
                    <option value="plan-1">3월 - 기초 수개념 익히기</option>
                    <option value="plan-2">3월 - 기본 의사소통 향상</option>
                    <option value="plan-3">4월 - 자립생활 기술 습득</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">관찰된 학습 성과</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="이번 달 학생이 보인 학습 성과나 발전사항을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">어려웠던 영역</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="학생이 어려워했던 영역이나 개선이 필요한 부분을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평가 중점사항</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['목표 달성도', '학습 태도', '참여도', '이해도', '적응력', '협력성'].map(item => (
                      <label key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
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
                    AI로 평가 생성하기
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
