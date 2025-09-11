// 다중 카테고리 매핑 테스트
import { getConsolidatedSectors } from './app/lib/crypto/consolidation.js';

console.log('=== 다중 카테고리 매핑 테스트 ===');

const testCases = [
  'AI/DePIN',                                    // AWE
  'DePIN/분산GPU클라우드(io.net)',               // IO
  'AI/탈중앙화AI트레이딩펀드',                   // AI16Z
  'AI/헤지펀드&예측(Numeraire)',                 // NMR
  'L1/DeFi최적화',                              // INJ
  'L1/NFT&게임',                                // FLOW
  'GameFi/L1(Endurance)',                       // ACE
  'DePIN/GPU',                                  // ATH
];

testCases.forEach(sector => {
  const result = getConsolidatedSectors(sector);
  console.log(`${sector} → [${result.join(', ')}]`);
});

console.log('\n=== 특별히 문제되는 케이스들 ===');
console.log('AWE (AI/DePIN):', getConsolidatedSectors('AI/DePIN'));
console.log('IO (DePIN/분산GPU클라우드):', getConsolidatedSectors('DePIN/분산GPU클라우드(io.net)'));
