// 바이낸스 API 통합 테스트
import { getBinanceBaseAssets, findCommonCoins, mapBithumbToBinanceSymbol } from './app/lib/binance-api.js';

async function testBinanceIntegration() {
  console.log('=== 바이낸스 API 통합 테스트 시작 ===\n');

  try {
    // 1. 바이낸스 베이스 자산 목록 가져오기
    console.log('1. 바이낸스 베이스 자산 목록 가져오는 중...');
    const baseAssets = await getBinanceBaseAssets();
    console.log(`   총 ${baseAssets.size}개의 바이낸스 코인 발견`);
    console.log(`   예시: ${Array.from(baseAssets).slice(0, 10).join(', ')}\n`);

    // 2. 빗썸 샘플 심볼들 (실제 빗썸에서 거래되는 주요 코인들)
    const sampleBithumbSymbols = [
      'BTC_KRW', 'ETH_KRW', 'XRP_KRW', 'ADA_KRW', 'SOL_KRW', 
      'DOGE_KRW', 'DOT_KRW', 'MATIC_KRW', 'LINK_KRW', 'LTC_KRW'
    ];
    
    console.log('2. 공통 코인 찾는 중...');
    console.log(`   빗썸 테스트 심볼: ${sampleBithumbSymbols.join(', ')}`);
    
    const commonCoins = await findCommonCoins(sampleBithumbSymbols);
    console.log(`   공통 코인 ${commonCoins.size}개 발견:`);
    
    for (const [bithumb, binance] of commonCoins.entries()) {
      console.log(`   - ${bithumb} → ${binance}`);
    }

    // 3. 심볼 매핑 테스트
    console.log('\n3. 심볼 매핑 테스트:');
    const testMappings = ['BTC_KRW', 'ETH_KRW', 'XRP_KRW'];
    testMappings.forEach(symbol => {
      const binanceSymbol = mapBithumbToBinanceSymbol(symbol);
      console.log(`   ${symbol} → ${binanceSymbol}`);
    });

    console.log('\n✅ 바이낸스 API 통합 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    console.error('상세 오류:', error);
  }
}

testBinanceIntegration();
