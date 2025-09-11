// 유틸리티 함수들
import { CRYPTO_KOREAN_NAMES, FALLBACK_KOREAN_NAMES } from './korean-names';
import { CRYPTO_SECTORS } from './sectors';
import { SECTOR_COLORS } from './colors';
import { CRYPTO_CATEGORIES, CATEGORY_PRIORITY } from './categories';

// 코인 정보 조회 함수
export function getCryptoInfo(symbol: string) {
  // 기본 매핑 테이블에서 한글 이름 찾기
  let koreanName = CRYPTO_KOREAN_NAMES[symbol];
  
  // 매핑되지 않은 코인의 경우 대체 한글 이름 생성
  if (!koreanName) {
    koreanName = FALLBACK_KOREAN_NAMES[symbol] || symbol;
  }
  
  // 섹터 정보 가져오기
  let sector = CRYPTO_SECTORS[symbol];
  
  // 매핑되지 않은 심볼의 경우 자동 추론
  if (!sector) {
    sector = inferSectorFromSymbol(symbol);
    
    // 개발 모드에서 매핑되지 않은 심볼 로깅
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ 섹터 매핑 누락: ${symbol} -> 추론된 섹터: ${sector}`);
    }
  }
  
  const sectorColor = SECTOR_COLORS[sector] || 'bg-gray-100 text-gray-600';
  
  // 카테고리 찾기
  const category = findCategoryForSymbol(symbol);
  
  return {
    koreanName,
    sector,
    sectorColor,
    category
  };
}

// 심볼로부터 섹터를 추론하는 함수
function inferSectorFromSymbol(symbol: string): string {
  const symbolLower = symbol.toLowerCase();
  
  // 일반적인 패턴 기반 추론
  if (symbolLower.includes('btc') || symbolLower.includes('bitcoin')) return '결제/기축';
  if (symbolLower.includes('eth') || symbolLower.includes('ethereum')) return 'L1';
  if (symbolLower.includes('usd') || symbolLower.includes('stable')) return '스테이블코인';
  if (symbolLower.includes('defi') || symbolLower.includes('swap') || symbolLower.includes('dex')) return 'DEX/AMM';
  if (symbolLower.includes('game') || symbolLower.includes('nft')) return 'GameFi/NFT';
  if (symbolLower.includes('ai') || symbolLower.includes('data')) return 'AI/데이터';
  if (symbolLower.includes('meme') || symbolLower.includes('doge') || symbolLower.includes('shib')) return '밈/커뮤니티';
  
  // 알려진 L1 블록체인 패턴
  const l1Patterns = ['chain', 'coin', 'network', 'protocol'];
  if (l1Patterns.some(pattern => symbolLower.includes(pattern))) return 'L1';
  
  // 기본값
  return '기타';
}

// 코인의 카테고리 찾기 함수
export function findCategoryForSymbol(symbol: string): string {
  let foundCategory = 'ALTCOIN';
  let highestPriority = 0;

  // 모든 카테고리를 순회하며 해당 심볼이 포함된 카테고리 찾기
  for (const [categoryName, symbols] of Object.entries(CRYPTO_CATEGORIES)) {
    if ((symbols as string[]).includes(symbol)) {
      const priority = CATEGORY_PRIORITY[categoryName as keyof typeof CATEGORY_PRIORITY] || 0;
      if (priority > highestPriority) {
        foundCategory = categoryName;
        highestPriority = priority;
      }
    }
  }

  return foundCategory;
}

// 섹터별 코인 개수 계산
export function getSectorStats(cryptos: any[]) {
  const sectorCounts: { [key: string]: number } = {};
  
  cryptos.forEach(crypto => {
    const info = getCryptoInfo(crypto.symbol);
    sectorCounts[info.sector] = (sectorCounts[info.sector] || 0) + 1;
  });

  return Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      sector,
      count,
      color: SECTOR_COLORS[sector] || 'bg-gray-100 text-gray-600'
    }))
    .sort((a, b) => b.count - a.count);
}

// 카테고리별 코인 개수 계산
export function getCategoryStats(cryptos: any[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  cryptos.forEach(crypto => {
    const category = findCategoryForSymbol(crypto.symbol);
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      priority: CATEGORY_PRIORITY[category as keyof typeof CATEGORY_PRIORITY] || 0
    }))
    .sort((a, b) => b.priority - a.priority);
}

// 섹터 필터링 함수
export function filterBySector(cryptos: any[], selectedSector: string) {
  if (selectedSector === 'ALL') return cryptos;
  
  return cryptos.filter(crypto => {
    const info = getCryptoInfo(crypto.symbol);
    return info.sector === selectedSector;
  });
}

// 카테고리 필터링 함수
export function filterByCategory(cryptos: any[], selectedCategory: string) {
  if (selectedCategory === 'ALL') return cryptos;
  
  return cryptos.filter(crypto => {
    const category = findCategoryForSymbol(crypto.symbol);
    return category === selectedCategory;
  });
}

// 텍스트 검색 함수
export function searchCryptos(cryptos: any[], searchTerm: string) {
  if (!searchTerm.trim()) return cryptos;
  
  const term = searchTerm.toLowerCase();
  
  return cryptos.filter(crypto => {
    const info = getCryptoInfo(crypto.symbol);
    return (
      crypto.symbol.toLowerCase().includes(term) ||
      info.koreanName.toLowerCase().includes(term) ||
      info.sector.toLowerCase().includes(term)
    );
  });
}

// 가격 변화율 기준 정렬
export function sortByPriceChange(cryptos: any[], direction: 'asc' | 'desc' = 'desc') {
  return [...cryptos].sort((a, b) => {
    const changeA = parseFloat(a.fluctate_rate_24H) || 0;
    const changeB = parseFloat(b.fluctate_rate_24H) || 0;
    
    return direction === 'desc' ? changeB - changeA : changeA - changeB;
  });
}

// 시가총액 기준 정렬 (가격 * 수량으로 대략 계산)
export function sortByMarketCap(cryptos: any[], direction: 'desc' | 'asc' = 'desc') {
  return [...cryptos].sort((a, b) => {
    const capA = parseFloat(a.closing_price) * parseFloat(a.acc_trade_value_24H || '0');
    const capB = parseFloat(b.closing_price) * parseFloat(b.acc_trade_value_24H || '0');
    
    return direction === 'desc' ? capB - capA : capA - capB;
  });
}

// 거래량 기준 정렬
export function sortByVolume(cryptos: any[], direction: 'desc' | 'asc' = 'desc') {
  return [...cryptos].sort((a, b) => {
    const volumeA = parseFloat(a.acc_trade_value_24H) || 0;
    const volumeB = parseFloat(b.acc_trade_value_24H) || 0;
    
    return direction === 'desc' ? volumeB - volumeA : volumeA - volumeB;
  });
}

// 한국 프로젝트 필터링
export function getKoreanProjects(cryptos: any[]) {
  return cryptos.filter(crypto => {
    const info = getCryptoInfo(crypto.symbol);
    return info.sector.startsWith('한국/');
  });
}

// 신규 코인 (2024년) 필터링
export function getNewCoins(cryptos: any[]) {
  const newCoinSymbols = [
    'HYPE', 'VIRTUAL', 'MOVE', 'ME', 'PENGU', 'USUAL', 'VELODROME', 
    'EIGEN', 'ONDO', 'ETHFI', 'PUFFER', 'ENA', 'MORPHO', 'AERO', 
    'VELO', 'ZEREBRO', 'AI16Z', 'VIRTUALS', 'AIXBT', 'ACT'
  ];
  
  return cryptos.filter(crypto => newCoinSymbols.includes(crypto.symbol));
}

// 상위 N개 코인 가져오기 (시가총액 기준)
export function getTopCoins(cryptos: any[], count: number = 10) {
  return sortByMarketCap(cryptos, 'desc').slice(0, count);
}

// 급등/급락 코인 가져오기
export function getTrendingCoins(cryptos: any[], type: 'rising' | 'falling' = 'rising', count: number = 10) {
  const sorted = sortByPriceChange(cryptos, type === 'rising' ? 'desc' : 'asc');
  return sorted.slice(0, count);
}
