// 빗썸 API 거래량 데이터 검증 스크립트
async function checkBithumbVolumeData() {
  try {
    console.log('=== 빗썸 API 직접 호출 테스트 ===');
    const directResponse = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
    const directData = await directResponse.json();
    
    console.log('직접 API 호출 상태:', directData.status);
    
    // 상위 3개 코인의 거래량 데이터 확인
    const topCoins = ['BTC', 'ETH', 'XRP'];
    console.log('\n=== 직접 API 호출 - 상위 코인 거래량 데이터 ===');
    topCoins.forEach(symbol => {
      const coinData = directData.data[symbol];
      if (coinData) {
        console.log(`${symbol}:`);
        console.log(`  - 거래량 (units_traded): ${coinData.units_traded}`);
        console.log(`  - 거래금액 (acc_trade_value): ${coinData.acc_trade_value}`);
        console.log(`  - 24H 거래량 (units_traded_24H): ${coinData.units_traded_24H}`);
        console.log(`  - 24H 거래금액 (acc_trade_value_24H): ${coinData.acc_trade_value_24H}`);
        console.log('---');
      }
    });
    
    console.log('\n=== 프록시 API 호출 테스트 ===');
    const proxyResponse = await fetch('http://localhost:3001/api/crypto');
    const proxyData = await proxyResponse.json();
    
    console.log('프록시 API 호출 상태:', proxyData.status);
    
    console.log('\n=== 프록시 API - 상위 코인 거래량 데이터 ===');
    topCoins.forEach(symbol => {
      const coinData = proxyData.data[symbol];
      if (coinData) {
        console.log(`${symbol}:`);
        console.log(`  - 거래량 (units_traded): ${coinData.units_traded}`);
        console.log(`  - 거래금액 (acc_trade_value): ${coinData.acc_trade_value}`);
        console.log(`  - 24H 거래량 (units_traded_24H): ${coinData.units_traded_24H}`);
        console.log(`  - 24H 거래금액 (acc_trade_value_24H): ${coinData.acc_trade_value_24H}`);
        console.log('---');
      }
    });
    
    // 우리 앱에서 처리된 데이터 확인
    console.log('\n=== 우리 앱의 getAllTickers() 함수로 처리된 데이터 ===');
    const processedResponse = await fetch('http://localhost:3001/api/crypto');
    const rawData = await processedResponse.json();
    
    // getAllTickers 함수 로직 시뮬레이션
    const processedCoins = topCoins.map(symbol => {
      const ticker = rawData.data[symbol];
      if (!ticker) return null;
      
      return {
        symbol,
        volume: parseFloat(ticker.acc_trade_value_24H) || 0,
        current_price: parseFloat(ticker.closing_price),
        change_rate: parseFloat(ticker.fluctate_rate_24H) || 0,
      };
    }).filter(Boolean);
    
    processedCoins.forEach(coin => {
      console.log(`${coin.symbol}: volume = ${coin.volume.toLocaleString()}원`);
    });
    
    console.log('\n=== 데이터 일관성 검증 ===');
    topCoins.forEach(symbol => {
      const raw = rawData.data[symbol];
      const processed = processedCoins.find(c => c.symbol === symbol);
      
      if (raw && processed) {
        const rawVolume = parseFloat(raw.acc_trade_value_24H);
        console.log(`${symbol}: 원본=${rawVolume.toLocaleString()}, 처리된값=${processed.volume.toLocaleString()}, 일치=${rawVolume === processed.volume}`);
      }
    });
    
  } catch (error) {
    console.error('검증 중 오류 발생:', error);
  }
}

checkBithumbVolumeData();
