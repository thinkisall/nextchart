// SSE 연결 테스트 스크립트
const EventSource = require('eventsource');

console.log('SSE 연결 테스트 시작...');

// EventSource 생성
const eventSource = new EventSource('http://localhost:3000/api/stream');

let dataCount = 0;
let startTime = Date.now();

eventSource.onopen = (event) => {
  console.log('✅ SSE 연결 성공:', new Date().toISOString());
};

eventSource.onmessage = (event) => {
  dataCount++;
  console.log(`📦 메시지 ${dataCount} 수신:`, new Date().toISOString());
  
  try {
    const data = JSON.parse(event.data);
    
    if (Array.isArray(data)) {
      console.log(`   - 암호화폐 데이터: ${data.length}개 코인`);
      console.log(`   - 첫 번째 코인: ${data[0]?.symbol} - ${data[0]?.current_price} (${data[0]?.change_rate?.toFixed(2)}%)`);
    } else if (data.type === 'connected') {
      console.log(`   - 환영 메시지:`, data.message);
    } else if (data.error) {
      console.log(`   - 에러:`, data.error);
    } else {
      console.log(`   - 기타 데이터:`, Object.keys(data));
    }
    
    // 5개 메시지 받으면 테스트 종료
    if (dataCount >= 5) {
      console.log(`\n✅ 테스트 완료: ${dataCount}개 메시지 수신 (${Date.now() - startTime}ms)`);
      eventSource.close();
      process.exit(0);
    }
  } catch (error) {
    console.error('   ❌ JSON 파싱 오류:', error.message);
    console.error('   Raw data:', event.data.substring(0, 200));
  }
};

eventSource.onerror = (error) => {
  console.error('❌ SSE 연결 오류:', error);
  console.error('   ReadyState:', eventSource.readyState);
  console.error('   URL:', eventSource.url);
  
  if (dataCount === 0) {
    console.log('연결 실패로 테스트 종료');
    process.exit(1);
  }
};

// 30초 후 타임아웃
setTimeout(() => {
  console.log(`⏰ 타임아웃: ${dataCount}개 메시지 수신 후 테스트 종료`);
  eventSource.close();
  process.exit(0);
}, 30000);
