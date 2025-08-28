'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Button from '@/components/common/Button';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: 'teacher' | 'admin' | 'student';
  };
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigation = [
    { name: '대시보드', href: '/dashboard' },
    { 
      name: '학생관리', 
      href: '/students',
      children: [
        { name: '학생 목록', href: '/students' },
        { name: '학생 등록', href: '/students/add' }
      ]
    },
    { 
      name: '교육과정', 
      href: '/education/curriculum-assignment',
      children: [
        { name: '교육과정 배정', href: '/education/curriculum-assignment' },
        { name: '교육계획 작성', href: '/education/create' },
        { name: '교육평가', href: '/education/evaluation' }
      ]
    },
    { 
      name: 'AI 서비스', 
      href: '/ai',
      children: [
        { name: 'AI 생성 도구', href: '/ai' },
        { name: '수업계획 생성', href: '/ai/lesson' },
        { name: '평가보고서 생성', href: '/ai/assessment' },
        { name: '행정문서 생성', href: '/ai/admin' },
        { name: '상담가이드 생성', href: '/ai/counseling' }
      ]
    },
    ...(user?.role === 'admin' ? [{
      name: '시스템 관리', 
      href: '/admin',
      children: [
        { name: '관리자 대시보드', href: '/admin' },
        { name: '교육과정 단원 관리', href: '/admin/curriculum' },
        { name: '사용자 관리', href: '/admin/users' },
        { name: '통계 분석', href: '/admin/analytics' },
        { name: '시스템 설정', href: '/admin/system' }
      ]
    }] : []),
  ];

  return (
    <header style={{ 
      backgroundColor: 'var(--color-white)', 
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div className="container" style={{ height: '4rem' }}>
        <div className="flex justify-between items-center h-full">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: 'var(--color-black)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span className="text-white font-semibold text-sm">IE</span>
              </div>
              <span className="text-heading-4 font-semibold">IEPON</span>
            </Link>
          </div>

          {/* 데스크톱 내비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div
                    className="group"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center text-body-sm font-medium px-3 py-2 rounded-md transition-colors" style={{
                      color: 'var(--color-text-secondary)'
                    }}>
                      {item.name}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-md py-2 z-50 animate-fade-in" style={{
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-white)'
                      }}>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-3 py-2 text-body-sm transition-colors" 
                            style={{
                              color: 'var(--color-text-secondary)'
                            }}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-body-sm font-medium px-3 py-2 rounded-md transition-colors"
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* 알림 */}
                <button
                  className="btn btn-ghost btn-xs relative"
                  aria-label="알림"
                >
                  <Bell size={16} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{
                    backgroundColor: 'var(--color-red)'
                  }}></span>
                </button>

                {/* 프로필 메뉴 */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors"
                    aria-label="프로필 메뉴"
                  >
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={14} style={{ color: 'var(--color-text-secondary)' }} />
                    </div>
                    <span className="hidden sm:block text-body-sm font-medium">
                      {user.name}
                    </span>
                  </button>

                  {/* 프로필 드롭다운 */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md py-1 z-50 animate-fade-in" style={{
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-white)'
                    }}>
                      <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <p className="text-body-sm font-medium">{user.name}</p>
                        <p className="text-body-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 text-body-sm transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={14} className="mr-2" />
                        프로필 설정
                      </Link>
                      
                      <Link
                        href="/settings/teacher-preferences"
                        className="flex items-center px-3 py-2 text-body-sm transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings size={14} className="mr-2" />
                        개별화 설정
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout?.();
                        }}
                        className="flex items-center w-full px-3 py-2 text-body-sm transition-colors"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <LogOut size={14} className="mr-2" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <button className="btn btn-ghost btn-sm">
                    로그인
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="btn btn-primary btn-sm">
                    회원가입
                  </button>
                </Link>
              </div>
            )}

            {/* 모바일 메뉴 토글 */}
            <button
              className="btn btn-ghost btn-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 토글"
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 mt-2" style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-body-sm font-medium rounded-md transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-3 py-1 text-body-xs font-medium rounded-md transition-colors"
                          style={{ color: 'var(--color-text-tertiary)' }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 클릭 외부 영역으로 메뉴 닫기 */}
      {(isMobileMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
