// 빗썸 API 실제 필드명 정확 확인
async function checkActualBithumbFields() {
  try {
    const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW');
    const data = await response.json();
    
    console.log('=== 빗썸 API 실제 응답 구조 ===');
    const btcData = data.data.BTC;
    
    console.log('BTC 데이터 필드들:');
    Object.keys(btcData).forEach(key => {
      console.log(`${key}: ${btcData[key]}`);
    });
    
    // 거래량 관련 필드들 명확히 구분
    console.log('\n=== 거래량 관련 필드 정확한 의미 ===');
    
    const fields = {
      'units_traded': '당일 거래량 (KST 0시~현재)',
      'acc_trade_value': '당일 누적 거래대금 (KST 0시~현재)', 
      'units_traded_24H': '24시간 슬라이딩 거래량',
      'acc_trade_value_24H': '24시간 슬라이딩 거래대금'
    };
    
    Object.entries(fields).forEach(([field, description]) => {
      if (btcData[field]) {
        console.log(`${field}: ${parseFloat(btcData[field]).toLocaleString()} - ${description}`);
      }
    });
    
    console.log('\n=== 권장사항 ===');
    console.log('섹터별 거래량 합계에는 어떤 필드를 사용해야 할까요?');
    console.log('1. acc_trade_value (당일 KST 0시 기준): 일관된 기준점');
    console.log('2. acc_trade_value_24H (24시간 슬라이딩): 항상 24시간 데이터');
    
    console.log('\n현재 시간:', new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}));
    console.log('KST 0시 기준과 24시간 슬라이딩의 차이가 명확합니다.');
    
  } catch (error) {
    console.error('오류:', error);
  }
}

checkActualBithumbFields();
