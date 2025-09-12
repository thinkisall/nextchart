'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

interface UseVirtualScrollProps<T> {
  items: T[];
  initialCount?: number;
  batchSize?: number;
  threshold?: number;
}

export function useVirtualScroll<T>({ 
  items, 
  initialCount = 10, 
  batchSize = 20, 
  threshold = 100 
}: UseVirtualScrollProps<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 중복 제거된 아이템을 메모이제이션으로 최적화
  const uniqueItems = useMemo(() => {
    if (items.length === 0) return [];
    return items.filter((item, index, self) => 
      index === self.findIndex((t: any) => t.symbol === (item as any).symbol)
    );
  }, [items]);

  // 아이템이 변경될 때 초기화
  useEffect(() => {
    if (uniqueItems.length === 0) {
      setDisplayedItems([]);
      setCurrentIndex(0);
      setHasMore(true);
      return;
    }

    const initial = uniqueItems.slice(0, initialCount);
    setDisplayedItems(initial);
    setCurrentIndex(initialCount);
    setHasMore(uniqueItems.length > initialCount);
  }, [uniqueItems, initialCount]);

  // 더 많은 아이템 로드 - 최적화된 버전
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore || uniqueItems.length === 0) return;

    setIsLoading(true);
    
    // 비동기 처리로 UI 블로킹 방지
    requestAnimationFrame(() => {
      const nextIndex = currentIndex + batchSize;
      const newItems = uniqueItems.slice(currentIndex, nextIndex);
      
      if (newItems.length > 0) {
        setDisplayedItems(prev => [...prev, ...newItems]);
        setCurrentIndex(nextIndex);
        setHasMore(nextIndex < uniqueItems.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    });
  }, [uniqueItems, currentIndex, batchSize, isLoading, hasMore]);

  // Intersection Observer를 사용한 무한 스크롤 (스크롤 핸들러 제거)
  const observerRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // 미리 로드하여 부드러운 스크롤
      }
    );

    if (node) observer.observe(node);
    
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [isLoading, hasMore, loadMore]);

  // 통계값 메모이제이션
  const stats = useMemo(() => ({
    total: uniqueItems.length,
    displayed: displayedItems.length,
    remaining: Math.max(0, uniqueItems.length - displayedItems.length)
  }), [uniqueItems.length, displayedItems.length]);

  return {
    displayedItems,
    isLoading,
    hasMore,
    loadMore,
    observerRef,
    stats
  };
}