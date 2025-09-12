'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ 
  items, 
  itemsPerPage = 20 
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // 중복 제거된 아이템을 메모이제이션으로 최적화
  const uniqueItems = useMemo(() => {
    if (items.length === 0) return [];
    return items.filter((item, index, self) => 
      index === self.findIndex((t: any) => t.symbol === (item as any).symbol)
    );
  }, [items]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(uniqueItems.length / itemsPerPage);

  // 현재 페이지의 아이템들
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return uniqueItems.slice(startIndex, endIndex);
  }, [uniqueItems, currentPage, itemsPerPage]);

  // 페이지 변경
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 페이지 변경 시 스크롤을 맨 위로
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  // 다음 페이지
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // 이전 페이지
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // 아이템이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [uniqueItems.length]);

  // 페이지 범위 계산 (표시할 페이지 번호들)
  const getPageRange = useCallback(() => {
    const delta = 2; // 현재 페이지 주변에 표시할 페이지 수
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // 통계값 메모이제이션
  const stats = useMemo(() => ({
    total: uniqueItems.length,
    displayed: currentItems.length,
    currentPage,
    totalPages,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, uniqueItems.length)
  }), [uniqueItems.length, currentItems.length, currentPage, totalPages, itemsPerPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    getPageRange,
    stats,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}