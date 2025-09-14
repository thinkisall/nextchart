# 🔍 Sector Analysis Feature

## 📋 개요

새로운 모듈화된 섹터 구조를 활용한 고도화된 섹터별 상세 분석 시스템입니다.

## 🏗️ 아키텍처

```
features/sector-analysis/
├── components/                    # UI 컴포넌트들
│   ├── SectorAnalysisContainer.tsx   # 메인 컨테이너
│   ├── SectorCard.tsx               # 개별 섹터 카드
│   ├── SectorGrid.tsx               # 섹터 그리드 + 필터
│   ├── MarketOverview.tsx           # 시장 개요
│   └── SectorDetail.tsx             # 섹터 상세 정보
├── hooks/                         # 커스텀 훅들
│   └── useSectorAnalysis.ts         # 섹터 분석 훅
├── services/                      # 비즈니스 로직
│   └── SectorAnalysisService.ts     # 섹터 분석 서비스
└── index.ts                       # 모듈 진입점
```

## ⭐ 주요 특징

### 🎯 모듈화된 섹터 분석
- **12개 주요 섹터 그룹**으로 체계적 분류
- **515개 토큰**을 **120+ 상세 섹터**로 정밀 분류
- 각 섹터별 **독립적인 분석 로직**

### 📊 고급 분석 지표
- **시가총액, 거래량, 변동률** 종합 분석
- **모멘텀 분석** (상승세/하락세/중립)
- **변동성 측정** (표준편차 기반)
- **시장 점유율** 계산
- **상위/하위 성과자** 추출

### 🎨 인터랙티브 UI
- **실시간 필터링** (추세별, 정렬 옵션)
- **반응형 그리드** 레이아웃
- **모달/상세 뷰** 지원
- **다크모드** 완전 지원

## 🚀 사용법

### 기본 사용
```typescript
import { SectorAnalysisContainer } from '@/features/sector-analysis';

function MarketPage() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);

  return (
    <SectorAnalysisContainer 
      cryptos={cryptos}
      onSectorClick={(analysis) => {
        console.log('섹터 클릭:', analysis);
      }}
    />
  );
}
```

### 훅만 사용
```typescript
import { useSectorAnalysis } from '@/features/sector-analysis';

function CustomComponent() {
  const { 
    analyses, 
    performanceSummary, 
    formatNumber 
  } = useSectorAnalysis(cryptos);

  return (
    <div>
      {analyses.map(analysis => (
        <div key={analysis.name}>
          {analysis.displayName}: {formatNumber(analysis.totalMarketCap)}
        </div>
      ))}
    </div>
  );
}
```

### 개별 컴포넌트 사용
```typescript
import { 
  MarketOverview, 
  SectorGrid, 
  SectorDetail 
} from '@/features/sector-analysis';

function CustomLayout() {
  return (
    <div className="space-y-6">
      <MarketOverview performanceSummary={summary} totalCoins={1000} />
      <SectorGrid analyses={analyses} onSectorClick={handleClick} />
      {selectedSector && (
        <SectorDetail analysis={selectedSector} onClose={handleClose} />
      )}
    </div>
  );
}
```

## 📈 지원하는 섹터 그룹

| 그룹 | 아이콘 | 토큰 수 | 설명 |
|------|--------|---------|------|
| **L1 블록체인** | 🌐 | ~75개 | 기본 블록체인 인프라 |
| **L2 & 확장성** | ⚡ | ~35개 | 레이어2 및 확장 솔루션 |
| **DeFi 프로토콜** | 💰 | ~65개 | 탈중앙화 금융 |
| **AI & 에이전트** | 🤖 | ~40개 | AI 및 머신러닝 |
| **밈코인** | 🐶 | ~30개 | 커뮤니티 밈 코인 |
| **GameFi & NFT** | 🎮 | ~60개 | 게임파이 및 NFT |
| **스테이킹 & 스테이블** | 💎 | ~35개 | LST/LRT 및 스테이블코인 |
| **인프라 & DePIN** | 🏗️ | ~70개 | 블록체인 인프라 |
| **한국 & 결제** | 🇰🇷 | ~30개 | 한국 프로젝트 및 결제 |
| **소셜 & DAO** | 👥 | ~35개 | 소셜 네트워크 및 DAO |
| **RWA & 코스모스** | 🏢 | ~40개 | 실물자산 및 코스모스 |
| **기타** | 🔧 | ~10개 | 특수 목적 토큰 |

## 🎯 분석 지표 상세

### 모멘텀 계산
```typescript
// 상승세: 평균변동률 > 5% && 상승비율 > 60%
// 하락세: 평균변동률 < -5% && 상승비율 < 40%
// 중립: 그 외의 경우
```

### 변동성 측정
```typescript
// 표준편차 기반 변동성 계산
const variance = changeRates.reduce((sum, rate) => 
  sum + Math.pow(rate - avgChange, 2), 0) / count;
const volatility = Math.sqrt(variance);
```

## 🔄 실시간 업데이트

- **자동 재계산**: 암호화폐 데이터 변경 시 자동으로 분석 재수행
- **메모이제이션**: useMemo를 활용한 성능 최적화
- **점진적 로딩**: 대량 데이터 처리 시 단계별 로딩

## 🎨 커스터마이징

### 테마 커스터마이징
```typescript
// Tailwind CSS 클래스로 쉽게 커스터마이징 가능
<SectorCard 
  className="hover:shadow-2xl transform hover:scale-105" 
/>
```

### 콜백 함수
```typescript
<SectorAnalysisContainer
  onSectorClick={(analysis) => {
    // 섹터 클릭 시 동작
    router.push(`/sector/${analysis.name}`);
  }}
/>
```

## 📱 반응형 지원

- **모바일**: 1열 그리드
- **태블릿**: 2열 그리드  
- **데스크톱**: 3-4열 그리드
- **와이드**: 4열+ 그리드

## 🚀 성능 최적화

- **메모이제이션**: 불필요한 재계산 방지
- **가상화**: 대량 데이터 처리 최적화
- **지연 로딩**: 필요시에만 컴포넌트 로드
- **트리셰이킹**: 사용하지 않는 코드 제거

## 🔍 디버깅

개발 모드에서 콘솔에 분석 통계가 출력됩니다:
```javascript
🔄 Sector Analysis: Processed 515 tokens into 12 sector groups
📊 Performance: Bullish(3) Bearish(2) Neutral(7)
⏱️ Processing time: 23ms
```

---

**업데이트**: 2025년 9월 14일  
**버전**: 2.0.0 (모듈화 완료)  
**호환성**: Next.js 15+, React 19+
