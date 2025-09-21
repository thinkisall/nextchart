/**
 * 바이낸스 관련 유틸리티 함수들
 */

/**
 * CoinGecko 심볼을 바이낸스 심볼로 변환
 * @param symbol CoinGecko 심볼 (예: "BTC", "ETH")
 * @returns 바이낸스 심볼 (예: "BTCUSDT", "ETHUSDT")
 */
export function convertToBinanceSymbol(symbol: string): string {
  // 일반적인 심볼 정리
  const cleanSymbol = symbol.toUpperCase().trim();
  
  // 특별한 케이스들 처리
  const symbolMap: Record<string, string> = {
    'USDT': 'USDTUSDT', // USDT는 USDT/USDT로
    'USDC': 'USDCUSDT',
    'BUSD': 'BUSDUSDT',
    'DAI': 'DAIUSDT',
    'TUSD': 'TUSDUSDT',
    'PAX': 'PAXUSDT',
    'USTC': 'USTCUSDT', // Terra Classic USD
    'LUNA': 'LUNAUSDT',
    'LUNC': 'LUNCUSDT', // Luna Classic
  };

  // 매핑에 있는 경우 해당 값 반환
  if (symbolMap[cleanSymbol]) {
    return symbolMap[cleanSymbol];
  }

  // 이미 USDT로 끝나는 경우 그대로 반환
  if (cleanSymbol.endsWith('USDT')) {
    return cleanSymbol;
  }

  // 기본적으로 USDT를 붙임
  return `${cleanSymbol}USDT`;
}

/**
 * 바이낸스 트레이딩 페이지 URL 생성
 * @param symbol CoinGecko 심볼
 * @returns 바이낸스 트레이딩 페이지 URL
 */
export function generateBinanceUrl(symbol: string): string {
  const binanceSymbol = convertToBinanceSymbol(symbol);
  return `https://www.binance.com/en/trade/${binanceSymbol}`;
}

/**
 * 바이낸스 코인 정보 페이지 URL 생성
 * @param symbol CoinGecko 심볼
 * @returns 바이낸스 코인 정보 페이지 URL
 */
export function generateBinanceCoinInfoUrl(symbol: string): string {
  const binanceSymbol = convertToBinanceSymbol(symbol);
  return `https://www.binance.com/en/price/${symbol.toLowerCase()}`;
}

/**
 * 새창으로 바이낸스 페이지 열기
 * @param symbol CoinGecko 심볼
 * @param pageType 페이지 타입 ('trade' | 'info')
 */
export function openBinancePage(symbol: string, pageType: 'trade' | 'info' = 'trade'): void {
  const url = pageType === 'trade' 
    ? generateBinanceUrl(symbol)
    : generateBinanceCoinInfoUrl(symbol);
  
  // 새창으로 열기
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * 트렌딩 코인을 바이낸스에서 검색하기 위한 URL 생성
 * @param coinName 코인 이름
 * @param symbol 코인 심볼
 * @returns 바이낸스 검색 URL
 */
export function generateBinanceSearchUrl(coinName: string, symbol: string): string {
  // 검색어로 심볼 우선 사용
  const searchTerm = symbol.toUpperCase();
  return `https://www.binance.com/en/markets/spot_margin?searchKeyword=${encodeURIComponent(searchTerm)}`;
}
