'use client';

import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    role: 'teacher' | 'admin' | 'student';
  };
  showHeader?: boolean;
}

const Layout = ({ children, user, showHeader = true }: LayoutProps) => {
  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('로그아웃');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header user={user} onLogout={handleLogout} />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
