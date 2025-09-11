import { useState, useEffect } from 'react';

interface PerformanceStats {
  updateCount: number;
  averageLatency: number;
  lastUpdateTime: Date | null;
  dataSize: number;
  connectionUptime: number;
}

interface PerformanceMonitorProps {
  updateMode: string;
  dataLength: number;
  isConnected: boolean;
}

export function PerformanceMonitor({ updateMode, dataLength, isConnected }: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    updateCount: 0,
    averageLatency: 0,
    lastUpdateTime: null,
    dataSize: 0,
    connectionUptime: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      updateCount: prev.updateCount + 1,
      lastUpdateTime: new Date(),
      dataSize: dataLength,
      connectionUptime: isConnected ? Date.now() - startTime : 0
    }));
  }, [dataLength, isConnected, startTime]);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}시간 ${minutes % 60}분`;
    if (minutes > 0) return `${minutes}분 ${seconds % 60}초`;
    return `${seconds}초`;
  };

  const getUpdateFrequency = () => {
    switch (updateMode) {
      case 'sse': return '1초';
      case 'auto': return '10초';
      case 'upbit-ws': return '실시간';
      case 'websocket': return '실시간';
      default: return '수동';
    }
  };

  const getStatusColor = () => {
    if (!isConnected && updateMode !== 'manual' && updateMode !== 'auto') return 'text-red-500 dark:text-red-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getStatusIcon = () => {
    if (!isConnected && updateMode !== 'manual' && updateMode !== 'auto') return '🔴';
    return '🟢';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">📊</span>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">성능 모니터링</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getStatusIcon()} {isConnected || updateMode === 'manual' || updateMode === 'auto' ? '연결됨' : '연결 안됨'}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  📈 {stats.updateCount}회 업데이트
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-4 text-xs">
              <div className="text-center">
                <div className="font-bold text-blue-600 dark:text-blue-400">{dataLength}</div>
                <div className="text-gray-500 dark:text-gray-400">코인</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600 dark:text-green-400">{getUpdateFrequency()}</div>
                <div className="text-gray-500 dark:text-gray-400">주기</div>
              </div>
            </div>
            <span className={`transform transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 animate-fadeIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.updateCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">📊 업데이트 횟수</div>
            </div>
            
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{dataLength}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">🪙 암호화폐 수</div>
            </div>
            
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getUpdateFrequency()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">⏱️ 업데이트 주기</div>
            </div>
            
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {formatUptime(stats.connectionUptime)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">⏰ 연결 시간</div>
            </div>
          </div>

          {stats.lastUpdateTime && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>🕐</span>
                <span>마지막 업데이트: {stats.lastUpdateTime.toLocaleTimeString('ko-KR')}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}