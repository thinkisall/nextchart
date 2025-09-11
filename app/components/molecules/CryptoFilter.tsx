import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useDebounce } from '../../hooks/useDebounce';
import { CRYPTO_SECTORS } from '../../lib/crypto';

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
          aValue = a.change_rate; // 상승률 순으로 정렬 (절대값 제거)
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

  // 필터 변경 시 useEffect로 적용
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = () => {
    // useEffect가 자동으로 처리하므로 별도 작업 불필요
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* 검색 */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="코인명 또는 심볼 검색..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 섹터 필터 */}
        <select
          value={selectedSector}
          onChange={(e) => {
            setSelectedSector(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 섹터</option>
          {Array.from(new Set(Object.values(CRYPTO_SECTORS))).sort().map((sector, index) => (
            <option key={`filter-sector-${index}`} value={sector}>{sector}</option>
          ))}
        </select>

        {/* 정렬 */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
            handleFilterChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="change-desc">변동률 높은순</option>
          <option value="change-asc">변동률 낮은순</option>
          <option value="volume-desc">거래량 높은순</option>
          <option value="volume-asc">거래량 낮은순</option>
          <option value="price-desc">가격 높은순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="name-asc">이름순</option>
        </select>

        {/* 가격 범위 */}
        <select
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value as typeof priceRange);
            handleFilterChange();
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체 가격</option>
          <option value="under1000">1,000원 미만</option>
          <option value="under10000">10,000원 미만</option>
          <option value="under100000">100,000원 미만</option>
          <option value="over100000">100,000원 이상</option>
        </select>

        {/* 즐겨찾기 필터 */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => {
              setShowFavoritesOnly(e.target.checked);
              handleFilterChange();
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">즐겨찾기만</span>
        </label>

        {/* 초기화 버튼 */}
        <button
          onClick={() => {
            setSearchTerm('');
            setSortBy('change');
            setSortOrder('desc');
            setShowFavoritesOnly(false);
            setPriceRange('all');
            setSelectedSector('all');
          }}
          className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}
