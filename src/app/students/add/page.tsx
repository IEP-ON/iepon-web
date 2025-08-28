'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import { User, UserPlus, ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';

interface StudentForm {
  // 기본 정보
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | '';
  phone: string;
  profilePhoto: string;
  
  // 교육 정보
  educationLevel: string;
  schoolName: string;
  grade: number;
  className: string;
  homeTeacherName: string;
  
  // 장애 정보
  disabilityTypes: string[];
  disabilityRegistrationDate: string;
  disabilitySeverity: 'mild' | 'moderate' | 'severe' | '';
  hasWelfareCard: boolean;
  
  // 가족 정보
  guardians: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  }>;
  
  // 의료 정보
  medicalHistory: string;
  currentTreatments: string[];
  medications: string;
  
  // 복지 정보
  supportServices: string[];
  welfareStatus: string;
}

export default function StudentAddPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState<StudentForm>({
    name: '',
    birthDate: '',
    gender: '',
    phone: '',
    profilePhoto: '',
    educationLevel: '',
    schoolName: '',
    grade: 1,
    className: '',
    homeTeacherName: '',
    disabilityTypes: [],
    disabilityRegistrationDate: '',
    disabilitySeverity: '',
    hasWelfareCard: false,
    guardians: [{ name: '', relationship: '', phone: '', email: '', address: '' }],
    medicalHistory: '',
    currentTreatments: [],
    medications: '',
    supportServices: [],
    welfareStatus: '샘플 사용자 데이터'
  });

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const steps = [
    { id: 1, name: '기본정보', icon: User },
    { id: 2, name: '교육정보', icon: UserPlus },
    { id: 3, name: '장애정보', icon: Check },
    { id: 4, name: '가족정보', icon: User },
    { id: 5, name: '의료/복지', icon: Save }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = '이름을 입력해주세요';
      if (!form.birthDate) newErrors.birthDate = '생년월일을 선택해주세요';
      if (!form.gender) newErrors.gender = '성별을 선택해주세요';
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

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    try {
      // 실제 API 호출로 대체 예정
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('학생이 성공적으로 등록되었습니다!');
      router.push('/students');
    } catch (error) {
      console.error('등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학생 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="한글 이름을 입력해주세요"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.birthDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별 <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={form.gender === 'male'}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value as 'male' }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">남성</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={form.gender === 'female'}
                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value as 'female' }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">여성</span>
                </label>
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">교육 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학교명
                </label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(e) => setForm(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="재학 중인 학교명을 입력해주세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학년
                </label>
                <select
                  value={form.grade}
                  onChange={(e) => setForm(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4,5,6].map(grade => (
                    <option key={grade} value={grade}>{grade}학년</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반명
                </label>
                <input
                  type="text"
                  value={form.className}
                  onChange={(e) => setForm(prev => ({ ...prev, className: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 1반, 가반"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  담임교사명
                </label>
                <input
                  type="text"
                  value={form.homeTeacherName}
                  onChange={(e) => setForm(prev => ({ ...prev, homeTeacherName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="담임교사 이름을 입력해주세요"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">단계 {currentStep} 구현 중입니다.</p>
          </div>
        );
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
                <h1 className="text-2xl font-bold text-gray-900">새 학생 등록</h1>
                <p className="text-sm text-gray-600">단계별로 학생 정보를 입력해주세요</p>
              </div>
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-sm ${
                    currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute w-16 h-0.5 mt-5 ml-20 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
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
                      <span>등록 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>등록 완료</span>
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
