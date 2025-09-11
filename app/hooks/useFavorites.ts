'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // 로컬 스토리지에서 즐겨찾기 로드
  useEffect(() => {
    const saved = localStorage.getItem('crypto-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // 즐겨찾기 저장
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('crypto-favorites', JSON.stringify(newFavorites));
  };

  // 즐겨찾기 추가/제거 토글
  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter(fav => fav !== symbol)
      : [...favorites, symbol];
    
    saveFavorites(newFavorites);
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (symbol: string) => favorites.includes(symbol);

  // 모든 즐겨찾기 제거
  const clearFavorites = () => {
    saveFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}
