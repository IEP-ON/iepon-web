'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { mcpAPI } from '../../lib/api/mcp-endpoints';
import { errorUtils } from '../../lib/error-handler';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  assignedStudents?: number;
  school?: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalStudents: number;
  aiGenerationsToday: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: number;
  errorRate: number;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock 데이터
  const mockUsers: AdminUser[] = [
    {
      id: 'admin-1',
      name: '김관리자',
      email: 'admin@school.edu',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['all'],
      assignedStudents: 0,
      school: '서울특수학교'
    },
    {
      id: 'teacher-1',
      name: '이선생',
      email: 'teacher1@school.edu',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      permissions: ['students.read', 'students.write', 'ai.generate'],
      assignedStudents: 15,
      school: '서울특수학교'
    },
    {
      id: 'teacher-2',
      name: '박선생',
      email: 'teacher2@school.edu',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      permissions: ['students.read', 'students.write', 'ai.generate'],
      assignedStudents: 12,
      school: '서울특수학교'
    },
    {
      id: 'teacher-3',
      name: '최선생',
      email: 'teacher3@school.edu',
      role: 'teacher',
      status: 'inactive',
      lastLogin: '2024-01-10T14:20:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      permissions: ['students.read', 'ai.generate'],
      assignedStudents: 8,
      school: '서울특수학교'
    }
  ];

  const mockMetrics: SystemMetrics = {
    totalUsers: 25,
    activeUsers: 22,
    totalStudents: 150,
    aiGenerationsToday: 45,
    systemHealth: 'healthy',
    uptime: 99.8,
    errorRate: 0.02
  };

  /**
   * 데이터 로드
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock 데이터 로드 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(mockUsers);
      setMetrics(mockMetrics);
      setError(null);
    } catch (err) {
      const standardError = errorUtils.createError(
        'SYSTEM_ERROR' as any,
        'DASHBOARD_LOAD_ERROR',
        '대시보드 데이터를 불러오는데 실패했습니다.',
        'HIGH' as any,
        err
      );
      setError(standardError.userFriendlyMessage || '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 사용자 필터링
   */
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  /**
   * 역할별 아이콘
   */
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Shield className="w-4 h-4 text-red-600" />;
      case 'admin': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'teacher': return <Users className="w-4 h-4 text-green-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  /**
   * 상태별 배지
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: '활성' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: '비활성' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: '정지' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  /**
   * 시스템 상태 색상
   */
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  /**
   * 사용자 상세보기
   */
  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  /**
   * 사용자 상태 변경
   */
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ));
      
      // 실제로는 API 호출
      console.log(`사용자 ${userId} 상태를 ${newStatus}로 변경`);
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <Button onClick={loadDashboardData} variant="outline" className="mt-4">
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">시스템 현황 및 사용자 관리</p>
        </div>
        <Button onClick={() => setShowUserModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          사용자 추가
        </Button>
      </div>

      {/* 시스템 메트릭 카드 */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오늘 AI 생성</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.aiGenerationsToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                metrics.systemHealth === 'healthy' ? 'bg-green-100' : 
                metrics.systemHealth === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${getHealthColor(metrics.systemHealth)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">시스템 상태</p>
                <p className={`text-lg font-bold ${getHealthColor(metrics.systemHealth)}`}>
                  {metrics.systemHealth === 'healthy' ? '정상' :
                   metrics.systemHealth === 'warning' ? '주의' : '위험'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 관리 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">사용자 관리</h2>
        </div>

        {/* 필터 및 검색 */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="이름 또는 이메일 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                options={[
                  { value: 'all', label: '전체 역할' },
                  { value: 'super_admin', label: '슈퍼 관리자' },
                  { value: 'admin', label: '관리자' },
                  { value: 'teacher', label: '교사' }
                ]}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: '전체 상태' },
                  { value: 'active', label: '활성' },
                  { value: 'inactive', label: '비활성' },
                  { value: 'suspended', label: '정지' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* 사용자 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당 학생
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-2 text-sm text-gray-900">
                        {user.role === 'super_admin' ? '슈퍼 관리자' :
                         user.role === 'admin' ? '관리자' : '교사'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.assignedStudents || 0}명
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Edit user:', user.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      {user.role !== 'super_admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 
                            user.status === 'active' ? 'suspended' : 'active'
                          )}
                          className="text-red-600 hover:text-red-900"
                        >
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 조건에 맞는 사용자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">사용자 정보</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">역할</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedUser.role === 'super_admin' ? '슈퍼 관리자' :
                   selectedUser.role === 'admin' ? '관리자' : '교사'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">권한</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedUser.permissions.map(permission => (
                    <span key={permission} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">가입일</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
