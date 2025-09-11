import { Button } from '../atoms/Button';
import { ClientOnly } from '../../hooks/useIsClient';

interface RefreshControlProps {
  isLoading: boolean;
  lastUpdated?: Date | null;
  onRefresh: () => void;
  autoRefresh?: boolean;
  onToggleAutoRefresh?: () => void;
}

export function RefreshControl({ 
  isLoading, 
  lastUpdated, 
  onRefresh, 
  autoRefresh = false,
  onToggleAutoRefresh 
}: RefreshControlProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          size="sm"
          variant="primary"
        >
          {isLoading ? '업데이트 중...' : '새로고침'}
        </Button>
        
        {onToggleAutoRefresh && (
          <Button
            onClick={onToggleAutoRefresh}
            size="sm"
            variant={autoRefresh ? 'success' : 'secondary'}
          >
            자동 새로고침 {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        )}
      </div>
      
      {lastUpdated && (
        <ClientOnly fallback={<div className="text-sm text-gray-500">업데이트 시간 로딩 중...</div>}>
          <div className="text-sm text-gray-500">
            마지막 업데이트: {formatTime(lastUpdated)}
          </div>
        </ClientOnly>
      )}
    </div>
  );
}
