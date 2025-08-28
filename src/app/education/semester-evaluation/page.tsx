'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Award, Plus, FileText, Search, BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';

interface SemesterEvaluation {
  id: string;
  studentId: string;
  studentName: string;
  semester: '1학기' | '2학기';
  year: number;
  subject: string;
  planId: string;
  planTitle: string;
  overallGoalEvaluation: {
    goal: string;
    achievement: 'exceeded' | 'achieved' | 'partially' | 'not_achieved';
    score: number;
    evidence: string[];
    monthlyProgress: { month: string; progress: number; notes: string }[];
  }[];
  semesterSummary: {
    totalHours: number;
    attendanceRate: number;
    engagementLevel: 'high' | 'medium' | 'low';
    overallProgress: number;
  };
  skillDevelopment: {
    area: string;
    initialLevel: number;
    finalLevel: number;
    improvement: number;
    notes: string;
  }[];
  challengesEncountered: string[];
  strategiesUsed: string[];
  parentFeedback: string;
  recommendations: {
    nextSemester: string[];
    longTerm: string[];
    supportNeeds: string[];
  };
  status: 'draft' | 'completed' | 'approved' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const mockSemesterEvaluations: SemesterEvaluation[] = [
  {
    id: '1',
    studentId: 'student-1',
    studentName: '김민수',
    semester: '1학기',
    year: 2024,
    subject: '국어',
    planId: 'plan-1',
    planTitle: '1학기 종합 언어능력 향상 계획',
    overallGoalEvaluation: [
      {
        goal: '기초 문해력 완성',
        achievement: 'achieved',
        score: 85,
        evidence: ['한글 읽기 90% 정확도', '문장 쓰기 80% 완성도', '어휘력 테스트 85점'],
        monthlyProgress: [
          { month: '3월', progress: 60, notes: '기본 자모 완성' },
          { month: '4월', progress: 75, notes: '단어 읽기 향상' },
          { month: '5월', progress: 85, notes: '문장 읽기 가능' }
        ]
      },
      {
        goal: '의사소통 능력 향상',
        achievement: 'partially',
        score: 75,
        evidence: ['발표 능력 향상', '질문-답변 가능', '대화 지속 시간 증가'],
        monthlyProgress: [
          { month: '3월', progress: 50, notes: '단답형 대화' },
          { month: '4월', progress: 65, notes: '문장으로 대화' },
          { month: '5월', progress: 75, notes: '주제 확장 대화' }
        ]
      }
    ],
    semesterSummary: {
      totalHours: 120,
      attendanceRate: 95,
      engagementLevel: 'high',
      overallProgress: 80
    },
    skillDevelopment: [
      {
        area: '읽기능력',
        initialLevel: 40,
        finalLevel: 85,
        improvement: 45,
        notes: '단계별 체계적 학습으로 큰 향상'
      },
      {
        area: '쓰기능력',
        initialLevel: 30,
        finalLevel: 70,
        improvement: 40,
        notes: '기초 문법 습득, 문장 구성력 향상'
      },
      {
        area: '말하기능력',
        initialLevel: 50,
        finalLevel: 75,
        improvement: 25,
        notes: '자신감 향상, 표현력 증가'
      }
    ],
    challengesEncountered: [
      '긴 문장 이해의 어려움',
      '집중력 지속 시간 부족',
      '복잡한 문법 규칙 습득 어려움'
    ],
    strategiesUsed: [
      '단계별 난이도 조절',
      '시각적 자료 활용',
      '반복 학습과 피드백',
      '개별 맞춤 교육'
    ],
    parentFeedback: '가정에서도 읽기에 대한 흥미가 크게 증가했고, 스스로 책을 찾아 읽으려는 모습을 보입니다.',
    recommendations: {
      nextSemester: [
        '문단 단위 읽기 이해력 향상',
        '창의적 글쓰기 활동 확대',
        '토론 및 발표 기회 증가'
      ],
      longTerm: [
        '독서 습관 정착',
        '논리적 사고력 개발',
        '자기표현력 강화'
      ],
      supportNeeds: [
        '가정에서 독서 환경 조성',
        '어휘력 확장을 위한 다양한 경험',
        '자신감 향상을 위한 격려'
      ]
    },
    status: 'completed',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-30'
  }
];

export default function SemesterEvaluationPage() {
  const [evaluations, setEvaluations] = useState<SemesterEvaluation[]>(mockSemesterEvaluations);
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

  const filteredEvaluations = evaluations.filter(evaluation => {
    return (
      (!selectedSemester || evaluation.semester === selectedSemester) &&
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
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'approved': return '승인됨';
      case 'archived': return '보관됨';
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">학기별 교육평가 작성</h1>
                <p className="text-gray-600">학기 단위 종합 교육성과를 평가하고 분석합니다</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  새 학기평가 작성
                </button>
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI 종합평가 생성
                </button>
              </div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학기</label>
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
                  <option value="approved">승인됨</option>
                  <option value="archived">보관됨</option>
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
                    setSelectedSemester('');
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
                <Award className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{evaluations.length}</p>
                  <p className="text-gray-600">총 학기평가</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round(evaluations.reduce((acc, e) => acc + e.semesterSummary.overallProgress, 0) / evaluations.length) || 0}%
                  </p>
                  <p className="text-gray-600">평균 진보율</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
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
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round(evaluations.reduce((acc, e) => acc + e.semesterSummary.attendanceRate, 0) / evaluations.length) || 0}%
                  </p>
                  <p className="text-gray-600">평균 출석률</p>
                </div>
              </div>
            </div>
          </div>

          {/* 학기평가 목록 */}
          <div className="space-y-8">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{evaluation.planTitle}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <span className="mr-4">{evaluation.studentName}</span>
                        <span className="mr-4">{evaluation.year}년 {evaluation.semester}</span>
                        <span className="mr-4">{evaluation.subject}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(evaluation.status)}`}>
                          {getStatusText(evaluation.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 학기 요약 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-blue-600">{evaluation.semesterSummary.totalHours}시간</p>
                      <p className="text-sm text-gray-600">총 수업시간</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-green-600">{evaluation.semesterSummary.attendanceRate}%</p>
                      <p className="text-sm text-gray-600">출석률</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-purple-600">{evaluation.semesterSummary.overallProgress}%</p>
                      <p className="text-sm text-gray-600">전체 진보율</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-yellow-600 capitalize">{evaluation.semesterSummary.engagementLevel}</p>
                      <p className="text-sm text-gray-600">참여도</p>
                    </div>
                  </div>

                  {/* 목표별 평가 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">학기 목표 달성도</h4>
                    <div className="space-y-4">
                      {evaluation.overallGoalEvaluation.map((goal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{goal.goal}</h5>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-semibold text-gray-900">{goal.score}점</span>
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getAchievementColor(goal.achievement)}`}>
                                {getAchievementText(goal.achievement)}
                              </span>
                            </div>
                          </div>
                          
                          {/* 월별 진행상황 */}
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">월별 진행상황</h6>
                            <div className="grid grid-cols-3 gap-3">
                              {goal.monthlyProgress.map((month, idx) => (
                                <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                                  <p className="text-sm font-medium">{month.month}</p>
                                  <p className="text-lg font-semibold text-blue-600">{month.progress}%</p>
                                  <p className="text-xs text-gray-600">{month.notes}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* 근거자료 */}
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-2">달성 근거</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {goal.evidence.map((evidence, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {evidence}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 기능별 발전도 */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">기능별 발전도</h4>
                    <div className="space-y-3">
                      {evaluation.skillDevelopment.map((skill, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{skill.area}</h5>
                            <span className="text-sm font-semibold text-green-600">+{skill.improvement}점</span>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-600">시작:</span>
                              <span className="ml-1 font-medium">{skill.initialLevel}점</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">종료:</span>
                              <span className="ml-1 font-medium">{skill.finalLevel}점</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{skill.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 권장사항 및 피드백 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">다음 학기 권장사항</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {evaluation.recommendations.nextSemester.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="h-3 w-3 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">장기 목표</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {evaluation.recommendations.longTerm.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 학부모 피드백 */}
                  {evaluation.parentFeedback && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">학부모 피드백</h4>
                      <p className="text-sm text-blue-800">{evaluation.parentFeedback}</p>
                    </div>
                  )}

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
            
            {filteredEvaluations.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">학기평가가 없습니다</h3>
                <p className="mt-1 text-sm text-gray-500">새로운 학기별 평가를 작성해보세요.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    학기평가 작성하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 새 학기평가 작성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">새 학기별 교육평가 작성</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">평가 학기</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">연결된 학기계획</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">계획 선택</option>
                    <option value="plan-1">1학기 종합 언어능력 향상 계획</option>
                    <option value="plan-2">1학기 기초 수리 능력 강화 계획</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학기 전체 목표 평가</label>
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <h4 className="font-medium text-gray-900 mb-3">목표 {item}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">목표 내용</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="평가할 학기 목표"
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
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학기 요약</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">총 수업시간</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="시간"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">출석률 (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="출석률"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">참여도</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="high">높음</option>
                          <option value="medium">보통</option>
                          <option value="low">낮음</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기능 발달 평가</label>
                    <div className="space-y-3">
                      {['인지능력', '의사소통', '사회성'].map((skill, index) => (
                        <div key={skill} className="border border-gray-200 rounded p-3">
                          <h5 className="font-medium text-gray-800 mb-2">{skill}</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-600">초기 수준</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="1-5"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">최종 수준</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="1-5"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">당면한 도전과제</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="학기 동안 겪은 어려움이나 도전과제"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사용한 교육전략</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="효과적이었던 교육 방법이나 전략"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학부모 피드백</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="학부모로부터 받은 피드백"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">권장사항</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">다음 학기</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="다음 학기 권장사항"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">장기 목표</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="장기 발전 방향"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">지원 필요사항</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="필요한 지원사항"
                      />
                    </div>
                  </div>
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

        {/* AI 종합평가 생성 모달 */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI 학기별 종합평가 생성</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">평가 대상 학기</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="1학기">1학기</option>
                      <option value="2학기">2학기</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연결된 학기계획</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">계획 선택</option>
                    <option value="plan-1">1학기 종합 언어능력 향상 계획</option>
                    <option value="plan-2">1학기 기초 수리 능력 강화 계획</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학기 중 주요 성과</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="학생이 한 학기 동안 보인 주요 성과와 발전사항을 기록하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">지속적인 도전영역</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="아직 어려워하거나 지속적인 지원이 필요한 영역"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">효과적인 교육전략</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="이번 학기에 효과적이었던 교육 방법이나 전략"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평가 중점 영역</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['학습 목표 달성도', '기능적 발달', '사회적 참여', '자립능력', '의사소통', '행동 변화'].map(area => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학부모 관찰사항</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="가정에서 관찰된 변화나 발전사항"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">추가 고려사항</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="평가 시 고려할 특별한 상황이나 요인"
                    />
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
                    AI로 종합평가 생성하기
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
