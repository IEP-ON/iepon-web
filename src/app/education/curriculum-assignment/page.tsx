'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Users, BarChart3, Calendar, Brain, Settings, Clock, Target, Award, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import type { Student, CurriculumUnit, CurriculumAssignment } from '@/lib/types';

// 추가 타입 정의
interface CurriculumRecommendation {
  unitId: string;
  unitName: string;
  subject: string;
  confidence: number;
  reason: string;
  expectedLearningSpeed: string;
  estimatedCompletionTime: string;
  supportNeeds: string[];
}

interface TeacherPreferences {
  preferredSubjects: string[];
  teachingStyle: string;
  difficultyPreference: 'easy' | 'medium' | 'hard';
}

export default function CurriculumAssignmentPage() {
  // 상태 관리
  const [students, setStudents] = useState<Student[]>([]);
  const [curriculumUnits, setCurriculumUnits] = useState<CurriculumUnit[]>([]);
  const [assignments, setAssignments] = useState<CurriculumAssignment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recommendations, setRecommendations] = useState<CurriculumRecommendation[]>([]);
  const [teacherPreferences, setTeacherPreferences] = useState<TeacherPreferences | null>(null);
  
  // UI 상태
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk' | 'progress'>('individual');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAIRecommendationModal, setShowAIRecommendationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Mock 데이터
  useEffect(() => {
    setStudents([
      {
        id: 'student-1',
        name: '김민수',
        grade: 3,
        schoolName: '햇빛초등학교',
        className: '3-2',
        homeTeacherName: '이선생님',
        integrationType: '부분통합',
        integrationHours: 15,
        integrationSubjects: ['국어', '수학'],
        disabilityTypes: [{ type: '지적장애' }],
        disabilityRegistrationDate: '2021-03-15',
        hasWelfareCard: true,
        disabilitySeverity: '경증',
        welfareSupports: [],
        treatmentSupports: [],
        assistantSupports: [],
        birthDate: '2015-03-10',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
        status: 'active',
        teacherId: 'teacher-1',
        gender: '남성'
      },
      {
        id: 'student-2',
        name: '이서연',
        grade: 4,
        schoolName: '푸른초등학교',
        className: '4-1',
        homeTeacherName: '박선생님',
        integrationType: '완전통합',
        integrationHours: 25,
        integrationSubjects: ['국어', '수학', '사회'],
        disabilityTypes: [{ type: '학습장애' }],
        disabilityRegistrationDate: '2020-09-01',
        hasWelfareCard: false,
        disabilitySeverity: '경증',
        welfareSupports: [],
        treatmentSupports: [],
        assistantSupports: [],
        birthDate: '2014-05-20',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z',
        status: 'active',
        teacherId: 'teacher-1',
        gender: '여성'
      }
    ]);

    // 관리자 페이지와 동일한 확장된 교육과정 단원 (20개)
    setCurriculumUnits([
      // 국어
      { id: 'unit-1', unitName: '문장의 구조 이해하기', unitNumber: '1-1', unitObjectives: '간단한 문장의 주어와 서술어를 구분할 수 있다.', educationContent: '주어와 서술어의 개념을 이해하고, 간단한 문장에서 주어와 서술어를 찾는 활동을 통해 문장의 기본 구조를 학습한다.', teachingMethods: ['modeling', 'demonstration', 'guided_practice'], evaluationPlan: '문장 분석 활동지를 통한 형성평가 및 구술평가', subject: '국어', grade: 1, difficulty: 'easy' as const, estimatedHours: 4, createdAt: '2024-03-01T09:00:00Z', updatedAt: '2024-03-01T09:00:00Z', createdBy: 'admin-1' },
      { id: 'unit-2', unitName: '단어와 문장 만들기', unitNumber: '1-2', unitObjectives: '주어진 단어를 사용하여 올바른 문장을 만들 수 있다.', educationContent: '다양한 단어 카드를 활용하여 의미 있는 문장을 구성하고, 문장의 완성도를 높이는 활동을 한다.', teachingMethods: ['hands_on_activities', 'peer_interaction', 'guided_practice'], evaluationPlan: '문장 구성 활동 및 발표 평가', subject: '국어', grade: 1, difficulty: 'easy' as const, estimatedHours: 3, createdAt: '2024-02-29T10:00:00Z', updatedAt: '2024-02-29T10:00:00Z', createdBy: 'admin-1' },
      { id: 'unit-3', unitName: '글자와 낱말 읽기', unitNumber: '1-3', unitObjectives: '한글의 자음과 모음을 조합하여 낱말을 읽을 수 있다.', educationContent: '기본적인 한글 조합 원리를 익히고, 일상생활에서 자주 사용하는 낱말을 정확하게 읽는 연습을 한다.', teachingMethods: ['visual_learning', 'repetition', 'phonics_approach'], evaluationPlan: '낱말 읽기 개별 평가 및 받아쓰기', subject: '국어', grade: 1, difficulty: 'medium' as const, estimatedHours: 5, createdAt: '2024-02-28T11:00:00Z', updatedAt: '2024-02-28T11:00:00Z', createdBy: 'admin-1' },
      { id: 'unit-4', unitName: '이야기 듣고 이해하기', unitNumber: '2-1', unitObjectives: '짧은 이야기를 듣고 내용을 파악할 수 있다.', educationContent: '그림책과 동화를 활용하여 이야기의 순서, 등장인물, 사건을 파악하고 간단한 질문에 답하는 활동을 한다.', teachingMethods: ['storytelling', 'visual_aids', 'discussion'], evaluationPlan: '이야기 이해도 구술 평가 및 그림 그리기', subject: '국어', grade: 2, difficulty: 'medium' as const, estimatedHours: 4, createdAt: '2024-02-27T14:00:00Z', updatedAt: '2024-02-27T14:00:00Z', createdBy: 'admin-1' },
      { id: 'unit-5', unitName: '간단한 글 쓰기', unitNumber: '2-2', unitObjectives: '자신의 생각이나 경험을 간단한 글로 표현할 수 있다.', educationContent: '일기, 편지, 감상문 등 다양한 글쓰기 형식을 익히고, 자신의 경험과 감정을 글로 표현하는 활동을 한다.', teachingMethods: ['process_writing', 'peer_feedback', 'scaffolding'], evaluationPlan: '글쓰기 포트폴리오 평가', subject: '국어', grade: 2, difficulty: 'hard' as const, estimatedHours: 6, createdAt: '2024-02-26T09:30:00Z', updatedAt: '2024-02-26T09:30:00Z', createdBy: 'admin-1' },
      // 수학
      { id: 'unit-6', unitName: '10까지의 수 세기', unitNumber: '1-4', unitObjectives: '구체물을 이용하여 10까지의 수를 정확히 셀 수 있다.', educationContent: '구체물(블록, 과일 모형 등)을 활용하여 1부터 10까지의 수를 세고, 수의 순서와 크기를 비교하는 활동을 한다.', teachingMethods: ['demonstration', 'independent_practice', 'visual_learning'], evaluationPlan: '구체물 조작 활동 관찰평가', subject: '수학', grade: 1, difficulty: 'easy' as const, estimatedHours: 6, createdAt: '2024-02-28T14:30:00Z', updatedAt: '2024-02-28T14:30:00Z', createdBy: 'admin-1' },
      { id: 'unit-7', unitName: '기본 도형 알아보기', unitNumber: '1-5', unitObjectives: '원, 삼각형, 사각형의 특징을 구별할 수 있다.', educationContent: '다양한 크기와 색깔의 도형을 활용하여 원, 삼각형, 사각형의 모양과 특징을 학습하고, 일상생활에서 도형을 찾아보는 활동을 한다.', teachingMethods: ['visual_learning', 'hands_on_activities', 'demonstration'], evaluationPlan: '도형 분류 활동 및 실물 도형 찾기 활동 평가', subject: '수학', grade: 1, difficulty: 'medium' as const, estimatedHours: 5, createdAt: '2024-02-27T10:15:00Z', updatedAt: '2024-02-27T10:15:00Z', createdBy: 'admin-1' },
      { id: 'unit-8', unitName: '덧셈과 뺄셈 기초', unitNumber: '2-3', unitObjectives: '10 이하의 수에서 덧셈과 뺄셈을 할 수 있다.', educationContent: '구체물과 그림을 이용하여 덧셈과 뺄셈의 개념을 이해하고, 간단한 연산 문제를 해결하는 활동을 한다.', teachingMethods: ['concrete_abstract', 'step_by_step', 'visual_learning'], evaluationPlan: '연산 문제 해결 평가 및 실생활 적용 과제', subject: '수학', grade: 2, difficulty: 'medium' as const, estimatedHours: 8, createdAt: '2024-02-25T13:20:00Z', updatedAt: '2024-02-25T13:20:00Z', createdBy: 'admin-1' },
      { id: 'unit-9', unitName: '시간 알아보기', unitNumber: '2-4', unitObjectives: '시계를 보고 정각과 30분을 읽을 수 있다.', educationContent: '아날로그 시계와 디지털 시계를 활용하여 시간 읽기를 연습하고, 일상생활의 시간 계획을 세우는 활동을 한다.', teachingMethods: ['visual_learning', 'real_life_application', 'practice'], evaluationPlan: '시간 읽기 개별 평가 및 시간표 만들기', subject: '수학', grade: 2, difficulty: 'hard' as const, estimatedHours: 6, createdAt: '2024-02-24T16:45:00Z', updatedAt: '2024-02-24T16:45:00Z', createdBy: 'admin-1' },
      { id: 'unit-10', unitName: '길이와 무게 비교하기', unitNumber: '3-1', unitObjectives: '물건의 길이와 무게를 비교하여 표현할 수 있다.', educationContent: '다양한 물건을 이용하여 길이와 무게를 직접 비교해보고, 길다/짧다, 무겁다/가볍다 등의 표현을 익힌다.', teachingMethods: ['hands_on_activities', 'comparison', 'measurement'], evaluationPlan: '물건 비교 활동 관찰평가', subject: '수학', grade: 3, difficulty: 'medium' as const, estimatedHours: 5, createdAt: '2024-02-23T11:30:00Z', updatedAt: '2024-02-23T11:30:00Z', createdBy: 'admin-1' },
      // 사회
      { id: 'unit-11', unitName: '우리 가족 알아보기', unitNumber: '1-6', unitObjectives: '가족 구성원의 역할과 소중함을 이해할 수 있다.', educationContent: '가족 사진을 통해 가족 구성원을 소개하고, 각자의 역할과 서로를 돕는 방법을 알아보는 활동을 한다.', teachingMethods: ['storytelling', 'visual_aids', 'discussion'], evaluationPlan: '가족 소개 발표 및 가족 그림 그리기', subject: '사회', grade: 1, difficulty: 'easy' as const, estimatedHours: 3, createdAt: '2024-02-22T10:00:00Z', updatedAt: '2024-02-22T10:00:00Z', createdBy: 'admin-1' },
      { id: 'unit-12', unitName: '우리 학교 둘러보기', unitNumber: '2-5', unitObjectives: '학교의 여러 공간과 그 기능을 알 수 있다.', educationContent: '학교 내 교실, 도서관, 체육관 등을 직접 둘러보며 각 공간의 용도와 이용 방법을 익히는 활동을 한다.', teachingMethods: ['field_trip', 'exploration', 'mapping'], evaluationPlan: '학교 지도 만들기 및 공간 설명하기', subject: '사회', grade: 2, difficulty: 'easy' as const, estimatedHours: 4, createdAt: '2024-02-21T14:15:00Z', updatedAt: '2024-02-21T14:15:00Z', createdBy: 'admin-1' },
      { id: 'unit-13', unitName: '우리 동네의 모습', unitNumber: '3-2', unitObjectives: '동네의 다양한 시설과 그 역할을 파악할 수 있다.', educationContent: '동네 산책을 통해 마트, 병원, 우체국 등의 시설을 관찰하고, 각 시설이 주민들에게 제공하는 서비스를 알아본다.', teachingMethods: ['community_exploration', 'observation', 'interview'], evaluationPlan: '동네 시설 조사 보고서 작성', subject: '사회', grade: 3, difficulty: 'medium' as const, estimatedHours: 6, createdAt: '2024-02-20T09:45:00Z', updatedAt: '2024-02-20T09:45:00Z', createdBy: 'admin-1' },
      // 과학
      { id: 'unit-14', unitName: '식물과 동물 관찰하기', unitNumber: '1-7', unitObjectives: '주변의 식물과 동물의 특징을 관찰하고 구별할 수 있다.', educationContent: '학교 화단과 운동장에서 식물과 곤충을 관찰하고, 그들의 생김새와 특징을 기록하는 활동을 한다.', teachingMethods: ['observation', 'nature_study', 'recording'], evaluationPlan: '관찰 일지 작성 및 발표', subject: '과학', grade: 1, difficulty: 'easy' as const, estimatedHours: 4, createdAt: '2024-02-19T11:20:00Z', updatedAt: '2024-02-19T11:20:00Z', createdBy: 'admin-1' },
      { id: 'unit-15', unitName: '날씨와 계절 변화', unitNumber: '2-6', unitObjectives: '계절에 따른 날씨 변화를 관찰하고 기록할 수 있다.', educationContent: '매일의 날씨를 관찰하고 기록하여 계절별 날씨 패턴을 파악하고, 계절에 맞는 옷차림과 활동을 알아본다.', teachingMethods: ['daily_observation', 'data_recording', 'pattern_recognition'], evaluationPlan: '날씨 관찰 일기 및 계절별 특징 정리', subject: '과학', grade: 2, difficulty: 'medium' as const, estimatedHours: 7, createdAt: '2024-02-18T15:30:00Z', updatedAt: '2024-02-18T15:30:00Z', createdBy: 'admin-1' },
      { id: 'unit-16', unitName: '물의 상태 변화', unitNumber: '3-3', unitObjectives: '물이 얼음, 물, 수증기로 변하는 현상을 관찰할 수 있다.', educationContent: '얼음을 녹이고 물을 끓여 수증기로 만드는 실험을 통해 물의 상태 변화를 직접 관찰하고 기록한다.', teachingMethods: ['hands_on_experiment', 'observation', 'hypothesis_testing'], evaluationPlan: '실험 관찰 기록지 작성 및 결과 발표', subject: '과학', grade: 3, difficulty: 'hard' as const, estimatedHours: 5, createdAt: '2024-02-17T13:40:00Z', updatedAt: '2024-02-17T13:40:00Z', createdBy: 'admin-1' },
      // 음악
      { id: 'unit-17', unitName: '동요 부르기', unitNumber: '1-8', unitObjectives: '간단한 동요를 정확한 가사로 부를 수 있다.', educationContent: '"곰 세 마리", "나비야" 등 친숙한 동요를 반복해서 불러보고, 박자에 맞춰 손뼉치기와 함께 노래한다.', teachingMethods: ['repetition', 'musical_accompaniment', 'movement_integration'], evaluationPlan: '개별 노래 부르기 평가', subject: '음악', grade: 1, difficulty: 'easy' as const, estimatedHours: 3, createdAt: '2024-02-16T10:50:00Z', updatedAt: '2024-02-16T10:50:00Z', createdBy: 'admin-1' },
      { id: 'unit-18', unitName: '악기 소리 구별하기', unitNumber: '2-7', unitObjectives: '다양한 악기의 소리를 듣고 구별할 수 있다.', educationContent: '탬버린, 트라이앵글, 실로폰 등의 악기 소리를 들어보고 각 악기의 특징적인 소리를 구별하는 활동을 한다.', teachingMethods: ['auditory_learning', 'instrument_exploration', 'sound_discrimination'], evaluationPlan: '악기 소리 맞히기 게임 평가', subject: '음악', grade: 2, difficulty: 'medium' as const, estimatedHours: 4, createdAt: '2024-02-15T14:25:00Z', updatedAt: '2024-02-15T14:25:00Z', createdBy: 'admin-1' },
      // 미술  
      { id: 'unit-19', unitName: '색깔 익히기', unitNumber: '1-9', unitObjectives: '기본 색깔을 구별하고 이름을 말할 수 있다.', educationContent: '빨강, 노랑, 파랑 등 기본 색깔을 익히고, 색연필과 크레파스를 사용하여 색칠하기 활동을 한다.', teachingMethods: ['visual_learning', 'hands_on_activities', 'color_exploration'], evaluationPlan: '색깔 구별하기 및 색칠 작품 평가', subject: '미술', grade: 1, difficulty: 'easy' as const, estimatedHours: 3, createdAt: '2024-02-14T11:35:00Z', updatedAt: '2024-02-14T11:35:00Z', createdBy: 'admin-1' },
      { id: 'unit-20', unitName: '간단한 그림 그리기', unitNumber: '2-8', unitObjectives: '자신이 경험한 것을 그림으로 표현할 수 있다.', educationContent: '가족, 친구, 좋아하는 동물 등을 자유롭게 그려보고, 그림에 대해 간단히 설명하는 활동을 한다.', teachingMethods: ['free_expression', 'storytelling_through_art', 'peer_sharing'], evaluationPlan: '그림 작품 포트폴리오 및 작품 설명', subject: '미술', grade: 2, difficulty: 'medium' as const, estimatedHours: 5, createdAt: '2024-02-13T16:20:00Z', updatedAt: '2024-02-13T16:20:00Z', createdBy: 'admin-1' }
    ]);

    setAssignments([
      {
        id: 'assignment-1',
        studentId: 'student-1',
        unitId: 'unit-1',
        assignedBy: 'teacher-1',
        assignmentReason: '현재 언어 발달 수준에 적합',
        assignedMonths: ['2024-03'],
        difficultyAdjustment: 'easy' as const,
        individualizedGoals: ['간단한 문장으로 감정 표현하기'],
        estimatedSessionTime: 30,
        supportMaterials: ['그림카드', '녹음기'],
        specialConsiderations: '집중력 향상 필요',
        progressStatus: 'in_progress',
        progressPercentage: 45,
        progressNotes: '',
        levelCompatibility: 85,
        learningLoad: 60,
        successPrediction: 78,
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
        status: 'active'
      }
    ]);
  }, []);

  // 학생 선택 핸들러
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    // AI 추천 생성
    generateRecommendations(student.id);
  };

  // AI 추천 생성
  const generateRecommendations = async (studentId: string) => {
    setIsGeneratingRecommendations(true);
    // Mock AI 추천
    setTimeout(() => {
      setRecommendations([
        { unitId: 'unit-2', unitName: '생각을 나타내요', subject: '국어', confidence: 0.89, reason: '현재 수준에서 다음 단계로 적합', expectedLearningSpeed: '보통', estimatedCompletionTime: '4주', supportNeeds: ['시각적 도구', '반복 학습'] }
      ]);
      setIsGeneratingRecommendations(false);
    }, 2000);
  };

  // 배정 생성 핸들러
  const handleCreateAssignment = () => {
    // 실제 구현에서는 폼 데이터 처리
    console.log('교육과정 배정이 완료되었습니다.');
    setShowAssignmentModal(false);
  };

  const filteredUnits = curriculumUnits.filter(unit => {
    const matchesSearch = unit.unitName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         unit.educationContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || unit.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || unit.grade.toString() === selectedGrade;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
                교육과정 배정 관리
              </h1>
              <p className="text-gray-600 mt-1">학생별 맞춤형 교육과정을 배정하고 관리합니다</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIRecommendationModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI 추천 받기
              </button>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                새 배정 생성
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'individual', name: '개별 배정', icon: Users },
              { id: 'bulk', name: '대량 배정', icon: Settings },
              { id: 'progress', name: '진도 현황', icon: BarChart3 }
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 학생 목록 */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">담당 학생</h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.grade}학년 · {student.className}</div>
                    <div className="text-xs text-gray-500">{student.integrationType}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="col-span-9">
            {activeTab === 'individual' && (
              <div className="space-y-6">
                {/* 학생 정보 */}
                {selectedStudent && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedStudent.name} 학생 정보
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">학년:</span> {selectedStudent.grade}학년
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">통합 형태:</span> {selectedStudent.integrationType}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">통합 시간:</span> 주 {selectedStudent.integrationHours}시간
                      </div>
                    </div>
                  </div>
                )}

                {/* AI 추천 */}
                {recommendations.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI 추천 교육과정
                    </h3>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-600" />
                                {rec.unitName}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">{rec.subject}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-600">
                                  {Math.round(rec.confidence * 100)}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">신뢰도</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded">{rec.reason}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>완료 예상: {rec.estimatedCompletionTime}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <BarChart3 className="w-3 h-3" />
                              <span>학습 속도: {rec.expectedLearningSpeed}</span>
                            </div>
                          </div>
                          {rec.supportNeeds.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 mb-1">필요 지원:</div>
                              <div className="flex flex-wrap gap-1">
                                {rec.supportNeeds.map((need, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                    {need}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setShowAssignmentModal(true)}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                            >
                              이 추천 배정하기
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 교육과정 단원 목록 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">교육과정 단원</h3>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="단원 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">전체 과목</option>
                        <option value="국어">국어</option>
                        <option value="수학">수학</option>
                        <option value="사회">사회</option>
                        <option value="과학">과학</option>
                        <option value="음악">음악</option>
                        <option value="미술">미술</option>
                      </select>
                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">전체 학년</option>
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {filteredUnits.map((unit) => (
                      <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{unit.unitName}</h4>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {unit.subject}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {unit.grade}학년
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{unit.educationContent}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>예상 시간: {unit.estimatedHours}시간</span>
                              <span>난이도: {unit.difficulty}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowAssignmentModal(true)}
                            disabled={!selectedStudent}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-300"
                          >
                            배정하기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배정 현황 및 진도</h3>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">국어 1단원</h4>
                          <p className="text-sm text-gray-600">김민수 학생</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {assignment.progressPercentage}%
                          </div>
                          <div className="text-xs text-gray-500">진도율</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${assignment.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>상태: {assignment.progressStatus}</div>
                        <div>적합성: {assignment.levelCompatibility}%</div>
                        <div>성공 예측: {assignment.successPrediction}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 배정 생성 모달 */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">새 교육과정 배정</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배정 월 선택
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['3월', '4월', '5월', '6월'].map((month) => (
                      <button
                        key={month}
                        className="p-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배정 사유
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="해당 단원을 배정하는 이유를 입력하세요..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  배정 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}
