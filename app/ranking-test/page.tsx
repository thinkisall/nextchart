'use client';

import { useState, useEffect } from 'react';
import { MobileCryptoRanking } from '../components/organisms/MobileCryptoRanking';
import { CryptoPrice } from '../lib/types';

// 샘플 데이터 (실제로는 API에서 가져와야 함)
const sampleData: CryptoPrice[] = [
  { 
    symbol: 'AVNT/KRW', 
    korean_name: 'AVNT', 
    english_name: 'AVNT',
    current_price: 1510, 
    change_rate: 32.46,
    change_amount: 372,
    high_price: 1650,
    low_price: 1200,
    volume: 150000000,
    is_positive: true
  },
  { 
    symbol: 'BN/KRW', 
    korean_name: '타운즈', 
    english_name: 'Binance',
    current_price: 46.21, 
    change_rate: 26.78,
    change_amount: 9.78,
    high_price: 50,
    low_price: 35,
    volume: 280000000,
    is_positive: true
  },
  { 
    symbol: 'ALTB/KRW', 
    korean_name: '알타바', 
    english_name: 'Altaba',
    current_price: 15.52, 
    change_rate: 17.93,
    change_amount: 2.36,
    high_price: 18,
    low_price: 12,
    volume: 120000000,
    is_positive: true
  },  { 
    symbol: 'BXNK/KRW', 
    korean_name: '비씨리', 
    english_name: 'BXNK',
    current_price: 4.31, 
    change_rate: 14.18,
    change_amount: 0.53,
    high_price: 5,
    low_price: 3.5,
    volume: 89000000,
    is_positive: true
  },
  { 
    symbol: 'NFT/KRW', 
    korean_name: '드리프트', 
    english_name: 'NFT',
    current_price: 2.45, 
    change_rate: 12.85,
    change_amount: 0.28,
    high_price: 2.8,
    low_price: 2.1,
    volume: 45000000,
    is_positive: true
  },
  { 
    symbol: 'SOL/KRW', 
    korean_name: '솔라나', 
    english_name: 'Solana',
    current_price: 337600, 
    change_rate: 1.20,
    change_amount: 4000,
    high_price: 345000,
    low_price: 330000,
    volume: 890000000,
    is_positive: true
  },  { 
    symbol: 'ETH/KRW', 
    korean_name: '이더리움', 
    english_name: 'Ethereum',
    current_price: 6458000, 
    change_rate: 0.86,
    change_amount: 55000,
    high_price: 6500000,
    low_price: 6400000,
    volume: 1200000000,
    is_positive: true
  },
  { 
    symbol: 'BTC/KRW', 
    korean_name: '비트코인', 
    english_name: 'Bitcoin',
    current_price: 161281000, 
    change_rate: 0.59,
    change_amount: 950000,
    high_price: 162000000,
    low_price: 160000000,
    volume: 2100000000,
    is_positive: true
  },
  { 
    symbol: 'LINEA/KRW', 
    korean_name: '리네아', 
    english_name: 'Linea',
    current_price: 44.3, 
    change_rate: -7.52,
    change_amount: -3.6,
    high_price: 48,
    low_price: 42,
    volume: 67000000,
    is_positive: false
  },  { 
    symbol: 'ATOM/KRW', 
    korean_name: '에이터', 
    english_name: 'Cosmos',
    current_price: 83.7, 
    change_rate: -1.41,
    change_amount: -1.2,
    high_price: 87,
    low_price: 81,
    volume: 34000000,
    is_positive: false
  },
  { 
    symbol: 'USDT/KRW', 
    korean_name: '테더', 
    english_name: 'Tether',
    current_price: 1389, 
    change_rate: -0.14,
    change_amount: -2,
    high_price: 1392,
    low_price: 1387,
    volume: 1800000000,
    is_positive: false
  },
  { 
    symbol: 'AWE/KRW', 
    korean_name: '에이더블유이', 
    english_name: 'AWE',
    current_price: 98.2, 
    change_rate: -0.10,
    change_amount: -0.1,
    high_price: 99,
    low_price: 97,
    volume: 23000000,
    is_positive: false
  },
];

export default function RankingTestPage() {
  const [data, setData] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 실제 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setData(sampleData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleItemClick = (item: CryptoPrice) => {
    console.log('클릭된 아이템:', item);
    // 여기서 상세 페이지로 이동하거나 모달을 띄울 수 있습니다
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4">
      <div className="container mx-auto px-4 max-w-md">
        <MobileCryptoRanking
          data={data}
          title="변동률 순위"
          subtitle="24시간 변동률 기준"
          maxItems={20}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}