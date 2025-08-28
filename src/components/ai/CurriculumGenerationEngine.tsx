'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Target, Clock, AlertCircle, CheckCircle, Loader2, Brain, FileText } from 'lucide-react';
import { useAIGeneration } from '../../lib/hooks/useAIGeneration';
import { createBaseAIGenerationRequest, createUserPreferences } from '../../lib/ai-service';
import { AI_SERVICE_TYPES, AI_SERVICE_LABELS, AIServiceType, UserPreferences } from '../../lib/ai-types';
import { Student } from '../../lib/types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface CurriculumGenerationEngineProps {
  student?: Student;
  onGenerated?: (result: any) => void;
  className?: string;
}

interface GenerationSettings {
  serviceType: AIServiceType;
  priority: 'low' | 'normal' | 'high';
  focusAreas: string[];
  detailLevel: 'brief' | 'moderate' | 'detailed';
  includeExamples: boolean;
  customInstructions: string;
}

const defaultSettings: GenerationSettings = {
  serviceType: AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT,
  priority: 'normal',
  focusAreas: [],
  detailLevel: 'moderate',
  includeExamples: true,
  customInstructions: ''
};

const focusAreaOptions = [
  { value: 'communication', label: '의사소통' },
  { value: 'academic', label: '학습기능' },
  { value: 'social', label: '사회성' },
  { value: 'daily_living', label: '일상생활' },
  { value: 'motor', label: '운동기능' },
  { value: 'behavioral', label: '행동관리' },
  { value: 'vocational', label: '직업준비' },
  { value: 'self_advocacy', label: '자기옹호' }
];

const serviceTypeOptions = [
  { value: AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT, label: AI_SERVICE_LABELS[AI_SERVICE_TYPES.CURRICULUM_ASSIGNMENT] },
  { value: AI_SERVICE_TYPES.LESSON_PLAN, label: AI_SERVICE_LABELS[AI_SERVICE_TYPES.LESSON_PLAN] },
  { value: AI_SERVICE_TYPES.ASSESSMENT, label: AI_SERVICE_LABELS[AI_SERVICE_TYPES.ASSESSMENT] },
  { value: AI_SERVICE_TYPES.COUNSELING_GUIDE, label: AI_SERVICE_LABELS[AI_SERVICE_TYPES.COUNSELING_GUIDE] }
];

const CurriculumGenerationEngine: React.FC<CurriculumGenerationEngineProps> = ({
  student,
  onGenerated,
  className = ''
}) => {
  // Mock student data if not provided
  const defaultStudent: Student = {
    id: 'demo-student',
    name: '김학생',
    birthDate: '2010-05-15',
    gender: '남성',
    schoolName: '서울특수학교',
    grade: 3,
    className: '3-1',
    homeTeacherName: '이선생',
    integrationType: '부분통합',
    integrationHours: 15,
    integrationSubjects: ['국어', '수학'],
    disabilityTypes: [{ type: '지적장애', description: '경증' }],
    disabilityRegistrationDate: '2015-03-01',
    hasWelfareCard: true,
    disabilitySeverity: '경증',
    welfareSupports: [],
    treatmentSupports: [],
    assistantSupports: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    status: 'active',
    teacherId: 'teacher-1'
  };
  
  const currentStudent = student || defaultStudent;
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);

  const aiGeneration = useAIGeneration({
    maxRetries: 3,
    requestTimeout: 30000,
    rateLimitWindow: 60000,
    maxRequestsPerWindow: 10
  });

  /**
   * 설정 업데이트 핸들러
   */
  const updateSettings = (updates: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * 포커스 영역 토글
   */
  const toggleFocusArea = (area: string) => {
    setSettings(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  /**
   * AI 생성 실행
   */
  const handleGenerate = async () => {
    if (!currentStudent.id) {
      alert('학생 정보가 올바르지 않습니다.');
      return;
    }

    try {
      // AI 생성 요청 생성
      const request = createBaseAIGenerationRequest();
      request.studentId = currentStudent.id;
      request.serviceType = settings.serviceType;
      request.priority = settings.priority;
      request.additionalContext = {
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentGrade: currentStudent.grade,
        studentSchool: currentStudent.schoolName,
        disabilityTypes: currentStudent.disabilityTypes,
        integrationType: currentStudent.integrationType,
        focusAreas: settings.focusAreas,
        customInstructions: settings.customInstructions
      };

      // 사용자 선호도 설정
      const preferences = createUserPreferences();
      preferences.detailLevel = settings.detailLevel;
      preferences.includeExamples = settings.includeExamples;
      preferences.focusAreas = settings.focusAreas;
      preferences.customInstructions = settings.customInstructions;

      // AI 생성 실행
      const result = await aiGeneration.generateWithContext(
        currentStudent.id,
        request,
        preferences
      );

      if (result) {
        // 생성 기록 추가
        setGenerationHistory(prev => [result, ...prev.slice(0, 4)]); // 최근 5개만 유지
        
        // 부모 컴포넌트에 결과 전달
        if (onGenerated) {
          onGenerated(result);
        }
      }
    } catch (error) {
      console.error('AI 생성 실패:', error);
    }
  };

  /**
   * 진행률 색상 계산
   */
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-blue-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  /**
   * 상태별 아이콘 렌더링
   */
  const renderStatusIcon = () => {
    switch (aiGeneration.state.status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {renderStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI 교육과정 생성 엔진
              </h3>
              <p className="text-sm text-gray-600">
                {currentStudent.name}님을 위한 맞춤형 교육 콘텐츠 생성
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            {showAdvanced ? '기본 설정' : '고급 설정'}
          </Button>
        </div>
      </div>

      {/* 생성 진행 상태 */}
      {aiGeneration.state.status === 'loading' && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-700">{aiGeneration.state.currentStep}</span>
                <span className="text-blue-600">{aiGeneration.state.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(aiGeneration.state.progress)}`}
                  style={{ width: `${aiGeneration.state.progress}%` }}
                />
              </div>
            </div>
            {aiGeneration.state.isRetrying && (
              <div className="text-sm text-blue-600">
                재시도 중... ({aiGeneration.state.retryCount + 1}회)
              </div>
            )}
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {aiGeneration.state.error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">생성 오류</h4>
              <p className="text-sm text-red-700 mt-1">{aiGeneration.state.error.message}</p>
              {aiGeneration.state.error.retryable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                >
                  다시 시도
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={aiGeneration.clearError}
              className="text-red-600 hover:bg-red-100"
            >
              닫기
            </Button>
          </div>
        </div>
      )}

      {/* 설정 패널 */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 서비스 타입 선택 */}
          <div>
            <Select
              label="생성할 콘텐츠 유형"
              value={settings.serviceType}
              onChange={(e) => updateSettings({ serviceType: e.target.value as AIServiceType })}
              options={serviceTypeOptions}
              required
            />
          </div>

          {/* 우선순위 */}
          <div>
            <Select
              label="우선순위"
              value={settings.priority}
              onChange={(value) => updateSettings({ priority: value as any })}
              options={[
                { value: 'low', label: '낮음' },
                { value: 'normal', label: '보통' },
                { value: 'high', label: '높음' }
              ]}
            />
          </div>
        </div>

        {/* 포커스 영역 선택 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            중점 영역 선택 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {focusAreaOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleFocusArea(option.value)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  settings.focusAreas.includes(option.value)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 고급 설정 */}
        {showAdvanced && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">고급 설정</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 상세 수준 */}
              <div>
                <Select
                  label="상세 수준"
                  value={settings.detailLevel}
                  onChange={(value) => updateSettings({ detailLevel: value as any })}
                  options={[
                    { value: 'brief', label: '간략' },
                    { value: 'moderate', label: '보통' },
                    { value: 'detailed', label: '상세' }
                  ]}
                />
              </div>

              {/* 예시 포함 여부 */}
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="includeExamples"
                  checked={settings.includeExamples}
                  onChange={(e) => updateSettings({ includeExamples: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeExamples" className="text-sm text-gray-700">
                  실제 예시 포함
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 생성 버튼 */}
      <div className="px-6 py-4 border-t border-gray-200">
        <Button
          onClick={handleGenerate}
          disabled={aiGeneration.state.status === 'loading'}
          className="px-6"
        >
          {aiGeneration.state.status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              AI 생성 시작
            </>
          )}
        </Button>
      </div>
      </div>

      {/* 생성 결과 미리보기 */}
      {aiGeneration.state.result && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">생성 결과</h4>
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span>품질: {aiGeneration.state.result.qualityScore}점</span>
              <span>신뢰도: {aiGeneration.state.result.confidenceLevel}점</span>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-gray-200 p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {aiGeneration.state.result.generatedContent || '생성된 내용이 없습니다.'}
            </pre>
          </div>

          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            <span>
              생성 시간: {new Date(aiGeneration.state.result.generatedAt).toLocaleString('ko-KR')}
            </span>
            <span>
              토큰 사용: {aiGeneration.state.result.metadata?.totalTokens || 0}
            </span>
          </div>
        </div>
      )}

      {/* 생성 기록 */}
      {generationHistory.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">최근 생성 기록</h4>
          <div className="space-y-2">
            {generationHistory.map((result, index) => (
              <div
                key={result.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-900">
                      {AI_SERVICE_LABELS[result.serviceType as keyof typeof AI_SERVICE_LABELS] || result.serviceType}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(result.generatedAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>품질 {result.qualityScore}점</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumGenerationEngine;
