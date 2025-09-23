'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MobileButton } from './MobileButton';

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  className?: string;
}

export const MobilePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  className
}: MobilePaginationProps) => {
  const [showAllPages, setShowAllPages] = useState(false);

  const getVisiblePages = () => {
    if (showAllPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const maxVisible = window.innerWidth < 640 ? 5 : 7; // 모바일에서 페이지 수 줄이기
    const pages = [];
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const shouldShowExpand = totalPages > 7 && !showAllPages;

  if (totalPages <= 1) return null;

  return (
    <div className={cn(
      "flex items-center justify-center gap-1 md:gap-2",
      "py-4 px-2",
      className
    )}>
      {/* 이전 페이지 버튼 */}
      {showPrevNext && (
        <MobileButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 md:px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">이전</span>
        </MobileButton>
      )}

      {/* 첫 번째 페이지 (떨어져 있을 때) */}
      {!visiblePages.includes(1) && (
        <>
          <MobileButton
            variant={1 === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="px-3"
          >
            1
          </MobileButton>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <MobileButton
          key={page}
          variant={page === currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={cn(
            "px-3 min-w-[44px]", // 모바일 터치 타겟 보장
            page === currentPage && "font-semibold"
          )}
        >
          {page}
        </MobileButton>
      ))}

      {/* 마지막 페이지 (떨어져 있을 때) */}
      {!visiblePages.includes(totalPages) && totalPages > 1 && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )}
          <MobileButton
            variant={totalPages === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="px-3"
          >
            {totalPages}
          </MobileButton>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      {showPrevNext && (
        <MobileButton
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 md:px-3"
        >
          <span className="hidden sm:inline mr-1">다음</span>
          <ChevronRight className="h-4 w-4" />
        </MobileButton>
      )}

      {/* 모든 페이지 보기 토글 (모바일에서만) */}
      {shouldShowExpand && (
        <MobileButton
          variant="ghost"
          size="sm"
          onClick={() => setShowAllPages(!showAllPages)}
          className="ml-2 px-2 md:hidden"
        >
          <MoreHorizontal className="h-4 w-4" />
        </MobileButton>
      )}
    </div>
  );
};

// 간단한 페이지네이션 (모바일 전용)
interface SimpleMobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SimpleMobilePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}: SimpleMobilePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3",
      "bg-background border-t",
      className
    )}>
      <MobileButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        이전
      </MobileButton>

      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>

      <MobileButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
        <ChevronRight className="h-4 w-4 ml-1" />
      </MobileButton>
    </div>
  );
};
