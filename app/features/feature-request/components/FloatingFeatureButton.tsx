import { memo, useState } from 'react';
import { FeatureRequestModal } from './FeatureRequestModal';
import type { FeatureRequestForm } from '../types';

interface FloatingFeatureButtonProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * 플로팅 기능 요청 버튼
 * 페이지 우측 하단에 고정되어 있는 기능 요청 버튼
 */
export const FloatingFeatureButton = memo<FloatingFeatureButtonProps>(({ 
  className = '',
  position = 'bottom-right'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    };
    return positions[position];
  };

  const handleOpenModal = (type: FeatureRequestForm['type'] = 'feature') => {
    setIsModalOpen(true);
    setIsExpanded(false);
  };

  return (
    <>
      {/* 플로팅 버튼 그룹 */}
      <div className={`fixed ${getPositionClasses()} z-40 flex flex-col items-end space-y-3 ${className}`}>
        
        {/* 확장된 메뉴 버튼들 */}
        {isExpanded && (
          <div className="flex flex-col space-y-2 animate-fade-in">
            <button
              onClick={() => handleOpenModal('feature')}
              className="group bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full 
                shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
              title="새 기능 요청"
            >
              <span className="text-sm">🚀</span>
              <span className="text-sm font-medium whitespace-nowrap">새 기능</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('improvement')}
              className="group bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full 
                shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
              title="개선 제안"
            >
              <span className="text-sm">✨</span>
              <span className="text-sm font-medium whitespace-nowrap">개선 제안</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('bug')}
              className="group bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full 
                shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
              title="버그 신고"
            >
              <span className="text-sm">🐛</span>
              <span className="text-sm font-medium whitespace-nowrap">버그 신고</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('question')}
              className="group bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full 
                shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
              title="문의사항"
            >
              <span className="text-sm">❓</span>
              <span className="text-sm font-medium whitespace-nowrap">문의</span>
            </button>
          </div>
        )}

        {/* 메인 플로팅 버튼 */}
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
              hover:from-purple-600 hover:via-pink-600 hover:to-red-600 
              text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl 
              transition-all duration-300 transform hover:scale-110 active:scale-95
              flex items-center justify-center ${isExpanded ? 'rotate-45' : 'hover:rotate-12'}
            `}
            title={isExpanded ? '메뉴 닫기' : '아이디어 제안하기'}
          >
            {isExpanded ? (
              <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="text-xl">💡</div>
            )}
          </button>
          
          {/* 펄스 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 
            rounded-full animate-ping opacity-20 -z-10" />
        </div>

        {/* 툴팁 */}
        {!isExpanded && (
          <div className="absolute right-16 bottom-4 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 
            rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 
            transition-opacity pointer-events-none">
            아이디어 제안하기
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 
              border-l-4 border-l-gray-900 dark:border-l-gray-700 border-y-4 border-y-transparent" />
          </div>
        )}
      </div>

      {/* 확장 메뉴 배경 오버레이 */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px]"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 기능 요청 모달 */}
      <FeatureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

FloatingFeatureButton.displayName = 'FloatingFeatureButton';
