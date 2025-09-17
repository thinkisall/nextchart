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
      <div className={`fixed ${getPositionClasses()} z-50 flex flex-col items-end space-y-3 ${className}`}>
        
        {/* 확장된 메뉴 버튼들 */}
        {isExpanded && (
          <div className="flex flex-col space-y-3 animate-fade-in">
            <button
              onClick={() => handleOpenModal('feature')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 backdrop-blur-sm border border-blue-500/20"
              title="새 기능 요청"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">새 기능 요청</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('improvement')}
              className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 backdrop-blur-sm border border-emerald-500/20"
              title="개선 제안"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">개선 제안</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('bug')}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 backdrop-blur-sm border border-red-500/20"
              title="버그 신고"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🐛</span>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">버그 신고</span>
            </button>
            
            <button
              onClick={() => handleOpenModal('question')}
              className="group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 backdrop-blur-sm border border-amber-500/20"
              title="문의사항"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">❓</span>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">문의사항</span>
            </button>
          </div>
        )}

        {/* 메인 플로팅 버튼 */}
        <div className="relative group">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white w-16 h-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-sm border border-white/20 ${isExpanded ? 'rotate-45 scale-110' : 'hover:rotate-12'}`}
            title={isExpanded ? '메뉴 닫기' : '피드백 보내기'}
          >
            {/* 배경 글로우 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
            
            {/* 아이콘 */}
            <div className="relative z-10 transition-all duration-300">
              {isExpanded ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-0.5">💬</span>
                </div>
              )}
            </div>
            
            {/* 반짝이는 효과 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100" />
          </button>
          
          {/* 펄스 애니메이션 */}
          {!isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl animate-ping opacity-20 -z-20" />
          )}

          {/* 툴팁 */}
          {!isExpanded && (
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <span>💡</span>
                <span className="font-medium">피드백 보내기</span>
              </div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 border-l-4 border-l-gray-900/90 dark:border-l-gray-800/90 border-y-4 border-y-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* 확장 메뉴 배경 오버레이 */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 기능 요청 모달 */}
      <FeatureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 커스텀 CSS 애니메이션 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes fade-in {
          0% { 
            opacity: 0; 
            transform: translateY(10px) scale(0.9); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
});

FloatingFeatureButton.displayName = 'FloatingFeatureButton';
