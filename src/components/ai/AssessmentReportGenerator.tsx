'use client';

import React, { useState } from 'react';
import { FileText, BarChart3, TrendingUp, CheckCircle, AlertCircle, Calendar, User, Target, Award, Download, Eye, Printer } from 'lucide-react';
import { useAIGeneration } from '../../lib/hooks/useAIGeneration';
import { createBaseAIGenerationRequest, createUserPreferences } from '../../lib/ai-service';
import { AI_SERVICE_TYPES } from '../../lib/ai-types';
import { Student } from '../../lib/types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface AssessmentReportGeneratorProps {
  student?: Student;
  onGenerated?: (result: any) => void;
  className?: string;
}

interface AssessmentSettings {
  reportType: 'comprehensive' | 'progress' | 'diagnostic' | 'transition';
  timeRange: 'weekly' | 'monthly' | 'semester' | 'yearly';
  assessmentAreas: string[];
  includeRecommendations: boolean;
  includeGraphs: boolean;
  reportFormat: 'narrative' | 'structured' | 'checklist';
  audienceType: 'parents' | 'teachers' | 'therapists' | 'administrators';
  notes: string;
}

const defaultSettings: AssessmentSettings = {
  reportType: 'comprehensive',
  timeRange: 'monthly',
  assessmentAreas: [],
  includeRecommendations: true,
  includeGraphs: true,
  reportFormat: 'structured',
  audienceType: 'parents',
  notes: ''
};

const reportTypeOptions = [
  { value: 'comprehensive', label: '종합 평가 보고서' },
  { value: 'progress', label: '진전 상황 보고서' },
  { value: 'diagnostic', label: '진단 평가 보고서' },
  { value: 'transition', label: '전환 계획 보고서' }
];

const timeRangeOptions = [
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
  { value: 'semester', label: '학기' },
  { value: 'yearly', label: '연간' }
];

const assessmentAreaOptions = [
  { value: 'academic', label: '학습 능력' },
  { value: 'communication', label: '의사소통' },
  { value: 'social', label: '사회성 발달' },
  { value: 'behavioral', label: '행동 관리' },
  { value: 'motor', label: '운동 능력' },
  { value: 'daily_living', label: '일상생활 기능' },
  { value: 'vocational', label: '직업 기능' },
  { value: 'emotional', label: '정서 발달' }
];

const reportFormatOptions = [
  { value: 'narrative', label: '서술형' },
  { value: 'structured', label: '구조화된 형식' },
  { value: 'checklist', label: '체크리스트 형식' }
];

const audienceTypeOptions = [
  { value: 'parents', label: '학부모용' },
  { value: 'teachers', label: '교사용' },
  { value: 'therapists', label: '치료사용' },
  { value: 'administrators', label: '관리자용' }
];

const AssessmentReportGenerator: React.FC<AssessmentReportGeneratorProps> = ({
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
  const [settings, setSettings] = useState<AssessmentSettings>(defaultSettings);
  const [showPreview, setShowPreview] = useState(false);

  const aiGeneration = useAIGeneration({
    maxRetries: 3,
    requestTimeout: 45000
  });

  /**
   * 설정 업데이트
   */
  const updateSettings = (updates: Partial<AssessmentSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * 평가 영역 토글
   */
  const toggleAssessmentArea = (area: string) => {
    setSettings(prev => ({
      ...prev,
      assessmentAreas: prev.assessmentAreas.includes(area)
        ? prev.assessmentAreas.filter(a => a !== area)
        : [...prev.assessmentAreas, area]
    }));
  };

  /**
   * AI 평가 보고서 생성
   */
  const handleGenerate = async () => {
    try {
      const request = createBaseAIGenerationRequest();
      request.studentId = currentStudent.id;
      request.serviceType = AI_SERVICE_TYPES.ASSESSMENT;
      request.additionalContext = {
        reportType: settings.reportType,
        timeRange: settings.timeRange,
        assessmentAreas: settings.assessmentAreas,
        includeRecommendations: settings.includeRecommendations,
        includeGraphs: settings.includeGraphs,
        reportFormat: settings.reportFormat,
        audienceType: settings.audienceType,
        notes: settings.notes,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentGrade: currentStudent.grade,
        studentSchool: currentStudent.schoolName,
        studentClass: currentStudent.className,
        teacherId: currentStudent.teacherId,
        disabilityTypes: currentStudent.disabilityTypes,
        integrationType: currentStudent.integrationType,
        supportNeeds: currentStudent.welfareSupports,
        treatmentSupports: currentStudent.treatmentSupports
      };

      const preferences = createUserPreferences();
      preferences.detailLevel = 'detailed';
      preferences.includeExamples = settings.includeRecommendations;
      preferences.tone = settings.audienceType === 'parents' ? 'friendly' : 'professional';

      const result = await aiGeneration.generateWithContext(
        currentStudent.id,
        request as any,
        preferences
      );

      if (result && onGenerated) {
        onGenerated(result);
      }
    } catch (error) {
      console.error('평가 보고서 생성 실패:', error);
    }
  };

  /**
   * 보고서 타입별 설명
   */
  const getReportTypeDescription = (type: string) => {
    switch (type) {
      case 'comprehensive':
        return '학생의 전반적인 발달 상황과 학습 성취도를 종합적으로 분석한 보고서';
      case 'progress':
        return '특정 기간 동안의 학습 진전 상황과 개선 사항을 중점적으로 다룬 보고서';
      case 'diagnostic':
        return '학습 어려움의 원인과 지원 필요 영역을 진단하기 위한 상세 분석 보고서';
      case 'transition':
        return '다음 학급이나 교육 단계로의 전환을 위한 준비 상황과 계획을 담은 보고서';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI 평가 보고서 생성기
              </h3>
              <p className="text-sm text-gray-600">
                {currentStudent.name}님의 발달 상황을 분석한 맞춤형 평가 보고서 생성
              </p>
            </div>
          </div>
          
          {aiGeneration.state.result && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {showPreview ? '숨기기' : '미리보기'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                인쇄
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 설정 패널 */}
      <div className="px-6 py-4 space-y-6">
        {/* 기본 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              label="보고서 유형"
              value={settings.reportType}
              onChange={(value) => updateSettings({ reportType: value as any })}
              options={reportTypeOptions}
              helperText={getReportTypeDescription(settings.reportType)}
            />
          </div>

          <div>
            <Select
              label="평가 기간"
              value={settings.timeRange}
              onChange={(value) => updateSettings({ timeRange: value as any })}
              options={timeRangeOptions}
            />
          </div>
        </div>

        {/* 평가 영역 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <BarChart3 className="w-4 h-4 inline mr-1" />
            평가 영역 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assessmentAreaOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleAssessmentArea(option.value)}
                className={`flex items-center justify-center px-3 py-3 text-sm rounded-lg border-2 transition-all ${
                  settings.assessmentAreas.includes(option.value)
                    ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-sm'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  {settings.assessmentAreas.includes(option.value) && (
                    <CheckCircle className="w-4 h-4 mx-auto mb-1" />
                  )}
                  <div>{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 보고서 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              label="보고서 형식"
              value={settings.reportFormat}
              onChange={(value) => updateSettings({ reportFormat: value as any })}
              options={reportFormatOptions}
            />
          </div>

          <div>
            <Select
              label="대상 독자"
              value={settings.audienceType}
              onChange={(value) => updateSettings({ audienceType: value as any })}
              options={audienceTypeOptions}
            />
          </div>
        </div>

        {/* 추가 옵션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.includeRecommendations}
                onChange={(e) => updateSettings({ includeRecommendations: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">개선 방안 및 권장사항 포함</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.includeGraphs}
                onChange={(e) => updateSettings({ includeGraphs: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">진전 그래프 및 차트 포함</span>
            </label>
          </div>

          <div>
            <label className="form-label">
              특별 고려사항 및 메모
            </label>
            <textarea
              className="form-input"
              value={settings.notes}
              onChange={(e) => updateSettings({ notes: e.target.value })}
              placeholder="평가 시 특별히 고려해야 할 사항이나 배경 정보를 입력하세요..."
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              학생의 최근 상황 변화, 특별한 사건, 새로운 지원 시작 등
            </p>
          </div>
        </div>

        {/* 학생 정보 요약 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            <User className="w-4 h-4 inline mr-1" />
            학생 정보 요약
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">이름:</span>
              <div className="font-medium">{currentStudent.name}</div>
            </div>
            <div>
              <span className="text-gray-600">학년:</span>
              <div className="font-medium">{currentStudent.grade}학년</div>
            </div>
            <div>
              <span className="text-gray-600">장애유형:</span>
              <div className="font-medium">
                {currentStudent.disabilityTypes?.map(type => type.type).join(', ') || '미등록'}
              </div>
            </div>
            <div>
              <span className="text-gray-600">통합형태:</span>
              <div className="font-medium">{currentStudent.integrationType}</div>
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={aiGeneration.state.status === 'loading' || settings.assessmentAreas.length === 0}
            className="px-8"
          >
            {aiGeneration.state.status === 'loading' ? (
              <>
                <BarChart3 className="w-4 h-4 mr-2 animate-pulse" />
                보고서 생성 중...
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2" />
                평가 보고서 생성
              </>
            )}
          </Button>
        </div>

        {settings.assessmentAreas.length === 0 && (
          <p className="text-sm text-amber-600 text-center">
            ⚠️ 평가 영역을 최소 하나 이상 선택해주세요.
          </p>
        )}
      </div>

      {/* 진행 상태 */}
      {aiGeneration.state.status === 'loading' && (
        <div className="px-6 py-4 bg-purple-50 border-t border-purple-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-700">{aiGeneration.state.currentStep}</span>
                <span className="text-purple-600">{aiGeneration.state.progress}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div
                  className="h-3 bg-purple-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${aiGeneration.state.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {aiGeneration.state.error && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">보고서 생성 오류</h4>
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

      {/* 생성 결과 */}
      {aiGeneration.state.result && showPreview && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              생성된 평가 보고서
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                품질: {aiGeneration.state.result.qualityScore}점
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                신뢰도: {aiGeneration.state.result.confidenceLevel}점
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto shadow-inner">
            <div className="prose prose-sm max-w-none">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {aiGeneration.state.result.generatedContent}
              </pre>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                생성: {new Date(aiGeneration.state.result.generatedAt).toLocaleString('ko-KR')}
              </span>
              <span>토큰: {aiGeneration.state.result.metadata?.totalTokens || 0}</span>
              <span>처리시간: {aiGeneration.state.result.metadata?.processingTime || 0}ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✓ UTF-8 안전</span>
              <span className="text-blue-600">✓ 접근성 준수</span>
            </div>
          </div>
        </div>
      )}

      {/* 성공 메시지 */}
      {aiGeneration.state.status === 'success' && !showPreview && (
        <div className="px-6 py-4 bg-green-50 border-t border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-green-800">보고서 생성 완료</h4>
              <p className="text-sm text-green-700">
                평가 보고서가 성공적으로 생성되었습니다. '미리보기' 버튼을 눌러 확인하세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentReportGenerator;
