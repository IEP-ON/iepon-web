'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Target, BookOpen, Users, PlayCircle, CheckSquare, AlertTriangle, Download, Eye } from 'lucide-react';
import { useAIGeneration } from '../../lib/hooks/useAIGeneration';
import { createBaseAIGenerationRequest, createUserPreferences } from '../../lib/ai-service';
import { AI_SERVICE_TYPES } from '../../lib/ai-types';
import { Student } from '../../lib/types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface LessonPlanGeneratorProps {
  student?: Student;
  onGenerated?: (result: any) => void;
  className?: string;
}

interface LessonPlanSettings {
  planType: 'daily' | 'weekly' | 'monthly';
  duration: number; // 분 단위
  subject: string;
  objectives: string[];
  materials: string[];
  adaptations: string[];
  assessmentMethod: string;
  notes: string;
}

const defaultSettings: LessonPlanSettings = {
  planType: 'weekly',
  duration: 40,
  subject: '국어',
  objectives: [],
  materials: [],
  adaptations: [],
  assessmentMethod: 'observation',
  notes: ''
};

const subjectOptions = [
  { value: '국어', label: '국어' },
  { value: '수학', label: '수학' },
  { value: '사회', label: '사회' },
  { value: '과학', label: '과학' },
  { value: '체육', label: '체육' },
  { value: '음악', label: '음악' },
  { value: '미술', label: '미술' },
  { value: '생활기능', label: '생활기능' },
  { value: '직업훈련', label: '직업훈련' },
  { value: '치료지원', label: '치료지원' }
];

const assessmentOptions = [
  { value: 'observation', label: '관찰평가' },
  { value: 'portfolio', label: '포트폴리오' },
  { value: 'checklist', label: '체크리스트' },
  { value: 'performance', label: '수행평가' },
  { value: 'interview', label: '면담평가' }
];

const commonObjectives = [
  '기본 의사소통 능력 향상',
  '일상생활 기능 습득',
  '사회적 상호작용 증진',
  '문제해결 능력 개발',
  '자립생활 기술 향상',
  '학습 동기 증진',
  '집중력 향상',
  '협력 능력 개발'
];

const commonMaterials = [
  '그림카드',
  '교구',
  '워크시트',
  '멀티미디어 자료',
  '실물 자료',
  '역할놀이 도구',
  '체험용 교구',
  '보조공학기기'
];

const commonAdaptations = [
  '시각적 단서 제공',
  '단계별 설명',
  '반복 학습',
  '충분한 대기시간',
  '개별 지도',
  '소그룹 활동',
  '동료 지원',
  '환경 수정'
];

const LessonPlanGenerator: React.FC<LessonPlanGeneratorProps> = ({
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
  const [settings, setSettings] = useState<LessonPlanSettings>(defaultSettings);
  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newAdaptation, setNewAdaptation] = useState('');

  const aiGeneration = useAIGeneration({
    maxRetries: 3,
    requestTimeout: 30000
  });

  /**
   * 설정 업데이트
   */
  const updateSettings = (updates: Partial<LessonPlanSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  /**
   * 목표 추가/제거
   */
  const addObjective = (objective: string) => {
    if (objective.trim() && !settings.objectives.includes(objective.trim())) {
      updateSettings({
        objectives: [...settings.objectives, objective.trim()]
      });
    }
  };

  const removeObjective = (index: number) => {
    updateSettings({
      objectives: settings.objectives.filter((_, i) => i !== index)
    });
  };

  /**
   * 재료 추가/제거
   */
  const addMaterial = (material: string) => {
    if (material.trim() && !settings.materials.includes(material.trim())) {
      updateSettings({
        materials: [...settings.materials, material.trim()]
      });
    }
  };

  const removeMaterial = (index: number) => {
    updateSettings({
      materials: settings.materials.filter((_, i) => i !== index)
    });
  };

  /**
   * 적응 방법 추가/제거
   */
  const addAdaptation = (adaptation: string) => {
    if (adaptation.trim() && !settings.adaptations.includes(adaptation.trim())) {
      updateSettings({
        adaptations: [...settings.adaptations, adaptation.trim()]
      });
    }
  };

  const removeAdaptation = (index: number) => {
    updateSettings({
      adaptations: settings.adaptations.filter((_, i) => i !== index)
    });
  };

  /**
   * AI 교육계획 생성
   */
  const handleGenerate = async () => {
    try {
      const request = createBaseAIGenerationRequest();
      request.studentId = currentStudent.id;
      request.serviceType = AI_SERVICE_TYPES.LESSON_PLAN;
      request.additionalContext = {
        planType: settings.planType,
        duration: settings.duration,
        subject: settings.subject,
        objectives: settings.objectives,
        materials: settings.materials,
        adaptations: settings.adaptations,
        assessmentMethod: settings.assessmentMethod,
        notes: settings.notes,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentGrade: currentStudent.grade,
        studentSchool: currentStudent.schoolName,
        disabilityTypes: currentStudent.disabilityTypes,
        integrationType: currentStudent.integrationType
      };

      const preferences = createUserPreferences();
      preferences.detailLevel = 'detailed';
      preferences.includeExamples = true;

      const result = await aiGeneration.generateWithContext(
        currentStudent.id,
        request as any,
        preferences
      );

      if (result && onGenerated) {
        onGenerated(result);
      }
    } catch (error) {
      console.error('교육계획 생성 실패:', error);
    }
  };

  /**
   * 태그 렌더링 헬퍼
   */
  const renderTags = (
    items: string[],
    onRemove: (index: number) => void,
    color: string = 'blue'
  ) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs bg-${color}-100 text-${color}-800`}
        >
          {item}
          <button
            onClick={() => onRemove(index)}
            className={`ml-1 text-${color}-600 hover:text-${color}-800`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI 교육계획 생성기
            </h3>
            <p className="text-sm text-gray-600">
              {currentStudent.name}님을 위한 맞춤형 교육계획 작성
            </p>
          </div>
        </div>
      </div>

      {/* 설정 패널 */}
      <div className="px-6 py-4 space-y-6">
        {/* 기본 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              label="계획 유형"
              value={settings.planType}
              onChange={(e) => updateSettings({ planType: e.target.value as 'daily' | 'weekly' | 'monthly' })}
              options={[
                { value: 'daily', label: '일일 계획' },
                { value: 'weekly', label: '주간 계획' },
                { value: 'monthly', label: '월간 계획' }
              ]}
            />
          </div>

          <div>
            <Select
              label="교과"
              value={settings.subject}
              onChange={(e) => updateSettings({ subject: e.target.value })}
              options={subjectOptions}
            />
          </div>

          <div>
            <Input
              label="수업 시간 (분)"
              type="number"
              value={settings.duration.toString()}
              onChange={(e) => updateSettings({ duration: parseInt(e.target.value) || 40 })}
              min="10"
              max="120"
            />
          </div>
        </div>

        {/* 학습 목표 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            학습 목표
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="새 학습목표를 입력하세요..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addObjective(newObjective);
                  setNewObjective('');
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                addObjective(newObjective);
                setNewObjective('');
              }}
            >
              추가
            </Button>
          </div>
          
          {/* 공통 목표 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {commonObjectives.map((objective) => (
              <button
                key={objective}
                onClick={() => addObjective(objective)}
                className="px-2 py-1 text-xs text-left bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                + {objective}
              </button>
            ))}
          </div>

          {renderTags(settings.objectives, removeObjective, 'green')}
        </div>

        {/* 준비물 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4 inline mr-1" />
            준비물 및 교구
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder="준비물을 입력하세요..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addMaterial(newMaterial);
                  setNewMaterial('');
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                addMaterial(newMaterial);
                setNewMaterial('');
              }}
            >
              추가
            </Button>
          </div>

          {/* 공통 준비물 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {commonMaterials.map((material) => (
              <button
                key={material}
                onClick={() => addMaterial(material)}
                className="px-2 py-1 text-xs text-left bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                + {material}
              </button>
            ))}
          </div>

          {renderTags(settings.materials, removeMaterial, 'purple')}
        </div>

        {/* 개별화 적응 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            개별화 적응 방법
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newAdaptation}
              onChange={(e) => setNewAdaptation(e.target.value)}
              placeholder="적응 방법을 입력하세요..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addAdaptation(newAdaptation);
                  setNewAdaptation('');
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                addAdaptation(newAdaptation);
                setNewAdaptation('');
              }}
            >
              추가
            </Button>
          </div>

          {/* 공통 적응 방법 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {commonAdaptations.map((adaptation) => (
              <button
                key={adaptation}
                onClick={() => addAdaptation(adaptation)}
                className="px-2 py-1 text-xs text-left bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                + {adaptation}
              </button>
            ))}
          </div>

          {renderTags(settings.adaptations, removeAdaptation, 'orange')}
        </div>

        {/* 평가 방법 및 특이사항 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="평가 방법"
              value={settings.assessmentMethod}
              onChange={(e) => updateSettings({ assessmentMethod: e.target.value })}
              options={assessmentOptions}
            />
          </div>
          <div>
            <div>
              <label className="form-label">특수 요청사항 및 메모</label>
              <textarea
                className="form-input"
                value={settings.notes}
                onChange={(e) => updateSettings({ notes: e.target.value })}
                placeholder="학생의 특성에 맞는 특별한 고려사항을 입력하세요..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={aiGeneration.state.status === 'loading'}
            className="px-6"
          >
            {aiGeneration.state.status === 'loading' ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                교육계획 생성
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 진행 상태 */}
      {aiGeneration.state.status === 'loading' && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-700">{aiGeneration.state.currentStep}</span>
                <span className="text-blue-600">{aiGeneration.state.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${aiGeneration.state.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {aiGeneration.state.error && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">생성 오류</h4>
              <p className="text-sm text-red-700 mt-1">{aiGeneration.state.error.message}</p>
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
      {aiGeneration.state.result && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">생성된 교육계획</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                미리보기
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {aiGeneration.state.result.generatedContent}
            </pre>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex space-x-4">
              <span>품질: {aiGeneration.state.result.qualityScore}점</span>
              <span>신뢰도: {aiGeneration.state.result.confidenceLevel}점</span>
            </div>
            <span>
              생성 시간: {new Date(aiGeneration.state.result.generatedAt).toLocaleString('ko-KR')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanGenerator;
