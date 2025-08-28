'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { FileCheck, User, School, Calendar, Download, AlertCircle } from 'lucide-react';

interface PrincipalOpinionTemplate {
  id: string;
  title: string;
  description: string;
  purpose: string;
  estimatedTime: string;
}

const opinionTemplates: PrincipalOpinionTemplate[] = [
  {
    id: '1',
    title: '특수교육 대상자 진단평가 의뢰서',
    description: '특수교육 대상자 선정을 위한 진단평가 의뢰 시 학교장 의견서',
    purpose: '진단평가 의뢰',
    estimatedTime: '3-5분'
  },
  {
    id: '2',
    title: '개별화교육지원팀 구성 의견서',
    description: '학생별 개별화교육지원팀 구성에 대한 학교장 의견서',
    purpose: '지원팀 구성',
    estimatedTime: '4-6분'
  },
  {
    id: '3',
    title: '특수교육 관련서비스 신청 의견서',
    description: '치료지원, 보조인력 등 관련서비스 신청 시 학교장 의견서',
    purpose: '관련서비스 신청',
    estimatedTime: '5-7분'
  },
  {
    id: '4',
    title: '전학 및 학급배치 의견서',
    description: '특수교육 대상 학생의 전학 또는 학급배치 변경 시 의견서',
    purpose: '배치 변경',
    estimatedTime: '4-6분'
  },
  {
    id: '5',
    title: '통합교육 운영 의견서',
    description: '통합교육 운영 현황 및 개선방안에 대한 학교장 의견서',
    purpose: '통합교육 운영',
    estimatedTime: '6-8분'
  },
  {
    id: '6',
    title: '특수교육 예산 지원 요청서',
    description: '특수교육 운영을 위한 예산 지원 요청 시 학교장 의견서',
    purpose: '예산 지원 요청',
    estimatedTime: '5-7분'
  }
];

interface GeneratedOpinion {
  id: string;
  studentName: string;
  templateTitle: string;
  content: {
    studentInfo: {
      basicInfo: string;
      currentStatus: string;
      educationalNeeds: string;
    };
    schoolStatus: {
      currentSupport: string;
      resources: string;
      challenges: string;
    };
    principalOpinion: {
      necessity: string;
      expectedOutcomes: string;
      supportPlan: string;
      recommendation: string;
    };
    attachments: string[];
  };
  generatedAt: string;
}

export default function PrincipalOpinionPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOpinion, setGeneratedOpinion] = useState<GeneratedOpinion | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const students = [
    { id: '1', name: '김민수', grade: '초등 3학년', disability: '자폐성장애', school: '○○초등학교' },
    { id: '2', name: '이소영', grade: '초등 5학년', disability: '지적장애', school: '○○초등학교' },
    { id: '3', name: '박준호', grade: '중등 1학년', disability: '정서행동장애', school: '○○중학교' },
  ];

  const handleGenerate = async (templateId: string) => {
    if (!selectedStudent) {
      console.log('학생을 먼저 선택해주세요.');
      return;
    }

    setSelectedTemplate(templateId);
    setIsGenerating(true);
    
    // AI 생성 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    const template = opinionTemplates.find(t => t.id === templateId);
    const student = students.find(s => s.id === selectedStudent);
    
    const mockOpinion: GeneratedOpinion = {
      id: `opinion-${Date.now()}`,
      studentName: student?.name || '',
      templateTitle: template?.title || '',
      content: {
        studentInfo: {
          basicInfo: `${student?.name} (${student?.grade}, ${student?.disability})은 현재 ${student?.school}에 재학 중인 특수교육대상 학생입니다.`,
          currentStatus: `학생은 현재 일반학급에서 통합교육을 받고 있으며, 개별화교육계획에 따라 맞춤형 교육을 제공받고 있습니다. 인지적 특성과 학습 속도를 고려한 교육과정 조정이 이루어지고 있습니다.`,
          educationalNeeds: `${student?.disability} 특성으로 인해 개별화된 교수학습 방법과 평가 조정이 필요하며, 사회적 상호작용 능력 향상과 자립생활 기술 습득을 위한 체계적인 지원이 요구됩니다.`
        },
        schoolStatus: {
          currentSupport: `현재 특수교육 담당교사의 개별지도(주 4시간), 통합학급 담임교사와의 협력교수, 그리고 특수교육실무사의 지원을 받고 있습니다.`,
          resources: `특수교육실 운영, 개별화교육 자료 구비, 보조공학기기 활용, 전문 상담교사 배치 등의 교육 인프라를 갖추고 있습니다.`,
          challenges: `학급 내 개별화 지원 시간 확보의 어려움, 전문 치료사 부족, 가정과의 연계 교육 강화 필요성 등의 과제가 있습니다.`
        },
        principalOpinion: {
          necessity: `${template?.purpose}의 필요성을 절실히 느끼고 있으며, 이는 학생의 교육적 성과 향상과 학교 특수교육 질 개선에 필수적입니다.`,
          expectedOutcomes: `체계적인 지원을 통해 학생의 학업 성취도 향상, 사회성 발달, 자립생활 능력 증진을 기대하며, 통합교육 환경 개선 효과도 예상됩니다.`,
          supportPlan: `학교 차원에서 교직원 연수 강화, 학부모 상담 확대, 지역사회 연계 프로그램 운영 등을 통해 지속적인 지원을 제공할 계획입니다.`,
          recommendation: `${template?.purpose}이 승인되어 학생에게 필요한 지원이 원활히 이루어질 수 있도록 적극 협조하겠으며, 관련 기관과의 긴밀한 협력을 약속드립니다.`
        },
        attachments: [
          '개별화교육계획서',
          '학생 현황 및 평가 자료',
          '가정환경 조사서',
          '교육활동 사진 자료',
          '학부모 면담 기록'
        ]
      },
      generatedAt: new Date().toISOString()
    };
    
    setGeneratedOpinion(mockOpinion);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedOpinion) return;
    
    const content = `
# ${generatedOpinion.templateTitle}

## 학생 기본정보
${generatedOpinion.content.studentInfo.basicInfo}

### 현재 교육 상황
${generatedOpinion.content.studentInfo.currentStatus}

### 교육적 요구사항
${generatedOpinion.content.studentInfo.educationalNeeds}

## 학교 현황

### 현재 지원 현황
${generatedOpinion.content.schoolStatus.currentSupport}

### 학교 보유 자원
${generatedOpinion.content.schoolStatus.resources}

### 당면 과제
${generatedOpinion.content.schoolStatus.challenges}

## 학교장 의견

### 필요성 인식
${generatedOpinion.content.principalOpinion.necessity}

### 기대 효과
${generatedOpinion.content.principalOpinion.expectedOutcomes}

### 학교 지원 계획
${generatedOpinion.content.principalOpinion.supportPlan}

### 권고사항
${generatedOpinion.content.principalOpinion.recommendation}

## 첨부서류
${generatedOpinion.content.attachments.map(doc => `- ${doc}`).join('\n')}

---
작성일: ${new Date(generatedOpinion.generatedAt).toLocaleDateString('ko-KR')}
작성자: 학교장 [인]

※ 본 의견서는 AI가 생성한 초안이며, 실제 사용 전 학교장의 검토 및 승인이 필요합니다.
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `학교장의견서_${generatedOpinion.studentName}_${new Date().getTime()}.txt`;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 학교장 의견서 생성</h1>
            <p className="text-gray-600">특수교육 관련 공문서 작성 시 필요한 학교장 의견서를 자동으로 생성합니다</p>
          </div>

          {!generatedOpinion ? (
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
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.grade}</p>
                          <p className="text-xs text-gray-500">{student.disability}</p>
                          <p className="text-xs text-gray-500 mt-1">{student.school}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추가 정보 입력 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">추가 정보 (선택사항)</h2>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="의견서에 포함하고 싶은 특별한 사항이나 강조하고 싶은 내용을 입력해주세요..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 의견서 템플릿 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opinionTemplates.map((template) => (
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
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {template.purpose}
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
              <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">중요 안내사항</h3>
                    <ul className="text-orange-800 text-sm space-y-1">
                      <li>• 생성된 의견서는 초안이며, 반드시 학교장의 검토와 승인이 필요합니다</li>
                      <li>• 각 지역 교육청의 공문서 양식에 맞게 형식을 조정해주세요</li>
                      <li>• 법적 효력을 갖는 공식 문서이므로 내용의 정확성을 재확인하시기 바랍니다</li>
                      <li>• 학생 개인정보 보호에 각별히 유의하여 관리해주세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 생성된 의견서 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <School className="h-6 w-6 text-green-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">의견서 생성 완료</h2>
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
                          setGeneratedOpinion(null);
                          setSelectedTemplate(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        새 의견서 생성
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{generatedOpinion.templateTitle}</h3>
                    <p className="text-sm text-gray-600">대상 학생: {generatedOpinion.studentName}</p>
                  </div>

                  <div className="space-y-6">
                    {/* 학생 정보 */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">학생 기본정보</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-1">기본 정보</h5>
                          <p className="text-sm text-gray-600">{generatedOpinion.content.studentInfo.basicInfo}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-1">현재 교육 상황</h5>
                          <p className="text-sm text-gray-600">{generatedOpinion.content.studentInfo.currentStatus}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-1">교육적 요구사항</h5>
                          <p className="text-sm text-gray-600">{generatedOpinion.content.studentInfo.educationalNeeds}</p>
                        </div>
                      </div>
                    </div>

                    {/* 학교 현황 */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">학교 현황</h4>
                      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">현재 지원 현황</h5>
                          <p className="text-sm text-blue-800">{generatedOpinion.content.schoolStatus.currentSupport}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">보유 자원</h5>
                          <p className="text-sm text-blue-800">{generatedOpinion.content.schoolStatus.resources}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-700 mb-1">당면 과제</h5>
                          <p className="text-sm text-blue-800">{generatedOpinion.content.schoolStatus.challenges}</p>
                        </div>
                      </div>
                    </div>

                    {/* 학교장 의견 */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">학교장 의견</h4>
                      <div className="bg-green-50 rounded-lg p-4 space-y-3">
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">필요성 인식</h5>
                          <p className="text-sm text-green-800">{generatedOpinion.content.principalOpinion.necessity}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">기대 효과</h5>
                          <p className="text-sm text-green-800">{generatedOpinion.content.principalOpinion.expectedOutcomes}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">지원 계획</h5>
                          <p className="text-sm text-green-800">{generatedOpinion.content.principalOpinion.supportPlan}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">권고사항</h5>
                          <p className="text-sm text-green-800">{generatedOpinion.content.principalOpinion.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    {/* 첨부서류 */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">첨부서류</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {generatedOpinion.content.attachments.map((doc, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t text-right text-sm text-gray-500">
                    작성일: {new Date(generatedOpinion.generatedAt).toLocaleDateString('ko-KR')}
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
