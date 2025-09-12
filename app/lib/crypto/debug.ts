// ?�터 매핑 ?�버�??�틸리티

import { CRYPTO_SECTORS } from './sectors';

// 매핑?��? ?��? ?�볼?�을 찾는 ?�수
export function findUnmappedSymbols(apiSymbols: string[]): string[] {
  return apiSymbols.filter(symbol => !CRYPTO_SECTORS[symbol]);
}

// ?�터�??�계
export function getSectorMappingStats(apiSymbols: string[]) {
  const mapped = apiSymbols.filter(symbol => CRYPTO_SECTORS[symbol]);
  const unmapped = findUnmappedSymbols(apiSymbols);
  
  return {
    total: apiSymbols.length,
    mapped: mapped.length,
    unmapped: unmapped.length,
    mappingRate: ((mapped.length / apiSymbols.length) * 100).toFixed(1),
    unmappedSymbols: unmapped
  };
}

// 콘솔??매핑 ?�태 출력
export function logMappingStatus(apiSymbols: string[]) {
  const stats = getSectorMappingStats(apiSymbols);
  
  // Debug information - removed console logs for production
  return stats;
  
  console.groupEnd();
  
  return stats;
}
