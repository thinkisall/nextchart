"use client";
import { memo, useCallback } from "react";
import { CryptoPrice } from "../../lib/types";
import { PriceChange } from "../atoms/PriceChange";
import { BinanceBadge } from "../atoms/BinanceBadge";
import { AlphaIcon } from "../atoms/BinanceAlphaBadge";
import { UpbitBadge } from "../atoms/UpbitBadge";
import { UPusdtBadge } from "../atoms/UPusdtBadge";
import { hasUpbitUsdtPair } from "../../lib/exchanges";

interface CryptoRowOptimizedProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: "desktop" | "tablet" | "mobile";
  index?: number;
}

/**
 * 성능 최적화된 CryptoRow 컴포넌트
 * - React.memo로 불필요한 리렌더링 방지
 * - 애니메이션 최소화
 * - DOM 요소 단순화
 * - 모바일 최적화
 */
const CryptoRowOptimized = memo(({
  crypto,
  onClick,
  onToggleFavorite,
  isFavorite = false,
  variant = "desktop",
  index = 0,
}: CryptoRowOptimizedProps) => {
  
  // 이벤트 핸들러 메모이제이션
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  }, [onToggleFavorite]);

  // 가격 포맷팅 최적화 (메모이제이션)
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
    maximumFractionDigits: crypto.current_price < 1000 ? 2 : 0,
  }).format(crypto.current_price);

  // 순위 표시 최적화
  const getRankIcon = (index: number) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    if (index < 10) return "🔝";
    return "#";
  };

  const getRankBg = (index: number) => {
    if (index < 3) return "bg-yellow-100 dark:bg-yellow-900/30";
    if (index < 10) return "bg-blue-50 dark:bg-blue-900/20";
    return "bg-gray-50 dark:bg-gray-800/30";
  };

  // 코인 아이콘 최적화
  const getCoinIcon = (symbol: string) => {
    const iconMap: Record<string, string> = {
      BTC: "₿", ETH: "Ξ", XRP: "ΧΡΡ", ADA: "₳", SOL: "◎",
      DOGE: "🐕", SHIB: "🐕", PEPE: "🐸", BONK: "🐕", FLOKI: "🐕",
    };
    return iconMap[symbol] || symbol.slice(0, 2);
  };

  // 모바일 카드 - 단순화된 디자인
  if (variant === "mobile") {
    return (
      <div
        className={`
          crypto-row-optimized mobile-optimized memory-optimized touch-optimized
          relative overflow-hidden rounded-lg border cursor-pointer
          ${index < 3 
            ? "bg-gradient-to-br from-white to-yellow-50/30 dark:from-gray-800 dark:to-yellow-900/10 border-yellow-300/30" 
            : "bg-white dark:bg-gray-800 border-gray-200/40 dark:border-gray-700/40"
          }
          active:scale-[0.98] transition-transform duration-100
        `}
        onClick={onClick}
      >
        {/* 상단 헤더 */}
        <div className="flex justify-between items-start p-3">
          {/* 순위 */}
          <div className={`${getRankBg(index)} px-2 py-1 rounded-md flex items-center space-x-1`}>
            <span className="text-xs">{getRankIcon(index)}</span>
            <span className="text-xs font-semibold">{index + 1}</span>
          </div>
          
          {/* 즐겨찾기 */}
          <button
            onClick={handleFavoriteClick}
            className="text-lg p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="px-3 pb-3">
          {/* 코인 정보 */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
              {crypto.korean_name}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              {crypto.isBinanceAlpha && <AlphaIcon />}
              {crypto.isOnBinance && <BinanceBadge size="sm" />}
              {crypto.isOnUpbit && <UpbitBadge size="sm" />}
              {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="sm" />}
            </div>
          </div>

          {/* 가격과 변동률 - 충돌 방지 레이아웃 */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 crypto-text-optimized truncate">
                {formattedPrice}
              </div>
            </div>
            <div className="flex-shrink-0">
              <PriceChange
                value={crypto.change_amount}
                percentage={crypto.change_rate}
                isPositive={crypto.is_positive}
                size="sm"
                compact={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 태블릿 테이블 행
  if (variant === "tablet") {
    return (
      <tr
        className={`
          crypto-row-optimized memory-optimized touch-optimized
          hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer
          ${index < 3 ? "bg-yellow-50/30 dark:bg-yellow-900/10" : ""}
        `}
        onClick={onClick}
      >
        <td className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className={`${getRankBg(index)} px-2 py-1 rounded-md flex items-center space-x-1`}>
              <span className="text-xs">{getRankIcon(index)}</span>
              <span className="text-xs font-semibold">{index + 1}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {getCoinIcon(crypto.symbol)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {crypto.korean_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {crypto.symbol}
                </div>
              </div>
            </div>
          </div>
        </td>

        <td className="px-4 py-4 text-right">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 crypto-text-optimized">
            {formattedPrice}
          </div>
        </td>

        <td className="px-4 py-4 text-right">
          <PriceChange
            value={crypto.change_amount}
            percentage={crypto.change_rate}
            isPositive={crypto.is_positive}
            size="sm"
          />
        </td>

        <td className="px-4 py-4 text-center">
          <button
            onClick={handleFavoriteClick}
            className="text-lg p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </td>
      </tr>
    );
  }

  // 데스크톱 테이블 행 (기존 기능 유지하되 최적화)
  return (
    <tr
      className={`
        crypto-row-optimized memory-optimized
        hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-100/50
        ${index < 3 ? "bg-yellow-50/30 dark:bg-yellow-900/10" : ""}
      `}
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className={`${getRankBg(index)} px-3 py-2 rounded-lg flex items-center space-x-2`}>
            <span className="text-sm">{getRankIcon(index)}</span>
            <span className="text-sm font-semibold">{index + 1}위</span>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isFavorite ? "⭐" : "☆"}
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {getCoinIcon(crypto.symbol)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {crypto.korean_name}
                </div>
                {crypto.isBinanceAlpha && <AlphaIcon />}
                {crypto.isOnBinance && <BinanceBadge size="md" />}
                {crypto.isOnUpbit && <UpbitBadge size="md" />}
                {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="md" />}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 crypto-text-optimized">
          {formattedPrice}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
          size="lg"
        />
      </td>

      <td className="px-6 py-4 text-right">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {crypto.volume.toLocaleString()}
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <button
          onClick={handleFavoriteClick}
          className="text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // 정확한 비교 조건으로 최적화
  return (
    prevProps.crypto.symbol === nextProps.crypto.symbol &&
    prevProps.crypto.current_price === nextProps.crypto.current_price &&
    prevProps.crypto.change_rate === nextProps.crypto.change_rate &&
    prevProps.crypto.change_amount === nextProps.crypto.change_amount &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.index === nextProps.index
  );
});

CryptoRowOptimized.displayName = "CryptoRowOptimized";

export { CryptoRowOptimized };
