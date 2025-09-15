"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoPrice } from "../../lib/types";
import { useDebounce } from "../../hooks/useDebounce";
import { CRYPTO_SECTORS } from "../../lib/crypto";
import { hasUpbitUsdtPair } from "../../lib/exchanges";

interface ModernCryptoFilterProps {
  cryptos: CryptoPrice[];
  onFilteredDataChange: (filtered: CryptoPrice[]) => void;
  favorites: string[];
}

export function ModernCryptoFilter({
  cryptos,
  onFilteredDataChange,
  favorites,
}: ModernCryptoFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<"volume" | "price" | "change" | "name">("change");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<"all" | "under1000" | "under10000" | "under100000" | "over100000">("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedExchange, setSelectedExchange] = useState<"all" | "bithumb" | "binance" | "binance-alpha" | "upbit" | "upbit-usdt">("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // 활성 필터 업데이트
  useEffect(() => {
    const filters: string[] = [];
    if (showFavoritesOnly) filters.push("즐겨찾기");
    if (priceRange !== "all") {
      const priceLabels = {
        under1000: "1천원 미만",
        under10000: "1만원 미만", 
        under100000: "10만원 미만",
        over100000: "10만원 이상"
      };
      filters.push(priceLabels[priceRange]);
    }
    if (selectedSector !== "all") filters.push(selectedSector);
    if (selectedExchange !== "all") {
      const exchangeLabels = {
        bithumb: "빗썸",
        binance: "바이낸스",
        "binance-alpha": "바이낸스 알파",
        upbit: "업비트",
        "upbit-usdt": "업비트 USDT"
      };
      filters.push(exchangeLabels[selectedExchange]);
    }
    setActiveFilters(filters);
  }, [showFavoritesOnly, priceRange, selectedSector, selectedExchange]);
  const applyFilters = useCallback(() => {
    let filtered = [...cryptos];

    // 검색 필터
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.korean_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // 즐겨찾기 필터
    if (showFavoritesOnly) {
      filtered = filtered.filter((crypto) => favorites.includes(crypto.symbol));
    }

    // 가격 범위 필터
    if (priceRange !== "all") {
      filtered = filtered.filter((crypto) => {
        switch (priceRange) {
          case "under1000":
            return crypto.current_price < 1000;
          case "under10000":
            return crypto.current_price < 10000;
          case "under100000":
            return crypto.current_price < 100000;
          case "over100000":
            return crypto.current_price >= 100000;
          default:
            return true;
        }
      });
    }

    // 섹터 필터
    if (selectedSector !== "all") {
      filtered = filtered.filter((crypto) => crypto.sector === selectedSector);
    }

    // 거래소 필터
    if (selectedExchange !== "all") {
      filtered = filtered.filter((crypto) => {
        switch (selectedExchange) {
          case "binance":
            return crypto.isOnBinance;
          case "binance-alpha":
            return crypto.isBinanceAlpha;
          case "upbit":
            return crypto.isOnUpbit;
          case "upbit-usdt":
            return hasUpbitUsdtPair(crypto.symbol);
          case "bithumb":
          default:
            return true;
        }
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case "volume":
          aValue = a.volume || 0;
          bValue = b.volume || 0;
          break;
        case "price":
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case "change":
          aValue = a.change_rate;
          bValue = b.change_rate;
          break;
        case "name":
          aValue = a.korean_name;
          bValue = b.korean_name;
          break;
        default:
          aValue = a.change_rate;
          bValue = b.change_rate;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }
    });

    onFilteredDataChange(filtered);
  }, [
    cryptos,
    debouncedSearchTerm,
    showFavoritesOnly,
    priceRange,
    selectedSector,
    selectedExchange,
    sortBy,
    sortOrder,
    favorites,
    onFilteredDataChange,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setShowFavoritesOnly(false);
    setPriceRange("all");
    setSelectedSector("all");
    setSelectedExchange("all");
    setSortBy("change");
    setSortOrder("desc");
  };

  const quickSortButtons = [
    {
      label: "변동률 ↑",
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => { setSortBy("change"); setSortOrder("desc"); }
    },
    {
      label: "변동률 ↓", 
      icon: <TrendingDown className="w-4 h-4" />,
      action: () => { setSortBy("change"); setSortOrder("asc"); }
    },
    {
      label: "가격순",
      icon: null,
      action: () => { setSortBy("price"); setSortOrder("desc"); }
    },
    {
      label: "거래량",
      icon: null,
      action: () => { setSortBy("volume"); setSortOrder("desc"); }
    }
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl p-6">
      {/* 검색 바 */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="코인명 또는 심볼 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full pl-12 pr-4 py-3 
            bg-gray-50 dark:bg-gray-700 
            border border-gray-200 dark:border-gray-600
            rounded-xl
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
          "
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 빠른 정렬 버튼들 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickSortButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={`
              flex items-center justify-center space-x-2 px-4 py-3
              rounded-xl border transition-all duration-200
              ${(sortBy === "change" && sortOrder === "desc" && index === 0) ||
                (sortBy === "change" && sortOrder === "asc" && index === 1) ||
                (sortBy === "price" && index === 2) ||
                (sortBy === "volume" && index === 3)
                ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            {button.icon}
            <span className="text-sm font-medium">{button.label}</span>
          </button>
        ))}
      </div>
      {/* 즐겨찾기 토글 */}
      <div className="mb-6">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`
            flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-200 w-full sm:w-auto
            ${showFavoritesOnly
              ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }
          `}
        >
          <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          <span className="font-medium">즐겨찾기만 보기</span>
        </button>
      </div>

      {/* 고급 필터 토글 */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">고급 필터</span>
          <div className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
            ↓
          </div>
        </button>
      </div>

      {/* 고급 필터 섹션 */}
      {showAdvanced && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* 가격 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              가격 범위
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { value: "all", label: "전체" },
                { value: "under1000", label: "1천원↓" },
                { value: "under10000", label: "1만원↓" },
                { value: "under100000", label: "10만원↓" },
                { value: "over100000", label: "10만원↑" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriceRange(option.value as any)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${priceRange === option.value
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 거래소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              거래소
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { value: "all", label: "전체", color: "bg-gray-500" },
                { value: "bithumb", label: "빗썸", color: "bg-orange-500" },
                { value: "binance", label: "바이낸스", color: "bg-yellow-500" },
                { value: "binance-alpha", label: "BN알파", color: "bg-purple-500" },
                { value: "upbit", label: "업비트", color: "bg-blue-500" },
                { value: "upbit-usdt", label: "UP USDT", color: "bg-green-500" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedExchange(option.value as any)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-all duration-200 text-white font-medium
                    ${selectedExchange === option.value
                      ? `${option.color} shadow-lg scale-105`
                      : `${option.color} opacity-70 hover:opacity-90`
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 섹터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              섹터
            </label>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedSector("all")}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-all duration-200
                    ${selectedSector === "all"
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  전체
                </button>
                {Object.keys(CRYPTO_SECTORS).map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`
                      px-3 py-2 text-sm rounded-lg transition-all duration-200
                      ${selectedSector === sector
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {activeFilters.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              활성 필터 ({activeFilters.length})
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              모두 초기화
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 결과 통계 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>총 {cryptos.length}개 코인</span>
          <span>현재 정렬: {
            sortBy === "change" ? "변동률" :
            sortBy === "price" ? "가격" :
            sortBy === "volume" ? "거래량" : "이름"
          } {sortOrder === "desc" ? "↓" : "↑"}</span>
        </div>
      </div>
    </div>
  );
}
