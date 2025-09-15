# 🎰 코인 룰렛 기능

바이낸스와 바이낸스 알파 코인 중에서 랜덤으로 코인을 뽑는 재미있는 기능입니다.

## 🎯 주요 기능

- **카테고리별 뽑기**: 바이낸스, 알파, 전체 코인 중 선택
- **실시간 애니메이션**: 스피닝 휠과 시각적 피드백
- **뽑기 통계**: 히스토리 추적 및 통계 분석
- **로컬 저장**: 뽑기 기록을 브라우저에 저장
- **반응형 디자인**: 모바일과 데스크톱 최적화

## 📁 구조

```
features/coin-roulette/
├── components/           # UI 컴포넌트
│   ├── RouletteWheel.tsx        # 스피닝 휠 (Atom)
│   ├── SpinButton.tsx           # 뽑기 버튼 (Atom) 
│   ├── RouletteResultDisplay.tsx # 결과 표시 (Molecule)
│   ├── CategorySelector.tsx     # 카테고리 선택 (Molecule)
│   ├── RouletteStats.tsx        # 통계 표시 (Molecule)
│   └── CoinRouletteContainer.tsx # 메인 컨테이너 (Organism)
├── hooks/
│   └── useCoinRoulette.ts       # 룰렛 상태 관리
├── services/
│   └── coinRouletteService.ts   # 비즈니스 로직
├── types.ts             # 타입 정의
└── index.ts            # 모듈 export
```

## 🎨 디자인 원칙

### 아토믹 디자인 적용
- **Atoms**: RouletteWheel, SpinButton
- **Molecules**: ResultDisplay, CategorySelector, Stats
- **Organisms**: CoinRouletteContainer

### 컴포넌트 책임 분리
- **Container**: 상태 관리와 비즈니스 로직
- **Presentation**: UI 렌더링과 스타일링
- **Service**: 데이터 처리와 알고리즘
- **Hook**: 상태 관리와 라이프사이클

## 🚀 사용법

```typescript
import { CoinRoulette } from './features/coin-roulette';

export default function Page() {
  return <CoinRoulette />;
}
```

## 🔧 확장 가능성

- 가중치 기반 뽑기 추가
- 새로운 거래소 코인 지원
- 소셜 공유 기능
- 뽑기 이벤트 시스템
- 사운드 효과 추가

## 📊 데이터 소스

- **바이낸스 코인**: `BINANCE_COINS` (200+ 코인)
- **알파 코인**: `BINANCE_ALPHA_COINS` (35+ 코인)
- **로컬 스토리지**: 뽑기 히스토리 저장
