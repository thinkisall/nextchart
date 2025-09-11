// 빗썸 API 정확한 필드 확인
async function checkBithumbAPIFields() {
  try {
    const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
    const data = await response.json();
    
    console.log('=== 빗썸 API 필드 확인 ===');
    const btcData = data.data.BTC;
    
    console.log('BTC 데이터의 모든 필드:');
    Object.keys(btcData).forEach(key => {
      console.log(`${key}: ${btcData[key]}`);
    });
    
    console.log('\n=== 필드 설명 추정 ===');
    console.log('units_traded: 거래량 (당일 0시~현재)');
    console.log('acc_trade_value: 누적 거래대금 (당일 0시~현재)');
    console.log('units_traded_24H: 24시간 거래량');
    console.log('acc_trade_value_24H: 24시간 거래대금');
    
    console.log('\n=== 실제 값 비교 ===');
    console.log(`당일 누적 거래대금: ${parseFloat(btcData.acc_trade_value).toLocaleString()}원`);
    console.log(`24시간 거래대금: ${parseFloat(btcData.acc_trade_value_24H).toLocaleString()}원`);
    
    // 차이 계산
    const dailyValue = parseFloat(btcData.acc_trade_value);
    const hourly24Value = parseFloat(btcData.acc_trade_value_24H);
    const difference = Math.abs(dailyValue - hourly24Value);
    const percentDiff = (difference / Math.max(dailyValue, hourly24Value)) * 100;
    
    console.log(`차이: ${difference.toLocaleString()}원 (${percentDiff.toFixed(2)}%)`);
    
  } catch (error) {
    console.error('오류:', error);
  }
}

checkBithumbAPIFields();
