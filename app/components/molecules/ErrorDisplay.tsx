interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * 사용자 친화적인 에러 표시 컴포넌트
 */
export function ErrorDisplay({ error, onRetry, isRetrying = false }: ErrorDisplayProps) {
  
  // 에러 타입에 따른 아이콘과 메시지 결정
  const getErrorInfo = (errorMessage: string) => {
    if (errorMessage.includes('네트워크') || errorMessage.includes('연결')) {
      return {
        icon: '📡',
        title: '인터넷 연결 오류',
        description: '네트워크 연결을 확인하고 다시 시도해주세요.',
        color: 'red'
      };
    }
    
    if (errorMessage.includes('시간 초과') || errorMessage.includes('지연')) {
      return {
        icon: '⏰',
        title: '서버 응답 지연',
        description: '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.',
        color: 'orange'
      };
    }
    
    return {
      icon: '⚠️',
      title: '데이터 로딩 오류',
      description: errorMessage,
      color: 'yellow'
    };
  };
  
  const errorInfo = getErrorInfo(error);
  
  return (
    <div className="flex justify-center items-center py-16 sm:py-24">
      <div className="text-center max-w-md">
        <div className="inline-flex flex-col items-center space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl px-8 sm:px-12 py-8 sm:py-12 shadow-2xl border-2 border-red-200/50 dark:border-red-800/30">
          
          {/* 에러 아이콘 */}
          <div className="relative">
            <div className="text-6xl">{errorInfo.icon}</div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          
          {/* 에러 정보 */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {errorInfo.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {errorInfo.description}
            </p>
          </div>
          
          {/* 재시도 버튼 */}
          {onRetry && (
            <button 
              onClick={onRetry}
              disabled={isRetrying}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-bold shadow-lg 
                hover:shadow-xl transition-all duration-300 hover:scale-105
                ${isRetrying 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }
              `}
            >
              <span className={`${isRetrying ? 'animate-spin' : ''}`}>🔄</span>
              <span>{isRetrying ? '재시도 중...' : '다시 시도'}</span>
            </button>
          )}
          
          {/* 추가 도움말 */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• 문제가 지속되면 새로고침을 시도해주세요</p>
            <p>• 모바일에서는 WiFi 연결을 확인해주세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 간단한 인라인 에러 표시
 */
export function InlineError({ error, className = '' }: { error: string; className?: string }) {
  return (
    <div className={`flex items-center space-x-2 text-red-600 dark:text-red-400 ${className}`}>
      <span className="text-lg">⚠️</span>
      <span className="text-sm">{error}</span>
    </div>
  );
}

/**
 * 토스트 스타일 에러 알림
 */
export function ErrorToast({ error, onClose }: { error: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <span className="text-lg">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
