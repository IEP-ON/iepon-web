'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { AIServiceType, AI_SERVICE_LABELS, AI_SERVICE_DESCRIPTIONS, AIGenerationResult } from '@/lib/types/ai-services';

const mockStudents = [
  { id: 'student-001', name: '김민수' },
  { id: 'student-002', name: '이수진' },
  { id: 'student-003', name: '박지호' },
  { id: 'student-004', name: '최서연' }
];

export default function AIPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedService, setSelectedService] = useState<AIServiceType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AIGenerationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AIGenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!selectedStudent || !selectedService) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // 3초 후 완료
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      const newResult: AIGenerationResult = {
        id: `ai-${Date.now()}`,
        serviceType: selectedService,
        studentId: selectedStudent,
        generatedContent: {
          summary: `${AI_SERVICE_LABELS[selectedService]} 생성 완료`,
          details: '상세 내용이 여기에 표시됩니다.'
        },
        metadata: {
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 2000,
          promptTokens: 1200,
          completionTokens: 800,
          totalTokens: 2000,
          processingTime: 3000,
          retryCount: 0,
          version: '1.0.0'
        },
        contextUsage: {
          dataSourcesUsed: ['student_profile'],
          contextCompleteness: 95,
          individualizedElements: ['학습방식'],
          adaptationsApplied: ['시각적지원'],
          supportNeedsAddressed: ['기본지원']
        },
        qualityScore: 92,
        confidenceLevel: 0.95,
        generatedAt: new Date().toISOString(),
        validatedAt: new Date().toISOString(),
        errors: [],
        warnings: []
      };
      
      setResults(prev => [newResult, ...prev]);
      setIsGenerating(false);
      setProgress(0);
      setSelectedStudent('');
      setSelectedService(null);
    }, 3000);
  };

  const getServiceIcon = (serviceType: AIServiceType): string => {
    switch (serviceType) {
      case AIServiceType.CURRICULUM_ASSIGNMENT: return '📚';
      case AIServiceType.LESSON_PLAN: return '📝';
      case AIServiceType.ASSESSMENT: return '📊';
      case AIServiceType.ADMIN_DOCUMENT: return '📄';
      case AIServiceType.COUNSELING_GUIDE: return '🤝';
      default: return '🤖';
    }
  };

  const getStatusBadge = (result: AIGenerationResult) => {
    if (result.errors.length > 0) return { text: '오류', color: 'bg-red-100 text-red-800' };
    if (result.warnings.length > 0) return { text: '검토필요', color: 'bg-yellow-100 text-yellow-800' };
    return { text: '완료', color: 'bg-green-100 text-green-800' };
  };

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI 생성 서비스</h1>
            <p className="text-sm sm:text-base text-gray-600">학생별 맞춤형 교육 자료를 AI로 생성합니다</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 생성 폼 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">새 자료 생성</h2>
                
                {/* 학생 선택 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">학생 선택</label>
                  <select 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="">학생을 선택하세요</option>
                    {mockStudents.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>

                {/* 서비스 선택 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">생성 서비스</label>
                  <div className="space-y-2">
                    {Object.values(AIServiceType).map(serviceType => (
                      <button
                        key={serviceType}
                        onClick={() => setSelectedService(serviceType)}
                        className={`w-full p-3 sm:p-4 text-left rounded-lg border transition-colors touch-manipulation ${
                          selectedService === serviceType
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span className="text-lg sm:text-xl mr-2 sm:mr-3">{getServiceIcon(serviceType)}</span>
                          <span className="font-medium text-sm sm:text-base">{AI_SERVICE_LABELS[serviceType]}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{AI_SERVICE_DESCRIPTIONS[serviceType]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 생성 버튼 */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedStudent || !selectedService || isGenerating}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-base font-medium touch-manipulation"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      생성 중... {progress}%
                    </div>
                  ) : (
                    'AI 생성 시작'
                  )}
                </button>

                {isGenerating && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 결과 목록 */}
            <div className="lg:col-span-2 mt-6 lg:mt-0">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold">생성 결과 ({results.length})</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {results.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">🤖</div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">아직 생성된 결과가 없습니다</h3>
                      <p className="text-sm sm:text-base text-gray-500 px-4">위에서 학생과 서비스를 선택하여 AI 생성을 시작해보세요</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map(result => {
                        const badge = getStatusBadge(result);
                        const student = mockStudents.find(s => s.id === result.studentId);
                        
                        return (
                          <div key={result.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                              <div className="flex items-start">
                                <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{getServiceIcon(result.serviceType)}</span>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{AI_SERVICE_LABELS[result.serviceType]}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600">학생: {student?.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(result.generatedAt).toLocaleDateString('ko-KR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                                  {badge.text}
                                </span>
                                <div className="text-right">
                                  <div className="text-xs sm:text-sm text-gray-500">품질: {result.qualityScore}점</div>
                                  <button
                                    onClick={() => setSelectedResult(result)}
                                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium touch-manipulation"
                                  >
                                    상세보기
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700">{result.generatedContent.summary}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 상세보기 모달 */}
          {selectedResult && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{getServiceIcon(selectedResult.serviceType)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold truncate">{AI_SERVICE_LABELS[selectedResult.serviceType]}</h3>
                        <p className="text-sm sm:text-base text-gray-600 truncate">
                          {mockStudents.find(s => s.id === selectedResult.studentId)?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl ml-2 touch-manipulation"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* 주요 내용 */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">생성된 내용</h4>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{selectedResult.generatedContent.summary}</p>
                      </div>
                      
                      {selectedResult.generatedContent.details && (
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                          <h5 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">상세 내용</h5>
                          <p className="text-blue-800 text-sm sm:text-base">{selectedResult.generatedContent.details}</p>
                        </div>
                      )}
                    </div>

                    {/* 메타데이터 */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">생성 정보</h4>
                      <div className="space-y-4">
                        <div className="bg-white border rounded-lg p-3">
                          <h5 className="font-medium text-gray-700 mb-2">품질 지표</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>품질 점수:</span>
                              <span className="font-medium">{selectedResult.qualityScore}점</span>
                            </div>
                            <div className="flex justify-between">
                              <span>신뢰도:</span>
                              <span className="font-medium">{Math.round(selectedResult.confidenceLevel * 100)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border rounded-lg p-3">
                          <h5 className="font-medium text-gray-700 mb-2">처리 정보</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>처리 시간:</span>
                              <span className="font-medium">{selectedResult.metadata.processingTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>토큰 사용:</span>
                              <span className="font-medium">{selectedResult.metadata.totalTokens}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>모델:</span>
                              <span className="font-medium">{selectedResult.metadata.model}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border rounded-lg p-3">
                          <h5 className="font-medium text-gray-700 mb-2">개별화 요소</h5>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-gray-600">사용된 데이터:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedResult.contextUsage.dataSourcesUsed.map(source => (
                                  <span key={source} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">적용된 지원:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedResult.contextUsage.adaptationsApplied.map(adaptation => (
                                  <span key={adaptation} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    {adaptation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
