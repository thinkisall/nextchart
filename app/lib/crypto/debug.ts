// 섹터 매핑 디버그 유틸리티

import { CRYPTO_SECTORS } from './sectors';

// 매핑되지 않은 심볼들을 찾는 함수
export function findUnmappedSymbols(apiSymbols: string[]): string[] {
  return apiSymbols.filter(symbol => !CRYPTO_SECTORS[symbol]);
}

// 섹터별 통계
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

// 콘솔에 매핑 상태 출력
export function logMappingStatus(apiSymbols: string[]) {
  const stats = getSectorMappingStats(apiSymbols);
  
  console.group('🔍 섹터 매핑 상태');
  console.log(`📊 전체 심볼: ${stats.total}개`);
  console.log(`✅ 매핑됨: ${stats.mapped}개 (${stats.mappingRate}%)`);
  console.log(`❌ 미매핑: ${stats.unmapped}개`);
  
  if (stats.unmappedSymbols.length > 0) {
    console.log('\n🚨 매핑이 필요한 심볼들:');
    stats.unmappedSymbols.forEach(symbol => {
      console.log(`  - ${symbol}`);
    });
  }
  
  console.groupEnd();
  
  return stats;
}
