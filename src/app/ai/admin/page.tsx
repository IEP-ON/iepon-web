'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { FileText, Download, Eye, Clock, CheckCircle } from 'lucide-react';

interface AdminDocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
}

const documentTemplates: AdminDocumentTemplate[] = [
  {
    id: '1',
    title: '학생 현황 보고서',
    description: '학생의 교육 진행 상황과 성과를 종합한 보고서',
    category: '교육 보고서',
    estimatedTime: '5-8분'
  },
  {
    id: '2',
    title: '개별화교육계획 요약서',
    description: 'IEP의 핵심 내용을 요약한 관리자용 문서',
    category: '교육 계획',
    estimatedTime: '3-5분'
  },
  {
    id: '3',
    title: '학부모 상담 기록서',
    description: '학부모와의 상담 내용을 체계적으로 정리한 문서',
    category: '상담 기록',
    estimatedTime: '4-6분'
  },
  {
    id: '4',
    title: '교육 성과 분석 리포트',
    description: '학생의 교육 성과를 데이터 기반으로 분석한 리포트',
    category: '성과 분석',
    estimatedTime: '6-10분'
  },
  {
    id: '5',
    title: '특수교육 지원 신청서',
    description: '추가 지원이 필요한 학생을 위한 신청 문서',
    category: '지원 신청',
    estimatedTime: '4-7분'
  },
  {
    id: '6',
    title: '학습 지원 계획서',
    description: '개별 학생의 학습 지원 방안을 담은 계획서',
    category: '지원 계획',
    estimatedTime: '5-8분'
  },
  {
    id: '7',
    title: '특수교육 대상자 진단평가 의뢰서',
    description: '특수교육 대상자 선정을 위한 진단평가 의뢰 시 학교장 의견서',
    category: '학교장 의견서',
    estimatedTime: '3-5분'
  },
  {
    id: '8',
    title: '개별화교육지원팀 구성 의견서',
    description: '학생별 개별화교육지원팀 구성에 대한 학교장 의견서',
    category: '학교장 의견서',
    estimatedTime: '4-6분'
  },
  {
    id: '9',
    title: '특수교육 관련서비스 신청 의견서',
    description: '치료지원, 보조인력 등 관련서비스 신청 시 학교장 의견서',
    category: '학교장 의견서',
    estimatedTime: '5-7분'
  },
  {
    id: '10',
    title: '통합교육 운영 의견서',
    description: '통합교육 운영 현황 및 개선방안에 대한 학교장 의견서',
    category: '학교장 의견서',
    estimatedTime: '6-8분'
  }
];

export default function AIAdminPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const handleGenerate = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsGenerating(true);
    
    // AI 생성 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const template = documentTemplates.find(t => t.id === templateId);
    const mockDocument = `
# ${template?.title}

## 작성 정보
- 작성일: ${new Date().toLocaleDateString('ko-KR')}
- 작성자: ${user.name}

## 문서 내용
AI가 생성한 ${template?.title} 내용입니다.

### 주요 내용
1. 학생 현황 분석
2. 목표 설정
3. 지원 방안
4. 평가 계획

### 세부 사항
이 문서는 AI가 학생의 정보와 현재 상황을 분석하여 자동으로 생성한 ${template?.title}입니다.
실제 사용 시에는 담당 교사가 검토하고 필요한 부분을 수정하여 사용하시기 바랍니다.

### 권장사항
- 정기적인 점검 및 업데이트
- 학부모와의 협의
- 관련 전문가 자문
    `;
    
    setGeneratedDocument(mockDocument);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedDocument) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedDocument], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AI_행정문서_${new Date().getTime()}.txt`;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 행정문서 생성</h1>
            <p className="text-gray-600">필요한 행정문서를 AI가 자동으로 생성해드립니다</p>
          </div>

          {!generatedDocument ? (
            <>
              {/* 템플릿 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documentTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() => !isGenerating && handleGenerate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
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
                        <Clock className="h-4 w-4 mr-1" />
                        예상 소요시간: {template.estimatedTime}
                      </div>
                      
                      {isGenerating && selectedTemplate === template.id ? (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          생성 중...
                        </div>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          생성하기 →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 안내 정보 */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI 행정문서 생성 안내</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• AI가 생성한 문서는 초안으로, 검토 후 사용하시기 바랍니다</li>
                  <li>• 학생별 맞춤 정보를 반영하여 정확한 문서를 생성합니다</li>
                  <li>• 생성된 문서는 다운로드하여 편집 가능합니다</li>
                  <li>• 법적 효력이 있는 공식 문서 작성 시 전문가 검토를 권장합니다</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* 생성된 문서 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">문서 생성 완료</h2>
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
                          setGeneratedDocument(null);
                          setSelectedTemplate(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        새 문서 생성
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedDocument}
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
