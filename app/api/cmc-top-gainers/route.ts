import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.CMC_PRO_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // API URL에 정렬 및 필터링 파라미터를 추가합니다.
  const API_URL = 
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest' +
    '?sort=percent_change_24h' + // 24시간 상승률로 정렬
    '&sort_dir=desc' +           // 내림차순 (가장 높은 것부터)
    '&limit=10' +                // 상위 10개 가져오기
    '&volume_24h_min=100000' +   // 최소 거래량 필터 (100k USD)
    '&market_cap_min=10000000';  // 최소 시가총액 필터 (10M USD)

  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
      // 데이터를 5분마다 새로고침
      next: {
        revalidate: 300, // 300초
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 오류: ${errorData.status.error_message}`);
    }

    const data = await response.json();
    
    // 필요한 정보만 추출하여 클라이언트에 전달
    const topGainers = data.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      volume_24h: coin.quote.USD.volume_24h,
      market_cap: coin.quote.USD.market_cap,
      rank: coin.cmc_rank,
    }));

    return NextResponse.json({
      data: topGainers,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('CMC API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류 발생';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
