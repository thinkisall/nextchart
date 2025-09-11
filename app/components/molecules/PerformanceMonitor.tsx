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
    if (!isConnected && updateMode !== 'manual' && updateMode !== 'auto') return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
      >
        <span>📊 성능 모니터링</span>
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${getStatusColor()}`}>
            {isConnected || updateMode === 'manual' || updateMode === 'auto' ? '● 연결됨' : '● 연결 안됨'}
          </span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.updateCount}</div>
              <div className="text-gray-600">업데이트 횟수</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dataLength}</div>
              <div className="text-gray-600">암호화폐 수</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getUpdateFrequency()}</div>
              <div className="text-gray-600">업데이트 주기</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatUptime(stats.connectionUptime)}
              </div>
              <div className="text-gray-600">연결 시간</div>
            </div>
          </div>

          {stats.lastUpdateTime && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
              마지막 업데이트: {stats.lastUpdateTime.toLocaleTimeString('ko-KR')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
