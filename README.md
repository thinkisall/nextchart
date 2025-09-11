# 빗썸 암호화폐 실시간 시세 차트

Next.js 15와 빗썸 API를 활용한 실시간 암호화폐 시세 확인 서비스입니다.

## 🚀 주요 기능

- **실시간 시세 조회**: 빗썸 REST API를 통한 암호화폐 가격 정보
- **WebSocket 지원**: 실시간 데이터 스트리밍 (계획)
- **다양한 실시간 업데이트 방식**: REST API, Server-Sent Events (1초), WebSocket
- **업비트 WebSocket 연동**: 실제 작동하는 실시간 데이터
- **가격 알림 기능**: 브라우저 알림으로 목표가 달성 시 알림
- **즐겨찾기 시스템**: 관심 코인 즐겨찾기 및 필터링
- **고급 필터링**: 검색, 정렬, 가격 범위, 즐겨찾기 필터
- **성능 모니터링**: 실시간 연결 상태 및 성능 지표
- **90개+ 암호화폐**: 완전한 한국어 매핑
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- **아토믹 디자인**: 재사용 가능한 컴포넌트 구조

## 🛠 기술 스택

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **Runtime**: React 19

## 📁 프로젝트 구조

```
app/
├── components/           # 아토믹 디자인 컴포넌트
│   ├── atoms/           # 기본 컴포넌트 (Button, PriceChange 등)
│   ├── molecules/       # 조합 컴포넌트 (CryptoRow, RefreshControl 등)
│   └── organisms/       # 복합 컴포넌트 (CryptoTable 등)
├── features/            # 기능별 모듈
│   └── crypto/         # 암호화폐 관련 기능
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 및 API
│   ├── bithumb-api.ts  # 빗썸 API 호출
│   ├── types.ts        # TypeScript 타입 정의
│   └── utils.ts        # 공통 유틸리티
└── globals.css         # 전역 스타일
```

## 🌐 API 정보

### 빗썸 Public API
- **전체 시세**: `https://api.bithumb.com/public/ticker/ALL_KRW`
- **개별 시세**: `https://api.bithumb.com/public/ticker/{symbol}_KRW`
- **WebSocket**: `wss://pubwss.bithumb.com/pub/ws` (구현 예정)

### 지원 데이터
- 현재가, 변동률, 변동금액
- 고가, 저가, 거래량
- 실시간 업데이트 (REST/WebSocket)

## 🚦 시작하기

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3002](http://localhost:3002)을 열어 확인하세요.

### 빌드
```bash
npm run build
npm run start
```

### 타입 검사
```bash
npm run type-check
```

## 📋 구현된 기능

- ✅ 빗썸 REST API 연동 (프록시 서버 포함)
- ✅ 실시간 시세 테이블 (90개+ 암호화폐, 변동률 순 정렬)
- ✅ 5가지 업데이트 방식 (수동, 자동, SSE, WebSocket)
- ✅ 가격 알림 시스템 (브라우저 알림)
- ✅ 즐겨찾기 기능 (로컬 저장)
- ✅ 고급 필터링 (검색, 정렬, 가격 범위)
- ✅ 성능 모니터링 (연결 상태, 업데이트 횟수)
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ TypeScript 타입 안정성
- ✅ 아토믹 디자인 패턴
- ✅ SSR/CSR Hydration 문제 해결
- ✅ CORS 이슈 해결 (API Routes)
- ✅ 완전한 에러 처리 (ErrorBoundary)
- ✅ 한국어 완전 지원 (90개+ 코인명)
- ✅ 디바운스 검색 (성능 최적화)
- 🚧 WebSocket 실시간 연결 (베타 - 현재 비활성화)
- 📊 차트 시각화 (계획)

## 🎨 디자인 시스템

### 아토믹 디자인 구조
- **Atoms**: Button, LoadingSpinner, PriceChange
- **Molecules**: CryptoRow, RefreshControl
- **Organisms**: CryptoTable
- **Templates**: CryptoMarket (기능 컴포넌트)

### 컬러 시스템
- **상승**: 빨간색 (`text-red-600`)
- **하락**: 파란색 (`text-blue-600`)
- **중립**: 회색 (`text-gray-600`)

## 🔧 커스터마이징

### 새로운 거래소 추가
1. `lib/` 폴더에 새 API 서비스 파일 생성
2. 타입 정의 추가 (`types.ts`)
3. 커스텀 훅 생성 (`hooks/`)
4. 컴포넌트에서 사용

### 차트 라이브러리 추가
권장 라이브러리:
- **Recharts**: React 친화적
- **Chart.js**: 다양한 차트 타입
- **D3.js**: 완전 커스터마이징

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

"# nextchart" 
