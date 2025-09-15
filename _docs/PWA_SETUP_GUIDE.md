# PWA 배포 가이드

## 📱 다모아봄 PWA 설정 완료!

### ✅ 완료된 설정:

1. **Web App Manifest** (`/public/manifest.json`)
   - 앱 이름, 아이콘, 색상 테마 설정
   - 단축키 (AI, DeFi, GameFi 섹터 바로가기)
   - 스크린샷 설정

2. **Service Worker** (`/public/sw.js`)
   - 오프라인 캐시 지원
   - 네트워크 우선 전략 (API 요청)
   - 백그라운드 동기화 준비

3. **PWA 컴포넌트** (`/app/components/PWAInstaller.tsx`)
   - 설치 프롬프트 관리
   - 온라인/오프라인 상태 표시
   - Service Worker 자동 등록

4. **메타데이터 최적화** (`/app/layout.tsx`)
   - PWA 관련 메타태그
   - Open Graph, Twitter Card
   - Apple Web App 설정

### 🎯 필요한 추가 작업:

#### 1. 아이콘 생성
```bash
# 현재 SVG 아이콘이 생성되었습니다
# 다음 사이트에서 모든 크기 생성:
# https://www.pwabuilder.com/imageGenerator
# 또는
# https://realfavicongenerator.net/

# 필요한 아이콘 크기:
- 16x16, 32x32 (파비콘)
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 (PWA)
- 180x180 (Apple Touch Icon)
```

#### 2. 스크린샷 추가
`/public/screenshots/` 폴더에 다음 파일 추가:
- `desktop.png` (1280x720) - 데스크톱 화면 캡처
- `mobile.png` (390x844) - 모바일 화면 캡처

#### 3. 도메인 설정
현재 manifest.json에 `https://www.damoabom.com` 설정됨
실제 배포 시 도메인 확인 필요

### 🚀 배포 체크리스트:

#### HTTPS 필수
- [ ] SSL 인증서 설정
- [ ] https://www.damoabom.com 도메인 연결

#### PWA 검증
- [ ] Chrome DevTools > Application > Manifest 확인
- [ ] Lighthouse PWA 점수 확인 (90점 이상 목표)
- [ ] 다양한 기기에서 설치 테스트

#### 성능 최적화
- [ ] Service Worker 캐시 전략 최적화
- [ ] 오프라인 페이지 구현
- [ ] 압축 및 최적화

### 📱 PWA 기능:

1. **홈 화면 추가** - 앱처럼 설치 가능
2. **오프라인 지원** - 기본 UI 캐시됨
3. **빠른 로딩** - 캐시된 리소스 활용
4. **푸시 알림** - Service Worker에 구현됨 (활성화 필요)
5. **백그라운드 동기화** - 데이터 업데이트 지원

### 🛠 개발 중 테스트:

```bash
# 로컬 개발 서버 실행
npm run dev

# PWA 기능 테스트:
1. Chrome DevTools > Application > Service Workers
2. 오프라인 모드로 전환하여 테스트
3. Application > Manifest에서 설정 확인
```

### 📊 PWA 품질 점검:

Chrome DevTools > Lighthouse에서 PWA 탭 확인:
- Installable ✅
- PWA Optimized ✅
- Fast and reliable ✅

### 🎨 브랜딩:

현재 설정된 브랜드 색상:
- 배경색: #ffffff (라이트), #1f2937 (다크)
- 테마색: #1f2937
- 아이콘: 차트 + 원화 기호 (₩)

---

## 🔧 문제 해결:

### Service Worker 업데이트 안됨
```javascript
// 강제 업데이트
navigator.serviceWorker.ready.then(registration => {
  registration.update();
});
```

### 설치 버튼 표시 안됨
- HTTPS 연결 확인
- 모든 PWA 요구사항 충족 확인
- 이미 설치된 상태인지 확인

### 오프라인에서 작동 안함
- Service Worker 등록 확인
- 캐시 전략 점검
- 네트워크 요청 확인

---

## 📈 향후 개선 사항:

1. **푸시 알림**: 가격 알림, 중요 뉴스
2. **백그라운드 동기화**: 주기적 데이터 업데이트
3. **오프라인 데이터**: 마지막 데이터 캐시
4. **App Store 등록**: 웹앱 스토어 등록 고려
