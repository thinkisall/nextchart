# Ads.txt 가이드

## 📝 Ads.txt란?

**Ads.txt (Authorized Digital Sellers)**는 웹사이트 소유자가 자신의 디지털 광고 인벤토리를 판매할 권한이 있는 광고 시스템을 공개적으로 선언하는 파일입니다.

## ✅ 완료된 설정

### **파일 위치**: `/public/ads.txt`
- URL: `https://www.damoabom.com/ads.txt`
- Google AdSense 계정: `pub-3000971739024587` 등록됨

### **현재 설정**:
```
google.com, pub-3000971739024587, DIRECT, f08c47fec0942fa0
```

## 🎯 Ads.txt의 중요성

### **1. 광고 사기 방지**
- 권한 없는 광고 판매자로부터 보호
- 브랜드 안전성 향상
- 광고주 신뢰도 증가

### **2. AdSense 최적화**
- Google AdSense 승인 과정에서 유리
- 더 높은 광고 단가 (eCPM) 기대
- 프리미엄 광고주 유치

### **3. 수익 보호**
- 무단 광고 판매 방지
- 수익 손실 최소화
- 광고 품질 관리

## 🔧 설정 방법

### **1. 파일 접근 확인**
배포 후 다음 URL에서 접근 가능해야 함:
```
https://www.damoabom.com/ads.txt
```

### **2. 파일 형식**
```
<Domain>, <Publisher ID>, <Relationship>, <Certification Authority ID>
```

#### **필드 설명**:
- **Domain**: 광고 시스템 도메인 (예: google.com)
- **Publisher ID**: 퍼블리셔 계정 ID (예: pub-3000971739024587)
- **Relationship**: 관계 유형 (DIRECT 또는 RESELLER)
- **Certification Authority ID**: 인증 기관 ID (선택사항)

### **3. Google AdSense 전용 설정**
```
google.com, pub-3000971739024587, DIRECT, f08c47fec0942fa0
```

## 📋 추가 네트워크 등록

나중에 다른 광고 네트워크를 사용할 경우 추가:

### **주요 광고 네트워크 예시**:
```
# Google Ad Exchange
google.com, pub-3000971739024587, DIRECT, f08c47fec0942fa0

# PubMatic
pubmatic.com, 156520, RESELLER, 5d62403b186f2ace

# Rubicon Project  
rubiconproject.com, 20416, RESELLER, 0bfd66d529a55807

# OpenX
openx.com, 540871654, RESELLER, 6ac7d0a29f50b500

# Sovrn
sovrn.com, 263049, RESELLER, fafdf38b16bf6b2b

# AppNexus
appnexus.com, 7353, RESELLER, f5ab79cb980f11d1
```

## ⚠️ 주의사항

### **1. 정확한 Publisher ID 사용**
- Google AdSense 대시보드에서 확인
- `pub-` 접두사 포함 필수
- 오타 없이 정확히 입력

### **2. DIRECT vs RESELLER**
- **DIRECT**: 직접 계약한 광고 시스템
- **RESELLER**: 리셀러를 통한 관계

### **3. 파일 위치**
- 루트 도메인에 위치해야 함: `/ads.txt`
- HTTP 상태 코드 200으로 접근 가능해야 함
- 텍스트 파일 형식 (HTML 아님)

## 🔍 검증 방법

### **1. 파일 접근 테스트**
```bash
curl https://www.damoabom.com/ads.txt
```

### **2. Google AdSense에서 확인**
- AdSense 대시보드 → 사이트 → ads.txt 상태 확인
- 보통 24-48시간 후 인식됨

### **3. 온라인 검증 도구**
- https://adstxt.guru/
- https://adstxt-validator.com/

## 📈 효과 측정

### **Ads.txt 적용 전후 비교**:
- **광고 요청 승인률** 증가
- **eCPM (천 노출당 수익)** 향상  
- **프리미엄 광고주** 유치
- **광고 사기** 감소

### **Google AdSense 개선사항**:
- 더 빠른 승인 과정
- 높은 품질 광고 배치
- 안정적인 수익 스트림

## 🚀 배포 후 체크리스트

- [ ] `https://www.damoabom.com/ads.txt` 접근 확인
- [ ] Google AdSense 계정에서 ads.txt 상태 확인
- [ ] 24-48시간 후 AdSense 대시보드에서 인식 여부 확인
- [ ] 추가 광고 네트워크 사용 시 ads.txt 업데이트

## 🔄 유지보수

### **정기 점검 (월 1회)**:
- Publisher ID 변경 사항 확인
- 새로운 광고 네트워크 추가
- 사용하지 않는 항목 제거
- 파일 접근성 확인

### **업데이트 시나리오**:
1. **새 광고 네트워크 추가**
2. **Publisher ID 변경**  
3. **리셀러 관계 변경**
4. **사용 중단된 네트워크 제거**

---

## 📞 문제 해결

### **파일이 접근되지 않는 경우**:
1. 파일 위치 확인 (`/public/ads.txt`)
2. 빌드 및 배포 재실행
3. DNS 설정 확인
4. 서버 설정 확인

### **AdSense에서 인식되지 않는 경우**:
1. 24-48시간 대기
2. Publisher ID 정확성 확인
3. 파일 형식 확인 (텍스트 파일)
4. HTTP 상태 코드 200 확인

Ads.txt는 AdSense 수익 최적화의 핵심 요소입니다. 올바른 설정으로 더 높은 광고 수익을 기대할 수 있습니다!
