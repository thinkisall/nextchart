# Google AdSense 구현 가이드

## ✅ 완료된 설정

### 1. **기본 AdSense 스크립트 추가**
- `app/layout.tsx`에 Google AdSense 스크립트 추가
- Publisher ID: `ca-pub-3000971739024587`
- `next/script`를 사용한 최적화된 로딩

### 2. **재사용 가능한 AdSense 컴포넌트**
- `app/components/AdSense.tsx` 생성
- 다양한 광고 형태 지원:
  - `HeaderAd` - 헤더 광고 (728x90)
  - `SidebarAd` - 사이드바 광고 (300x250)
  - `FooterAd` - 푸터 광고 (728x90)
  - `ResponsiveAd` - 반응형 광고
  - `AdSense` - 커스텀 광고

### 3. **광고 배치**
- 메인 페이지 헤더/푸터에 광고 추가
- 섹터 통계 사이드바에 광고 추가 (데스크톱만)

## 🔧 필요한 추가 설정

### 1. **실제 광고 슬롯 ID 설정**
Google AdSense 계정에서 광고 단위 생성 후 ID 교체:

```typescript
// app/components/AdSense.tsx에서 수정 필요
export function HeaderAd() {
  return (
    <AdSense
      adSlot="YOUR_ACTUAL_SLOT_ID" // 🔴 실제 슬롯 ID로 교체
      adFormat="horizontal"
      // ...
    />
  );
}
```

### 2. **Google AdSense 승인 과정**

#### **사전 요구사항:**
- ✅ 도메인 소유권 확인
- ✅ HTTPS 설정 (PWA 완료로 준비됨)
- ✅ 고품질 콘텐츠 (암호화폐 시세 서비스)
- ✅ 개인정보처리방침 (추가 필요)
- ✅ 이용약관 (추가 필요)

#### **승인 단계:**
1. **AdSense 계정 생성**: https://www.google.com/adsense/
2. **사이트 추가**: https://www.damoabom.com
3. **광고 코드 배치**: ✅ 완료
4. **검토 대기**: 2-14일 소요
5. **승인 후 광고 표시**: 자동 시작

### 3. **광고 단위 생성 방법**

AdSense 대시보드에서:
1. **광고 → 광고 단위별**
2. **새 광고 단위 만들기**
3. **디스플레이 광고** 선택
4. 광고 단위 설정:
   - **헤더 광고**: 728x90 (데스크톱), 320x50 (모바일)
   - **사이드바 광고**: 300x250
   - **푸터 광고**: 728x90
   - **반응형 광고**: 자동 크기
5. **코드 생성 → 슬롯 ID 복사**

## 📱 반응형 광고 최적화

### **모바일 우선 설계**
```typescript
// 모바일에서는 큰 광고 숨김
<div className="hidden sm:block">
  <HeaderAd />
</div>

// 모바일 전용 작은 광고
<div className="block sm:hidden">
  <ResponsiveAd adSlot="mobile-slot-id" />
</div>
```

### **성능 최적화**
- `strategy="afterInteractive"`: 페이지 로딩 후 광고 로드
- 지연 로딩으로 초기 페이지 속도 유지
- PWA 캐시 정책과 충돌 방지

## 📊 수익 최적화 팁

### **광고 배치 전략**
1. **Above the fold**: 헤더 하단
2. **콘텐츠 사이**: 섹터 통계 중간
3. **사이드바**: 데스크톱 전용
4. **푸터**: 페이지 하단

### **광고 크기 최적화**
- **728x90** (Leaderboard): 헤더/푸터
- **300x250** (Medium Rectangle): 사이드바/콘텐츠 내
- **320x50** (Mobile Banner): 모바일 헤더
- **반응형**: 모든 위치

### **A/B 테스트 요소**
- 광고 위치
- 광고 크기
- 광고 수량
- 텍스트 vs 디스플레이 vs 자동

## 🚫 AdSense 정책 준수

### **콘텐츠 정책**
- ✅ 암호화폐 시세 정보 제공 (허용)
- ❌ 투자 조언 제공 금지
- ❌ 클릭 유도 문구 금지
- ❌ 가격 조작 관련 내용 금지

### **기술적 요구사항**
- ✅ HTTPS 필수
- ✅ 모바일 친화적 디자인
- ✅ 빠른 로딩 속도
- ✅ 유효한 HTML

## 🔍 문제 해결

### **광고가 표시되지 않는 경우**
1. **AdSense 승인 확인**
2. **광고 슬롯 ID 확인**
3. **애드블로커 비활성화**
4. **콘솔 에러 확인**
5. **24-48시간 대기** (새 사이트의 경우)

### **수익이 낮은 경우**
1. **트래픽 증가** 필요
2. **광고 위치 최적화**
3. **페이지 뷰 시간 증가**
4. **타겟팅 개선**

## 📝 개인정보처리방침 추가 필요

AdSense 승인을 위해 다음 페이지들 추가 권장:
- `/privacy-policy` - 개인정보처리방침
- `/terms-of-service` - 이용약관
- `/contact` - 연락처

## 📈 수익 모니터링

Google AdSense 대시보드에서 확인:
- **수익**: 일일/월간 수익
- **노출수**: 광고 표시 횟수
- **클릭수**: 광고 클릭 횟수
- **CTR**: 클릭률 (Click-Through Rate)
- **CPC**: 클릭당 단가 (Cost Per Click)

---

## 🎯 다음 단계

1. **Google AdSense 계정 생성 및 사이트 등록**
2. **실제 광고 슬롯 ID로 교체**
3. **개인정보처리방침/이용약관 페이지 추가**
4. **도메인 HTTPS 배포**
5. **AdSense 승인 신청**
6. **승인 후 수익 최적화**

AdSense 승인까지는 시간이 걸리므로, 먼저 사이트 트래픽을 늘리고 콘텐츠 품질을 높이는 것이 중요합니다.
