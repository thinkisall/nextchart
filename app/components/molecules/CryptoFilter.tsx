import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useDebounce } from '../../hooks/useDebounce';
import { CRYPTO_SECTORS } from '../../lib/crypto';
import { Button } from '../atoms/Button';

interface CryptoFilterProps {
  cryptos: CryptoPrice[];
  onFilteredDataChange: (filtered: CryptoPrice[]) => void;
  favorites: string[];
}

export function CryptoFilter({ cryptos, onFilteredDataChange, favorites }: CryptoFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'change' | 'name'>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under1000' | 'under10000' | 'under100000' | 'over100000'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = [...cryptos];

    // 검색 필터 (디바운스된 검색어 사용)
    if (debouncedSearchTerm) {
      filtered = filtered.filter(crypto => 
        crypto.korean_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // 즐겨찾기 필터
    if (showFavoritesOnly) {
      filtered = filtered.filter(crypto => favorites.includes(crypto.symbol));
    }

    // 섹터 필터
    if (selectedSector !== 'all') {
      filtered = filtered.filter(crypto => crypto.sector === selectedSector);
    }

    // 가격 범위 필터
    switch (priceRange) {
      case 'under1000':
        filtered = filtered.filter(crypto => crypto.current_price < 1000);
        break;
      case 'under10000':
        filtered = filtered.filter(crypto => crypto.current_price < 10000);
        break;
      case 'under100000':
        filtered = filtered.filter(crypto => crypto.current_price < 100000);
        break;
      case 'over100000':
        filtered = filtered.filter(crypto => crypto.current_price >= 100000);
        break;
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change':
          aValue = a.change_rate;
          bValue = b.change_rate;
          break;
        case 'name':
          aValue = a.korean_name;
          bValue = b.korean_name;
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        default: // volume
          aValue = a.volume;
          bValue = b.volume;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    onFilteredDataChange(filtered);
  }, [cryptos, debouncedSearchTerm, showFavoritesOnly, priceRange, sortBy, sortOrder, selectedSector, favorites, onFilteredDataChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('change');
    setSortOrder('desc');
    setShowFavoritesOnly(false);
    setPriceRange('all');
    setSelectedSector('all');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* 항상 보이는 기본 필터 */}
      <div className="p-4 space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="코인명 또는 심볼 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 모바일: 간단한 컨트롤 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="change-desc">📈 상승률 높은순</option>
              <option value="change-asc">📉 상승률 낮은순</option>
              <option value="volume-desc">📊 거래량 높은순</option>
              <option value="volume-asc">📊 거래량 낮은순</option>
              <option value="price-desc">💰 가격 높은순</option>
              <option value="price-asc">💰 가격 낮은순</option>
              <option value="name-asc">🔤 이름순</option>
            </select>
          </div>
          
          {/* 즐겨찾기 토글 */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFavoritesOnly 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            ⭐ {showFavoritesOnly ? '즐겨찾기' : '전체'}
          </button>
          
          {/* 고급 필터 토글 */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium border border-blue-300 dark:border-blue-700 transition-colors"
          >
            🔧 {showAdvanced ? '간단히' : '고급'}
          </button>
        </div>
      </div>

      {/* 고급 필터 (접을 수 있음) */}
      {showAdvanced && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 섹터 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">섹터</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">🌐 전체 섹터</option>
                {Array.from(new Set(Object.values(CRYPTO_SECTORS))).sort().map((sector, index) => (
                  <option key={`filter-sector-${index}`} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* 가격 범위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">가격 범위</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">💰 전체 가격</option>
                <option value="under1000">💱 1,000원 미만</option>
                <option value="under10000">💴 10,000원 미만</option>
                <option value="under100000">💵 100,000원 미만</option>
                <option value="over100000">💎 100,000원 이상</option>
              </select>
            </div>

            {/* 초기화 버튼 */}
            <div className="flex items-end">
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                fullWidth
                className="h-10"
              >
                🔄 초기화
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}