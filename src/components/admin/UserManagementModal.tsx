'use client';

import React, { useState } from 'react';
import { X, User, Mail, Shield, Settings, Users, Save, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { errorUtils } from '../../lib/error-handler';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: AdminUser | null;
  onSave: (userData: Partial<AdminUser>) => Promise<void>;
}

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

interface FormData {
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher';
  status: 'active' | 'inactive' | 'suspended';
  school: string;
  permissions: string[];
  password?: string;
  confirmPassword?: string;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'teacher',
    status: user?.status || 'active',
    school: user?.school || '',
    permissions: user?.permissions || [],
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 역할별 기본 권한
  const rolePermissions = {
    super_admin: ['all'],
    admin: ['users.read', 'users.write', 'students.read', 'students.write', 'ai.generate', 'reports.read', 'system.read'],
    teacher: ['students.read', 'students.write', 'ai.generate']
  };

  /**
   * 폼 데이터 업데이트
   */
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // 역할 변경 시 권한 자동 설정
      if (field === 'role') {
        updated.permissions = rolePermissions[value as keyof typeof rolePermissions] || [];
      }
      
      return updated;
    });
    
    // 해당 필드의 검증 에러 제거
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  /**
   * 폼 검증
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // 이름 검증
    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      errors.name = '이름을 2자 이상 입력해주세요.';
    }
    
    // 이메일 검증
    if (!formData.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    // 학교 검증
    if (!formData.school.trim()) {
      errors.school = '소속 학교를 입력해주세요.';
    }
    
    // 새 사용자인 경우 비밀번호 검증
    if (!user) {
      if (!formData.password) {
        errors.password = '비밀번호를 입력해주세요.';
      } else if (formData.password.length < 8) {
        errors.password = '비밀번호를 8자 이상 입력해주세요.';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * 저장 처리
   */
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // UTF-8 안전성 검증
      const utf8SafeData = {
        ...formData,
        name: errorUtils.validateUtf8(formData.name),
        email: errorUtils.validateUtf8(formData.email),
        school: errorUtils.validateUtf8(formData.school)
      };
      
      await onSave(utf8SafeData);
      onClose();
    } catch (err) {
      const standardError = errorUtils.createError(
        'VALIDATION_ERROR' as any,
        'USER_SAVE_ERROR',
        '사용자 정보 저장에 실패했습니다.',
        'HIGH' as any,
        err
      );
      setError(standardError.userFriendlyMessage || '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 권한 토글
   */
  const togglePermission = (permission: string) => {
    if (formData.role === 'super_admin') return; // 슈퍼 관리자는 모든 권한
    
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? '사용자 수정' : '사용자 추가'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* 폼 */}
        <div className="px-6 py-4 space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              기본 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="이름"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                error={validationErrors.name}
                placeholder="이름을 입력해주세요"
                required
              />
              
              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                error={validationErrors.email}
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>
            
            <Input
              label="소속 학교"
              value={formData.school}
              onChange={(e) => updateFormData('school', e.target.value)}
              error={validationErrors.school}
              placeholder="소속 학교를 입력해주세요"
              required
            />
          </div>

          {/* 계정 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              계정 설정
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="역할"
                value={formData.role}
                onChange={(value) => updateFormData('role', value)}
                options={[
                  { value: 'teacher', label: '교사' },
                  { value: 'admin', label: '관리자' },
                  { value: 'super_admin', label: '슈퍼 관리자' }
                ]}
                required
              />
              
              <Select
                label="상태"
                value={formData.status}
                onChange={(value) => updateFormData('status', value)}
                options={[
                  { value: 'active', label: '활성' },
                  { value: 'inactive', label: '비활성' },
                  { value: 'suspended', label: '정지' }
                ]}
                required
              />
            </div>
          </div>

          {/* 비밀번호 (신규 사용자만) */}
          {!user && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                비밀번호 설정
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="비밀번호"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  error={validationErrors.password}
                  placeholder="8자 이상 입력해주세요"
                  required
                />
                
                <Input
                  label="비밀번호 확인"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  error={validationErrors.confirmPassword}
                  placeholder="비밀번호를 다시 입력해주세요"
                  required
                />
              </div>
            </div>
          )}

          {/* 권한 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              권한 설정
            </h3>
            
            {formData.role === 'super_admin' ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">슈퍼 관리자는 모든 권한을 가집니다.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { key: 'students.read', label: '학생 정보 조회' },
                  { key: 'students.write', label: '학생 정보 수정' },
                  { key: 'ai.generate', label: 'AI 생성 서비스' },
                  { key: 'reports.read', label: '보고서 조회' },
                  { key: 'users.read', label: '사용자 조회' },
                  { key: 'users.write', label: '사용자 관리' },
                  { key: 'system.read', label: '시스템 정보 조회' }
                ].map(permission => (
                  <label key={permission.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.key)}
                      onChange={() => togglePermission(permission.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{permission.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {user ? '수정' : '추가'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;
