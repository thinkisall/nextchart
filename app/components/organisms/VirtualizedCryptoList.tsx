"use client";
import { memo, useMemo, useState, useEffect } from "react";
import { CryptoPrice } from "../../lib/types";
import { CryptoRowProfessional } from "../molecules/CryptoRowProfessional";

interface VirtualizedCryptoListProps {
  cryptos: CryptoPrice[];
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
  variant: "desktop" | "tablet" | "mobile";
}

// 간단한 Virtual Scrolling 구현
export const VirtualizedCryptoList = memo(
  ({
    cryptos,
    onCryptoClick,
    onToggleFavorite,
    isFavorite,
    variant,
  }: VirtualizedCryptoListProps) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

    // 아이템 높이를 variant에 따라 조정
    const itemHeight = useMemo(() => {
      switch (variant) {
        case "mobile":
          return 180; // 모바일 카드 높이 축소 (겹침 방지)
        case "tablet":
          return 80; // 태블릿 행 높이
        case "desktop":
          return 100; // 데스크톱 행 높이
        default:
          return 80;
      }
    }, [variant]);

    // 화면에 보이는 아이템만 렌더링
    const visibleItems = useMemo(() => {
      return cryptos.slice(visibleRange.start, visibleRange.end);
    }, [cryptos, visibleRange]);

    // 스크롤 이벤트 핸들러
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + 20, cryptos.length); // 한 번에 20개씩 렌더링

      setVisibleRange({ start, end });
    };

    const containerHeight = Math.min(cryptos.length * itemHeight, 600); // 최대 높이 600px
    const totalHeight = cryptos.length * itemHeight;

    if (cryptos.length === 0) return null;

    return (
      <div
        className="crypto-virtual-list overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              transform: `translateY(${visibleRange.start * itemHeight}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((crypto, index) => (
              <div key={crypto.symbol} style={{ height: itemHeight }}>
                <CryptoRowProfessional
                  crypto={crypto}
                  onClick={() => onCryptoClick?.(crypto)}
                  onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                  isFavorite={isFavorite?.(crypto.symbol) || false}
                  variant={variant}
                  index={visibleRange.start + index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

VirtualizedCryptoList.displayName = "VirtualizedCryptoList";
