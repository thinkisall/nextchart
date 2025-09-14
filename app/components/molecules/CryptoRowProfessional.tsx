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
      }, 800);

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
    };
    return iconMap[symbol] || symbol.slice(0, 2);
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return { 
      gradient: "from-amber-400 via-yellow-300 to-amber-500",
      textColor: "text-amber-900", 
      icon: "👑",
      glow: "shadow-amber-200/50"
    };
    if (index === 1) return { 
      gradient: "from-gray-300 via-slate-200 to-gray-400",
      textColor: "text-slate-800", 
      icon: "🥈",
      glow: "shadow-gray-200/50"
    };
    if (index === 2) return { 
      gradient: "from-orange-400 via-amber-300 to-orange-500",
      textColor: "text-orange-900", 
      icon: "🥉",
      glow: "shadow-orange-200/50"
    };
    return { 
      gradient: "from-blue-500 via-indigo-400 to-purple-500",
      textColor: "text-white", 
      icon: "#",
      glow: "shadow-blue-200/30"
    };
  };

  const rank = getRankStyle(index);

  // 프로페셔널 모바일 카드 디자인
  if (variant === "mobile") {
    return (
      <div
        className={`
          group relative overflow-hidden rounded-2xl border backdrop-blur-sm
          transition-all duration-500 cursor-pointer touch-manipulation
          active:scale-[0.97] hover:scale-[1.02] 
          ${index < 3 
            ? `bg-gradient-to-br from-slate-50/95 via-white/90 to-slate-100/95 
               dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95
               border-slate-200/60 dark:border-slate-600/40
               shadow-xl ${rank.glow} hover:shadow-2xl` 
            : `bg-slate-50/90 dark:bg-slate-900/90 
               border-slate-200/50 dark:border-slate-700/50
               shadow-lg hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-800/30`
          }
          ${priceFlash === "up" 
            ? "ring-2 ring-emerald-400/60 bg-emerald-50/30 dark:bg-emerald-900/20" 
            : ""}
          ${priceFlash === "down" 
            ? "ring-2 ring-red-400/60 bg-red-50/30 dark:bg-red-900/20" 
            : ""}
        `}
        onClick={onClick}
      >
        {/* 상단 헤더 영역 */}
        <div className="flex items-start justify-between p-4 pb-3">
          {/* 순위 배지 - 미니멀한 프로페셔널 스타일 */}
          <div className={`
            px-3 py-1.5 rounded-xl bg-gradient-to-r ${rank.gradient} 
            shadow-lg ${rank.glow} flex items-center space-x-1.5
          `}>
            <span className="text-sm">{rank.icon}</span>
            <span className={`text-xs font-bold tracking-wide ${rank.textColor}`}>
              {index < 10 ? `${index + 1}위` : `${index + 1}`}
            </span>
          </div>

          {/* 즐겨찾기 버튼 - 세련된 아이콘 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className={`
              w-9 h-9 rounded-xl transition-all duration-300 
              flex items-center justify-center text-lg
              ${isFavorite 
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500 scale-110" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
              hover:scale-110 focus:outline-none shadow-sm
            `}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>

        {/* 메인 정보 영역 */}
        <div className="px-4 pb-4">
          {/* 코인 아이콘 + 이름 */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
              ${index < 3 
                ? `bg-gradient-to-br ${rank.gradient}` 
                : "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700"
              }
            `}>
              <span className="text-lg font-bold text-white">
                {getCoinIcon(crypto.symbol)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight truncate">
                {crypto.korean_name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                {crypto.symbol}
              </p>
            </div>
          </div>

          {/* 거래소 배지들 - 미니멀하게 */}
          <div className="flex items-center space-x-1.5 mb-4">
            {crypto.isBinanceAlpha && <AlphaIcon />}
            {crypto.isOnBinance && <BinanceBadge size="sm" />}
            {crypto.isOnUpbit && <UpbitBadge size="sm" />}
            {hasUpbitUsdtPair(crypto.symbol) && <UPusdtBadge size="sm" />}
          </div>

          {/* 가격 정보 - 프로페셔널한 레이아웃 */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  현재가
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none tabular-nums">
                  {formatPrice(crypto.current_price)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <PriceChange
                  value={crypto.change_amount}
                  percentage={crypto.change_rate}
                  isPositive={crypto.is_positive}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액센트 바 - 미세한 그라데이션 */}
        <div className={`
          h-1 ${crypto.is_positive 
            ? "bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500" 
            : "bg-gradient-to-r from-red-400 via-pink-400 to-red-500"
          }
        `} />
      </div>
    );
  }

  // 태블릿 및 데스크톱용 테이블 행 스타일도 개선
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
            <div className={`${rank.gradient} ${rank.textColor} px-2 py-1 rounded-lg flex items-center space-x-1 min-w-[60px] justify-center bg-gradient-to-r`}>
              <span className="text-sm">{rank.icon}</span>
              <span className="text-xs font-bold">{index < 10 ? `${index + 1}위` : index + 1}</span>
            </div>
            {/* 코인 정보 */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${index < 3 ? rank.gradient : "from-slate-600 to-slate-700"}`}>
                <span className="text-sm font-bold text-white">{getCoinIcon(crypto.symbol)}</span>
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
          <div className={`bg-gradient-to-r ${rank.gradient} ${rank.textColor} px-3 py-2 rounded-xl flex items-center space-x-2 min-w-[80px] justify-center shadow-sm`}>
            <span className="text-lg">{rank.icon}</span>
            <span className="text-sm font-bold">{index < 10 ? `${index + 1}위` : `${index + 1}위`}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }} className="text-2xl hover:scale-110 focus:outline-none transition-all opacity-60 group-hover:opacity-100 p-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
            {isFavorite ? "⭐" : "☆"}
          </button>
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${index < 3 ? rank.gradient : "from-slate-600 to-slate-700"}`}>
              <span className="text-lg font-bold text-white">{getCoinIcon(crypto.symbol)}</span>
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