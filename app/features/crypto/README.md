# Crypto Market Feature Module

## 📁 구조 개요

이 모듈은 암호화폐 시장 데이터를 관리하고 표시하는 기능을 담당합니다. 단일 책임 원칙과 기능 중심 구조를 따라 설계되었습니다.

```
features/crypto/
├── components/           # UI 컴포넌트들
│   ├── CryptoDataTableSection.tsx  # 데이터 테이블 섹션  
│   ├── CryptoFooter.tsx          # 푸터 컴포넌트
│   └── index.ts                  # 컴포넌트 export
├── hooks/               # 커스텀 훅들
│   ├── useCryptoData.ts          # 데이터 통합 관리
│   ├── useCryptoFilters.ts       # 필터링 로직
│   ├── useConnectionManager.ts    # 연결 상태 관리
│   └── index.ts                  # 훅 export
├── services/            # 비즈니스 로직
│   ├── cryptoDataService.ts      # 데이터 서비스
│   └── index.ts                  # 서비스 export
├── CryptoMarketContainer.tsx     # 컨테이너 컴포넌트 (로직)
├── CryptoMarketView.tsx          # 프레젠테이션 컴포넌트 (UI)
├── CryptoMarket.tsx             # 기존 파일 (레거시, 사용X)
└── index.ts                     # 모듈 진입점
```

## 🔧 주요 개선 사항

### 1. 단일 책임 원칙 (SRP) 적용
- **CryptoMarketContainer**: 비즈니스 로직과 상태 관리만 담당
- **CryptoMarketView**: 순수한 UI 렌더링만 담당
- **개별 컴포넌트**: 각각 하나의 UI 섹션만 담당

### 2. 관심사 분리
- **Services**: 데이터 조작 로직
- **Hooks**: 상태 관리와 사이드 이펙트
- **Components**: UI 렌더링

### 3. 재사용성 향상
- 각 컴포넌트와 훅을 독립적으로 사용 가능
- 명확한 인터페이스로 의존성 최소화

## 🚀 성능 최적화

### 실시간 데이터 갱신
- **SSE (Server-Sent Events)**: 1초 간격 실시간 업데이트
- **WebSocket**: 주요 코인 실시간 모니터링  
- **REST API**: 백업 데이터 소스

```typescript
// 전체 기능 사용
import { CryptoMarket } from './features/crypto';

// 개별 컴포넌트 사용
import { MarketStatusPanel } from './features/crypto/components';
import { useCryptoData } from './features/crypto/hooks';
```

## 📋 컴포넌트 설명

### CryptoMarketContainer
메인 컨테이너 컴포넌트로 모든 비즈니스 로직을 관리합니다.
- 데이터 페칭 및 통합
- 상태 관리
- 이벤트 핸들링

### CryptoMarketView  
순수한 프레젠테이션 컴포넌트로 UI만 렌더링합니다.
- props 기반 렌더링
- 사이드 이펙트 없음
- 테스트하기 쉬운 구조

### 개별 컴포넌트들
- **CryptoDataTableSection**: 메인 데이터 테이블
- **CryptoFooter**: 데이터 소스 정보

## 🔗 훅 설명

### useCryptoData
여러 데이터 소스(REST, WebSocket, SSE)를 통합 관리합니다.

### useCryptoFilters  
필터링 로직과 최종 표시 데이터를 관리합니다.

### useConnectionManager
연결 상태 모니터링과 자동 재연결을 처리합니다.

## 🛠 서비스 설명

### CryptoDataService
순수한 비즈니스 로직을 담당하는 정적 클래스입니다.
- 데이터 소스 선택 로직
- 통계 계산
- 유틸리티 함수들