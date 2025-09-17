'use client';

import { memo } from 'react';
import { useNewListings } from '../hooks/useNewListings';
import { NewListingCard } from './NewListingCard';

interface NewListingsContainerProps {
  className?: string;
  maxItems?: number;
}

export const NewListingsContainer = memo<NewListingsContainerProps>(({ 
  className = '',
  maxItems = 6
}) => {
  const { listings, loading, error, lastUpdated, refetch } = useNewListings();

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 dark:from-blue-600 dark:via-purple-600 dark:to-blue-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-white text-lg">🚀</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">신규상장 알림</h2>
                <p className="text-gray-600 dark:text-blue-100 text-sm">빗썸 신규 코인 상장 소식</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로딩 상태 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-600 dark:to-red-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-white text-lg">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">신규상장 알림</h2>
                <p className="text-gray-600 dark:text-red-100 text-sm">데이터 로드 실패</p>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 상태 */}
        <div className="p-6 text-center">
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </div>
          <button
            onClick={refetch}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const displayListings = listings.slice(0, maxItems);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 dark:from-emerald-600 dark:via-green-600 dark:to-emerald-700 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-white text-lg">🚀</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">신규상장 알림</h2>
              <p className="text-gray-600 dark:text-emerald-100 text-sm">빗썸 신규 코인 상장 소식</p>
            </div>
          </div>
          
          {/* 업데이트 시간 및 카운트 */}
          <div className="text-right">
            <div className="bg-emerald-100 dark:bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-1">
              <span className="text-gray-800 dark:text-white text-sm font-medium">
                {listings.length}개 알림
              </span>
            </div>
            {lastUpdated && (
              <div className="text-gray-600 dark:text-emerald-200 text-xs">
                {lastUpdated.toLocaleTimeString('ko-KR')} 업데이트
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
        {displayListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
              📋
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              신규상장 알림이 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              최근 빗썸에 상장된 새로운 코인이 없습니다
            </p>
            <button
              onClick={refetch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              새로고침
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayListings.map((listing, index) => (
                <NewListingCard
                  key={`${listing.publishedAt}-${index}`}
                  listing={listing}
                  isNew={index === 0} // 첫 번째 아이템만 NEW 표시
                />
              ))}
            </div>

            {/* 더보기 버튼 */}
            {listings.length > maxItems && (
              <div className="text-center mt-6">
                <button
                  onClick={() => window.open('https://bithumb.com/customer_support/notice', '_blank')}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  빗썸 공지사항에서 더보기 ({listings.length - maxItems}개 더)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

NewListingsContainer.displayName = 'NewListingsContainer';
