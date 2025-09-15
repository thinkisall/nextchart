"use client";
import { useState, useEffect, useCallback } from "react";
import { CryptoPrice } from "../../lib/types";
import { useDebounce } from "../../hooks/useDebounce";
import { CRYPTO_SECTORS } from "../../lib/crypto";
import { hasUpbitUsdtPair } from "../../lib/exchanges";

interface SimplifiedFilterProps {
  cryptos: CryptoPrice[];
  onFilteredDataChange: (filtered: CryptoPrice[]) => void;
  favorites: string[];
}

export function SimplifiedFilter({
  cryptos,
  onFilteredDataChange,
  favorites,
}: SimplifiedFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<"volume" | "price" | "change" | "name">("change");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<"all" | "under1000" | "under10000" | "under100000" | "over100000">("all");
  const [selectedExchange, setSelectedExchange] = useState<"all" | "bithumb" | "binance" | "binance-alpha" | "upbit" | "upbit-usdt">("all");
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    selectedExchange,
    sortBy,
    sortOrder,
    favorites,
    onFilteredDataChange,
  ]);

  useEffect(() => {
    console.log('🔄 Filter applied:', { sortBy, sortOrder, searchTerm: debouncedSearchTerm });
    applyFilters();
  }, [applyFilters]);

  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    console.log('🎯 Sort button clicked:', { newSortBy, newSortOrder });
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl p-6">
      {/* 검색 바 */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="🔍 코인명 또는 심볼 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full px-4 py-3 
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* 거래소별 빠른 필터 */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
        <button
          onClick={() => setSelectedExchange("all")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "all"
              ? 'bg-gray-500 shadow-lg scale-105'
              : 'bg-gray-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🏢</span>
          <span>전체</span>
        </button>
        
        <button
          onClick={() => setSelectedExchange("bithumb")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "bithumb"
              ? 'bg-orange-500 shadow-lg scale-105'
              : 'bg-orange-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🟧</span>
          <span>빗썸</span>
        </button>
        
        <button
          onClick={() => setSelectedExchange("binance")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "binance"
              ? 'bg-yellow-500 shadow-lg scale-105'
              : 'bg-yellow-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🟨</span>
          <span>바이낸스</span>
        </button>
        
        <button
          onClick={() => setSelectedExchange("binance-alpha")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "binance-alpha"
              ? 'bg-purple-500 shadow-lg scale-105'
              : 'bg-purple-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🟪</span>
          <span>BN알파</span>
        </button>
        
        <button
          onClick={() => setSelectedExchange("upbit")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "upbit"
              ? 'bg-blue-500 shadow-lg scale-105'
              : 'bg-blue-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🟦</span>
          <span>업비트</span>
        </button>
        
        <button
          onClick={() => setSelectedExchange("upbit-usdt")}
          className={`
            flex items-center justify-center space-x-2 px-3 py-3
            rounded-xl transition-all duration-200 text-sm font-medium text-white
            ${selectedExchange === "upbit-usdt"
              ? 'bg-green-500 shadow-lg scale-105'
              : 'bg-green-500 opacity-70 hover:opacity-90'
            }
          `}
        >
          <span>🟩</span>
          <span>UP USDT</span>
        </button>
      </div>

      {/* 정렬 옵션 - 작은 버튼들로 */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => handleSortChange("change", "desc")}
          className={`
            px-3 py-2 text-xs rounded-lg transition-all duration-200
            ${sortBy === "change" && sortOrder === "desc"
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          📈 상승률
        </button>
        
        <button
          onClick={() => handleSortChange("change", "asc")}
          className={`
            px-3 py-2 text-xs rounded-lg transition-all duration-200
            ${sortBy === "change" && sortOrder === "asc"
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          📉 하락률
        </button>
        
        <button
          onClick={() => handleSortChange("price", "desc")}
          className={`
            px-3 py-2 text-xs rounded-lg transition-all duration-200
            ${sortBy === "price"
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          💰 가격순
        </button>
        
        <button
          onClick={() => handleSortChange("volume", "desc")}
          className={`
            px-3 py-2 text-xs rounded-lg transition-all duration-200
            ${sortBy === "volume"
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
          `}
        >
          📊 거래량
        </button>
      </div>

      {/* 즐겨찾기 토글 */}
      <div className="mb-6">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`
            flex items-center space-x-3 px-5 py-3 rounded-xl border transition-all duration-200 w-full sm:w-auto text-sm font-medium
            ${showFavoritesOnly
              ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }
          `}
        >
          <span className="text-lg">{showFavoritesOnly ? '⭐' : '☆'}</span>
          <span>즐겨찾기만 보기</span>
        </button>
      </div>

      {/* 고급 필터 토글 */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
        >
          <span>🔧</span>
          <span>고급 필터</span>
          <span className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* 고급 필터 섹션 */}
      {showAdvanced && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* 가격 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              💰 가격 범위
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
                    px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium
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
        </div>
      )}

      {/* 결과 통계 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>📊 총 {cryptos.length}개 코인</span>
          <span>정렬: {
            sortBy === "change" ? "변동률" :
            sortBy === "price" ? "가격" :
            sortBy === "volume" ? "거래량" : "이름"
          } {sortOrder === "desc" ? "↓" : "↑"}</span>
        </div>
      </div>
    </div>
  );
}
