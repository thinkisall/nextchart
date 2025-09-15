# 📊 거래소별 성과 분석 기능

바이낸스, 업비트, 빗썸 거래소별 코인 상승률을 비교 분석하는 기능입니다.

## 🎯 주요 기능

- **5개 거래소 분석**: 빗썸 전체, 업비트 KRW, 업비트 USDT, 바이낸스, 바이낸스 알파
- **실시간 성과 비교**: 평균 변동률, 상승 비율, 상위/하위 코인
- **시각적 랭킹**: 성과별 거래소 순위와 비교 차트
- **필터링 기능**: 정렬 기준 변경, 상승만 보기 옵션
- **상세 통계**: 코인 수, 상승/하락 비율, 베스트/워스트 성과

## 📁 구조

```
features/exchange-performance/
├── components/           # UI 컴포넌트
│   ├── ExchangeCard.tsx         # 거래소 카드 (Atom)
│   ├── PerformanceSummary.tsx   # 성과 요약 (Molecule)
│   └── ExchangePerformanceContainer.tsx # 메인 컨테이너 (Organism)
├── hooks/
│   └── useExchangePerformance.ts # 성과 분석 훅
├── services/
│   └── exchangePerformanceService.ts # 비즈니스 로직
├── types.ts             # 타입 정의
└── index.ts            # 모듈 export
```

## 🏗️ 설계 원칙

### 데이터 소스별 분류
- **빗썸 전체**: 모든 코인 데이터 (기준점)
- **업비트 KRW**: `UPBIT_COINS` 필터링
- **업비트 USDT**: `UPBIT_USDT_COINS` 필터링
- **바이낸스**: `BINANCE_COINS` 필터링
- **바이낸스 알파**: `BINANCE_ALPHA_COINS` 필터링

### 통계 계산
- **평균 변동률**: 전체 코인의 변동률 평균
- **상승 비율**: 상승 코인 수 / 전체 코인 수 * 100
- **상위/하위 코인**: 변동률 기준 상위 3개, 하위 3개

## 🎨 컴포넌트 구조

### 아토믹 디자인 적용
- **Atoms**: ExchangeCard (거래소별 성과 카드)
- **Molecules**: PerformanceSummary (전체 성과 요약)
- **Organisms**: ExchangePerformanceContainer (통합 컨테이너)

### 색상 테마
- **빗썸**: 파란색 (`blue-500`)
- **업비트**: 초록색 (`green-500`)
- **업비트 USDT**: 에메랄드 (`emerald-500`)
- **바이낸스**: 황금색 (`yellow-500`)
- **바이낸스 알파**: 보라색 (`purple-500`)

## 🚀 사용법

```typescript
import { ExchangePerformance } from './features/exchange-performance';

export default function Page() {
  const { prices } = useCryptoPrices();
  
  return <ExchangePerformance coins={prices} />;
}
```

## 📊 분석 지표

### 성과 지표
- **평균 변동률**: 거래소별 코인들의 평균 상승률
- **상승 비율**: 상승하는 코인의 비율
- **코인 수**: 각 거래소에서 거래되는 코인 수
- **상위/하위 코인**: 가장 좋은/나쁜 성과의 코인들

### 정렬 옵션
- **평균 변동률**: 성과 순 정렬
- **상승 비율**: 상승 코인 비율 순 정렬
- **코인 수**: 거래 코인 수 순 정렬

## 🔧 확장 가능성

- 시간대별 성과 분석 (1시간, 24시간, 7일)
- 거래량 기반 가중 평균
- 섹터별 성과 비교
- 알림 기능 (특정 거래소 성과 임계값)
- 히스토리 추적 및 트렌드 분석
