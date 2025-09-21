# NextChart - Modern Crypto Dashboard

Next.js 15와 shadcn/ui를 활용한 실시간 암호화폐 차트 대시보드입니다.

## 🚀 주요 기능

### 📊 차트 & 시각화
- **Chart.js 통합**: 라인, 바, 파이 차트 지원
- **shadcn/ui 디자인 시스템**: 모던하고 일관된 UI
- **실시간 데이터 시각화**: 암호화폐 가격 및 거래량 차트
- **반응형 차트**: 모든 디바이스에서 최적화된 표시
- **다크 모드 지원**: 자동 테마 전환

### 🔄 실시간 데이터
- **실시간 시세 조회**: 빗썸, 업비트, 바이낸스 API 연동
- **WebSocket 지원**: 실시간 데이터 스트리밍
- **다양한 업데이트 방식**: REST API, Server-Sent Events, WebSocket
- **성능 모니터링**: 실시간 연결 상태 및 성능 지표
- **CoinGecko 트렌딩**: 인기 코인, NFT, 카테고리 실시간 조회

### 🎯 고급 기능
- **거래소별 필터링**: 업비트, 빗썸, 바이낸스, 업비트USDT
- **섹터 분석**: DeFi, Layer 1, Metaverse 등 카테고리별 분석
- **즐겨찾기 시스템**: 관심 코인 관리
- **가격 알림**: 브라우저 알림 지원
- **고급 필터링**: 검색, 정렬, 가격 범위 필터
- **트렌딩 데이터**: CoinGecko 인기 코인/NFT/카테고리 추적

## 🛠 기술 스택

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Chart.js + react-chartjs-2
- **State Management**: React Hooks
- **Build Tool**: Turbopack
- **Runtime**: React 19

## 📁 프로젝트 구조 (기능 중심)

```
app/
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── atoms/              # 기본 컴포넌트
│   ├── molecules/          # 조합 컴포넌트
│   └── organisms/          # 복합 컴포넌트
├── features/               # 기능별 모듈
│   ├── charts/            # 차트 기능
│   │   ├── components/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ChartGrid.tsx
│   │   ├── hooks/
│   │   │   ├── useChartData.ts
│   │   │   └── useChartTheme.ts
│   │   └── index.ts
│   ├── crypto/            # 암호화폐 데이터
│   ├── sector-analysis/   # 섹터 분석
│   └── exchange-performance/ # 거래소 성능
├── hooks/                 # 공통 훅
├── lib/                   # 유틸리티 및 API
└── dashboard/             # 차트 대시보드 페이지
```

## 🎨 shadcn/ui 디자인 시스템

### 컴포넌트 계층
- **Card**: 모든 차트와 데이터를 감싸는 컨테이너
- **Badge**: 상태 표시 (실시간, 변동률 등)
- **Button**: 인터랙션 요소
- **Tabs**: 차트 타입 전환
- **Separator**: 섹션 구분

### 테마 시스템
```css
:root {
  --background: #fefefe;
  --foreground: #1e293b;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --muted: #f8fafc;
  --muted-foreground: #64748b;
  --accent: #e2e8f0;
  --destructive: #ef4444;
  --border: #e2e8f0;
}
```

## 📊 차트 컴포넌트

### LineChart
```tsx
<LineChart
  title="가격 추이"
  description="주요 암호화폐 가격 변동"
  data={chartData}
  showBadge={true}
  badgeText="실시간"
  height={300}
/>
```

### BarChart
```tsx
<BarChart
  title="거래소별 거래량"
  description="24시간 거래량 비교"
  data={barData}
  orientation="vertical"
  height={300}
/>
```

### PieChart
```tsx
<PieChart
  title="시가총액 분포"
  description="상위 5개 코인"
  data={pieData}
  showLegend={true}
  height={300}
/>
```

## 🔧 설치 및 실행

### 의존성 설치
```bash
npm install
# shadcn/ui 컴포넌트 설치
npx shadcn@latest add card button input select badge tabs separator
npx shadcn@latest add dropdown-menu sheet dialog tooltip
# 차트 라이브러리 설치
npm install chart.js react-chartjs-2
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
npm run start
```

## 🌐 API 엔드포인트

### 암호화폐 데이터
- **메인 페이지**: `/` - 실시간 순위 및 시세
- **차트 대시보드**: `/dashboard` - 차트 및 분석
- **섹터 분석**: `/sector` - 업종별 분석

### 지원 거래소
- **업비트** (Upbit): KRW 마켓
- **업비트 USDT**: USDT 마켓  
- **빗썸** (Bithumb): KRW 마켓
- **바이낸스** (Binance): USDT 마켓
- **바이낸스 알파**: 신규 상장 코인

## 📱 반응형 디자인

### 브레이크포인트
```css
/* 모바일 */
@media (max-width: 767px) { ... }

/* 태블릿 */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* 데스크톱 */
@media (min-width: 1024px) { ... }
```

### 모바일 최적화
- **터치 최적화**: 44px 최소 터치 타겟
- **스와이프 제스처**: 카드 네비게이션
- **성능 최적화**: 모바일 CPU/메모리 고려
- **배터리 절약**: 애니메이션 최소화

## 🎯 성능 최적화

### 차트 성능
- **Canvas 렌더링**: Chart.js의 하드웨어 가속
- **데이터 가상화**: 대용량 데이터셋 처리
- **메모이제이션**: React.memo와 useMemo 활용
- **지연 로딩**: 동적 import로 번들 크기 최적화

### 코드 스플리팅
```tsx
const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />
});
```

## 🔒 보안 고려사항

- **CORS 처리**: Next.js API Routes 프록시
- **Rate Limiting**: API 호출 제한
- **데이터 검증**: Zod 스키마 검증
- **XSS 방지**: DOMPurify 사용

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### 환경 변수
```env
NEXT_PUBLIC_API_URL=https://api.example.com
UPBIT_ACCESS_KEY=your_access_key
BINANCE_API_KEY=your_api_key
```

## 🤝 기여하기

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사

- [shadcn/ui](https://ui.shadcn.com/) - 모던 컴포넌트 라이브러리
- [Chart.js](https://www.chartjs.org/) - 강력한 차트 라이브러리
- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 CSS 프레임워크