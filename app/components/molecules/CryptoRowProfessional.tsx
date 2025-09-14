"use client";
import { useEffect, useRef, useState } from "react";
import { CryptoPrice } from "../../lib/types";
import { PriceChange } from "../atoms/PriceChange";
import { BinanceBadge } from "../atoms/BinanceBadge";
import { AlphaIcon } from "../atoms/BinanceAlphaBadge";
import { UpbitBadge } from "../atoms/UpbitBadge";
import { UPusdtBadge } from "../atoms/UPusdtBadge";
import { SECTOR_COLORS } from "../../lib/crypto";
import { hasUpbitUsdtPair } from "../../lib/exchanges";

interface CryptoRowProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: "desktop" | "tablet" | "mobile";
  index?: number;
}

export function CryptoRowProfessional({
  crypto,
  onClick,
  onToggleFavorite,
  isFavorite = false,
  variant = "desktop",
  index = 0,
}: CryptoRowProps) {
  // 가격 변동 애니메이션을 위한 상태
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef<number>(crypto.current_price);

  // 가격 변동 감지 및 애니메이션 트리거
  useEffect(() => {
    const currentPrice = crypto.current_price;
    const prevPrice = prevPriceRef.current;

    if (prevPrice !== currentPrice) {
      if (currentPrice > prevPrice) {
        setPriceFlash("up");
      } else if (currentPrice < prevPrice) {
        setPriceFlash("down");
      }

      const timer = setTimeout(() => {
        setPriceFlash(null);
      }, 1200);

      prevPriceRef.current = currentPrice;
      return () => clearTimeout(timer);
    }
  }, [crypto.current_price]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
      maximumFractionDigits: price < 1000 ? 2 : 0,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e12) {
      return `${(volume / 1e12).toFixed(1)}조`;
    } else if (volume >= 1e8) {
      return `${(volume / 1e8).toFixed(1)}억`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(0)}K`;
    }
    return volume.toFixed(0);
  };

  const getCoinIcon = (symbol: string) => {
    const iconMap: { [key: string]: string } = {
      BTC: "₿",
      ETH: "Ξ", 
      XRP: "ΧΡΡ",
      ADA: "₳",
      SOL: "◎",
      DOGE: "🐕",
      SHIB: "🐕", 
      PEPE: "🐸",
      BONK: "🐕",
      FLOKI: "🐕",
      PUMP: "PU",
      PEAQ: "PE",
    };
    return iconMap[symbol] || symbol.slice(0, 2);
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return { 
      bgColor: "bg-gradient-to-r from-amber-500 to-yellow-500",
      textColor: "text-white", 
      number: "1",
      borderColor: "border-amber-300/30"
    };
    if (index === 1) return { 
      bgColor: "bg-gradient-to-r from-gray-400 to-slate-500",
      textColor: "text-white", 
      number: "2",
      borderColor: "border-gray-300/30"
    };
    if (index === 2) return { 
      bgColor: "bg-gradient-to-r from-orange-500 to-amber-600",
      textColor: "text-white", 
      number: "3",
      borderColor: "border-orange-300/30"
    };
    if (index < 10) return { 
      bgColor: "bg-gradient-to-r from-blue-600 to-indigo-600",
      textColor: "text-white", 
      number: (index + 1).toString(),
      borderColor: "border-blue-300/20"
    };
    return { 
      bgColor: "bg-gradient-to-r from-slate-600 to-gray-700",
      textColor: "text-white", 
      number: (index + 1).toString(),
      borderColor: "border-slate-300/20"
    };
  };

  const rank = getRankStyle(index);

  // 초세련된 모바일 카드 디자인
  if (variant === "mobile") {
    return (
      <div
        className={`
          group relative overflow-hidden rounded-3xl border backdrop-blur-md
          transition-all duration-700 cursor-pointer touch-manipulation
          active:scale-[0.96] hover:scale-[1.01]
          bg-white/95 dark:bg-slate-900/95 
          ${rank.borderColor}
          shadow-xl hover:shadow-2xl
          ${priceFlash === "up" 
            ? "ring-2 ring-emerald-400/70 shadow-emerald-200/30" 
            : ""}
          ${priceFlash === "down" 
            ? "ring-2 ring-red-400/70 shadow-red-200/30" 
            : ""}
        `}
        onClick={onClick}
      >
        {/* 상단 영역 - 순위와 즐겨찾기 */}
        <div className="flex items-start justify-between p-5 pb-4">
          {/* 순위 배지 - 미니멀 프로페셔널 */}
          <div className={`
            ${rank.bgColor} ${rank.textColor} 
            w-8 h-8 rounded-2xl flex items-center justify-center
            shadow-lg font-bold text-sm tracking-tight
          `}>
            {rank.number}
          </div>

          {/* 즐겨찾기 버튼 - 더 세련되게 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className={`
              w-8 h-8 rounded-2xl transition-all duration-300 
              flex items-center justify-center text-base font-medium
              ${isFavorite 
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 scale-110" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600"
              }
              hover:scale-110 focus:outline-none shadow-sm
            `}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>

        {/* 메인 정보 영역 */}
        <div className="px-5 pb-5">
          {/* 코인 정보 - 더 전문적으로 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* 코인 아이콘 - 더 작고 세련되게 */}
              <div className={`
                w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-sm font-bold
                ${index < 3 
                  ? rank.bgColor
                  : "bg-gradient-to-br from-slate-700 to-slate-800 text-white"
                }
              `}>
                {getCoinIcon(crypto.symbol)}
              </div>
              
              {/* 코인 이름과 심볼 */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight truncate">
                  {crypto.korean_name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                  {crypto.symbol}
                </p>
              </div>
            </div>
            
            {/* 거래소 배지들 - 더 컴팩트하게 */}
            <div className="flex items-center space-x-1">
              {crypto.isBinanceAlpha && <AlphaIcon />}
              {crypto.isOnBinance && <BinanceBadge size="sm" />}
              {crypto.isOnUpbit && <UpbitBadge size="sm" />}
              {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="sm" />}
            </div>
          </div>

          {/* 가격 정보 - 더 깔끔하게 */}
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium uppercase tracking-wide">
                현재가
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none tabular-nums">
                {formatPrice(crypto.current_price)}
              </p>
            </div>
            
            {/* 변동률 - 더 프로페셔널하게 */}
            <div className="flex-shrink-0">
              <div className={`
                px-3 py-1.5 rounded-2xl backdrop-blur-sm font-bold text-sm
                flex items-center space-x-1.5
                ${crypto.is_positive
                  ? "bg-emerald-500/90 text-white shadow-emerald-200/40"
                  : "bg-red-500/90 text-white shadow-red-200/40"
                }
              `}>
                <span className="text-xs">
                  {crypto.is_positive ? "▲" : "▼"}
                </span>
                <span className="tabular-nums">
                  {crypto.is_positive ? "+" : ""}{crypto.change_rate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액센트 라인 - 더 얇고 세련되게 */}
        <div className={`
          h-0.5 ${crypto.is_positive 
            ? "bg-gradient-to-r from-emerald-400 to-green-500" 
            : "bg-gradient-to-r from-red-400 to-pink-500"
          }
        `} />
      </div>
    );
  }

  // 태블릿 및 데스크톱용 테이블 행 스타일
  const tableBaseClasses = `
    group transition-all duration-300 cursor-pointer 
    ${index < 3
      ? "bg-gradient-to-r from-yellow-50/30 via-white to-white dark:from-yellow-900/10 dark:via-gray-800 dark:to-gray-800 hover:from-yellow-100/50 dark:hover:from-yellow-900/20"
      : "hover:bg-white/80 dark:hover:bg-gray-800/80"
    }
    ${priceFlash === "up" ? "bg-emerald-100/60 dark:bg-emerald-900/20" : ""}
    ${priceFlash === "down" ? "bg-red-100/60 dark:bg-red-900/20" : ""}
  `;

  if (variant === "tablet") {
    return (
      <tr className={tableBaseClasses} onClick={onClick}>
        <td className="px-4 py-5">
          <div className="flex items-center space-x-4">
            {/* 순위 */}
            <div className={`${rank.bgColor} ${rank.textColor} w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm`}>
              {rank.number}
            </div>
            {/* 코인 정보 */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${index < 3 ? rank.bgColor : "bg-gradient-to-br from-slate-600 to-slate-700"} text-white text-sm font-bold`}>
                {getCoinIcon(crypto.symbol)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{crypto.korean_name}</div>
                  {crypto.isBinanceAlpha && <AlphaIcon className="ml-1" />}
                  {crypto.isOnBinance && <BinanceBadge size="sm" />}
                  {crypto.isOnUpbit && <UpbitBadge size="sm" />}
                  {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="sm" />}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{crypto.symbol}</div>
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-5 text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatPrice(crypto.current_price)}</div>
        </td>
        <td className="px-4 py-5 text-right">
          <PriceChange value={crypto.change_amount} percentage={crypto.change_rate} isPositive={crypto.is_positive} size="sm" />
        </td>
        <td className="px-4 py-5 text-center">
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }} className="text-xl hover:scale-110 focus:outline-none transition-all p-2 touch-manipulation rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
            {isFavorite ? "⭐" : "☆"}
          </button>
        </td>
      </tr>
    );
  }

  // 데스크톱 버전
  return (
    <tr className={tableBaseClasses + " border-b border-gray-100/50 dark:border-gray-700/30"} onClick={onClick}>
      <td className="px-6 py-6">
        <div className="flex items-center space-x-6">
          {/* 순위 */}
          <div className={`${rank.bgColor} ${rank.textColor} w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm`}>
            {rank.number}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }} className="text-2xl hover:scale-110 focus:outline-none transition-all opacity-60 group-hover:opacity-100 p-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
            {isFavorite ? "⭐" : "☆"}
          </button>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${index < 3 ? rank.bgColor : "bg-gradient-to-br from-slate-600 to-slate-700"} text-white font-bold`}>
              {getCoinIcon(crypto.symbol)}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{crypto.korean_name}</div>
                {crypto.isBinanceAlpha && <AlphaIcon className="ml-1" />}
                {crypto.isOnBinance && <BinanceBadge size="md" />}
                {crypto.isOnUpbit && <UpbitBadge size="md" />}
                {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="md" />}
                {crypto.sector && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${SECTOR_COLORS[crypto.sector] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                    {crypto.sector}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{crypto.symbol}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-6 text-right">
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatPrice(crypto.current_price)}</div>
      </td>
      <td className="px-6 py-6 text-right">
        <PriceChange value={crypto.change_amount} percentage={crypto.change_rate} isPositive={crypto.is_positive} size="lg" />
      </td>
      <td className="px-6 py-6 text-right">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{formatVolume(crypto.volume)}</div>
      </td>
      <td className="px-6 py-6 text-center">
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }} className="text-2xl hover:scale-110 focus:outline-none transition-all p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 opacity-60 group-hover:opacity-100">
          {isFavorite ? "⭐" : "☆"}
        </button>
      </td>
    </tr>
  );
}