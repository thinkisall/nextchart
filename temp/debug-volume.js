// 거래량 데이터 구조 확인 스크립트
async function testVolumeData() {
  try {
    console.log('빗썸 거래량 데이터 구조 확인...');
    const response = await fetch('http://localhost:3001/api/crypto');
    const data = await response.json();
    
    if (data.status !== '0000') {
      console.error('API 오류:', data);
      return;
    }

    // 첫 번째 코인 데이터 구조 확인
    const firstSymbol = Object.keys(data.data).find(key => key !== 'date');
    const firstCoin = data.data[firstSymbol];
    
    console.log('=== 첫 번째 코인 데이터 구조 ===');
    console.log('Symbol:', firstSymbol);
    console.log('Data:', firstCoin);
    
    console.log('\n=== 거래량 관련 필드들 ===');
    console.log('units_traded (거래량):', firstCoin.units_traded);
    console.log('acc_trade_value (누적 거래금액):', firstCoin.acc_trade_value);
    console.log('units_traded_24H (24시간 거래량):', firstCoin.units_traded_24H);
    console.log('acc_trade_value_24H (24시간 거래금액):', firstCoin.acc_trade_value_24H);
    
    // 상위 5개 코인의 거래금액 비교
    console.log('\n=== 상위 5개 코인 24시간 거래금액 ===');
    const coins = Object.entries(data.data)
      .filter(([symbol, data]) => symbol !== 'date')
      .sort(([,a], [,b]) => parseFloat(b.acc_trade_value_24H) - parseFloat(a.acc_trade_value_24H))
      .slice(0, 5);
    
    coins.forEach(([symbol, coinData]) => {
      const volume24h = parseFloat(coinData.acc_trade_value_24H);
      console.log(`${symbol}: ${volume24h.toLocaleString('ko-KR')}원`);
    });

  } catch (error) {
    console.error('테스트 오류:', error);
  }
}

testVolumeData();
