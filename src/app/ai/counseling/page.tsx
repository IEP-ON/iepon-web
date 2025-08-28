'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { MessageCircle, Download, Users, BookOpen, Heart, Lightbulb } from 'lucide-react';

interface CounselingGuideTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const counselingTemplates: CounselingGuideTemplate[] = [
  {
    id: '1',
    title: '학부모 상담 가이드',
    description: '학생의 특성과 가정환경을 고려한 맞춤형 학부모 상담 가이드를 생성합니다',
    category: '학부모상담',
    icon: <Users className="h-6 w-6" />
  },
  {
    id: '2',
    title: '행동 개선 상담 가이드',
    description: '문제행동 분석과 개선 방안을 포함한 행동 상담 가이드를 제공합니다',
    category: '행동지도',
    icon: <Heart className="h-6 w-6" />
  },
  {
    id: '3',
    title: '학습 상담 가이드',
    description: '학습 어려움과 인지적 특성을 고려한 학습 상담 전략을 생성합니다',
    category: '학습지도',
    icon: <BookOpen className="h-6 w-6" />
  },
  {
    id: '4',
    title: '진로 상담 가이드',
    description: '학생의 흥미와 능력을 바탕으로 한 진로 상담 가이드를 제공합니다',
    category: '진로지도',
    icon: <Lightbulb className="h-6 w-6" />
  }
];

export default function AICounselingPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<string | null>(null);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  // 모의 학생 데이터
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const template = counselingTemplates.find(t => t.id === templateId);
    const student = students.find(s => s.id === selectedStudent);
    
    const mockGuide = `
# ${template?.title} - ${student?.name}

## 학생 정보
- 이름: ${student?.name}
- 학년: ${student?.grade}
- 장애유형: ${student?.disability}
- 작성일: ${new Date().toLocaleDateString('ko-KR')}
- 작성자: ${user.name}

## 상담 목표
${template?.category}에 중점을 둔 맞춤형 상담 계획을 수립합니다.

## 상담 전략

### 1. 사전 준비사항
- 학생의 최근 행동 및 학습 상황 파악
- 이전 상담 기록 검토
- 학부모의 관심사 및 우려사항 확인

### 2. 상담 진행 방법
- 긍정적인 분위기 조성
- 학생의 강점 먼저 언급
- 구체적인 사례를 통한 설명
- 협력적 문제해결 접근

### 3. 주요 상담 포인트
${template?.category === '학부모상담' ? `
- 가정에서의 학습환경 조성 방안
- 학교와 가정 간 일관된 지도 방향
- 학생의 사회성 발달 지원 방안
- 미래 계획 및 준비사항 논의
` : template?.category === '행동지도' ? `
- 문제행동의 원인 분석
- 대체 행동 교육 방안
- 긍정적 강화 전략
- 환경 조정 방안
` : template?.category === '학습지도' ? `
- 개별화된 학습 방법 제안
- 학습 동기 증진 방안
- 인지 처리 특성 고려사항
- 보조 도구 활용 방안
` : `
- 흥미 및 적성 탐색
- 직업 체험 기회 제공
- 장애 특성을 고려한 진로 설계
- 전환 교육 계획 수립
`}

### 4. 예상 질문 및 답변
Q: 가정에서 어떻게 도울 수 있나요?
A: 일관된 규칙과 긍정적 피드백을 통해 학생의 자신감을 높여주세요.

Q: 언제쯤 개선을 기대할 수 있나요?
A: 개별 차이가 있지만, 꾸준한 지원 시 3-6개월 내 긍정적 변화를 기대할 수 있습니다.

## 후속 조치
- 다음 상담 일정 안내
- 가정에서 실천할 구체적 방안 제시
- 필요시 전문기관 연계 상담
- 정기적인 진전 상황 점검

## 참고사항
- 학생의 개별적 특성을 최우선으로 고려
- 가족 구성원 모두의 협력 필요
- 전문가 팀과의 지속적 협력
- 장기적 관점에서의 발달 지원

---
※ 본 가이드는 AI가 생성한 참고자료이며, 실제 상담 시 학생의 개별 상황을 충분히 고려하여 활용하시기 바랍니다.
    `;
    
    setGeneratedGuide(mockGuide);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedGuide) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedGuide], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `상담가이드_${selectedStudent}_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 상담가이드 생성</h1>
            <p className="text-gray-600">학생별 맞춤형 상담 가이드를 AI가 생성해드립니다</p>
          </div>

          {!generatedGuide ? (
            <>
              {/* 학생 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상담 대상 학생 선택</h2>
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
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.grade}</p>
                      <p className="text-xs text-gray-500">{student.disability}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 상담가이드 템플릿 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {counselingTemplates.map((template) => (
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
                        {template.icon}
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {template.category}
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
                        <MessageCircle className="h-4 w-4 mr-1" />
                        맞춤형 가이드 생성
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
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">상담가이드 생성 안내</h3>
                <ul className="text-amber-800 text-sm space-y-1">
                  <li>• 학생의 개별 정보와 특성을 반영한 맞춤형 상담 가이드가 생성됩니다</li>
                  <li>• 생성된 가이드는 참고용이며, 실제 상담 시 학생 상황에 맞게 조정하세요</li>
                  <li>• 상담 전 학생의 최근 상황을 다시 한번 확인하시기 바랍니다</li>
                  <li>• 전문적인 상담이 필요한 경우 관련 전문기관과 연계하세요</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* 생성된 상담가이드 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">상담가이드 생성 완료</h2>
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
                          setGeneratedGuide(null);
                          setSelectedTemplate(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        새 가이드 생성
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedGuide}
                    </pre>
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
