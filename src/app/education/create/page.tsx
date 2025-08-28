'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import { 
  BookOpen, 
  Target, 
  Calendar, 
  FileText, 
  CheckCircle,
  ArrowLeft, 
  ArrowRight, 
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface EducationPlanForm {
  title: string;
  studentId: string;
  startDate: string;
  endDate: string;
  educationGoals: Array<{
    id: string;
    text: string;
    category: 'academic' | 'social' | 'behavioral' | 'self_care';
  }>;
  teachingStrategies: string[];
  assessmentMethods: string[];
  resources: string[];
  specialSupports: string[];
  progressIndicators: string[];
}

interface Student {
  id: string;
  name: string;
  grade: number;
  className: string;
}

export default function EducationCreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [students, setStudents] = useState<Student[]>([]);
  
  const [form, setForm] = useState<EducationPlanForm>({
    title: '',
    studentId: '',
    startDate: '',
    endDate: '',
    educationGoals: [{ id: '1', text: '', category: 'academic' }],
    teachingStrategies: [''],
    assessmentMethods: [''],
    resources: [''],
    specialSupports: [''],
    progressIndicators: ['']
  });

  const user: { name: string; email: string; role: 'teacher' | 'admin' | 'student' } = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher',
  };

  const steps = [
    { id: 1, name: '기본정보', icon: FileText },
    { id: 2, name: '교육목표', icon: Target },
    { id: 3, name: '교수전략', icon: BookOpen },
    { id: 4, name: '평가방법', icon: CheckCircle },
    { id: 5, name: '검토완료', icon: Save }
  ];

  const goalCategories = [
    { value: 'academic', label: '학업 목표' },
    { value: 'social', label: '사회성 목표' },
    { value: 'behavioral', label: '행동 목표' },
    { value: 'self_care', label: '자조기술 목표' }
  ];

  useEffect(() => {
    // 학생 목록 로드 (실제로는 API 호출)
    const mockStudents: Student[] = [
      { id: '1', name: '김민수', grade: 3, className: '1반' },
      { id: '2', name: '이영희', grade: 3, className: '1반' },
      { id: '3', name: '박철수', grade: 4, className: '2반' }
    ];
    setStudents(mockStudents);
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!form.title.trim()) newErrors.title = '계획 제목을 입력해주세요';
        if (!form.studentId) newErrors.studentId = '학생을 선택해주세요';
        if (!form.startDate) newErrors.startDate = '시작일을 선택해주세요';
        if (!form.endDate) newErrors.endDate = '종료일을 선택해주세요';
        break;
      case 2:
        if (form.educationGoals.some(goal => !goal.text.trim())) {
          newErrors.educationGoals = '모든 교육목표를 입력해주세요';
        }
        break;
      case 3:
        if (form.teachingStrategies.some(strategy => !strategy.trim())) {
          newErrors.teachingStrategies = '모든 교수전략을 입력해주세요';
        }
        break;
      case 4:
        if (form.assessmentMethods.some(method => !method.trim())) {
          newErrors.assessmentMethods = '모든 평가방법을 입력해주세요';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const addEducationGoal = () => {
    const newGoal = {
      id: Date.now().toString(),
      text: '',
      category: 'academic' as const
    };
    setForm(prev => ({
      ...prev,
      educationGoals: [...prev.educationGoals, newGoal]
    }));
  };

  const removeEducationGoal = (id: string) => {
    setForm(prev => ({
      ...prev,
      educationGoals: prev.educationGoals.filter(goal => goal.id !== id)
    }));
  };

  const updateEducationGoal = (id: string, text: string, category: string) => {
    setForm(prev => ({
      ...prev,
      educationGoals: prev.educationGoals.map(goal =>
        goal.id === id ? { ...goal, text, category: category as any } : goal
      )
    }));
  };

  const addArrayItem = (field: keyof EducationPlanForm) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof EducationPlanForm, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof EducationPlanForm, index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('교육계획이 성공적으로 생성되었습니다!');
      router.push('/education');
    } catch (error) {
      console.error('생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">교육계획 기본정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계획 제목 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="예: 2024년 1학기 김민수 학생 IEP"
              />
              {errors.title && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대상 학생 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
              </label>
              <select
                value={form.studentId}
                onChange={(e) => setForm(prev => ({ ...prev, studentId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.studentId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">학생을 선택해주세요</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.grade}학년 {student.className})
                  </option>
                ))}
              </select>
              {errors.studentId && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.studentId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일 <span style={{ color: 'var(--color-text-secondary)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.endDate}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">교육목표 설정</h2>
            
            <div className="space-y-4">
              {form.educationGoals.map((goal, index) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">목표 {index + 1}</h3>
                    {form.educationGoals.length > 1 && (
                      <button
                        onClick={() => removeEducationGoal(goal.id)}
                        className="p-1" style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        목표 내용
                      </label>
                      <textarea
                        value={goal.text}
                        onChange={(e) => updateEducationGoal(goal.id, e.target.value, goal.category)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="구체적이고 측정 가능한 교육목표를 입력해주세요"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        목표 유형
                      </label>
                      <select
                        value={goal.category}
                        onChange={(e) => updateEducationGoal(goal.id, goal.text, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {goalCategories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addEducationGoal}
                className="w-full px-4 py-3 border-2 border-dashed rounded-lg flex items-center justify-center space-x-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                <Plus className="w-5 h-5" />
                <span>교육목표 추가</span>
              </button>
            </div>
            
            {errors.educationGoals && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.educationGoals}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">교수전략</h2>
            
            <div className="space-y-4">
              {form.teachingStrategies.map((strategy, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={strategy}
                      onChange={(e) => updateArrayItem('teachingStrategies', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder={`교수전략 ${index + 1}: 구체적인 교수방법을 입력해주세요`}
                    />
                  </div>
                  {form.teachingStrategies.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('teachingStrategies', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => addArrayItem('teachingStrategies')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>교수전략 추가</span>
              </button>
            </div>
            
            {errors.teachingStrategies && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.teachingStrategies}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">평가방법</h2>
            
            <div className="space-y-4">
              {form.assessmentMethods.map((method, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={method}
                      onChange={(e) => updateArrayItem('assessmentMethods', index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder={`평가방법 ${index + 1}: 구체적인 평가방법을 입력해주세요`}
                    />
                  </div>
                  {form.assessmentMethods.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('assessmentMethods', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => addArrayItem('assessmentMethods')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>평가방법 추가</span>
              </button>
            </div>
            
            {errors.assessmentMethods && (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{errors.assessmentMethods}</p>
            )}
          </div>
        );

      case 5:
        const selectedStudent = students.find(s => s.id === form.studentId);
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">교육계획 검토</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">계획 제목</h3>
                <p className="text-gray-700">{form.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">대상 학생</h3>
                <p className="text-gray-700">
                  {selectedStudent ? `${selectedStudent.name} (${selectedStudent.grade}학년 ${selectedStudent.className})` : ''}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">계획 기간</h3>
                <p className="text-gray-700">{form.startDate} ~ {form.endDate}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">교육목표 ({form.educationGoals.length}개)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {form.educationGoals.map((goal, index) => (
                    <li key={goal.id}>
                      [{goalCategories.find(c => c.value === goal.category)?.label}] {goal.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">새로운 교육계획 생성</h1>
                <p className="text-sm text-gray-600">단계별로 개별화 교육계획을 작성해주세요</p>
              </div>
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-sm ${
                    currentStep >= step.id ? 'text-black font-medium' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-5 left-10 w-16 h-0.5 ${
                      currentStep > step.id ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 단계별 콘텐츠 */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전</span>
            </Button>

            <div className="flex space-x-3">
              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2"
                >
                  <span>다음</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>생성 중...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>계획 생성</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
