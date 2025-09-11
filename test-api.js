// API 테스트 스크립트
async function testMarketAPI() {
  try {
    console.log('Testing market API...');
    const response = await fetch('http://localhost:3001/api/market');
    const data = await response.json();
    
    console.log('Market API response status:', response.status);
    console.log('Market API response:', {
      dataLength: data.data?.length,
      firstFewItems: data.data?.slice(0, 5),
      status: data.status
    });
    
    if (data.data?.length > 0) {
      console.log('Sample Korean names:');
      data.data.slice(0, 10).forEach(item => {
        console.log(`${item.market}: ${item.korean_name} (${item.english_name})`);
      });
    }
  } catch (error) {
    console.error('Error testing market API:', error);
  }
}

async function testCryptoAPI() {
  try {
    console.log('Testing crypto API...');
    const response = await fetch('http://localhost:3001/api/crypto');
    const data = await response.json();
    
    console.log('Crypto API response status:', response.status);
    console.log('Crypto API data keys:', Object.keys(data.data || {}));
  } catch (error) {
    console.error('Error testing crypto API:', error);
  }
}

// 실행
testMarketAPI();
testCryptoAPI();
