'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '../common/Select';
import { X, User, School, Heart, FileText } from 'lucide-react';
import { Student, DisabilityType, WelfareSupport, TreatmentSupport, AssistantSupport } from '@/lib/types';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: Partial<Student>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function StudentRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null
}: StudentRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    birthDate: '',
    gender: '남성',
    schoolName: '',
    grade: 1,
    className: '',
    homeTeacherName: '',
    integrationType: '부분통합',
    integrationHours: 0,
    integrationSubjects: [],
    disabilityTypes: [],
    disabilityRegistrationDate: '',
    hasWelfareCard: false,
    disabilitySeverity: '경증',
    welfareSupports: [],
    treatmentSupports: [],
    assistantSupports: [],
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: '기본정보', icon: User },
    { number: 2, title: '교육정보', icon: School },
    { number: 3, title: '장애정보', icon: Heart },
    { number: 4, title: '가족정보', icon: FileText },
    { number: 5, title: '의료/복지', icon: Heart }
  ];

  const disabilityTypeOptions = [
    '지적장애', '자폐성장애', '정서행동장애', '의사소통장애',
    '학습장애', '건강장애', '발달지체', '기타'
  ] as const;

  const integrationSubjects = [
    '국어', '수학', '사회', '과학', '영어', 
    '체육', '음악', '미술', '도덕', '실과'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name?.trim()) {
          newErrors.name = '학생 이름은 필수 입력 사항입니다.';
        }
        if (!formData.birthDate) {
          newErrors.birthDate = '생년월일은 필수 입력 사항입니다.';
        }
        break;
      
      case 2:
        if (!formData.schoolName?.trim()) {
          newErrors.schoolName = '학교명은 필수 입력 사항입니다.';
        }
        if (!formData.className?.trim()) {
          newErrors.className = '학급명은 필수 입력 사항입니다.';
        }
        break;

      case 3:
        if (!formData.disabilityTypes?.length) {
          newErrors.disabilityTypes = '최소 하나의 장애 유형을 선택해주세요.';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        await onSubmit(formData);
        onClose();
        setCurrentStep(1);
        setFormData({
          name: '',
          birthDate: '',
          gender: '남성',
          schoolName: '',
          grade: 1,
          className: '',
          homeTeacherName: '',
          integrationType: '부분통합',
          integrationHours: 0,
          integrationSubjects: [],
          disabilityTypes: [],
          disabilityRegistrationDate: '',
          hasWelfareCard: false,
          disabilitySeverity: '경증',
          welfareSupports: [],
          treatmentSupports: [],
          assistantSupports: [],
          status: 'active'
        });
      } catch (error) {
        console.error('학생 등록 실패:', error);
      }
    }
  };

  const updateFormData = (path: string, value: string | number | boolean | string[] | DisabilityType[]) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: Record<string, unknown> = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, unknown>;
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">신규 학생 등록</h2>
            <p className="text-sm text-gray-600 mt-1">
              특수교육 대상 학생의 기본 정보를 입력해주세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 진행 단계 */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-black bg-black text-white' :
                    isCompleted ? 'border-black bg-black text-white' :
                    'border-gray-300 bg-white text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 w-12 h-0.5 ${
                      isCompleted ? 'bg-black' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 폼 내용 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {error && (
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
            </div>
          )}

          {/* 1단계: 기본 정보 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학생 이름 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                  </label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="학생 이름을 입력하세요"
                    error={errors.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    생년월일 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={(e) => updateFormData('birthDate', e.target.value)}
                    error={errors.birthDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    성별
                  </label>
                  <Select
                    value={formData.gender || '남성'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('gender', e.target.value as '남성' | '여성')}
                    options={[
                      { value: '남성', label: '남자' },
                      { value: '여성', label: '여자' }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2단계: 학교 정보 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">학교 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학교명 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                  </label>
                  <Input
                    value={formData.schoolName || ''}
                    onChange={(e) => updateFormData('schoolName', e.target.value)}
                    placeholder="학교명을 입력하세요"
                    error={errors.schoolName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학년
                  </label>
                  <Select
                    value={String(formData.grade || 1)}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('grade', parseInt(e.target.value))}
                    options={[
                      { value: '1', label: '1학년' },
                      { value: '2', label: '2학년' },
                      { value: '3', label: '3학년' },
                      { value: '4', label: '4학년' },
                      { value: '5', label: '5학년' },
                      { value: '6', label: '6학년' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    학급 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                  </label>
                  <Input
                    value={formData.className || ''}
                    onChange={(e) => updateFormData('className', e.target.value)}
                    placeholder="예: 1반, 2반"
                    error={errors.className}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    담임교사명
                  </label>
                  <Input
                    value={formData.homeTeacherName || ''}
                    onChange={(e) => updateFormData('homeTeacherName', e.target.value)}
                    placeholder="담임교사명을 입력하세요"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">통합교육 정보</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      통합 유형
                    </label>
                    <Select
                      value={formData.integrationType || '부분통합'}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('integrationType', e.target.value as '완전통합' | '부분통합')}
                      options={[
                        { value: '완전통합', label: '완전통합' },
                        { value: '부분통합', label: '부분통합' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주당 통합 시간
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={String(formData.integrationHours || 0)}
                      onChange={(e) => updateFormData('integrationHours', parseInt(e.target.value) || 0)}
                      placeholder="시간 수를 입력하세요"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    통합 과목 (다중 선택 가능)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {integrationSubjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.integrationSubjects?.includes(subject) || false}
                          onChange={(e) => {
                            const currentSubjects = formData.integrationSubjects || [];
                            const newSubjects = e.target.checked
                              ? [...currentSubjects, subject]
                              : currentSubjects.filter((s: string) => s !== subject);
                            updateFormData('integrationSubjects', newSubjects);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3단계: 장애 정보 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">장애 정보</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  장애 유형 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {disabilityTypeOptions.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes?.some(dt => typeof dt === 'string' ? dt === type : dt.type === type) || false}
                        onChange={(e) => {
                          const currentTypes = formData.disabilityTypes || [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, { type, description: undefined } as DisabilityType]
                            : currentTypes.filter((t: DisabilityType) => (typeof t === 'string' ? t !== type : t.type !== type));
                          updateFormData('disabilityTypes', newTypes);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.disabilityTypes && (
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{errors.disabilityTypes}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    장애 등록일
                  </label>
                  <Input
                    type="date"
                    value={formData.disabilityRegistrationDate || ''}
                    onChange={(e) => updateFormData('disabilityRegistrationDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    장애 정도
                  </label>
                  <Select
                    value={formData.disabilitySeverity || '경증'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('disabilitySeverity', e.target.value as '경증' | '중증')}
                    options={[
                      { value: '경증', label: '경증' },
                      { value: '중증', label: '중증' }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasWelfareCard || false}
                    onChange={(e) => updateFormData('hasWelfareCard', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">복지카드 소지</span>
                </label>
              </div>
            </div>
          )}

          {/* 4단계: 가족정보 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">가족정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보호자 이름 *
                  </label>
                  <Input
                    type="text"
                    placeholder="보호자 이름을 입력하세요"
                    value={formData.guardianName || ''}
                    onChange={(e) => updateFormData('guardianName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    관계
                  </label>
                  <Select
                    value={formData.guardianRelation || '부모'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFormData('guardianRelation', e.target.value)}
                    options={[
                      { value: '부모', label: '부모' },
                      { value: '조부모', label: '조부모' },
                      { value: '친척', label: '친척' },
                      { value: '기타', label: '기타' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 *
                  </label>
                  <Input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.guardianPhone || ''}
                    onChange={(e) => updateFormData('guardianPhone', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <Input
                    type="email"
                    placeholder="guardian@example.com"
                    value={formData.guardianEmail || ''}
                    onChange={(e) => updateFormData('guardianEmail', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <Input
                  type="text"
                  placeholder="주소를 입력하세요"
                  value={formData.address || ''}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 5단계: 의료/복지 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">의료/복지</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  복지 지원 현황
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasWelfareCard || false}
                      onChange={(e) => updateFormData('hasWelfareCard', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">복지카드 소지</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasDisabilityAllowance || false}
                      onChange={(e) => updateFormData('hasDisabilityAllowance', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">장애수당 수급</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasCaregiver || false}
                      onChange={(e) => updateFormData('hasCaregiver', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">돌봄 서비스</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  치료 지원 현황
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasSpeechTherapy || false}
                      onChange={(e) => updateFormData('hasSpeechTherapy', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">언어치료</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasOccupationalTherapy || false}
                      onChange={(e) => updateFormData('hasOccupationalTherapy', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">작업치료</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPhysicalTherapy || false}
                      onChange={(e) => updateFormData('hasPhysicalTherapy', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">물리치료</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPsychotherapy || false}
                      onChange={(e) => updateFormData('hasPsychotherapy', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">심리치료</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  특이사항 및 메모
                </label>
                <textarea
                  placeholder="학생의 특성, 주의사항, 기타 중요한 정보를 입력하세요"
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>등록 완료 후</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• 개별화교육계획(IEP) 수립이 가능합니다</li>
                  <li>• 월간/주간 교육계획을 생성할 수 있습니다</li>
                  <li>• AI 분석을 통한 맞춤 교육과정 추천을 받을 수 있습니다</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                이전
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </Button>
            
            {currentStep < 5 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isLoading}
              >
                다음
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? '등록 중...' : '등록 완료'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
