'use client';

import Layout from '@/components/layout/Layout';
import CurriculumGenerationEngine from '../../../components/ai/CurriculumGenerationEngine';
import { BookOpen } from 'lucide-react';

const AIGenerationPage = () => {
  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: 'var(--color-black)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI 교육과정 생성</h1>
              <p className="text-gray-600">학생 맞춤형 교육과정을 AI로 생성합니다</p>
            </div>
          </div>
        </div>
        <CurriculumGenerationEngine />
      </div>
    </Layout>
  );
};

export default AIGenerationPage;
