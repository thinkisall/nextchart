import { X } from 'lucide-react';
import { MobileCryptoRanking } from '../organisms/MobileCryptoRanking';
import { CryptoPrice } from '../../lib/types';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CryptoPrice[];
  onItemClick?: (item: CryptoPrice) => void;
}

export function RankingModal({ isOpen, onClose, data, onItemClick }: RankingModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* 모달 컨테이너 */}
      <div 
        className="relative h-full flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 컨텐츠 */}
        <div className="
          bg-white dark:bg-gray-800 
          w-full max-w-md max-h-[90vh]
          rounded-t-3xl sm:rounded-3xl
          shadow-2xl
          overflow-hidden
          animate-slide-up
        ">
          {/* 상단 핸들바 (모바일용) */}
          <div className="flex justify-center py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          
          {/* 닫기 버튼 (데스크톱용) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center hidden sm:flex"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* 변동순위 컨텐츠 */}
          <MobileCryptoRanking
            data={data}
            title="변동률 순위"
            subtitle="24시간 변동률 기준"
            maxItems={50}
            onItemClick={(item: CryptoPrice) => {
              onItemClick?.(item);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}