'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Brain,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';
import { mcpAPI } from '../../lib/api/mcp-endpoints';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

interface StatisticsData {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    roleDistribution: Record<string, number>;
  };
  studentStats: {
    totalStudents: number;
    activeStudents: number;
    newStudentsThisMonth: number;
    gradeDistribution: Record<string, number>;
    disabilityDistribution: Record<string, number>;
  };
  aiUsageStats: {
    totalGenerations: number;
    generationsThisMonth: number;
    averageQualityScore: number;
    serviceTypeUsage: Record<string, number>;
    monthlyTrends: { month: string; count: number }[];
  };
  systemStats: {
    uptime: number;
    errorRate: number;
    avgResponseTime: number;
    totalStorage: number;
  };
}

const StatisticsDashboard: React.FC = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    loadStatisticsData();
  }, [timeRange]);

  const loadStatisticsData = async () => {
    try {
      setLoading(true);
      
      // Mock 통계 데이터
      const mockData: StatisticsData = {
        userStats: {
          totalUsers: 45,
          activeUsers: 38,
          newUsersThisMonth: 7,
          roleDistribution: {
            '관리자': 3,
            '교사': 35,
            '보조교사': 7
          }
        },
        studentStats: {
          totalStudents: 250,
          activeStudents: 235,
          newStudentsThisMonth: 12,
          gradeDistribution: {
            '초등 1학년': 28,
            '초등 2학년': 32,
            '초등 3학년': 29,
            '초등 4학년': 31,
            '초등 5학년': 35,
            '초등 6학년': 33,
            '중학교': 45,
            '고등학교': 17
          },
          disabilityDistribution: {
            '지적장애': 85,
            '자폐성장애': 62,
            '발달지연': 43,
            '학습장애': 35,
            '다중장애': 25
          }
        },
        aiUsageStats: {
          totalGenerations: 1245,
          generationsThisMonth: 186,
          averageQualityScore: 8.7,
          serviceTypeUsage: {
            '개별화 교육과정': 45,
            '교육계획서': 38,
            '평가보고서': 32,
            '교수적응': 25,
            '행동지원계획': 18
          },
          monthlyTrends: [
            { month: '1월', count: 95 },
            { month: '2월', count: 112 },
            { month: '3월', count: 128 },
            { month: '4월', count: 145 },
            { month: '5월', count: 167 },
            { month: '6월', count: 186 }
          ]
        },
        systemStats: {
          uptime: 99.8,
          errorRate: 0.02,
          avgResponseTime: 145,
          totalStorage: 2.4
        }
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockData);
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      // 실제로는 PDF/Excel 파일 생성
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeRange,
        reportType,
        data: data
      };
      
      console.log('리포트 내보내기:', reportData);
      alert('리포트가 생성되었습니다. (Mock)');
    } catch (error) {
      console.error('리포트 내보내기 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">통계 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">통계 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 필터 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">통계 대시보드</h1>
          <p className="text-gray-600">시스템 사용 현황 및 분석 리포트</p>
        </div>
        
        <div className="flex gap-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '7days', label: '최근 7일' },
              { value: '30days', label: '최근 30일' },
              { value: '3months', label: '최근 3개월' },
              { value: '1year', label: '최근 1년' }
            ]}
          />
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'overview', label: '전체 개요' },
              { value: 'users', label: '사용자 분석' },
              { value: 'students', label: '학생 분석' },
              { value: 'ai', label: 'AI 서비스' }
            ]}
          />
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            리포트 내보내기
          </Button>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="전체 사용자"
          value={data.userStats.totalUsers}
          change={data.userStats.newUsersThisMonth}
          changeLabel="이번 달 신규"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="전체 학생"
          value={data.studentStats.totalStudents}
          change={data.studentStats.newStudentsThisMonth}
          changeLabel="이번 달 신규"
          icon={<BookOpen className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="AI 생성 건수"
          value={data.aiUsageStats.totalGenerations}
          change={data.aiUsageStats.generationsThisMonth}
          changeLabel="이번 달"
          icon={<Brain className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="시스템 가동률"
          value={`${data.systemStats.uptime}%`}
          change={data.systemStats.errorRate}
          changeLabel="오류율"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 역할 분포 */}
        <ChartCard title="사용자 역할 분포" type="doughnut">
          <DoughnutChart 
            data={data.userStats.roleDistribution}
            colors={['#3B82F6', '#10B981', '#F59E0B']}
          />
        </ChartCard>

        {/* 학년별 학생 분포 */}
        <ChartCard title="학년별 학생 분포" type="bar">
          <BarChart 
            data={data.studentStats.gradeDistribution}
            color="#10B981"
          />
        </ChartCard>

        {/* AI 서비스 사용 추이 */}
        <ChartCard title="AI 서비스 사용 추이" type="line" className="lg:col-span-2">
          <LineChart 
            data={data.aiUsageStats.monthlyTrends}
            color="#8B5CF6"
          />
        </ChartCard>
      </div>

      {/* 상세 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">장애 유형별 학생 분포</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">장애 유형</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">학생 수</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">비율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(data.studentStats.disabilityDistribution).map(([type, count]) => {
                const percentage = ((count / data.studentStats.totalStudents) * 100).toFixed(1);
                return (
                  <tr key={type}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{count}명</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeLabel, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">
            {changeLabel}: +{change}
          </p>
        </div>
      </div>
    </div>
  );
};

// 차트 카드 컴포넌트
interface ChartCardProps {
  title: string;
  type: 'bar' | 'line' | 'doughnut';
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, type, children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          {type === 'bar' && <BarChart3 className="w-4 h-4 mr-1" />}
          {type === 'line' && <TrendingUp className="w-4 h-4 mr-1" />}
          {type === 'doughnut' && <PieChart className="w-4 h-4 mr-1" />}
          {type.toUpperCase()}
        </div>
      </div>
      <div className="h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// 간단한 차트 컴포넌트들 (실제로는 Chart.js나 D3.js 사용)
const DoughnutChart: React.FC<{ data: Record<string, number>; colors: string[] }> = ({ data, colors }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          {Object.entries(data).map(([label, value], index) => (
            <div key={label} className="flex items-center justify-between mb-2 text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                {label}
              </div>
              <span>{value}명 ({((value/total)*100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{ data: Record<string, number>; color: string }> = ({ data, color }) => {
  const maxValue = Math.max(...Object.values(data));
  
  return (
    <div className="w-full h-full flex items-end justify-center space-x-2">
      {Object.entries(data).map(([label, value]) => {
        const height = (value / maxValue) * 200;
        return (
          <div key={label} className="flex flex-col items-center">
            <div className="text-xs text-gray-600 mb-1">{value}</div>
            <div 
              className="w-8 rounded-t"
              style={{ height: `${height}px`, backgroundColor: color }}
            />
            <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-center">
              {label.replace('초등 ', '').replace('학년', '학')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LineChart: React.FC<{ data: { month: string; count: number }[]; color: string }> = ({ data, color }) => {
  const maxValue = Math.max(...data.map(d => d.count));
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full relative">
        {data.map((item, index) => (
          <div key={item.month} className="inline-block text-center mx-2">
            <div className="text-sm text-gray-600 mb-2">{item.count}</div>
            <div 
              className="w-2 mx-auto rounded"
              style={{ 
                height: `${(item.count / maxValue) * 150}px`,
                backgroundColor: color 
              }}
            />
            <div className="text-xs text-gray-500 mt-2">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsDashboard;
