'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { validateEmail, validateUTF8 } from '@/lib/utils';
import { authenticateUser, saveUserSession } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // 이메일 검증
    if (!form.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(form.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    } else if (!validateUTF8(form.email)) {
      newErrors.email = '이메일에 올바르지 않은 문자가 포함되어 있습니다.';
    }

    // 비밀번호 검증
    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (form.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    } else if (!validateUTF8(form.password)) {
      newErrors.password = '비밀번호에 올바르지 않은 문자가 포함되어 있습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // 실제 로그인 인증
      const user = await authenticateUser(form.email, form.password);
      
      if (user) {
        // 세션 저장
        saveUserSession(user);
        console.log('로그인 성공:', user);
        router.push('/dashboard');
      } else {
        setErrors({
          general: '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
      }
      
    } catch (error) {
      setErrors({
        general: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'naver' | 'kakao') => {
    setIsLoading(true);
    try {
      // 소셜 로그인 처리
      console.log(`${provider} 로그인`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setErrors({
        general: `${provider} 로그인에 실패했습니다.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="w-full max-w-sm space-y-6">
        
        {/* 헤더 */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: 'var(--color-black)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="text-white font-semibold text-lg">IE</span>
            </div>
          </div>
          <h1 className="text-heading-2 mb-2" role="banner">
            로그인
          </h1>
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
            IEPON에 오신 것을 환영합니다
          </p>
        </div>
        
        {/* 로그인 폼 */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="IEPON 로그인 폼">
            
            {/* 전역 에러 메시지 */}
            {errors.general && (
              <div 
                className="p-3 rounded-md" 
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)'
                }}
                role="alert"
              >
                <p className="text-body-sm" style={{ color: 'var(--color-error)' }}>{errors.general}</p>
              </div>
            )}
            
            {/* 이메일 입력 */}
            <Input
              id="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
              aria-describedby="email-error"
            />
            
            {/* 비밀번호 입력 */}
            <Input
              id="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              showPasswordToggle
              required
              autoComplete="current-password"
              aria-describedby="password-error"
            />
            
            {/* 로그인 상태 유지 & 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="h-4 w-4 rounded border border-input-border text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="text-body-sm">
                  로그인 상태 유지
                </label>
              </div>
              
              <Link 
                href="/auth/forgot-password" 
                className="text-body-sm font-medium transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                비밀번호 찾기
              </Link>
            </div>
            
            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
              aria-label="로그인 실행"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
            
          </form>
        </div>
        
        {/* 회원가입 링크 */}
        <div className="text-center">
          <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
            계정이 없으신가요?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium transition-colors underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
