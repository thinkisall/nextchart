'use client';

import { memo } from 'react';
import type { Listing } from '../types';

interface NewListingCardProps {
  listing: Listing;
  isNew?: boolean;
}

export const NewListingCard = memo<NewListingCardProps>(({ listing, isNew = false }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isRecent = () => {
    const date = new Date(listing.publishedAt);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24; // 24시간 이내
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
      
      {/* 뉴 배지 */}
      {(isNew || isRecent()) && (
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
            <span className="text-white text-sm sm:text-lg">🚀</span>
          </div>
          <div>
            <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
              {listing.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatDate(listing.publishedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {listing.title}
      </h3>

      {/* 코인 정보 */}
      {listing.coins.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            상장 코인:
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {listing.coins.map((coin, index) => (
              <div
                key={index}
                className="inline-flex items-center space-x-1 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-700/30 rounded-md sm:rounded-lg px-2 sm:px-3 py-1"
              >
                <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {coin.symbol}
                </span>
                {coin.name !== coin.symbol && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    ({coin.name})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 상세보기 버튼 */}
      <div className="flex justify-between items-center">
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <span>공지 보기</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        {isRecent() && (
          <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-medium">24시간 이내</span>
          </div>
        )}
      </div>
    </div>
  );
});

NewListingCard.displayName = 'NewListingCard';
