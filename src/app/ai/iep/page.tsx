'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { FileText, User, Target, Calendar, Download, Eye, Plus } from 'lucide-react';

interface IEPTemplate {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'behavior' | 'social' | 'life_skills';
  estimatedTime: string;
}

const iepTemplates: IEPTemplate[] = [
  {
    id: '1',
    title: '학업 중심 IEP',
    description: '학업 성취도 향상을 중심으로 한 개별화교육계획서',
    category: 'academic',
    estimatedTime: '15-20분'
  },
  {
    id: '2',
    title: '행동 중심 IEP',
    description: '문제행동 개선과 적응행동 향상을 위한 계획서',
    category: 'behavior',
    estimatedTime: '12-18분'
  },
  {
    id: '3',
    title: '사회성 중심 IEP',
    description: '사회적 기술과 의사소통 능력 향상 계획서',
    category: 'social',
    estimatedTime: '10-15분'
  },
  {
    id: '4',
    title: '생활기능 중심 IEP',
    description: '일상생활 기능과 자립능력 향상 계획서',
    category: 'life_skills',
    estimatedTime: '12-16분'
  }
];

interface GeneratedIEP {
  id: string;
  studentName: string;
  category: string;
  content: {
    studentProfile: {
      currentLevel: string;
      strengths: string[];
      needs: string[];
    };
    goals: {
      longTerm: string[];
      shortTerm: string[];
    };
    strategies: string[];
    assessmentMethods: string[];
    supportServices: string[];
    timeline: string;
  };
  generatedAt: string;
}

export default function AIIEPPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIEP, setGeneratedIEP] = useState<GeneratedIEP | null>(null);
  const [customRequirements, setCustomRequirements] = useState('');

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const students = [
    { id: '1', name: '김민수', grade: '초등 3학년', disability: '자폐성장애' },
    { id: '2', name: '이소영', grade: '초등 5학년', disability: '지적장애' },
    { id: '3', name: '박준호', grade: '중등 1학년', disability: '정서행동장애' },
  ];

  const handleGenerate = async (templateId: string) => {
    if (!selectedStudent) {
      console.log('학생을 먼저 선택해주세요.');
      return;
    }

    setSelectedTemplate(templateId);
    setIsGenerating(true);
    
    // AI 생성 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const template = iepTemplates.find(t => t.id === templateId);
    const student = students.find(s => s.id === selectedStudent);
    
    const mockIEP: GeneratedIEP = {
      id: `iep-${Date.now()}`,
      studentName: student?.name || '',
      category: template?.category || '',
      content: {
        studentProfile: {
          currentLevel: `${student?.name}은 현재 ${student?.grade}에 재학 중이며, ${student?.disability} 진단을 받은 학생입니다. 개별적인 교육적 지원이 필요한 상황입니다.`,
          strengths: [
            '시각적 정보 처리 능력이 우수함',
            '규칙적인 일과에 잘 적응함',
            '관심 분야에 대한 집중력이 높음',
            '긍정적인 피드백에 잘 반응함'
          ],
          needs: [
            '사회적 상호작용 기술 향상',
            '의사소통 능력 개발',
            '학업 기초 능력 강화',
            '자기조절 능력 향상'
          ]
        },
        goals: {
          longTerm: [
            `${template?.category === 'academic' ? '학업 성취도를 학급 평균의 80% 수준까지 향상' : 
              template?.category === 'behavior' ? '적응행동 빈도 70% 이상 증가 및 문제행동 50% 감소' :
              template?.category === 'social' ? '또래와의 적절한 상호작용 능력 80% 향상' :
              '일상생활 자립도 70% 이상 향상'}`,
            '자기주도적 학습 능력 개발',
            '학교생활 적응도 향상'
          ],
          shortTerm: [
            '월별 목표 달성률 80% 이상 유지',
            '주간 평가에서 지속적인 진전 확인',
            '학부모 만족도 85% 이상 달성'
          ]
        },
        strategies: [
          '시각적 지원 도구 활용 (그림카드, 일정표 등)',
          '단계별 과제 분석을 통한 체계적 교수',
          '긍정적 강화 및 즉각적 피드백 제공',
          '구조화된 환경에서의 반복 학습',
          '개별화된 교수-학습 자료 개발 및 활용'
        ],
        assessmentMethods: [
          '포트폴리오 평가',
          '관찰 평가 (주 2회)',
          '수행 평가',
          '자기평가 및 동료평가',
          '학부모 면담을 통한 가정에서의 변화 확인'
        ],
        supportServices: [
          '특수교육 담당교사 개별지도 (주 4시간)',
          '언어치료사 연계 서비스 (주 1회)',
          '교육복지사 상담 지원',
          '또래 도우미 프로그램 참여',
          '가족 상담 및 교육 프로그램'
        ],
        timeline: '2024년 3월 ~ 2025년 2월 (1년간)'
      },
      generatedAt: new Date().toISOString()
    };
    
    setGeneratedIEP(mockIEP);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedIEP) return;
    
    const content = `
# 개별화교육계획서 (IEP)

## 학생 정보
- 이름: ${generatedIEP.studentName}
- 작성일: ${new Date(generatedIEP.generatedAt).toLocaleDateString('ko-KR')}
- 계획 유형: ${generatedIEP.category}

## 현재 수준
${generatedIEP.content.studentProfile.currentLevel}

### 강점
${generatedIEP.content.studentProfile.strengths.map(s => `- ${s}`).join('\n')}

### 요구사항
${generatedIEP.content.studentProfile.needs.map(n => `- ${n}`).join('\n')}

## 교육 목표

### 장기 목표
${generatedIEP.content.goals.longTerm.map(g => `- ${g}`).join('\n')}

### 단기 목표
${generatedIEP.content.goals.shortTerm.map(g => `- ${g}`).join('\n')}

## 교수 전략
${generatedIEP.content.strategies.map(s => `- ${s}`).join('\n')}

## 평가 방법
${generatedIEP.content.assessmentMethods.map(m => `- ${m}`).join('\n')}

## 지원 서비스
${generatedIEP.content.supportServices.map(s => `- ${s}`).join('\n')}

## 실행 기간
${generatedIEP.content.timeline}

---
본 계획서는 AI가 생성한 초안이며, 실제 적용 전 전문가 검토가 필요합니다.
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `IEP_${generatedIEP.studentName}_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'behavior': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'academic': return '학업중심';
      case 'behavior': return '행동중심';
      case 'social': return '사회성중심';
      default: return '생활기능';
    }
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 개별화교육계획서(IEP) 생성</h1>
            <p className="text-gray-600">학생별 맞춤형 개별화교육계획서를 AI가 자동으로 생성합니다</p>
          </div>

          {!generatedIEP ? (
            <>
              {/* 학생 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">대상 학생 선택</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedStudent === student.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.grade}</p>
                          <p className="text-xs text-gray-500">{student.disability}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추가 요구사항 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">추가 요구사항 (선택사항)</h2>
                <textarea
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="특별히 강조하고 싶은 교육 목표나 고려사항이 있다면 입력해주세요..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IEP 템플릿 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {iepTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 ${
                      selectedStudent 
                        ? 'border-transparent hover:border-blue-500' 
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => selectedStudent && !isGenerating && handleGenerate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-blue-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getCategoryColor(template.category)}`}>
                        {getCategoryName(template.category)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="h-4 w-4 mr-1" />
                        예상 소요시간: {template.estimatedTime}
                      </div>
                      
                      {isGenerating && selectedTemplate === template.id ? (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          생성 중...
                        </div>
                      ) : (
                        <button 
                          className={`text-sm font-medium ${
                            selectedStudent 
                              ? 'text-blue-600 hover:text-blue-800' 
                              : 'text-gray-400'
                          }`}
                          disabled={!selectedStudent}
                        >
                          생성하기 →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 안내 정보 */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">IEP 생성 안내</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• 학생의 개별 정보와 특성을 반영한 맞춤형 IEP가 생성됩니다</li>
                  <li>• 생성된 계획서는 초안이며, 실제 적용 전 전문가 검토가 필요합니다</li>
                  <li>• 법적 요구사항을 충족하도록 구성되지만, 지역별 양식에 맞게 조정하세요</li>
                  <li>• 학부모와의 협의를 거쳐 최종 승인을 받으시기 바랍니다</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* 생성된 IEP */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-6 w-6 text-green-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">IEP 생성 완료</h2>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        다운로드
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedIEP(null);
                          setSelectedTemplate(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        새 IEP 생성
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">학생 프로필</h3>
                    <p className="text-gray-600 mb-4">{generatedIEP.content.studentProfile.currentLevel}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">강점</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {generatedIEP.content.studentProfile.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">요구사항</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {generatedIEP.content.studentProfile.needs.map((need, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {need}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">교육 목표</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">장기 목표</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {generatedIEP.content.goals.longTerm.map((goal, index) => (
                            <li key={index} className="p-2 bg-blue-50 rounded">
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">단기 목표</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {generatedIEP.content.goals.shortTerm.map((goal, index) => (
                            <li key={index} className="p-2 bg-green-50 rounded">
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">교수 전략</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {generatedIEP.content.strategies.map((strategy, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">평가 방법</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {generatedIEP.content.assessmentMethods.map((method, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">지원 서비스</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {generatedIEP.content.supportServices.map((service, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-1">실행 기간</h3>
                    <p className="text-sm text-gray-600">{generatedIEP.content.timeline}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
