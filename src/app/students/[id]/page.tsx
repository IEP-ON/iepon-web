'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  School, 
  Shield, 
  Heart, 
  Users, 
  FileText, 
  Edit, 
  ArrowLeft,
  Phone,
  MapPin,
  Briefcase,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Student, WelfareSupport, TreatmentSupport, AssistantSupport } from '@/lib/types';

// Mock 학생 데이터 (개발문서 기준 상세 정보 포함)
const mockStudentDetail: Student = {
  id: "student-1",
  name: "김민수",
  birthDate: "2015-03-15",
  gender: "남성",
  schoolName: "서울초등학교",
  grade: 3,
  className: "3-2",
  homeTeacherName: "이선생님",
  integrationType: "부분통합",
  integrationHours: 20,
  integrationSubjects: ["국어", "수학", "과학"],
  disabilityTypes: [
    { type: "자폐성장애", description: "경미한 자폐 스펙트럼 장애" },
    { type: "의사소통장애", description: "언어 발달 지연" }
  ],
  disabilityRegistrationDate: "2020-01-15",
  hasWelfareCard: true,
  disabilitySeverity: "경증",
  welfareSupports: [
    {
      id: "welfare-1",
      type: "장애아동수당",
      agency: "구청 복지과",
      content: "월 20만원 지원",
      startDate: "2020-01-01",
      status: "active"
    },
    {
      id: "welfare-2", 
      type: "보육료지원",
      agency: "교육청",
      content: "특수교육 관련 서비스 지원",
      startDate: "2020-03-01",
      status: "active"
    }
  ],
  treatmentSupports: [
    {
      id: "treatment-1",
      type: "언어치료",
      frequency: "주2회",
      agency: "서울언어치료센터",
      therapistName: "박언어치료사",
      therapistContact: "010-1234-5678",
      startDate: "2020-06-01",
      status: "active"
    },
    {
      id: "treatment-2",
      type: "작업치료", 
      frequency: "주1회",
      agency: "아동발달센터",
      therapistName: "김작업치료사",
      therapistContact: "010-2345-6789",
      startDate: "2021-01-01",
      status: "active"
    }
  ],
  assistantSupports: [
    {
      id: "assistant-1",
      type: "특수교육실무사",
      hoursPerWeek: 15,
      name: "정실무사",
      contact: "010-3456-7890",
      startDate: "2022-03-01",
      status: "active"
    }
  ],
  createdAt: "2020-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  status: "active",
  teacherId: "teacher-1"
};

// 보호자 정보 (개발문서 기준)
const mockGuardians = [
  {
    id: "guardian-1",
    name: "김아버지",
    relationship: "부",
    phone: "010-1111-2222",
    email: "father@example.com",
    address: "서울시 강남구 테헤란로 123",
    occupation: "회사원",
    isPrimary: true
  },
  {
    id: "guardian-2", 
    name: "김어머니",
    relationship: "모",
    phone: "010-3333-4444",
    email: "mother@example.com",
    address: "서울시 강남구 테헤란로 123",
    occupation: "주부",
    isPrimary: false
  }
];

const StudentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [guardians, setGuardians] = useState(mockGuardians);
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(true);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  useEffect(() => {
    // 실제로는 API에서 학생 정보를 가져옴
    setStudent(mockStudentDetail);
    setIsLoading(false);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || styles.active}`}>
        {status === 'active' ? '활성' : status === 'pending' ? '대기' : '취소'}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      경증: 'bg-blue-100 text-blue-800',
      중증: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[severity as keyof typeof styles] || styles.경증}`}>
        {severity}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout user={user}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">학생을 찾을 수 없습니다</h2>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                학생 목록으로
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-600">학생 상세 정보</p>
              </div>
            </div>
            <Button onClick={() => router.push(`/students/${student.id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              정보 수정
            </Button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'basic', name: '기본 정보', icon: User },
              { id: 'disability', name: '장애 정보', icon: Shield },
              { id: 'support', name: '지원 현황', icon: Heart },
              { id: 'guardian', name: '보호자 정보', icon: Users },
              { id: 'documents', name: '첨부서류', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="space-y-6">
          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">학생 기본 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">이름</p>
                      <p className="text-sm text-gray-900">{student.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">생년월일</p>
                      <p className="text-sm text-gray-900">{formatDate(student.birthDate)} ({student.gender})</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">학교 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <School className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">소속 학교</p>
                      <p className="text-sm text-gray-900">{student.schoolName}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">학급</p>
                      <p className="text-sm text-gray-900">{student.grade}학년 {student.className}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">담임교사</p>
                      <p className="text-sm text-gray-900">{student.homeTeacherName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">통합교육 정보</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">통합 유형</p>
                    <p className="text-sm text-gray-900">{student.integrationType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">주당 통합 시간</p>
                    <p className="text-sm text-gray-900">{student.integrationHours}시간</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">통합 과목</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {student.integrationSubjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 장애 정보 탭 */}
          {activeTab === 'disability' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">장애 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">장애 유형</p>
                    <div className="mt-2 space-y-2">
                      {student.disabilityTypes.map((disability, index) => (
                        <div key={index} className="border rounded p-3">
                          <p className="font-medium text-sm">{disability.type}</p>
                          {disability.description && (
                            <p className="text-xs text-gray-600 mt-1">{disability.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">장애 등록일</p>
                    <p className="text-sm text-gray-900">{formatDate(student.disabilityRegistrationDate)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">장애 정도</p>
                    <div className="mt-1">
                      {getSeverityBadge(student.disabilitySeverity)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">복지카드 소지</p>
                    <div className="flex items-center mt-1">
                      {student.hasWelfareCard ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-900">
                        {student.hasWelfareCard ? '소지' : '미소지'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 지원 현황 탭 */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {/* 복지 지원 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">복지 지원</h3>
                <div className="space-y-4">
                  {student.welfareSupports.map((support) => (
                    <div key={support.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{support.type}</h4>
                        {getStatusBadge(support.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">지원 기관:</span> {support.agency}</p>
                          <p><span className="font-medium">지원 내용:</span> {support.content}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">시작일:</span> {formatDate(support.startDate)}</p>
                          {support.endDate && (
                            <p><span className="font-medium">종료일:</span> {formatDate(support.endDate)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 치료 지원 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">치료 지원</h3>
                <div className="space-y-4">
                  {student.treatmentSupports.map((treatment) => (
                    <div key={treatment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{treatment.type}</h4>
                        {getStatusBadge(treatment.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">빈도:</span> {treatment.frequency}</p>
                          <p><span className="font-medium">기관:</span> {treatment.agency}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">담당자:</span> {treatment.therapistName}</p>
                          <p><span className="font-medium">연락처:</span> {treatment.therapistContact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 보조인력 지원 */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">보조인력 지원</h3>
                <div className="space-y-4">
                  {student.assistantSupports.map((assistant) => (
                    <div key={assistant.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{assistant.type}</h4>
                        {getStatusBadge(assistant.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">주당 시간:</span> {assistant.hoursPerWeek}시간</p>
                          <p><span className="font-medium">담당자:</span> {assistant.name}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">연락처:</span> {assistant.contact}</p>
                          <p><span className="font-medium">시작일:</span> {formatDate(assistant.startDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 보호자 정보 탭 */}
          {activeTab === 'guardian' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">보호자 정보</h3>
              <div className="space-y-6">
                {guardians.map((guardian) => (
                  <div key={guardian.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {guardian.name} ({guardian.relationship})
                        {guardian.isPrimary && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            주보호자
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>연락처: {guardian.phone}</span>
                        </div>
                        {guardian.email && (
                          <div className="flex items-center">
                            <span className="w-4 h-4 mr-2">@</span>
                            <span>이메일: {guardian.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {guardian.occupation && (
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2" />
                            <span>직업: {guardian.occupation}</span>
                          </div>
                        )}
                        {guardian.address && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>주소: {guardian.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 첨부서류 탭 */}
          {activeTab === 'documents' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">첨부서류</h3>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">첨부된 서류가 없습니다.</p>
                <Button variant="outline" className="mt-4">
                  서류 업로드
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetailPage;
