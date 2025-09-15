# 🚀 Vercel 대역폭 최적화 가이드

현재 120GB/100GB 사용량을 줄이기 위한 최적화 방법들입니다.

## ✅ 즉시 적용된 최적화

### 1. **Next.js 설정 최적화**
- ✅ 이미지 최적화 활성화 (WebP, AVIF 포맷)
- ✅ JavaScript/CSS 압축 활성화 
- ✅ 정적 자산 1년 캐싱
- ✅ API 응답 30초 캐싱

### 2. **API 응답 최적화**
- ✅ 메모리 캐싱 (30초)
- ✅ 불필요한 데이터 필드 제거
- ✅ gzip 압축 활성화
- ✅ stale-while-revalidate 패턴

### 3. **SSE 스트림 최적화**
- ✅ 동시 연결 수 제한 (50개)
- ✅ 메시지 크기 최소화
- ✅ 불필요한 메타데이터 제거

### 4. **폰트 최적화**
- ✅ Font display: swap
- ✅ 선택적 폰트 로딩

## 📊 예상 절약 효과

| 최적화 항목 | 예상 절약률 | 설명 |
|------------|------------|------|
| 이미지 최적화 | 40-60% | WebP/AVIF로 크기 대폭 감소 |
| API 캐싱 | 20-30% | 중복 요청 감소 |
| 정적 자산 캐싱 | 15-25% | JS/CSS 재전송 방지 |
| 응답 압축 | 10-20% | gzip으로 텍스트 압축 |
| **총 예상 절약** | **60-80%** | **48-96GB 절약 가능** |

## 🔧 추가 권장 사항

### 1. **이미지 관리**
```bash
# 기존 이미지들을 WebP로 변환
npm install -g imagemin-cli imagemin-webp
imagemin public/**/*.{jpg,png} --out-dir=public/optimized --plugin=webp
```

### 2. **코드 분할**
```javascript
// 동적 import로 번들 크기 줄이기
const CoinRoulette = dynamic(() => import('./CoinRoulette'), {
  loading: () => <LoadingSpinner />
});
```

### 3. **CDN 활용**
```javascript
// 외부 리소스는 CDN 사용
<Image 
  src="https://cdn.example.com/logo.webp"
  width={100} 
  height={100}
  priority={false}
/>
```

### 4. **불필요한 데이터 제거**
- 사용하지 않는 API 필드 제거
- 과거 데이터 정리
- 로그 데이터 최소화

### 5. **모니터링 설정**
```javascript
// Vercel Analytics로 사용량 추적
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## 📈 모니터링 방법

### Vercel 대시보드에서 확인할 항목:
1. **Functions**: API 호출 횟수
2. **Edge Requests**: 정적 자산 요청
3. **Bandwidth**: 전체 데이터 전송량
4. **Cache Hit Rate**: 캐시 효율성

### 최적화 효과 측정:
- 배포 후 24-48시간 모니터링
- 주간 대역폭 사용량 비교
- 페이지 로딩 속도 개선 확인

## 🚨 긴급 대역폭 절약 방법

만약 즉시 사용량을 줄여야 한다면:

1. **이미지 크기 제한**
   ```javascript
   // 최대 이미지 크기 제한
   images: {
     deviceSizes: [640, 828, 1200], // 큰 크기 제거
     imageSizes: [16, 32, 48, 64], // 작은 크기만 유지
   }
   ```

2. **API 호출 빈도 조정**
   ```javascript
   // SSE 업데이트 간격 늘리기
   const UPDATE_INTERVAL = 5000; // 1초 → 5초
   ```

3. **일시적 기능 비활성화**
   - 실시간 차트 업데이트 일시 중단
   - 이미지 압축 품질 낮추기
   - 불필요한 API 엔드포인트 비활성화

## 💰 비용 최적화

100GB 초과시 추가 비용이 발생하므로:
- **Pro 플랜 고려**: 1TB 포함, 더 경제적일 수 있음
- **Edge Config 활용**: 정적 설정 데이터는 Edge Config 사용
- **Vercel KV**: 자주 조회되는 데이터는 KV 저장소 활용

적용 후 24-48시간 뒤에 사용량 변화를 확인해보세요!