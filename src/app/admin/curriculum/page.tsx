'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Book, CheckCircle, Clock, X, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { CurriculumUnit, TEACHING_METHODS } from '@/lib/types';

const mockCurriculums: CurriculumUnit[] = [
  // 국어 교육과정 단원들
  {
    id: 'unit-1',
    unitName: '문장의 구조 이해하기',
    unitNumber: '1-1',
    unitObjectives: '간단한 문장의 주어와 서술어를 구분할 수 있다.',
    educationContent: '주어와 서술어의 개념을 이해하고, 간단한 문장에서 주어와 서술어를 찾는 활동을 통해 문장의 기본 구조를 학습한다.',
    teachingMethods: ['modeling', 'demonstration', 'guided_practice'],
    evaluationPlan: '문장 분석 활동지를 통한 형성평가 및 구술평가',
    subject: '국어',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 4,
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-2',
    unitName: '단어와 문장 만들기',
    unitNumber: '1-2',
    unitObjectives: '주어진 단어를 사용하여 올바른 문장을 만들 수 있다.',
    educationContent: '다양한 단어 카드를 활용하여 의미 있는 문장을 구성하고, 문장의 완성도를 높이는 활동을 한다.',
    teachingMethods: ['hands_on_activities', 'peer_interaction', 'guided_practice'],
    evaluationPlan: '문장 구성 활동 및 발표 평가',
    subject: '국어',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 3,
    createdAt: '2024-02-29T10:00:00Z',
    updatedAt: '2024-02-29T10:00:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-3',
    unitName: '글자와 낱말 읽기',
    unitNumber: '1-3',
    unitObjectives: '한글의 자음과 모음을 조합하여 낱말을 읽을 수 있다.',
    educationContent: '기본적인 한글 조합 원리를 익히고, 일상생활에서 자주 사용하는 낱말을 정확하게 읽는 연습을 한다.',
    teachingMethods: ['visual_learning', 'repetition', 'phonics_approach'],
    evaluationPlan: '낱말 읽기 개별 평가 및 받아쓰기',
    subject: '국어',
    grade: 1,
    difficulty: 'medium' as const,
    estimatedHours: 5,
    createdAt: '2024-02-28T11:00:00Z',
    updatedAt: '2024-02-28T11:00:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-4',
    unitName: '이야기 듣고 이해하기',
    unitNumber: '2-1',
    unitObjectives: '짧은 이야기를 듣고 내용을 파악할 수 있다.',
    educationContent: '그림책과 동화를 활용하여 이야기의 순서, 등장인물, 사건을 파악하고 간단한 질문에 답하는 활동을 한다.',
    teachingMethods: ['storytelling', 'visual_aids', 'discussion'],
    evaluationPlan: '이야기 이해도 구술 평가 및 그림 그리기',
    subject: '국어',
    grade: 2,
    difficulty: 'medium' as const,
    estimatedHours: 4,
    createdAt: '2024-02-27T14:00:00Z',
    updatedAt: '2024-02-27T14:00:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-5',
    unitName: '간단한 글 쓰기',
    unitNumber: '2-2',
    unitObjectives: '자신의 생각이나 경험을 간단한 글로 표현할 수 있다.',
    educationContent: '일기, 편지, 감상문 등 다양한 글쓰기 형식을 익히고, 자신의 경험과 감정을 글로 표현하는 활동을 한다.',
    teachingMethods: ['process_writing', 'peer_feedback', 'scaffolding'],
    evaluationPlan: '글쓰기 포트폴리오 평가',
    subject: '국어',
    grade: 2,
    difficulty: 'hard' as const,
    estimatedHours: 6,
    createdAt: '2024-02-26T09:30:00Z',
    updatedAt: '2024-02-26T09:30:00Z',
    createdBy: 'admin-1'
  },

  // 수학 교육과정 단원들
  {
    id: 'unit-6',
    unitName: '10까지의 수 세기',
    unitNumber: '1-4',
    unitObjectives: '구체물을 이용하여 10까지의 수를 정확히 셀 수 있다.',
    educationContent: '구체물(블록, 과일 모형 등)을 활용하여 1부터 10까지의 수를 세고, 수의 순서와 크기를 비교하는 활동을 한다.',
    teachingMethods: ['demonstration', 'independent_practice', 'visual_learning'],
    evaluationPlan: '구체물 조작 활동 관찰평가',
    subject: '수학',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 6,
    createdAt: '2024-02-28T14:30:00Z',
    updatedAt: '2024-02-28T14:30:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-7',
    unitName: '기본 도형 알아보기',
    unitNumber: '1-5',
    unitObjectives: '원, 삼각형, 사각형의 특징을 구별할 수 있다.',
    educationContent: '다양한 크기와 색깔의 도형을 활용하여 원, 삼각형, 사각형의 모양과 특징을 학습하고, 일상생활에서 도형을 찾아보는 활동을 한다.',
    teachingMethods: ['visual_learning', 'hands_on_activities', 'demonstration'],
    evaluationPlan: '도형 분류 활동 및 실물 도형 찾기 활동 평가',
    subject: '수학',
    grade: 1,
    difficulty: 'medium' as const,
    estimatedHours: 5,
    createdAt: '2024-02-27T10:15:00Z',
    updatedAt: '2024-02-27T10:15:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-8',
    unitName: '덧셈과 뺄셈 기초',
    unitNumber: '2-3',
    unitObjectives: '10 이하의 수에서 덧셈과 뺄셈을 할 수 있다.',
    educationContent: '구체물과 그림을 이용하여 덧셈과 뺄셈의 개념을 이해하고, 간단한 연산 문제를 해결하는 활동을 한다.',
    teachingMethods: ['concrete_abstract', 'step_by_step', 'visual_learning'],
    evaluationPlan: '연산 문제 해결 평가 및 실생활 적용 과제',
    subject: '수학',
    grade: 2,
    difficulty: 'medium' as const,
    estimatedHours: 8,
    createdAt: '2024-02-25T13:20:00Z',
    updatedAt: '2024-02-25T13:20:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-9',
    unitName: '시간 알아보기',
    unitNumber: '2-4',
    unitObjectives: '시계를 보고 정각과 30분을 읽을 수 있다.',
    educationContent: '아날로그 시계와 디지털 시계를 활용하여 시간 읽기를 연습하고, 일상생활의 시간 계획을 세우는 활동을 한다.',
    teachingMethods: ['visual_learning', 'real_life_application', 'practice'],
    evaluationPlan: '시간 읽기 개별 평가 및 시간표 만들기',
    subject: '수학',
    grade: 2,
    difficulty: 'hard' as const,
    estimatedHours: 6,
    createdAt: '2024-02-24T16:45:00Z',
    updatedAt: '2024-02-24T16:45:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-10',
    unitName: '길이와 무게 비교하기',
    unitNumber: '3-1',
    unitObjectives: '물건의 길이와 무게를 비교하여 표현할 수 있다.',
    educationContent: '다양한 물건을 이용하여 길이와 무게를 직접 비교해보고, 길다/짧다, 무겁다/가볍다 등의 표현을 익힌다.',
    teachingMethods: ['hands_on_activities', 'comparison', 'measurement'],
    evaluationPlan: '물건 비교 활동 관찰평가',
    subject: '수학',
    grade: 3,
    difficulty: 'medium' as const,
    estimatedHours: 5,
    createdAt: '2024-02-23T11:30:00Z',
    updatedAt: '2024-02-23T11:30:00Z',
    createdBy: 'admin-1'
  },

  // 사회 교육과정 단원들
  {
    id: 'unit-11',
    unitName: '우리 가족 알아보기',
    unitNumber: '1-6',
    unitObjectives: '가족 구성원의 역할과 소중함을 이해할 수 있다.',
    educationContent: '가족 사진을 통해 가족 구성원을 소개하고, 각자의 역할과 서로를 돕는 방법을 알아보는 활동을 한다.',
    teachingMethods: ['storytelling', 'visual_aids', 'discussion'],
    evaluationPlan: '가족 소개 발표 및 가족 그림 그리기',
    subject: '사회',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 3,
    createdAt: '2024-02-22T10:00:00Z',
    updatedAt: '2024-02-22T10:00:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-12',
    unitName: '우리 학교 둘러보기',
    unitNumber: '2-5',
    unitObjectives: '학교의 여러 공간과 그 기능을 알 수 있다.',
    educationContent: '학교 내 교실, 도서관, 체육관 등을 직접 둘러보며 각 공간의 용도와 이용 방법을 익히는 활동을 한다.',
    teachingMethods: ['field_trip', 'exploration', 'mapping'],
    evaluationPlan: '학교 지도 만들기 및 공간 설명하기',
    subject: '사회',
    grade: 2,
    difficulty: 'easy' as const,
    estimatedHours: 4,
    createdAt: '2024-02-21T14:15:00Z',
    updatedAt: '2024-02-21T14:15:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-13',
    unitName: '우리 동네의 모습',
    unitNumber: '3-2',
    unitObjectives: '동네의 다양한 시설과 그 역할을 파악할 수 있다.',
    educationContent: '동네 산책을 통해 마트, 병원, 우체국 등의 시설을 관찰하고, 각 시설이 주민들에게 제공하는 서비스를 알아본다.',
    teachingMethods: ['community_exploration', 'observation', 'interview'],
    evaluationPlan: '동네 시설 조사 보고서 작성',
    subject: '사회',
    grade: 3,
    difficulty: 'medium' as const,
    estimatedHours: 6,
    createdAt: '2024-02-20T09:45:00Z',
    updatedAt: '2024-02-20T09:45:00Z',
    createdBy: 'admin-1'
  },

  // 과학 교육과정 단원들
  {
    id: 'unit-14',
    unitName: '식물과 동물 관찰하기',
    unitNumber: '1-7',
    unitObjectives: '주변의 식물과 동물의 특징을 관찰하고 구별할 수 있다.',
    educationContent: '학교 화단과 운동장에서 식물과 곤충을 관찰하고, 그들의 생김새와 특징을 기록하는 활동을 한다.',
    teachingMethods: ['observation', 'nature_study', 'recording'],
    evaluationPlan: '관찰 일지 작성 및 발표',
    subject: '과학',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 4,
    createdAt: '2024-02-19T11:20:00Z',
    updatedAt: '2024-02-19T11:20:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-15',
    unitName: '날씨와 계절 변화',
    unitNumber: '2-6',
    unitObjectives: '계절에 따른 날씨 변화를 관찰하고 기록할 수 있다.',
    educationContent: '매일의 날씨를 관찰하고 기록하여 계절별 날씨 패턴을 파악하고, 계절에 맞는 옷차림과 활동을 알아본다.',
    teachingMethods: ['daily_observation', 'data_recording', 'pattern_recognition'],
    evaluationPlan: '날씨 관찰 일기 및 계절별 특징 정리',
    subject: '과학',
    grade: 2,
    difficulty: 'medium' as const,
    estimatedHours: 7,
    createdAt: '2024-02-18T15:30:00Z',
    updatedAt: '2024-02-18T15:30:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-16',
    unitName: '물의 상태 변화',
    unitNumber: '3-3',
    unitObjectives: '물이 얼음, 물, 수증기로 변하는 현상을 관찰할 수 있다.',
    educationContent: '얼음을 녹이고 물을 끓여 수증기로 만드는 실험을 통해 물의 상태 변화를 직접 관찰하고 기록한다.',
    teachingMethods: ['hands_on_experiment', 'observation', 'hypothesis_testing'],
    evaluationPlan: '실험 관찰 기록지 작성 및 결과 발표',
    subject: '과학',
    grade: 3,
    difficulty: 'hard' as const,
    estimatedHours: 5,
    createdAt: '2024-02-17T13:40:00Z',
    updatedAt: '2024-02-17T13:40:00Z',
    createdBy: 'admin-1'
  },

  // 음악 교육과정 단원들
  {
    id: 'unit-17',
    unitName: '동요 부르기',
    unitNumber: '1-8',
    unitObjectives: '간단한 동요를 정확한 가사로 부를 수 있다.',
    educationContent: '"곰 세 마리", "나비야" 등 친숙한 동요를 반복해서 불러보고, 박자에 맞춰 손뼉치기와 함께 노래한다.',
    teachingMethods: ['repetition', 'musical_accompaniment', 'movement_integration'],
    evaluationPlan: '개별 노래 부르기 평가',
    subject: '음악',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 3,
    createdAt: '2024-02-16T10:50:00Z',
    updatedAt: '2024-02-16T10:50:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-18',
    unitName: '악기 소리 구별하기',
    unitNumber: '2-7',
    unitObjectives: '다양한 악기의 소리를 듣고 구별할 수 있다.',
    educationContent: '탬버린, 트라이앵글, 실로폰 등의 악기 소리를 들어보고 각 악기의 특징적인 소리를 구별하는 활동을 한다.',
    teachingMethods: ['auditory_learning', 'instrument_exploration', 'sound_discrimination'],
    evaluationPlan: '악기 소리 맞히기 게임 평가',
    subject: '음악',
    grade: 2,
    difficulty: 'medium' as const,
    estimatedHours: 4,
    createdAt: '2024-02-15T14:25:00Z',
    updatedAt: '2024-02-15T14:25:00Z',
    createdBy: 'admin-1'
  },

  // 미술 교육과정 단원들
  {
    id: 'unit-19',
    unitName: '색깔 익히기',
    unitNumber: '1-9',
    unitObjectives: '기본 색깔을 구별하고 이름을 말할 수 있다.',
    educationContent: '빨강, 노랑, 파랑 등 기본 색깔을 익히고, 색연필과 크레파스를 사용하여 색칠하기 활동을 한다.',
    teachingMethods: ['visual_learning', 'hands_on_activities', 'color_exploration'],
    evaluationPlan: '색깔 구별하기 및 색칠 작품 평가',
    subject: '미술',
    grade: 1,
    difficulty: 'easy' as const,
    estimatedHours: 3,
    createdAt: '2024-02-14T11:35:00Z',
    updatedAt: '2024-02-14T11:35:00Z',
    createdBy: 'admin-1'
  },
  {
    id: 'unit-20',
    unitName: '간단한 그림 그리기',
    unitNumber: '2-8',
    unitObjectives: '자신이 경험한 것을 그림으로 표현할 수 있다.',
    educationContent: '가족, 친구, 좋아하는 동물 등을 자유롭게 그려보고, 그림에 대해 간단히 설명하는 활동을 한다.',
    teachingMethods: ['free_expression', 'storytelling_through_art', 'peer_sharing'],
    evaluationPlan: '그림 작품 포트폴리오 및 작품 설명',
    subject: '미술',
    grade: 2,
    difficulty: 'medium' as const,
    estimatedHours: 5,
    createdAt: '2024-02-13T16:20:00Z',
    updatedAt: '2024-02-13T16:20:00Z',
    createdBy: 'admin-1'
  }
];

export default function AdminCurriculumPage() {
  const [curriculums, setCurriculums] = useState<CurriculumUnit[]>(mockCurriculums);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<CurriculumUnit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<CurriculumUnit>>({
    unitName: '',
    unitNumber: '',
    unitObjectives: '',
    educationContent: '',
    teachingMethods: [],
    evaluationPlan: '',
    subject: '국어',
    grade: 1,
    difficulty: 'medium',
    estimatedHours: 4
  });

  const filteredCurriculums = curriculums.filter(curriculum => {
    const matchesSubject = selectedSubject === 'all' || curriculum.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || curriculum.grade === selectedGrade;
    const matchesSearch = curriculum.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         curriculum.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         curriculum.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesGrade && matchesSearch;
  });

  const subjects = ['국어', '수학', '사회', '과학', '음악', '미술', '체육'];

  const handleCreateUnit = () => {
    setEditingUnit(null);
    setFormData({
      unitName: '',
      unitNumber: '',
      unitObjectives: '',
      educationContent: '',
      teachingMethods: [],
      evaluationPlan: '',
      subject: '국어',
      grade: 1,
      difficulty: 'medium',
      estimatedHours: 4
    });
    setShowCreateModal(true);
  };

  const handleEditUnit = (unit: CurriculumUnit) => {
    setEditingUnit(unit);
    setFormData(unit);
    setShowCreateModal(true);
  };

  const handleDeleteUnit = (id: string) => {
    if (confirm('이 교육과정 단원을 삭제하시겠습니까?')) {
      setCurriculums(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingUnit) {
        setCurriculums(prev => prev.map(u => 
          u.id === editingUnit.id 
            ? { ...u, ...formData, updatedAt: new Date().toISOString() } 
            : u
        ));
      } else {
        const newUnit: CurriculumUnit = {
          ...formData as CurriculumUnit,
          id: `unit-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin-1'
        };
        setCurriculums(prev => [newUnit, ...prev]);
      }

      setShowCreateModal(false);
      setEditingUnit(null);
    } catch (error) {
      console.error('저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeachingMethodToggle = (methodId: string) => {
    setFormData(prev => ({
      ...prev,
      teachingMethods: prev.teachingMethods?.includes(methodId)
        ? prev.teachingMethods.filter(m => m !== methodId)
        : [...(prev.teachingMethods || []), methodId]
    }));
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800', 
      'hard': 'bg-red-100 text-red-800'
    };
    const labels = {
      'easy': '쉬움',
      'medium': '보통',
      'hard': '어려움'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[difficulty as keyof typeof colors]}`}>
        {labels[difficulty as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">교육과정 단원 관리</h1>
          <button
            onClick={handleCreateUnit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            단원 등록
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 단원</p>
                <p className="text-2xl font-bold text-gray-900">{curriculums.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">쉬움 단원</p>
                <p className="text-2xl font-bold text-gray-900">
                  {curriculums.filter(c => c.difficulty === 'easy').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예상시간</p>
                <p className="text-2xl font-bold text-gray-900">
                  {curriculums.reduce((sum, c) => sum + c.estimatedHours, 0)}시간
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">과목</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">전체</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">전체</option>
                {[1, 2, 3, 4, 5, 6].map(grade => (
                  <option key={grade} value={grade}>{grade}학년</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="단원명, 과목, 단원번호로 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 교육과정 목록 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              교육과정 단원 목록 ({filteredCurriculums.length}개)
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCurriculums.length === 0 ? (
              <div className="p-8 text-center">
                <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">검색 조건에 맞는 교육과정 단원이 없습니다.</p>
              </div>
            ) : (
              filteredCurriculums.map((curriculum) => (
                <div key={curriculum.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{curriculum.unitName}</h3>
                        <span className="text-sm text-gray-500">({curriculum.unitNumber})</span>
                        {getDifficultyBadge(curriculum.difficulty)}
                      </div>
                      <p className="text-gray-600 mb-3">{curriculum.unitObjectives}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {curriculum.subject}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {curriculum.grade}학년
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center gap-1">
                          <Clock size={12} />
                          {curriculum.estimatedHours}시간
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        교육방법: {curriculum.teachingMethods.map(method => 
                          TEACHING_METHODS.find(tm => tm.id === method)?.name
                        ).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditUnit(curriculum)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="수정"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(curriculum.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 단원 생성/수정 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingUnit ? '단원 수정' : '새 단원 등록'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">단원명</label>
                    <input
                      type="text"
                      value={formData.unitName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">단원번호</label>
                    <input
                      type="text"
                      value={formData.unitNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">단원목표</label>
                  <textarea
                    value={formData.unitObjectives || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitObjectives: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육내용</label>
                  <textarea
                    value={formData.educationContent || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, educationContent: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">교육방법</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEACHING_METHODS.map((method) => (
                      <label key={method.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.teachingMethods?.includes(method.id) || false}
                          onChange={() => handleTeachingMethodToggle(method.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평가계획</label>
                  <textarea
                    value={formData.evaluationPlan || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, evaluationPlan: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">과목</label>
                    <select
                      value={formData.subject || '국어'}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
                    <select
                      value={formData.grade || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {[1, 2, 3, 4, 5, 6].map(grade => (
                        <option key={grade} value={grade}>{grade}학년</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                    <select
                      value={formData.difficulty || 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="easy">쉬움</option>
                      <option value="medium">보통</option>
                      <option value="hard">어려움</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">예상시간(시간)</label>
                    <input
                      type="number"
                      value={formData.estimatedHours || 4}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="1"
                      max="40"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>처리 중...</>
                    ) : (
                      <>
                        <Save size={18} />
                        {editingUnit ? '수정' : '등록'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
