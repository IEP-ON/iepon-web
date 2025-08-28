'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Brain, MessageSquare, Palette, FileText, RefreshCw } from 'lucide-react';
import type { TeacherPreferences } from '@/lib/types';

export default function TeacherPreferencesPage() {
  const [preferences, setPreferences] = useState<TeacherPreferences>({
    id: '',
    teacherId: 'teacher-1',
    educationPhilosophy: '',
    preferredMethods: [],
    writingStyle: 'professional',
    tone: 'encouraging',
    aiIntensity: 'medium',
    preferredLanguage: 'ko',
    formalityLevel: 'formal',
    detailLevel: 'moderate',
    includeExamples: true,
    focusAreas: [],
    avoidTerms: [],
    customInstructions: '',
    preferredContentLength: 'medium',
    includeVisualAids: true,
    emphasizePositiveAspects: true,
    createdAt: '',
    updatedAt: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Mock 데이터 로드
  useEffect(() => {
    // 실제로는 API에서 교사의 기존 선호도를 불러옴
    const mockPreferences: TeacherPreferences = {
      id: 'pref-1',
      teacherId: 'teacher-1',
      educationPhilosophy: '학생 중심의 개별화 교육을 통해 각자의 잠재력을 최대한 발휘할 수 있도록 돕는다.',
      preferredMethods: ['개별화교육', '체험학습', '시각적지원'],
      writingStyle: 'professional',
      tone: 'encouraging',
      aiIntensity: 'medium',
      preferredLanguage: 'ko',
      formalityLevel: 'formal',
      detailLevel: 'moderate',
      includeExamples: true,
      focusAreas: ['인지발달', '언어발달', '사회성발달'],
      avoidTerms: ['문제행동', '결함'],
      customInstructions: '긍정적이고 희망적인 표현을 사용하여 학생의 강점을 부각시켜 주세요.',
      preferredContentLength: 'medium',
      includeVisualAids: true,
      emphasizePositiveAspects: true,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z'
    };
    setPreferences(mockPreferences);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreferences(prev => ({
        ...prev,
        updatedAt: new Date().toISOString()
      }));
      
      setSaveMessage('설정이 성공적으로 저장되었습니다.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMethodToggle = (method: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredMethods: prev.preferredMethods.includes(method)
        ? prev.preferredMethods.filter(m => m !== method)
        : [...prev.preferredMethods, method]
    }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const availableMethods = [
    '개별화교육', '협력학습', '체험학습', '시각적지원', 
    '반복학습', '단계별학습', '놀이학습', '프로젝트학습'
  ];

  const availableFocusAreas = [
    '인지발달', '언어발달', '사회성발달', '정서발달', 
    '운동발달', '자조기능', '학습기능', '직업기능'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-8 h-8 text-blue-600" />
                교사 개별화 설정
              </h1>
              <p className="text-gray-600 mt-1">AI 생성 서비스에서 사용할 개인 선호도를 설정합니다</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? '저장 중...' : '설정 저장'}
            </button>
          </div>
          {saveMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 교육 철학 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">교육 철학 및 접근 방식</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나의 교육 철학
                </label>
                <textarea
                  value={preferences.educationPhilosophy}
                  onChange={(e) => setPreferences(prev => ({ ...prev, educationPhilosophy: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="예: 학생 중심의 개별화 교육을 통해 각자의 잠재력을 최대한 발휘할 수 있도록 돕는다."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  선호하는 교수법 (다중 선택)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => handleMethodToggle(method)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        preferences.preferredMethods.includes(method)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI 생성 스타일 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI 생성 스타일 설정</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  문체 스타일
                </label>
                <select
                  value={preferences.writingStyle}
                  onChange={(e) => setPreferences(prev => ({ ...prev, writingStyle: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="formal">격식체</option>
                  <option value="professional">전문적</option>
                  <option value="friendly">친근한</option>
                  <option value="casual">캐주얼</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  어조/톤
                </label>
                <select
                  value={preferences.tone}
                  onChange={(e) => setPreferences(prev => ({ ...prev, tone: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="polite">정중한</option>
                  <option value="encouraging">격려하는</option>
                  <option value="directive">지시적인</option>
                  <option value="supportive">지지적인</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  격식 수준
                </label>
                <select
                  value={preferences.formalityLevel}
                  onChange={(e) => setPreferences(prev => ({ ...prev, formalityLevel: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="very_formal">매우 격식적</option>
                  <option value="formal">격식적</option>
                  <option value="moderate">보통</option>
                  <option value="casual">캐주얼</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세도
                </label>
                <select
                  value={preferences.detailLevel}
                  onChange={(e) => setPreferences(prev => ({ ...prev, detailLevel: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="brief">간략한</option>
                  <option value="moderate">보통</option>
                  <option value="detailed">상세한</option>
                  <option value="comprehensive">포괄적</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AI 생성 강도
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: '없음 (0%)', desc: 'AI 생성 사용 안함' },
                  { value: 'low', label: '낮음 (20%)', desc: '최소한의 AI 도움' },
                  { value: 'medium', label: '보통 (50%)', desc: '적절한 AI 도움' },
                  { value: 'high', label: '높음 (80%)', desc: '적극적 AI 활용' }
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setPreferences(prev => ({ ...prev, aiIntensity: value as any }))}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      preferences.aiIntensity === value
                        ? 'bg-purple-100 border-purple-500'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-gray-600">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 콘텐츠 및 개별화 설정 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">콘텐츠 및 개별화 설정</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  중점 발달 영역 (다중 선택)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableFocusAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => handleFocusAreaToggle(area)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        preferences.focusAreas.includes(area)
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    선호하는 콘텐츠 길이
                  </label>
                  <select
                    value={preferences.preferredContentLength}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferredContentLength: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short">짧게</option>
                    <option value="medium">보통</option>
                    <option value="long">길게</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    추가 옵션
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.includeExamples}
                        onChange={(e) => setPreferences(prev => ({ ...prev, includeExamples: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">예시 포함</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.includeVisualAids}
                        onChange={(e) => setPreferences(prev => ({ ...prev, includeVisualAids: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">시각적 도구 제안</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.emphasizePositiveAspects}
                        onChange={(e) => setPreferences(prev => ({ ...prev, emphasizePositiveAspects: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">긍정적 측면 강조</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용하지 않을 용어들 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={preferences.avoidTerms.join(', ')}
                  onChange={(e) => setPreferences(prev => ({ 
                    ...prev, 
                    avoidTerms: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 문제행동, 결함, 장애아동"
                />
                <p className="text-xs text-gray-500 mt-1">
                  AI가 생성하는 내용에서 피하고 싶은 용어를 입력하세요
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 지침사항
                </label>
                <textarea
                  value={preferences.customInstructions}
                  onChange={(e) => setPreferences(prev => ({ ...prev, customInstructions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="AI 생성 시 특별히 고려해야 할 사항이나 개인적인 지침을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">설정 미리보기</h2>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">현재 설정으로 생성될 예상 스타일:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">문체:</span> {preferences.writingStyle} | <span className="font-medium">어조:</span> {preferences.tone}</p>
                <p><span className="font-medium">AI 강도:</span> {preferences.aiIntensity} | <span className="font-medium">상세도:</span> {preferences.detailLevel}</p>
                <p><span className="font-medium">중점 영역:</span> {preferences.focusAreas.join(', ') || '없음'}</p>
                <p><span className="font-medium">선호 교수법:</span> {preferences.preferredMethods.join(', ') || '없음'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
