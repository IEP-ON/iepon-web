'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  User,
  FileText,
  Download,
  Share2,
  Maximize2,
  Eye,
  EyeOff
} from 'lucide-react';
import { AIGenerationResult, AI_SERVICE_LABELS, AIServiceType } from '../../lib/ai-types';
import Button from '../common/Button';

interface AIResultVisualizationProps {
  result: AIGenerationResult;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

interface VisualizationConfig {
  showQualityScore: boolean;
  showConfidenceLevel: boolean;
  showContextUsage: boolean;
  showMetadata: boolean;
  showTokenUsage: boolean;
  chartType: 'bar' | 'pie' | 'line';
}

const defaultConfig: VisualizationConfig = {
  showQualityScore: true,
  showConfidenceLevel: true,
  showContextUsage: true,
  showMetadata: false,
  showTokenUsage: true,
  chartType: 'bar'
};

const AIResultVisualization: React.FC<AIResultVisualizationProps> = ({
  result,
  className = '',
  showControls = true,
  compact = false
}) => {
  const [config, setConfig] = useState<VisualizationConfig>(defaultConfig);
  const [isExpanded, setIsExpanded] = useState(!compact);

  /**
   * 품질 점수 색상 계산
   */
  const getQualityColor = (score: number): string => {
    if (score >= 80) return 'text-heading-4';
    if (score >= 60) return 'text-heading-4';
    return 'text-heading-4';
  };

  const getQualityBgColor = (score: number): React.CSSProperties => {
    return {
      backgroundColor: 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)'
    };
  };

  /**
   * 신뢰도 점수 색상 계산
   */
  const getConfidenceColor = (confidence: number): string => {
    return 'text-heading-4';
  };

  const getConfidenceBgColor = (confidence: number): React.CSSProperties => {
    return {
      backgroundColor: 'var(--color-bg-secondary)',
      color: 'var(--color-text-primary)'
    };
  };

  /**
   * 컨텍스트 완성도 시각화 데이터
   */
  const contextData = useMemo(() => {
    if (!result.contextUsage) return null;

    return {
      completeness: result.contextUsage.contextCompleteness,
      dataSourcesCount: result.contextUsage.dataSourcesUsed.length,
      individualizedElementsCount: result.contextUsage.individualizedElements.length,
      adaptationsCount: result.contextUsage.adaptationsApplied.length,
      supportNeedsCount: result.contextUsage.supportNeedsAddressed.length
    };
  }, [result.contextUsage]);

  /**
   * 토큰 사용량 데이터
   */
  const tokenData = useMemo(() => {
    if (!result.metadata) return null;

    return {
      prompt: result.metadata.promptTokens,
      completion: result.metadata.completionTokens,
      total: result.metadata.totalTokens,
      efficiency: result.metadata.totalTokens > 0 
        ? Math.round((result.metadata.completionTokens / result.metadata.totalTokens) * 100)
        : 0
    };
  }, [result.metadata]);

  /**
   * 진행률 바 렌더링
   */
  const renderProgressBar = (value: number, maxValue: number = 100, color: string = 'blue') => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 bg-${color}-500 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
      />
    </div>
  );

  /**
   * 원형 진행률 렌더링 (간단한 CSS 기반)
   */
  const renderCircularProgress = (value: number, color: string = 'blue', size: number = 60) => {
    const circumference = 2 * Math.PI * 18; // radius = 18
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`text-${color}-500 transition-all duration-300`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold text-${color}-600`}>
            {Math.round(value)}
          </span>
        </div>
      </div>
    );
  };

  /**
   * 설정 토글
   */
  const toggleConfig = (key: keyof VisualizationConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!result) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">시각화할 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                AI 생성 결과 분석
              </h3>
              <p className="text-xs text-gray-600">
                {AI_SERVICE_LABELS[result.serviceType]} • {new Date(result.generatedAt).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {showControls && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 주요 지표 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {config.showQualityScore && (
              <div className={`p-3 rounded-lg border ${getQualityColor(result.qualityScore)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-80">품질 점수</p>
                    <p className="text-lg font-bold">{result.qualityScore}</p>
                  </div>
                  {renderCircularProgress(result.qualityScore, 'green', 40)}
                </div>
              </div>
            )}

            {config.showConfidenceLevel && (
              <div className={`p-3 rounded-lg border ${getConfidenceColor(result.confidenceLevel)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-80">신뢰도</p>
                    <p className="text-lg font-bold">{result.confidenceLevel}</p>
                  </div>
                  {renderCircularProgress(result.confidenceLevel, 'blue', 40)}
                </div>
              </div>
            )}

            {config.showTokenUsage && tokenData && (
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>토큰 사용</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{tokenData.total}</p>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {result.metadata && (
              <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">처리 시간</p>
                    <p className="text-lg font-bold text-gray-900">
                      {(result.metadata.processingTime / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <div className="text-gray-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 컨텍스트 사용량 시각화 */}
          {config.showContextUsage && contextData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                컨텍스트 활용도
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">완성도</span>
                    <span className="font-medium">{contextData.completeness}%</span>
                  </div>
                  {renderProgressBar(contextData.completeness, 100, 'green')}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">데이터 소스</span>
                      <span className="font-medium">{contextData.dataSourcesCount}개</span>
                    </div>
                    {renderProgressBar(contextData.dataSourcesCount, 10, 'blue')}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">개별화 요소</span>
                      <span className="font-medium">{contextData.individualizedElementsCount}개</span>
                    </div>
                    {renderProgressBar(contextData.individualizedElementsCount, 8, 'purple')}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">적응 방법</span>
                      <span className="font-medium">{contextData.adaptationsCount}개</span>
                    </div>
                    {renderProgressBar(contextData.adaptationsCount, 6, 'orange')}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">지원 요구</span>
                      <span className="font-medium">{contextData.supportNeedsCount}개</span>
                    </div>
                    {renderProgressBar(contextData.supportNeedsCount, 5, 'indigo')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 토큰 사용량 상세 */}
          {config.showTokenUsage && tokenData && (
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: 'var(--color-text-primary)' }}>
                <PieChart className="w-4 h-4 mr-2" />
                토큰 사용량 분석
              </h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{tokenData.prompt}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>프롬프트</div>
                  <div className="mt-1">
                    {renderProgressBar(tokenData.prompt, tokenData.total, 'purple')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{tokenData.completion}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>완성</div>
                  <div className="mt-1">
                    {renderProgressBar(tokenData.completion, tokenData.total, 'blue')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{tokenData.efficiency}%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>효율성</div>
                  <div className="mt-1">
                    {renderProgressBar(tokenData.efficiency, 100, 'green')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 메타데이터 */}
          {config.showMetadata && result.metadata && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                생성 메타데이터
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">모델:</span>
                  <div className="font-medium">{result.metadata.model}</div>
                </div>
                <div>
                  <span className="text-gray-600">온도:</span>
                  <div className="font-medium">{result.metadata.temperature}</div>
                </div>
                <div>
                  <span className="text-gray-600">최대 토큰:</span>
                  <div className="font-medium">{result.metadata.maxTokens}</div>
                </div>
                <div>
                  <span className="text-gray-600">재시도:</span>
                  <div className="font-medium">{result.metadata.retryCount || 0}회</div>
                </div>
              </div>
            </div>
          )}

          {/* 경고 및 오류 */}
          {(result.warnings && result.warnings.length > 0) || (result.errors && result.errors.length > 0) && (
            <div className="space-y-2">
              {result.warnings && result.warnings.length > 0 && (
                <div className="border rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: 'var(--color-text-secondary)' }} />
                    <div>
                      <h5 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>경고사항</h5>
                      <ul className="text-xs mt-1 space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {result.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="border rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: 'var(--color-text-secondary)' }} />
                    <div>
                      <h5 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>오류</h5>
                      <ul className="text-xs mt-1 space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {result.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 성공 지표 */}
          {result.qualityScore >= 80 && result.confidenceLevel >= 80 && (
            <div className="border rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                <div>
                  <h5 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>높은 품질 생성 완료</h5>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    품질 점수와 신뢰도가 모두 우수합니다. 생성된 콘텐츠를 안전하게 사용할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 설정 컨트롤 */}
      {showControls && isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2 text-xs">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={config.showQualityScore}
                onChange={() => toggleConfig('showQualityScore')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>품질점수</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={config.showConfidenceLevel}
                onChange={() => toggleConfig('showConfidenceLevel')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>신뢰도</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={config.showContextUsage}
                onChange={() => toggleConfig('showContextUsage')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>컨텍스트</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={config.showTokenUsage}
                onChange={() => toggleConfig('showTokenUsage')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>토큰사용량</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={config.showMetadata}
                onChange={() => toggleConfig('showMetadata')}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>메타데이터</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResultVisualization;
