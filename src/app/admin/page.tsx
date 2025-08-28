'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import AdminDashboard from '../../components/admin/AdminDashboard';
import { Users, BarChart3, Settings, Shield, Database, FileText } from 'lucide-react';

const AdminPage = () => {
  const user = {
    name: '관리자',
    email: 'admin@iepon.kr',
    role: 'admin' as const,
  };

  const adminFeatures = [
    {
      title: '사용자 관리',
      description: '교사 및 학생 계정 관리, 권한 설정',
      href: '/admin/users',
      icon: Users
    },
    {
      title: '통계 분석',
      description: '시스템 사용 현황 및 성과 분석',
      href: '/admin/analytics',
      icon: BarChart3
    },
    {
      title: '시스템 설정',
      description: '시스템 환경설정 및 보안 관리',
      href: '/admin/system',
      icon: Settings
    }
  ];

  return (
    <Layout user={user}>
      <div className="container py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: 'var(--color-black)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-heading-1 mb-1">관리자 대시보드</h1>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                시스템 관리 및 사용자 현황을 확인하세요
              </p>
            </div>
          </div>
        </div>

        {/* 관리자 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link 
                key={feature.title}
                href={feature.href} 
                className="card card-interactive"
              >
                <div className="card-body">
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <IconComponent className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                  <h3 className="text-heading-4 mb-2">{feature.title}</h3>
                  <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 기존 AdminDashboard 컴포넌트 */}
        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default AdminPage;
