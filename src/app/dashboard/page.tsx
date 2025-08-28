'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Plus,
  Target,
  Clock,
  Award,
  AlertCircle,
  GamepadIcon,
  PenTool,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  activePrograms: number;
  completedGoals: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'student_added' | 'goal_completed' | 'plan_created' | 'assessment_done';
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activePrograms: 0,
    completedGoals: 0,
    pendingTasks: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 샘플 사용자 데이터
  const user = {
    name: '김선생님',
    email: 'teacher@iepon.kr',
    role: 'teacher' as const,
  };

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // 통계 데이터 로드
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 24,
        activePrograms: 12,
        completedGoals: 89,
        pendingTasks: 5,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'student_added',
          message: '김민수 학생이 새로 등록되었습니다.',
          timestamp: '2024-08-27T10:30:00Z',
        },
        {
          id: '2',
          type: 'goal_completed',
          message: '이지은 학생의 읽기 목표가 완료되었습니다.',
          timestamp: '2024-08-27T09:15:00Z',
        },
        {
          id: '3',
          type: 'plan_created',
          message: '9월 개별화 교육계획이 생성되었습니다.',
          timestamp: '2024-08-27T08:45:00Z',
        },
        {
          id: '4',
          type: 'assessment_done',
          message: '박준호 학생의 평가가 완료되었습니다.',
          timestamp: '2024-08-26T16:20:00Z',
        },
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'student_added':
        return <Users className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
      case 'goal_completed':
        return <Target className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
      case 'plan_created':
        return <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
      case 'assessment_done':
        return <Award className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
      default:
        return <Bell className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  return (
    <Layout user={user}>
      <div className="container animate-fade-in py-8">
        
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-heading-1 animate-slide-up mb-2">
            안녕하세요, {user.name}!
          </h1>
          <p className="text-body">
            오늘도 학생들의 성장을 위해 함께해요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card card-interactive animate-fade-in">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body-sm mb-1">전체 학생</p>
                  <p className="text-heading-2">
                    {isLoading ? '...' : stats.totalStudents}
                  </p>
                </div>
                <div style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive animate-fade-in">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body-sm mb-1">활성 프로그램</p>
                  <p className="text-heading-2">
                    {isLoading ? '...' : stats.activePrograms}
                  </p>
                </div>
                <div style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive animate-fade-in">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body-sm mb-1">완료된 목표</p>
                  <p className="text-heading-2">
                    {isLoading ? '...' : stats.completedGoals}
                  </p>
                </div>
                <div style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card card-interactive animate-fade-in">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-body-sm mb-1">대기 중인 업무</p>
                  <p className="text-heading-2">
                    {isLoading ? '...' : stats.pendingTasks}
                  </p>
                </div>
                <div style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 빠른 액션 */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <div className="card-header">
                <h2 className="text-heading-3">빠른 액션</h2>
                <p className="text-body-sm">자주 사용하는 기능들</p>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    className="btn btn-outline"
                    style={{ 
                      height: '4rem',
                      flexDirection: 'column',
                      gap: 'var(--space-1)'
                    }}
                    onClick={() => router.push('/students')}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-body-sm">학생 관리</span>
                  </button>
                  
                  <button
                    className="btn btn-outline"
                    style={{ 
                      height: '4rem',
                      flexDirection: 'column',
                      gap: 'var(--space-1)'
                    }}
                    onClick={() => router.push('/education/curriculum-assignment')}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-body-sm">교육 계획</span>
                  </button>
                  
                  <button
                    className="btn btn-primary"
                    style={{ 
                      height: '4rem',
                      flexDirection: 'column',
                      gap: 'var(--space-1)'
                    }}
                    onClick={() => router.push('/ai')}
                  >
                    <Award className="w-4 h-4" />
                    <span className="text-body-sm">AI 생성</span>
                  </button>
                  
                  <button
                    className="btn btn-outline"
                    style={{ 
                      height: '4rem',
                      flexDirection: 'column',
                      gap: 'var(--space-1)'
                    }}
                    onClick={() => {
                      // 관리자 권한 확인 후 리다이렉트 (실제로는 role 체크)
                      router.push('/admin/curriculum');
                    }}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-body-sm">교육과정 관리</span>
                  </button>
                </div>

                {/* 교육도구 섹션 */}
                <div>
                  <h3 className="text-body font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <BookOpen className="w-4 h-4" />
                    교육도구
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="btn btn-outline"
                      style={{ 
                        height: '3.5rem',
                        flexDirection: 'column',
                        gap: 'var(--space-1)'
                      }}
                      onClick={() => window.open('https://ieptool3.vercel.app', '_blank')}
                    >
                      <div className="flex items-center gap-1">
                        <GamepadIcon className="w-4 h-4" />
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <span className="text-body-xs">특수학급 빙고게임</span>
                    </button>
                    
                    <button
                      className="btn btn-outline"
                      style={{ 
                        height: '3.5rem',
                        flexDirection: 'column',
                        gap: 'var(--space-1)'
                      }}
                      onClick={() => window.open('https://ieptool.vercel.app', '_blank')}
                    >
                      <div className="flex items-center gap-1">
                        <PenTool className="w-4 h-4" />
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <span className="text-body-xs">특수학급 일기생성</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 이번 주 일정 */}
            <div className="card animate-slide-up mt-6">
              <div className="card-header">
                <h2 className="text-heading-4">이번 주 일정</h2>
              </div>
              <div className="card-body">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3" style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ 
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: 'var(--color-text-tertiary)',
                      borderRadius: '50%'
                    }}></div>
                    <div className="flex-1">
                      <p className="text-body-sm mb-1" style={{ fontWeight: '500' }}>김민수 개별 상담</p>
                      <p className="text-body-xs">오늘 오후 2:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3" style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ 
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: 'var(--color-text-tertiary)',
                      borderRadius: '50%'
                    }}></div>
                    <div className="flex-1">
                      <p className="text-body-sm mb-1" style={{ fontWeight: '500' }}>9월 교육계획 회의</p>
                      <p className="text-body-xs">내일 오전 10:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3" style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ 
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: 'var(--color-text-tertiary)',
                      borderRadius: '50%'
                    }}></div>
                    <div className="flex-1">
                      <p className="text-body-sm mb-1" style={{ fontWeight: '500' }}>학부모 상담 주간</p>
                      <p className="text-body-xs">9월 2일 - 6일</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div>
            <div className="card animate-slide-up">
              <div className="card-header">
                <h2 className="text-heading-4">최근 활동</h2>
              </div>
              <div className="card-body">
                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div style={{ 
                        width: '1.25rem',
                        height: '1.25rem',
                        border: '2px solid var(--color-border)',
                        borderTop: '2px solid var(--color-black)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    </div>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 animate-fade-in">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-body-sm mb-1">
                            {activity.message}
                          </p>
                          <p className="text-body-xs">
                            {formatRelativeTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 알림 및 공지 */}
            <div className="card animate-slide-up mt-6">
              <div className="card-header">
                <h2 className="text-heading-4">공지사항</h2>
              </div>
              <div className="card-body">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 p-3" style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <AlertCircle className="w-4 h-4 mt-0.5" style={{ 
                      color: 'var(--color-text-secondary)',
                      flexShrink: 0
                    }} />
                    <div>
                      <p className="text-body-sm mb-1" style={{ 
                        fontWeight: '500'
                      }}>
                        시스템 업데이트 안내
                      </p>
                      <p className="text-body-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        8월 30일 오후 6시-8시 시스템 점검이 예정되어 있습니다.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3" style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <Bell className="w-4 h-4 mt-0.5" style={{ 
                      color: 'var(--color-text-secondary)',
                      flexShrink: 0
                    }} />
                    <div>
                      <p className="text-body-sm mb-1" style={{ 
                        fontWeight: '500'
                      }}>
                        새로운 AI 기능 출시
                      </p>
                      <p className="text-body-xs">
                        AI 맞춤 교육 추천 기능이 추가되었습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
