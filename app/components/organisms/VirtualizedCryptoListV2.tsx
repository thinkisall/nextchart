"use client";
import { memo, useMemo, useRef, useEffect, useState, useCallback } from "react";
import { CryptoPrice } from "../../lib/types";
import { CryptoRowOptimized } from "../molecules/CryptoRowOptimized";
import { usePerformanceMonitor } from "../../lib/performance-monitor";

interface VirtualizedCryptoListV2Props {
  cryptos: CryptoPrice[];
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
  variant: "desktop" | "tablet" | "mobile";
}

/**
 * 고성능 Virtual Scrolling 구현
 * - Intersection Observer 활용
 * - 메모리 사용량 최적화
 * - 부드러운 스크롤링
 * - 모바일 성능 최적화
 */
export const VirtualizedCryptoListV2 = memo(({
  cryptos,
  onCryptoClick,
  onToggleFavorite,
  isFavorite,
  variant,
}: VirtualizedCryptoListV2Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 15 });
  const [containerHeight, setContainerHeight] = useState(600);
  const { measureScrollPerformance } = usePerformanceMonitor();

  // 디바이스별 최적화된 설정
  const config = useMemo(() => {
    const isMobile = variant === "mobile";
    return {
      itemHeight: isMobile ? 140 : variant === "tablet" ? 70 : 90,
      overscan: isMobile ? 3 : 5, // 모바일에서는 오버스캔 줄임
      visibleCount: isMobile ? 10 : 15, // 모바일에서는 더 적게 렌더링
      bufferSize: isMobile ? 5 : 8,
    };
  }, [variant]);

  // 컨테이너 높이 조정 + 성능 모니터링 설정
  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== 'undefined') {
        const viewportHeight = window.innerHeight;
        const maxHeight = variant === "mobile" ? viewportHeight * 0.6 : 600;
        setContainerHeight(Math.min(maxHeight, cryptos.length * config.itemHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    // 스크롤 성능 모니터링 설정
    let cleanupScrollMonitor: (() => void) | undefined;
    if (containerRef.current && process.env.NODE_ENV === 'development') {
      cleanupScrollMonitor = measureScrollPerformance(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      cleanupScrollMonitor?.();
    };
  }, [cryptos.length, config.itemHeight, variant, measureScrollPerformance]);

  // 최적화된 스크롤 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / config.itemHeight) - config.overscan);
    const end = Math.min(
      cryptos.length,
      start + config.visibleCount + config.overscan * 2
    );

    setVisibleRange(prev => {
      if (prev.start !== start || prev.end !== end) {
        return { start, end };
      }
      return prev;
    });
  }, [config.itemHeight, config.overscan, config.visibleCount, cryptos.length]);

  // 현재 보이는 아이템들
  const visibleItems = useMemo(() => {
    return cryptos.slice(visibleRange.start, visibleRange.end);
  }, [cryptos, visibleRange]);

  // 스크롤 영역 전체 높이
  const totalHeight = cryptos.length * config.itemHeight;

  // 빈 상태 처리
  if (cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="virtual-scroll-container overflow-auto"
      style={{ 
        height: containerHeight,
        // 모바일 최적화: 스크롤 성능 향상
        ...(variant === "mobile" && {
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        })
      }}
      onScroll={handleScroll}
    >
      <div
        className="virtual-scroll-content"
        style={{ 
          height: totalHeight, 
          position: "relative",
          // GPU 가속 활용
          willChange: 'transform'
        }}
      >
        <div
          style={{
            transform: `translateY(${visibleRange.start * config.itemHeight}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            // 브라우저 최적화
            willChange: 'transform'
          }}
        >
          {visibleItems.map((crypto, index) => {
            const actualIndex = visibleRange.start + index;
            
            return (
              <div 
                key={crypto.symbol} 
                style={{ 
                  height: config.itemHeight,
                  // 모바일에서 padding 최소화
                  ...(variant === "mobile" && { padding: '2px' })
                }}
              >
                <CryptoRowOptimized
                  crypto={crypto}
                  onClick={() => onCryptoClick?.(crypto)}
                  onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                  isFavorite={isFavorite?.(crypto.symbol) || false}
                  variant={variant}
                  index={actualIndex}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

VirtualizedCryptoListV2.displayName = "VirtualizedCryptoListV2";
