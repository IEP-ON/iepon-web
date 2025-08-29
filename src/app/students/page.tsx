'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { StudentRegistrationModal } from '@/components/students/StudentRegistrationModal';
import { 
  mockStudents, 
  mockTeachers, 
  getMockStudentsByTeacher
} from '@/lib/mockData';
import { Student, Teacher } from '@/lib/types';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  Heart, 
  Activity,
  HelpingHand,
  X,
  Calendar,
  GraduationCap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | number>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedDisabilityType, setSelectedDisabilityType] = useState<'all' | string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  const handleStudentRegister = async (studentData: Partial<Student>) => {
    try {
      setIsRegistering(true);
      
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 새 학생 데이터 생성
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: studentData.name || '',
        birthDate: studentData.birthDate || '',
        gender: studentData.gender || '남성',
        schoolName: studentData.schoolName || '',
        grade: studentData.grade || 1,
        className: studentData.className || '',
        homeTeacherName: studentData.homeTeacherName || '',
        integrationType: studentData.integrationType || '부분통합',
        integrationHours: studentData.integrationHours || 0,
        integrationSubjects: studentData.integrationSubjects || [],
        disabilityTypes: studentData.disabilityTypes || [],
        disabilityRegistrationDate: studentData.disabilityRegistrationDate || '',
        hasWelfareCard: studentData.hasWelfareCard || false,
        disabilitySeverity: studentData.disabilitySeverity || '경증',
        welfareSupports: studentData.welfareSupports || [],
        treatmentSupports: studentData.treatmentSupports || [],
        assistantSupports: studentData.assistantSupports || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        teacherId: currentTeacher?.id || 'teacher-1'
      };
      
      // 학생 목록에 추가
      setStudents(prev => [newStudent, ...prev]);
      setFilteredStudents(prev => [newStudent, ...prev]);
      
      setShowRegistrationModal(false);
      
      // 성공 알림 (실제로는 토스트 등 사용)
      console.log('학생이 성공적으로 등록되었습니다.');
      
    } catch (error) {
      console.error('학생 등록 실패:', error);
      console.error('학생 등록에 실패했습니다.');
    } finally {
      setIsRegistering(false);
    }
  };

  // 현재 로그인한 교사의 학생 데이터 로드
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 현재 로그인한 교사 정보 가져오기 (실제로는 인증에서 가져옴)
      const teacher = mockTeachers[0]; // 김특수 선생님
      setCurrentTeacher(teacher);
      
      // 해당 교사의 학생들만 가져오기
      const teacherStudents = getMockStudentsByTeacher(teacher.id);
      
      // 통계 데이터 계산
      const stats = {
        total: teacherStudents.length,
        active: teacherStudents.filter(s => s.status === 'active').length,
        withDisability: teacherStudents.filter(s => s.disabilityTypes.length > 0).length,
        needingSupport: teacherStudents.filter(s => 
          s.welfareSupports.length > 0 || 
          s.treatmentSupports.length > 0 || 
          s.assistantSupports.length > 0
        ).length
      };
      
      setStudents(teacherStudents);
      setFilteredStudents(teacherStudents);
      setIsLoading(false);
    };

    loadStudents();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = students;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 학년 필터링
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    // 상태 필터링
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    // 장애 유형 필터링
    if (selectedDisabilityType !== 'all') {
      filtered = filtered.filter(student => 
        student.disabilityTypes.some(disability => disability.type === selectedDisabilityType)
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedGrade, selectedStatus, selectedDisabilityType]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusBadge = (status: Student['status']) => {
    const badges = {
      active: 'badge-success',
      expired: 'badge-neutral',
      pending: 'badge-warning',
      cancelled: 'badge-error',
      error: 'badge-error',
    };

    const labels = {
      active: '활성',
      expired: '만료',
      pending: '대기',
      cancelled: '취소',
      error: '오류',
    };

    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDisabilitySeverityBadge = (severity: '경증' | '중증') => {
    const severityColors = {
      경증: 'badge-primary',
      중증: 'badge-warning',
    };

    return (
      <span className={`badge ${severityColors[severity]}`}>
        {severity}
      </span>
    );
  };

  const getIntegrationTypeBadge = (type: '완전통합' | '부분통합') => {
    const typeColors = {
      완전통합: 'badge-success',
      부분통합: 'badge-warning',
    };

    return (
      <span className={`badge ${typeColors[type]}`}>
        {type}
      </span>
    );
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm('정말로 이 학생을 삭제하시겠습니까?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  const handleViewStudent = (student: Student) => {
    router.push(`/students/${student.id}`);
  };

  const handleEditStudent = (student: Student) => {
    // 수정 로직 구현
  };

  return (
    <Layout user={user}>
      <div className="container animate-fade-in py-8">
        
        {/* 페이지 헤더 */}
        <div className="animate-slide-up mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-heading-1 mb-2">학생 관리</h1>
              <p className="text-body hidden sm:block">
                특수교육 대상 학생들의 정보를 관리하고 모니터링하세요
              </p>
            </div>
            <button
              className="btn btn-primary w-full sm:w-auto btn-touch"
              onClick={() => setShowRegistrationModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span>학생 등록</span>
            </button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="card mb-6">
          <div className="card-body">
            {/* 모바일 우선 레이아웃 */}
            <div className="space-y-4">
              {/* 검색바 - 전체 너비 */}
              <div>
                <Input
                  placeholder="학생 이름, 학교명, 학급으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={20} />}
                />
              </div>
              
              {/* 필터 - 모바일에서는 2x2 그리드, 태블릿 이상에서는 3열 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="form-select w-full"
                  >
                    <option value="all">전체 학년</option>
                    <option value="7">중1 (7학년)</option>
                    <option value="8">중2 (8학년)</option>
                    <option value="9">중3 (9학년)</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedDisabilityType}
                    onChange={(e) => setSelectedDisabilityType(e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="all">전체 장애유형</option>
                    <option value="지적장애">지적장애</option>
                    <option value="자폐성장애">자폐성장애</option>
                    <option value="정서행동장애">정서행동장애</option>
                    <option value="의사소통장애">의사소통장애</option>
                    <option value="학습장애">학습장애</option>
                    <option value="건강장애">건강장애</option>
                    <option value="발달지체">발달지체</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2 lg:col-span-1">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'pending')}
                    className="form-select w-full"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="pending">대기</option>
                    <option value="expired">만료</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="card animate-fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs mb-1">전체 학생</p>
                  <p className="text-heading-3">{students.length}</p>
                </div>
                <GraduationCap className="w-5 h-5" style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
            </div>
          </div>
          <div className="card animate-fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs mb-1">활성 학생</p>
                  <p className="text-heading-3">
                    {students.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              </div>
            </div>
          </div>
          <div className="card animate-fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs mb-1">치료 지원</p>
                  <p className="text-heading-3">
                    {students.reduce((acc, s) => acc + s.treatmentSupports.length, 0)}
                  </p>
                </div>
                <Heart className="w-5 h-5" style={{ color: 'var(--color-red)' }} />
              </div>
            </div>
          </div>
          <div className="card animate-fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs mb-1">복지 지원</p>
                  <p className="text-heading-3">
                    {students.reduce((acc, s) => acc + s.welfareSupports.length, 0)}
                  </p>
                </div>
                <Shield className="w-5 h-5" style={{ color: 'var(--color-blue)' }} />
              </div>
            </div>
          </div>
          <div className="card animate-fade-in">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-xs mb-1">보조 인력</p>
                  <p className="text-heading-3">
                    {students.reduce((acc, s) => acc + s.assistantSupports.length, 0)}
                  </p>
                </div>
                <Users className="w-5 h-5" style={{ color: 'var(--color-orange)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 학생 목록 */}
        <div className="card animate-slide-up">
          <div className="card-header">
            <h2 className="text-heading-4">학생 목록</h2>
            <p className="text-body-sm">
              총 {filteredStudents.length}명의 학생
            </p>
          </div>
          <div style={{ padding: 0 }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid var(--color-border)',
                  borderTop: '2px solid var(--color-black)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span className="ml-3">학생 목록을 불러오는 중...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="text-body mb-2">검색 결과가 없습니다.</p>
                <p className="text-body-sm">
                  다른 검색어나 필터를 시도해보세요.
                </p>
              </div>
            ) : (
              <>
                {/* 데스크톱 테이블 뷰 */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full table-mobile">
                    <thead style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                      <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                          학생 정보
                        </th>
                        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                          학급 및 통합교육
                        </th>
                        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                          장애 정보
                        </th>
                        <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                          지원 현황
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                          상태
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: 'var(--color-white)' }}>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border-light)' }} className="hover:bg-gray-50">
                          <td className="px-3 py-4 align-top">
                            <div>
                              <div className="text-sm mb-1 font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-xs flex items-center text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(student.birthDate)} ({student.gender})
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <div className="text-sm mb-1 font-medium text-gray-900">{student.className}</div>
                            <div className="text-xs mb-2 text-gray-600">{student.grade}학년</div>
                            <div>{getIntegrationTypeBadge(student.integrationType)}</div>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              {student.disabilityTypes.slice(0, 2).map((disability, index) => (
                                <span key={index} className="badge badge-neutral text-xs">
                                  {disability.type}
                                </span>
                              ))}
                              {student.disabilityTypes.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{student.disabilityTypes.length - 2}개 더
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              {getDisabilitySeverityBadge(student.disabilitySeverity)}
                            </div>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center text-xs">
                                <Heart className="w-3 h-3 mr-1" style={{ color: 'var(--color-red)' }} />
                                치료 {student.treatmentSupports.length}개
                              </div>
                              <div className="flex items-center text-xs">
                                <Shield className="w-3 h-3 mr-1" style={{ color: 'var(--color-blue)' }} />
                                복지 {student.welfareSupports.length}개
                              </div>
                              <div className="flex items-center text-xs">
                                <Users className="w-3 h-3 mr-1" style={{ color: 'var(--color-green)' }} />
                                보조 {student.assistantSupports.length}개
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 align-top text-center">
                            {getStatusBadge(student.status)}
                          </td>
                          <td className="px-3 py-4 align-top text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleViewStudent(student)}
                                className="btn btn-ghost btn-xs"
                                title="학생 상세보기"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="btn btn-ghost btn-xs"
                                title="학생 정보 수정"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="btn btn-ghost btn-xs"
                                style={{ color: 'var(--color-red)' }}
                                title="학생 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 모바일/태블릿 카드 뷰 */}
                <div className="lg:hidden space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="card card-interactive">
                      <div className="card-body p-4">
                        {/* 학생 기본 정보 헤더 */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {student.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(student.birthDate)} • {student.gender}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{student.className}</span>
                              <span className="text-sm text-gray-500">{student.grade}학년</span>
                              {getStatusBadge(student.status)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="btn btn-ghost btn-sm"
                              title="학생 상세보기"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="btn btn-ghost btn-sm"
                              title="학생 정보 수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* 통합교육 정보 */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">통합교육:</span>
                            {getIntegrationTypeBadge(student.integrationType)}
                          </div>
                        </div>
                        
                        {/* 장애 정보 */}
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-700 block mb-2">장애 정보:</span>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {student.disabilityTypes.slice(0, 3).map((disability, index) => (
                              <span key={index} className="badge badge-neutral text-xs">
                                {disability.type}
                              </span>
                            ))}
                            {student.disabilityTypes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{student.disabilityTypes.length - 3}개 더
                              </span>
                            )}
                          </div>
                          {getDisabilitySeverityBadge(student.disabilitySeverity)}
                        </div>
                        
                        {/* 지원 현황 */}
                        <div className="border-t border-gray-200 pt-4">
                          <span className="text-sm font-medium text-gray-700 block mb-3">지원 현황:</span>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-1">
                                <Heart className="w-4 h-4" style={{ color: 'var(--color-red)' }} />
                              </div>
                              <div className="text-sm font-medium">{student.treatmentSupports.length}</div>
                              <div className="text-xs text-gray-500">치료지원</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-1">
                                <Shield className="w-4 h-4" style={{ color: 'var(--color-blue)' }} />
                              </div>
                              <div className="text-sm font-medium">{student.welfareSupports.length}</div>
                              <div className="text-xs text-gray-500">복지지원</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-1">
                                <Users className="w-4 h-4" style={{ color: 'var(--color-green)' }} />
                              </div>
                              <div className="text-sm font-medium">{student.assistantSupports.length}</div>
                              <div className="text-xs text-gray-500">보조지원</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 학생 상세 정보 모달 */}
        {selectedStudentForView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">학생 상세 정보</h2>
                <button
                  onClick={() => setSelectedStudentForView(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">기본 정보</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">이름:</span> {selectedStudentForView.name}</p>
                      <p><span className="font-medium">생년월일:</span> {selectedStudentForView.birthDate}</p>
                      <p><span className="font-medium">성별:</span> {selectedStudentForView.gender}</p>
                      <p><span className="font-medium">등록일:</span> {selectedStudentForView.createdAt}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">학교 정보</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">학교:</span> {selectedStudentForView.schoolName}</p>
                      <p><span className="font-medium">학년:</span> {selectedStudentForView.grade}학년</p>
                      <p><span className="font-medium">학급:</span> {selectedStudentForView.className}</p>
                      <p><span className="font-medium">담임교사:</span> {selectedStudentForView.homeTeacherName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">장애 정보</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">장애유형:</span> {selectedStudentForView.disabilityTypes.map(dt => typeof dt === 'string' ? dt : dt.type).join(', ')}</p>
                      <p><span className="font-medium">정도:</span> {selectedStudentForView.disabilitySeverity}</p>
                      <p><span className="font-medium">복지카드:</span> {selectedStudentForView.hasWelfareCard ? '소지' : '미소지'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">통합정보</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">유형:</span> {selectedStudentForView.integrationType}</p>
                      <p><span className="font-medium">주당시간:</span> {selectedStudentForView.integrationHours}시간</p>
                      <p><span className="font-medium">과목:</span> {selectedStudentForView.integrationSubjects.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 학생 등록 모달 */}
        <StudentRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => {
            setShowRegistrationModal(false);
            setRegistrationError(null);
          }}
          onSubmit={handleStudentRegister}
          isLoading={isRegistering}
          error={registrationError}
        />
      </div>
    </Layout>
  );
}
