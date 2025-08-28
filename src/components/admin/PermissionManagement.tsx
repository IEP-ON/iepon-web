'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Lock, 
  Unlock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { permissionManager, Permission, Role, UserPermissions } from '../../lib/auth/permission-manager';
import { errorUtils } from '../../lib/error-handler';

interface PermissionManagementProps {
  className?: string;
}

const PermissionManagement: React.FC<PermissionManagementProps> = ({ className = '' }) => {
  const [users, setUsers] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserPermissions | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStats, setPermissionStats] = useState<any>(null);

  // 권한 옵션들
  const permissionOptions: { value: Permission; label: string; category: string }[] = [
    { value: 'students.read', label: '학생 정보 조회', category: '학생 관리' },
    { value: 'students.write', label: '학생 정보 수정', category: '학생 관리' },
    { value: 'students.delete', label: '학생 정보 삭제', category: '학생 관리' },
    { value: 'ai.generate', label: 'AI 생성 서비스', category: 'AI 서비스' },
    { value: 'ai.read', label: 'AI 결과 조회', category: 'AI 서비스' },
    { value: 'reports.read', label: '보고서 조회', category: '보고서' },
    { value: 'reports.write', label: '보고서 작성', category: '보고서' },
    { value: 'users.read', label: '사용자 조회', category: '사용자 관리' },
    { value: 'users.write', label: '사용자 관리', category: '사용자 관리' },
    { value: 'users.delete', label: '사용자 삭제', category: '사용자 관리' },
    { value: 'system.read', label: '시스템 정보 조회', category: '시스템' },
    { value: 'system.write', label: '시스템 설정', category: '시스템' },
    { value: 'settings.read', label: '설정 조회', category: '설정' },
    { value: 'settings.write', label: '설정 수정', category: '설정' }
  ];

  /**
   * 데이터 로드
   */
  useEffect(() => {
    loadPermissionData();
  }, []);

  const loadPermissionData = async () => {
    try {
      setLoading(true);
      
      // Mock 사용자 권한 데이터
      const mockUsers: UserPermissions[] = [
        {
          userId: 'admin-1',
          role: 'super_admin',
          permissions: ['all'],
          isActive: true,
          restrictions: undefined,
          validUntil: undefined
        },
        {
          userId: 'teacher-1',
          role: 'teacher',
          permissions: ['students.read', 'students.write', 'ai.generate', 'ai.read', 'reports.read'],
          isActive: true,
          restrictions: {
            schoolIds: ['school-1'],
            studentIds: ['student-1', 'student-2', 'student-3']
          },
          validUntil: '2024-12-31T23:59:59Z'
        },
        {
          userId: 'teacher-2',
          role: 'teacher',
          permissions: ['students.read', 'students.write', 'ai.generate', 'reports.read'],
          isActive: true,
          restrictions: {
            schoolIds: ['school-1'],
            studentIds: ['student-4', 'student-5']
          }
        },
        {
          userId: 'admin-2',
          role: 'admin',
          permissions: ['students.read', 'students.write', 'ai.generate', 'ai.read', 'reports.read', 'reports.write', 'users.read', 'system.read'],
          isActive: false,
          restrictions: {
            schoolIds: ['school-1']
          }
        }
      ];

      // 권한 관리자에 등록
      mockUsers.forEach(user => {
        permissionManager.registerUserPermissions(user);
      });

      setUsers(mockUsers);
      setPermissionStats(permissionManager.getPermissionStats());
      setError(null);
    } catch (err) {
      const standardError = errorUtils.createError(
        'SYSTEM_ERROR' as any,
        'PERMISSION_LOAD_ERROR',
        '권한 데이터를 불러오는데 실패했습니다.',
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
    const matchesSearch = user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  /**
   * 역할별 색상
   */
  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'super_admin': return 'text-red-600 bg-red-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'teacher': return 'text-green-600 bg-green-100';
      case 'readonly': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  /**
   * 권한 수정 모달 열기
   */
  const handleEditPermissions = (user: UserPermissions) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  /**
   * 권한 저장
   */
  const handleSavePermissions = async (updatedPermissions: Partial<UserPermissions>) => {
    if (!selectedUser) return;

    try {
      permissionManager.updateUserPermissions(selectedUser.userId, updatedPermissions);
      
      // UI 상태 업데이트
      setUsers(prev => prev.map(user => 
        user.userId === selectedUser.userId 
          ? { ...user, ...updatedPermissions }
          : user
      ));
      
      setPermissionStats(permissionManager.getPermissionStats());
      setShowPermissionModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('권한 저장 실패:', err);
    }
  };

  /**
   * 사용자 상태 토글
   */
  const handleToggleUserStatus = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;

    const updatedStatus = !user.isActive;
    permissionManager.updateUserPermissions(userId, { isActive: updatedStatus });
    
    setUsers(prev => prev.map(u => 
      u.userId === userId ? { ...u, isActive: updatedStatus } : u
    ));
    
    setPermissionStats(permissionManager.getPermissionStats());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">권한 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <Button onClick={loadPermissionData} variant="outline" size="sm" className="mt-2">
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 권한 통계 */}
      {permissionStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                <p className="text-xl font-bold text-gray-900">{permissionStats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                <p className="text-xl font-bold text-gray-900">{permissionStats.activeUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">관리자</p>
                <p className="text-xl font-bold text-gray-900">
                  {permissionStats.roleDistribution.admin + permissionStats.roleDistribution.super_admin}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">교사</p>
                <p className="text-xl font-bold text-gray-900">{permissionStats.roleDistribution.teacher}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="사용자 ID 검색..."
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
                { value: 'teacher', label: '교사' },
                { value: 'readonly', label: '읽기 전용' }
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: '전체 상태' },
                { value: 'active', label: '활성' },
                { value: 'inactive', label: '비활성' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 사용자 권한 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">사용자별 권한 관리</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사용자 ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">역할</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">권한 수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제한사항</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유효기간</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role === 'super_admin' ? '슈퍼 관리자' :
                       user.role === 'admin' ? '관리자' :
                       user.role === 'teacher' ? '교사' : '읽기 전용'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.permissions.includes('all') ? '전체' : user.permissions.length}개
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.restrictions ? (
                      <div className="text-xs">
                        {user.restrictions.schoolIds && <div>학교: {user.restrictions.schoolIds.length}개</div>}
                        {user.restrictions.studentIds && <div>학생: {user.restrictions.studentIds.length}명</div>}
                      </div>
                    ) : (
                      '없음'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.validUntil ? (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(user.validUntil).toLocaleDateString('ko-KR')}
                      </div>
                    ) : (
                      '무제한'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPermissions(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.userId)}
                        className={user.isActive ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 조건에 맞는 사용자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 권한 수정 모달 */}
      {showPermissionModal && selectedUser && (
        <PermissionEditModal
          user={selectedUser}
          permissionOptions={permissionOptions}
          onSave={handleSavePermissions}
          onClose={() => {
            setShowPermissionModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

/**
 * 권한 편집 모달
 */
interface PermissionEditModalProps {
  user: UserPermissions;
  permissionOptions: { value: Permission; label: string; category: string }[];
  onSave: (permissions: Partial<UserPermissions>) => void;
  onClose: () => void;
}

const PermissionEditModal: React.FC<PermissionEditModalProps> = ({
  user,
  permissionOptions,
  onSave,
  onClose
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(user.permissions);
  const [isActive, setIsActive] = useState(user.isActive);
  const [validUntil, setValidUntil] = useState(user.validUntil || '');

  const togglePermission = (permission: Permission) => {
    if (selectedPermissions.includes('all')) return; // 슈퍼 관리자는 수정 불가
    
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    onSave({
      permissions: selectedPermissions,
      isActive,
      validUntil: validUntil || undefined
    });
  };

  // 카테고리별 권한 그룹화
  const groupedPermissions = permissionOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof permissionOptions>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">권한 수정 - {user.userId}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* 상태 설정 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">계정 상태</h4>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">계정 활성화</span>
            </label>
          </div>

          {/* 유효기간 설정 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">유효기간</h4>
            <Input
              type="datetime-local"
              value={validUntil ? validUntil.slice(0, 16) : ''}
              onChange={(e) => setValidUntil(e.target.value ? `${e.target.value}:00Z` : '')}
              helperText="비워두면 무제한"
            />
          </div>

          {/* 권한 설정 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">권한 설정</h4>
            
            {selectedPermissions.includes('all') ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">슈퍼 관리자는 모든 권한을 가집니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, options]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3">{category}</h5>
                    <div className="space-y-2">
                      {options.map(option => (
                        <label key={option.value} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(option.value)}
                            onChange={() => togglePermission(option.value)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;
