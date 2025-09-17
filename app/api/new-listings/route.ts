import { NextRequest, NextResponse } from 'next/server';

interface Notice {
  categories: string[];
  title: string;
  pc_url: string;
  published_at: string;
  modified_at: string;
}

interface CoinInfo {
  name: string;
  symbol: string;
}

interface Listing {
  title: string;
  categories: string[];
  publishedAt: string;
  url: string;
  coins: CoinInfo[];
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 빗썸 신규상장 API 호출 시작...');
    
    // 1) 빗썸 공지사항 API 호출 (최대 20개)
    const response = await fetch(
      'https://api.bithumb.com/v1/notices?count=20',
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        next: { revalidate: 300 } // 5분 캐시
      }
    );
    
    if (!response.ok) {
      throw new Error(`빗썸 API 호출 실패: ${response.status}`);
    }
    
    const notices: Notice[] = await response.json();
    console.log(`📥 빗썸 공지사항 ${notices.length}개 가져옴`);

    // 2) 신규상장 필터링
    const listingKeywords = [
      '마켓 추가',
      '상장',
      '추가 상장',
      '신규 상장',
      '원화 마켓',
      '거래 시작',
      '거래개시',
      'KRW 마켓'
    ];
    const listingCategories = ['마켓 추가'];

    const extractCoins = (title: string): CoinInfo[] => {
      // 다양한 패턴으로 코인 추출
      const patterns = [
        /([^(),]+)\(([A-Z]+)\)/g,  // 기본 패턴: 이름(심볼)
        /([A-Z]{2,10})\s*거래/g,   // 심볼 거래 패턴
        /([A-Z]{2,10})\s*마켓/g,   // 심볼 마켓 패턴
      ];
      
      const coins: CoinInfo[] = [];
      const seenSymbols = new Set<string>();
      
      patterns.forEach(pattern => {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(title))) {
          let name = '';
          let symbol = '';
          
          if (pattern === patterns[0]) {
            // 이름(심볼) 패턴
            name = match[1].trim();
            symbol = match[2].trim();
          } else {
            // 심볼만 있는 패턴
            symbol = match[1].trim();
            name = symbol;
          }
          
          if (symbol && !seenSymbols.has(symbol)) {
            seenSymbols.add(symbol);
            coins.push({ name, symbol });
          }
        }
      });
      
      return coins;
    };

    const listings: Listing[] = notices
      .filter((notice) => {
        // 카테고리 또는 제목 키워드로 필터링
        const hasCategory = notice.categories.some((c) => listingCategories.includes(c));
        const hasKeyword = listingKeywords.some((kw) => notice.title.includes(kw));
        
        return hasCategory || hasKeyword;
      })
      .map((notice) => ({
        title: notice.title,
        categories: notice.categories,
        publishedAt: notice.published_at,
        url: notice.pc_url,
        coins: extractCoins(notice.title),
      }))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf()
      );

    console.log(`✅ 신규상장 공지 ${listings.length}개 필터링 완료`);
    
    return NextResponse.json({ 
      listings,
      count: listings.length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ 빗썸 신규상장 API 오류:', error);
    return NextResponse.json(
      { 
        listings: [], 
        count: 0,
        error: error.message,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
