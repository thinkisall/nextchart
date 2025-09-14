/**
 * 프로페셔널한 디자인 컴포넌트 사용 가이드
 * 
 * 기존의 유치한 디자인을 세련되고 전문적인 디자인으로 업그레이드
 * 금융/트레이딩 플랫폼에 적합한 프리미엄 느낌의 UI 컴포넌트들
 */

import React from 'react';
import { CryptoRowProfessional } from '../molecules/CryptoRowProfessional';
import { ButtonProfessional } from '../atoms/ButtonProfessional';
import { PriceChangeProfessional } from '../atoms/PriceChangeProfessional';

// 사용 예시 컴포넌트
export function ProfessionalDesignShowcase() {
  const mockCryptoData = {
    symbol: 'BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
    current_price: 45000000,
    change_amount: 2250000,
    change_rate: 5.26,
    high_price: 46000000,
    low_price: 43000000,
    is_positive: true,
    volume: 1200000000,
    isBinanceAlpha: false,
    isOnBinance: true,
    isOnUpbit: true,
    sector: 'Layer 1'
  };

  return (
    <div className="space-y-8 p-6 bg-slate-50 dark:bg-slate-900">
      
      {/* 프로페셔널 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          프로페셔널 디자인 컴포넌트
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          전문적이고 세련된 암호화폐 트레이딩 플랫폼을 위한 UI 컴포넌트
        </p>
      </div>

      {/* 1. 개선된 CryptoRow - 모바일 카드 스타일 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          개선된 암호화폐 카드 (모바일)
        </h2>
        <div className="grid gap-4 max-w-sm">
          <CryptoRowProfessional
            crypto={mockCryptoData}
            variant="mobile"
            index={0}
            isFavorite={false}
            onClick={() => console.log('Card clicked')}
            onToggleFavorite={() => console.log('Favorite toggled')}
          />
        </div>
      </section>

      {/* 2. 프로페셔널 버튼들 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          프로페셔널 버튼 스타일
        </h2>
        <div className="flex flex-wrap gap-4">
          <ButtonProfessional variant="primary" size="md">
            매수 주문
          </ButtonProfessional>
          <ButtonProfessional variant="danger" size="md">
            매도 주문
          </ButtonProfessional>
          <ButtonProfessional variant="success" size="md">
            포트폴리오 추가
          </ButtonProfessional>
          <ButtonProfessional variant="premium" size="md" icon="⭐">
            프리미엄 기능
          </ButtonProfessional>
        </div>
      </section>

      {/* 3. 개선된 가격 변동 표시 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          프로페셔널 가격 변동 표시
        </h2>
        <div className="flex flex-wrap gap-4">
          <PriceChangeProfessional
            value={2250000}
            percentage={5.26}
            isPositive={true}
            size="md"
            variant="professional"
          />
          <PriceChangeProfessional
            value={850000}
            percentage={-3.42}
            isPositive={false}
            size="md"
            variant="professional"
            showValue={true}
          />
        </div>
      </section>
    </div>
  );
}