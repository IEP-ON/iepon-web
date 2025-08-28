'use client';

import PermissionManagement from '../../../components/admin/PermissionManagement';

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600 mt-1">사용자 권한 및 계정 관리</p>
      </div>
      <PermissionManagement />
    </div>
  );
};

export default AdminUsersPage;
