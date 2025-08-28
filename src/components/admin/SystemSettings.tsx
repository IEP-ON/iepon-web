'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Database,
  Shield,
  Mail,
  Bell,
  Palette,
  Globe,
  Clock,
  HardDrive
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { errorUtils } from '../../lib/error-handler';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    defaultLanguage: string;
    timeZone: string;
    dateFormat: string;
  };
  database: {
    backupFrequency: string;
    retentionDays: number;
    maxConnections: number;
    connectionTimeout: number;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromAddress: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    userRegistration: boolean;
    aiGeneration: boolean;
    dataExport: boolean;
  };
  ui: {
    theme: string;
    primaryColor: string;
    sidebarStyle: string;
    showBranding: boolean;
    customLogo: string;
  };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Mock 설정 데이터
  const defaultConfig: SystemConfig = {
    general: {
      siteName: 'IEPON 특수교육 관리시스템',
      siteDescription: '개별화 교육 프로그램 및 특수교육 통합 관리 시스템',
      defaultLanguage: 'ko-KR',
      timeZone: 'Asia/Seoul',
      dateFormat: 'YYYY-MM-DD'
    },
    database: {
      backupFrequency: 'daily',
      retentionDays: 30,
      maxConnections: 100,
      connectionTimeout: 30
    },
    security: {
      sessionTimeout: 3600,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'],
      maxFileSize: 10
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromAddress: 'noreply@iepon.edu',
      fromName: 'IEPON 시스템'
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      userRegistration: true,
      aiGeneration: false,
      dataExport: true
    },
    ui: {
      theme: 'light',
      primaryColor: '#3B82F6',
      sidebarStyle: 'expanded',
      showBranding: true,
      customLogo: ''
    }
  };

  useEffect(() => {
    loadSystemConfig();
  }, []);

  const loadSystemConfig = async () => {
    try {
      setLoading(true);
      
      // Mock 데이터 로드
      await new Promise(resolve => setTimeout(resolve, 800));
      setConfig(defaultConfig);
      setError(null);
    } catch (err) {
      const standardError = errorUtils.createError(
        'SYSTEM_ERROR' as any,
        'CONFIG_LOAD_ERROR',
        '시스템 설정을 불러오는데 실패했습니다.',
        'HIGH' as any,
        err
      );
      setError(standardError.userFriendlyMessage || '설정 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const saveConfig = async () => {
    if (!config) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // UTF-8 안전성 검증
      const safeConfig = {
        ...config,
        general: {
          ...config.general,
          siteName: errorUtils.validateUtf8(config.general.siteName),
          siteDescription: errorUtils.validateUtf8(config.general.siteDescription)
        }
      };
      
      // Mock 저장
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('시스템 설정이 성공적으로 저장되었습니다.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const standardError = errorUtils.createError(
        'SYSTEM_ERROR' as any,
        'CONFIG_SAVE_ERROR',
        '시스템 설정 저장에 실패했습니다.',
        'HIGH' as any,
        err
      );
      setError(standardError.userFriendlyMessage || '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConfig = async () => {
    try {
      // Mock 이메일 테스트
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('테스트 이메일이 성공적으로 발송되었습니다.');
    } catch (err) {
      alert('이메일 설정을 확인해주세요.');
    }
  };

  const tabs = [
    { id: 'general', label: '일반 설정', icon: <Settings className="w-4 h-4" /> },
    { id: 'database', label: '데이터베이스', icon: <Database className="w-4 h-4" /> },
    { id: 'security', label: '보안', icon: <Shield className="w-4 h-4" /> },
    { id: 'email', label: '이메일', icon: <Mail className="w-4 h-4" /> },
    { id: 'notifications', label: '알림', icon: <Bell className="w-4 h-4" /> },
    { id: 'ui', label: 'UI/테마', icon: <Palette className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">시스템 설정 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">시스템 설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
          <p className="text-gray-600 mt-1">시스템 전반적인 설정을 관리합니다</p>
        </div>
        <Button 
          onClick={saveConfig} 
          loading={saving}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          설정 저장
        </Button>
      </div>

      {/* 상태 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 설정 콘텐츠 */}
        <div className="p-6">
          {/* 일반 설정 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="사이트 이름"
                  value={config.general.siteName}
                  onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                  placeholder="사이트 이름을 입력하세요"
                />
                <Select
                  label="기본 언어"
                  value={config.general.defaultLanguage}
                  onChange={(value) => updateConfig('general', 'defaultLanguage', value)}
                  options={[
                    { value: 'ko-KR', label: '한국어' },
                    { value: 'en-US', label: 'English' }
                  ]}
                />
              </div>
              <Input
                label="사이트 설명"
                value={config.general.siteDescription}
                onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                placeholder="사이트 설명을 입력하세요"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="시간대"
                  value={config.general.timeZone}
                  onChange={(value) => updateConfig('general', 'timeZone', value)}
                  options={[
                    { value: 'Asia/Seoul', label: '서울 (UTC+9)' },
                    { value: 'UTC', label: 'UTC' }
                  ]}
                />
                <Select
                  label="날짜 형식"
                  value={config.general.dateFormat}
                  onChange={(value) => updateConfig('general', 'dateFormat', value)}
                  options={[
                    { value: 'YYYY-MM-DD', label: '2024-01-15' },
                    { value: 'MM/DD/YYYY', label: '01/15/2024' },
                    { value: 'DD/MM/YYYY', label: '15/01/2024' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* 데이터베이스 설정 */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="백업 주기"
                  value={config.database.backupFrequency}
                  onChange={(value) => updateConfig('database', 'backupFrequency', value)}
                  options={[
                    { value: 'hourly', label: '매시간' },
                    { value: 'daily', label: '매일' },
                    { value: 'weekly', label: '매주' }
                  ]}
                />
                <Input
                  label="백업 보관 기간 (일)"
                  type="number"
                  value={config.database.retentionDays}
                  onChange={(e) => updateConfig('database', 'retentionDays', Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="최대 연결 수"
                  type="number"
                  value={config.database.maxConnections}
                  onChange={(e) => updateConfig('database', 'maxConnections', Number(e.target.value))}
                />
                <Input
                  label="연결 타임아웃 (초)"
                  type="number"
                  value={config.database.connectionTimeout}
                  onChange={(e) => updateConfig('database', 'connectionTimeout', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* 보안 설정 */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="세션 타임아웃 (초)"
                  type="number"
                  value={config.security.sessionTimeout}
                  onChange={(e) => updateConfig('security', 'sessionTimeout', Number(e.target.value))}
                />
                <Input
                  label="최소 비밀번호 길이"
                  type="number"
                  value={config.security.passwordMinLength}
                  onChange={(e) => updateConfig('security', 'passwordMinLength', Number(e.target.value))}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.security.requireTwoFactor}
                    onChange={(e) => updateConfig('security', 'requireTwoFactor', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">2단계 인증 필수</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="허용 파일 형식 (쉼표로 구분)"
                  value={config.security.allowedFileTypes.join(', ')}
                  onChange={(e) => updateConfig('security', 'allowedFileTypes', e.target.value.split(', '))}
                />
                <Input
                  label="최대 파일 크기 (MB)"
                  type="number"
                  value={config.security.maxFileSize}
                  onChange={(e) => updateConfig('security', 'maxFileSize', Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* 이메일 설정 */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="SMTP 호스트"
                  value={config.email.smtpHost}
                  onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                />
                <Input
                  label="SMTP 포트"
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => updateConfig('email', 'smtpPort', Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="SMTP 사용자명"
                  value={config.email.smtpUser}
                  onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                />
                <Input
                  label="SMTP 비밀번호"
                  type="password"
                  value={config.email.smtpPassword}
                  onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="발신자 이메일"
                  type="email"
                  value={config.email.fromAddress}
                  onChange={(e) => updateConfig('email', 'fromAddress', e.target.value)}
                />
                <Input
                  label="발신자 이름"
                  value={config.email.fromName}
                  onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={testEmailConfig} variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  이메일 테스트
                </Button>
              </div>
            </div>
          )}

          {/* 알림 설정 */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">알림 설정</h3>
                
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">이메일 알림</span>
                    <p className="text-sm text-gray-500">시스템 알림을 이메일로 받습니다</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.emailNotifications}
                    onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">시스템 경고</span>
                    <p className="text-sm text-gray-500">시스템 오류 및 경고 알림</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.systemAlerts}
                    onChange={(e) => updateConfig('notifications', 'systemAlerts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">사용자 등록</span>
                    <p className="text-sm text-gray-500">새 사용자 등록 시 알림</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.userRegistration}
                    onChange={(e) => updateConfig('notifications', 'userRegistration', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">AI 생성 완료</span>
                    <p className="text-sm text-gray-500">AI 생성 작업 완료 시 알림</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.aiGeneration}
                    onChange={(e) => updateConfig('notifications', 'aiGeneration', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">데이터 내보내기</span>
                    <p className="text-sm text-gray-500">데이터 내보내기 완료 시 알림</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.dataExport}
                    onChange={(e) => updateConfig('notifications', 'dataExport', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* UI 설정 */}
          {activeTab === 'ui' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="테마"
                  value={config.ui.theme}
                  onChange={(value) => updateConfig('ui', 'theme', value)}
                  options={[
                    { value: 'light', label: '라이트' },
                    { value: 'dark', label: '다크' },
                    { value: 'auto', label: '자동' }
                  ]}
                />
                <Input
                  label="기본 색상"
                  type="color"
                  value={config.ui.primaryColor}
                  onChange={(e) => updateConfig('ui', 'primaryColor', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="사이드바 스타일"
                  value={config.ui.sidebarStyle}
                  onChange={(value) => updateConfig('ui', 'sidebarStyle', value)}
                  options={[
                    { value: 'expanded', label: '확장' },
                    { value: 'collapsed', label: '축소' },
                    { value: 'overlay', label: '오버레이' }
                  ]}
                />
                <Input
                  label="커스텀 로고 URL"
                  value={config.ui.customLogo}
                  onChange={(e) => updateConfig('ui', 'customLogo', e.target.value)}
                  placeholder="로고 이미지 URL"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={config.ui.showBranding}
                    onChange={(e) => updateConfig('ui', 'showBranding', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">브랜딩 표시</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
