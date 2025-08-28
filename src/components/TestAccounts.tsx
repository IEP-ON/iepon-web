'use client';

import { TEST_USERS } from '@/lib/auth';
import { Copy, User, Mail, Phone, Building, Calendar } from 'lucide-react';
import Button from '@/components/common/Button';

export default function TestAccounts() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const roleLabels = {
    special_teacher: '특수교사'
  };

  const roleColors = {
    special_teacher: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-heading-2 mb-2">특수교사 테스트 계정</h2>
        <p className="text-body text-gray-600">
          IEPON 특수교육 지원 시스템에 로그인하여 테스트해보세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEST_USERS.map((user, index) => (
          <div key={user.id} className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: 'var(--color-black)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${roleColors[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body space-y-4">
              {/* 로그인 정보 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">이메일</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 font-mono">{user.email}</span>
                    <button
                      onClick={() => copyToClipboard(user.email)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="복사"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs">🔑</span>
                    </div>
                    <span className="text-sm font-medium">비밀번호</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 font-mono">{user.password}</span>
                    <button
                      onClick={() => copyToClipboard(user.password)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="복사"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{user.school} - {user.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>가입일: {user.joinDate}</span>
                </div>
              </div>

              {/* 빠른 로그인 버튼 */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => {
                  // 폼에 자동 입력 (실제로는 window.location으로 이동)
                  window.location.href = `/auth/login?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`;
                }}
              >
                이 계정으로 로그인
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 사용법 안내 */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">특수교육 시스템 테스트 방법</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 위 특수교사 계정 정보를 복사하여 로그인 페이지에서 사용하세요</li>
          <li>• "이 계정으로 로그인" 버튼으로 빠른 로그인도 가능합니다</li>
          <li>• 각 특수교육 분야별로 맞춤화된 기능을 테스트할 수 있습니다</li>
          <li>• 개별화 교육계획, AI 분석, 학생 관리 등 모든 기능이 제공됩니다</li>
        </ul>
      </div>
    </div>
  );
}
