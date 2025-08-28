'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '김선생님',
    email: 'teacher@iepon.com',
    phone: '010-1234-5678',
    school: '햇빛초등학교',
    department: '특수교육과',
    position: '특수교사',
    experience: '5년',
    certification: '특수교육 1급 정교사'
  });

  const handleSave = () => {
    // 실제 구현에서는 API 호출
    setIsEditing(false);
    alert('프로필이 성공적으로 업데이트되었습니다.');
  };

  return (
    <Layout user={{ name: formData.name, email: formData.email, role: 'teacher' }}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                프로필 설정
              </h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{formData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">소속 학교</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{formData.school}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학과</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      <span>{formData.department}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">직급</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      <span>{formData.position}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      <span>{formData.experience}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">자격증</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.certification}
                      onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      <span>{formData.certification}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
