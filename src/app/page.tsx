import Link from 'next/link';
import Button from '@/components/common/Button';
import { ArrowRight, BookOpen, Users, BarChart, Sparkles, ChevronRight, Mail, Phone, MapPin, Brain, Target } from 'lucide-react';
import TestAccounts from '@/components/TestAccounts';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Hero Section */}
      <div className="container py-24">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div style={{ 
              backgroundColor: 'var(--color-black)',
              color: 'var(--color-white)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <BookOpen className="w-6 h-6" />
              <Brain className="w-6 h-6" />
            </div>
          </div>
          
          <h1 className="text-heading-1 animate-slide-up mb-6" style={{ 
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: '600'
          }}>
            IEPON
          </h1>
          
          <p className="text-heading-3 mb-4" style={{ 
            maxWidth: '48rem',
            margin: '0 auto var(--space-4)'
          }}>
            개별화 교육 프로그램 온라인 네트워크
          </p>
          
          <p className="text-body mb-12" style={{ 
            maxWidth: '40rem',
            margin: '0 auto var(--space-12)'
          }}>
            AI 기반 개별화 학습으로 모든 학생의 잠재력을 실현하세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <button className="btn btn-primary animate-fade-in">
                시작하기
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button className="btn btn-outline animate-fade-in">
              데모 보기
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-24">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 animate-slide-up mb-4">
            왜 IEPON을 선택해야 할까요?
          </h2>
          <p className="text-body" style={{ 
            maxWidth: '40rem',
            margin: '0 auto'
          }}>
            최신 AI 기술과 교육 전문성을 결합하여 개별화된 학습 경험을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center animate-fade-in">
            <div className="card card-interactive">
              <div className="card-body">
                <div style={{ 
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  margin: '0 auto var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-heading-4 mb-2">AI 기반 분석</h3>
                <p className="text-body-sm">
                  학습자의 패턴을 분석하여 최적화된 개별 학습 계획을 제공합니다
                </p>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in">
            <div className="card card-interactive">
              <div className="card-body">
                <div style={{ 
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  margin: '0 auto var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-heading-4 mb-2">학생 관리</h3>
                <p className="text-body-sm">
                  체계적인 학생 정보 관리와 학습 진도 추적을 통한 효율적인 교육
                </p>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in">
            <div className="card card-interactive">
              <div className="card-body">
                <div style={{ 
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  margin: '0 auto var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-heading-4 mb-2">맞춤형 목표</h3>
                <p className="text-body-sm">
                  개별 학습자의 특성에 맞는 학습 목표 설정과 단계별 달성 지원
                </p>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in">
            <div className="card card-interactive">
              <div className="card-body">
                <div style={{ 
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  margin: '0 auto var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-heading-4 mb-2">성과 분석</h3>
                <p className="text-body-sm">
                  실시간 학습 성과 분석과 데이터 기반 개선 방안 제시
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        backgroundColor: 'var(--color-black)',
        color: 'var(--color-white)',
        padding: 'var(--space-20) 0'
      }}>
        <div className="container text-center" style={{ maxWidth: '48rem' }}>
          <h2 className="text-heading-2 animate-fade-in mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-body mb-8" style={{ 
            opacity: '0.8'
          }}>
            개별화된 교육의 새로운 경험을 만나보세요
          </p>
          <Link href="/auth/login">
            <button className="btn btn-white animate-fade-in">
              무료로 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        padding: 'var(--space-12) 0'
      }}>
        <div className="container">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div style={{
                backgroundColor: 'var(--color-black)',
                color: 'var(--color-white)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Brain className="w-5 h-5" />
              </div>
            </div>
            <p className="text-body mb-2">
              IEPON - 개별화 교육 프로그램 온라인 네트워크
            </p>
            <p className="text-body-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              © 2024 IEPON. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 테스트 계정 정보 섹션 */}
      <section style={{ 
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div className="container py-12">
          <TestAccounts />
        </div>
      </section>
    </div>
  );
}
