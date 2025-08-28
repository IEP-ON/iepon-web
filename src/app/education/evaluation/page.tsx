'use client';

import React, { useState, useEffect } from 'react';
import { User, AlertCircle, Brain, FileText, Save, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';

// 타입 정의
interface Student {
  id: string;
  name: string;
  birthDate: string;
  gender: '남성' | '여성';
  schoolName: string;
  grade: number;
  className: string;
  homeTeacherName: string;
  integrationType: '완전통합' | '부분통합' | '특수학급' | '특수학교';
  integrationHours: number;
  integrationSubjects: string[];
  disabilityTypes: string[];
  disabilityRegistrationDate: string;
  hasWelfareCard: boolean;
  disabilitySeverity: '경증' | '중등도' | '중증' | '최중증';
  welfareSupports: string[];
  treatmentSupports: string[];
  assistantSupports: string[];
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

interface MonthlyEvaluation {
  id?: string;
  studentId: string;
  evaluationMonth: string;
  evaluationDate: string;
  semester: '1학기' | '2학기';
  
  // 수행평가 점수 (1-5점)
  performanceScores: {
    cognitive: number;    // 인지 영역
    affective: number;    // 정의 영역
    psychomotor: number;  // 심동 영역
  };
  
  // 개별화 평가 기준
  individualizedCriteria: string[];
  
  // 서술형 평가
  descriptiveEvaluation: {
    strengths: string;      // 강점 및 성취 사항
    challenges: string;     // 도전과제 및 개선점
    growthProgress: string; // 성장과정 및 발전사항
    improvementPlan: string; // 개선방안 및 지원계획
  };
  
  overallScore: number;
  evaluatorId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock 데이터
const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: '김지수',
    birthDate: '2012-05-15',
    gender: '여성',
    schoolName: '희망초등학교',
    grade: 3,
    className: '3-2',
    homeTeacherName: '이영희',
    integrationType: '부분통합',
    integrationHours: 15,
    integrationSubjects: ['국어', '수학', '통합교과'],
    disabilityTypes: ['지적장애'],
    disabilityRegistrationDate: '2018-03-10',
    hasWelfareCard: true,
    disabilitySeverity: '경증',
    welfareSupports: ['복지카드', '교육지원'],
    treatmentSupports: ['언어치료', '인지치료'],
    assistantSupports: ['보조공학기기', '개별지도'],
    status: 'active',
    teacherId: 'teacher-1',
    createdAt: '2023-03-01T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'student-2',
    name: '박민준',
    birthDate: '2011-08-22',
    gender: '남성',
    schoolName: '희망초등학교',
    grade: 4,
    className: '4-1',
    homeTeacherName: '김철수',
    integrationType: '완전통합',
    integrationHours: 25,
    integrationSubjects: ['국어', '수학', '과학', '사회', '체육'],
    disabilityTypes: ['자폐성장애'],
    disabilityRegistrationDate: '2017-12-05',
    hasWelfareCard: true,
    disabilitySeverity: '중등도',
    welfareSupports: ['복지카드', '돌봄서비스', '재활치료'],
    treatmentSupports: ['언어치료', '사회성치료'],
    assistantSupports: ['개별지도', '사회성훈련'],
    status: 'active',
    teacherId: 'teacher-1',
    createdAt: '2023-03-01T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  }
];

export default function MonthlyEvaluationPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [evaluation, setEvaluation] = useState<MonthlyEvaluation>({
    studentId: '',
    evaluationMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    evaluationDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    semester: '1학기',
    performanceScores: {
      cognitive: 3,
      affective: 3,
      psychomotor: 3
    },
    individualizedCriteria: [],
    descriptiveEvaluation: {
      strengths: '',
      challenges: '',
      growthProgress: '',
      improvementPlan: ''
    },
    overallScore: 0,
    evaluatorId: 'teacher-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 개별화 평가기준 자동 설정
  const generateIndividualizedCriteria = (student: Student): string[] => {
    const criteria: string[] = [];
    
    student.disabilityTypes.forEach((type: string) => {
      switch (type) {
        case '지적장애':
          criteria.push('인지능력 수준에 따른 단계별 평가');
          criteria.push('반복학습을 통한 이해도 확인');
          criteria.push('실생활 적용능력 중점 평가');
          break;
        case '자폐성장애':
          criteria.push('사회적 상호작용 능력 평가');
          criteria.push('의사소통 기능 향상도 측정');
          criteria.push('행동 자기조절 능력 관찰');
          break;
      }
    });

    return criteria.length > 0 ? criteria : ['기본 교육과정 기준 평가'];
  };

  // 학생 선택 시 개별화 기준 자동 설정
  const selectStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setEvaluation(prev => ({
        ...prev,
        studentId: student.id,
        individualizedCriteria: generateIndividualizedCriteria(student)
      }));
    }
  };

  // 전체 점수 자동 계산
  useEffect(() => {
    const { cognitive, affective, psychomotor } = evaluation.performanceScores;
    const overallScore = Math.round((cognitive + affective + psychomotor) / 3 * 100) / 100;
    setEvaluation(prev => ({ ...prev, overallScore }));
  }, [evaluation.performanceScores]);

  // AI 서술형 평가 생성
  const generateAIDescriptiveEvaluation = async () => {
    if (!selectedStudent) return;
    
    setIsGeneratingAI(true);
    try {
      // 실제 구현 시 AI API 호출
      await new Promise(resolve => setTimeout(resolve, 3000)); // 시뮬레이션
      
      const aiEvaluation = {
        strengths: `${selectedStudent.name} 학생은 ${evaluation.evaluationMonth}월 평가에서 꾸준한 학습 참여도를 보였으며, 특히 개별화된 지원 하에 기본 학습 목표에 대한 이해를 나타냈습니다.`,
        challenges: '복합적인 과제 수행 시 집중력 유지와 순서적 사고 과정에서 어려움을 보이며, 추가적인 단계별 지원이 필요합니다.',
        growthProgress: '이전 월 대비 과제 지속 시간이 10분 증가하였고, 교사의 지시를 따르는 빈도가 향상되었습니다.',
        improvementPlan: '구체적이고 단계적인 학습 목표 설정과 함께 시각적 보조 자료를 활용한 개별 지도를 지속적으로 제공하겠습니다.'
      };
      
      setEvaluation(prev => ({
        ...prev,
        descriptiveEvaluation: aiEvaluation
      }));
    } catch (error) {
      console.error('AI 생성 실패:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // 평가 저장
  const saveEvaluation = async () => {
    if (!selectedStudent) {
      setSaveError('학생을 선택해주세요.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      // 실제 구현 시 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('월별 평가가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      setSaveError('평가 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDomainName = (domain: string) => {
    switch (domain) {
      case 'cognitive': return '인지 영역';
      case 'affective': return '정의 영역';
      case 'psychomotor': return '심동 영역';
      default: return domain;
    }
  };

  return (
    <Layout user={{ name: '김선생님', email: 'teacher@iepon.kr', role: 'teacher' as const }}>
      <div className="container fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', maxWidth: '64rem' }}>
        <div className="slide-up" style={{ marginBottom: 'var(--space-8)' }}>
          <h1 className="text-heading-1" style={{ marginBottom: 'var(--space-2)' }}>월별 평가</h1>
          <p className="text-body" style={{ color: 'var(--color-neutral-600)' }}>
            학생들의 월별 학습 성과를 평가하고 기록합니다.
          </p>
        </div>

        {saveError && (
          <div className="card fade-in" style={{ 
            marginBottom: 'var(--space-4)',
            backgroundColor: 'var(--color-error-50)',
            border: '1px solid var(--color-error-200)'
          }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-error-600)' }} />
              <span style={{ color: 'var(--color-error-700)' }}>{saveError}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
          {/* 기본 정보 설정 */}
          <div>
            <div className="card slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-header">
                <h3 className="text-heading-3">평가 기본 정보</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>평가 대상 학생</label>
                  <select
                    value={evaluation.studentId}
                    onChange={(e) => selectStudent(e.target.value)}
                    className="input-field"
                  >
                    <option value="">학생을 선택하세요</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.grade}학년)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>평가 월</label>
                  <input
                    type="month"
                    value={evaluation.evaluationMonth}
                    onChange={(e) => setEvaluation(prev => ({ ...prev, evaluationMonth: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>학기</label>
                  <select
                    value={evaluation.semester}
                    onChange={(e) => setEvaluation(prev => ({ ...prev, semester: e.target.value as '1학기' | '2학기' }))}
                    className="input-field"
                  >
                    <option value="1학기">1학기</option>
                    <option value="2학기">2학기</option>
                  </select>
                </div>

                <div>
                  <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>평가 일자</label>
                  <input
                    type="date"
                    value={evaluation.evaluationDate}
                    onChange={(e) => setEvaluation(prev => ({
                      ...prev,
                      evaluationDate: e.target.value
                    }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 학생 개별 정보 */}
          {selectedStudent && (
            <div>
              <div className="card slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="card-header">
                  <h3 className="text-heading-3">학생 정보</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>장애 유형</label>
                    <div className="flex-wrap" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {selectedStudent.disabilityTypes.map((type, index) => (
                        <span key={index} className="badge badge-primary">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>지원 현황</label>
                    <div className="flex-wrap" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {selectedStudent.welfareSupports.map((support, index) => (
                        <span key={index} className="badge badge-success">
                          {support}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>개별화 평가 기준</label>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {evaluation.individualizedCriteria.map((criteria, index) => (
                        <li key={index} className="text-body-sm" style={{ color: 'var(--color-neutral-600)' }}>• {criteria}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 수행평가 */}
          <div>
            <div className="card slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-header">
                <h3 className="text-heading-3">수행평가</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {Object.entries(evaluation.performanceScores).map(([domain, score]) => (
                  <div key={domain}>
                    <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                      <span className="text-label">{getDomainName(domain)}</span>
                      <span className="text-heading-3" style={{ color: 'var(--color-primary-600)' }}>{score}점</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={score}
                        onChange={(e) => {
                          const newScore = parseInt(e.target.value);
                          setEvaluation(prev => ({
                            ...prev,
                            performanceScores: {
                              ...prev.performanceScores,
                              [domain]: newScore
                            }
                          }));
                        }}
                        className="performance-slider"
                        style={{ 
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '6px',
                          appearance: 'none',
                          cursor: 'pointer',
                          outline: 'none',
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((score-1)/4)*100}%, #e2e8f0 ${((score-1)/4)*100}%, #e2e8f0 100%)`
                        }}
                      />
                      <style jsx>{`
                        .performance-slider::-webkit-slider-thumb {
                          appearance: none;
                          height: 20px;
                          width: 20px;
                          border-radius: 50%;
                          background: #3b82f6;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                          cursor: pointer;
                        }
                        .performance-slider::-moz-range-thumb {
                          height: 20px;
                          width: 20px;
                          border-radius: 50%;
                          background: #3b82f6;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                          cursor: pointer;
                          border: none;
                        }
                      `}</style>
                    </div>
                    <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--color-neutral-500)' }}>
                      <span className="font-medium">1점</span>
                      <span className="font-medium">2점</span>
                      <span className="font-medium">3점</span>
                      <span className="font-medium">4점</span>
                      <span className="font-medium">5점</span>
                    </div>
                  </div>
                ))}

                <div style={{ 
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div className="flex-between">
                    <span className="text-label">전체 평균 점수</span>
                    <span className="text-heading-3" style={{ color: 'var(--color-primary-600)' }}>
                      {evaluation.overallScore}/5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 서술형 평가 */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="card-header">
                <div className="flex-between">
                  <h3 className="text-heading-3">서술형 평가</h3>
                  <button
                    onClick={generateAIDescriptiveEvaluation}
                    disabled={isGeneratingAI || !selectedStudent}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                  >
                    {isGeneratingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {isGeneratingAI ? 'AI 생성 중...' : 'AI 자동 생성'}
                  </button>
                </div>
              </div>
              
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>강점 및 성취 사항</label>
                    <textarea
                      value={evaluation.descriptiveEvaluation.strengths}
                      onChange={(e) => setEvaluation(prev => ({
                        ...prev,
                        descriptiveEvaluation: {
                          ...prev.descriptiveEvaluation,
                          strengths: e.target.value
                        }
                      }))}
                      placeholder="학생의 강점과 성취사항을 서술하세요..."
                      rows={4}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>도전과제 및 개선점</label>
                    <textarea
                      value={evaluation.descriptiveEvaluation.challenges}
                      onChange={(e) => setEvaluation(prev => ({
                        ...prev,
                        descriptiveEvaluation: {
                          ...prev.descriptiveEvaluation,
                          challenges: e.target.value
                        }
                      }))}
                      placeholder="도전과제와 개선이 필요한 부분을 서술하세요..."
                      rows={4}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>성장과정 및 발전사항</label>
                    <textarea
                      value={evaluation.descriptiveEvaluation.growthProgress}
                      onChange={(e) => setEvaluation(prev => ({
                        ...prev,
                        descriptiveEvaluation: {
                          ...prev.descriptiveEvaluation,
                          growthProgress: e.target.value
                        }
                      }))}
                      placeholder="학생의 성장과정과 발전사항을 서술하세요..."
                      rows={4}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label className="text-label" style={{ marginBottom: 'var(--space-2)' }}>개선방안 및 지원계획</label>
                    <textarea
                      value={evaluation.descriptiveEvaluation.improvementPlan}
                      onChange={(e) => setEvaluation(prev => ({
                        ...prev,
                        descriptiveEvaluation: {
                          ...prev.descriptiveEvaluation,
                          improvementPlan: e.target.value
                        }
                      }))}
                      placeholder="개선방안과 향후 지원계획을 서술하세요..."
                      rows={4}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex-center" style={{ marginTop: 'var(--space-8)' }}>
          <button
            onClick={saveEvaluation}
            disabled={isSaving || !selectedStudent}
            className="btn btn-primary btn-lg"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)', 
              paddingLeft: 'var(--space-8)',
              paddingRight: 'var(--space-8)'
            }}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? '저장 중...' : '평가 저장'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
