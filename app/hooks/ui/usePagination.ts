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
  const [isChangingPage, setIsChangingPage] = useState(false);

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

  // 스크롤 함수 개선
  const scrollToTable = useCallback(() => {
    // 여러 선택자로 테이블 또는 목록 컨테이너 찾기 (우선순위 순)
    const selectors = [
      '[data-crypto-table]',
      '.crypto-table-container', 
      '[role="table"]',
      'table',
      '.bg-gradient-to-r.from-slate-900', // 테이블 헤더
      'h2:contains("변동률")', // 제목
      'h2' // 임의의 제목
    ];
    
    let targetElement = null;
    for (const selector of selectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) break;
    }
    
    if (targetElement) {
      const headerOffset = 80; // 고정 헤더나 여유 공간
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    } else {
      // 요소를 찾지 못한 경우 적당한 위치로
      window.scrollTo({ 
        top: 300, // 300px 정도 아래로 (헤더 + 여유공간)
        behavior: 'smooth' 
      });
    }
  }, []);

  // 페이지 변경
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsChangingPage(true);
      setCurrentPage(page);
      
      // DOM 업데이트 후 스크롤
      setTimeout(() => {
        scrollToTable();
        setIsChangingPage(false);
      }, 100);
    }
  }, [totalPages, currentPage, scrollToTable]);

  // 다음 페이지
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  // 이전 페이지
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // 아이템이 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
    setIsChangingPage(false);
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
    isChangingPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}
