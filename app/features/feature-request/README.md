# 💡 기능 요청 시스템

사용자가 웹사이트에서 직접 기능 요청, 버그 신고, 개선 제안을 할 수 있는 시스템입니다.

## 🎯 주요 기능

- **플로팅 버튼**: 우측 하단에 항상 표시되는 기능 요청 버튼
- **다양한 요청 타입**: 새 기능, 개선 제안, 버그 신고, 문의사항
- **이메일 자동 전송**: EmailJS를 통한 관리자 이메일 전송
- **사용자 친화적 UI**: 모달 기반의 직관적인 인터페이스
- **실시간 피드백**: 제출 상태 및 성공/실패 알림

## 📁 구조

```
features/feature-request/
├── components/           # UI 컴포넌트
│   ├── FeatureRequestModal.tsx     # 기능 요청 모달 (Organism)
│   └── FloatingFeatureButton.tsx   # 플로팅 버튼 (Molecule)
├── hooks/
│   └── useFeatureRequest.ts        # 폼 관리 훅
├── services/
│   └── emailService.ts             # EmailJS 서비스
├── types.ts             # 타입 정의
└── index.ts            # 모듈 export
```

## 🛠️ 설정 방법

### 1. EmailJS 계정 설정
1. [EmailJS](https://www.emailjs.com/) 가입
2. Service 생성 (Gmail, Outlook 등)
3. Template 생성
4. Public Key 발급

### 2. 이메일 주소 보안
이메일 주소는 보안을 위해 base64로 인코딩되어 코드에 저장됩니다:
- 현재 설정된 이메일: `thinkisall@naver.com`
- 코드에서는 인코딩된 형태로 저장
- 클라이언트에서 런타임에 복호화

### 3. 환경 변수 설정
`.env.local` 파일은 EmailJS 키만 필요합니다:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. 이메일 템플릿 설정
EmailJS 대시보드에서 다음 변수를 포함한 템플릿 생성:
- `{{to_email}}` - 받을 이메일
- `{{from_name}}` - 보낸 사람 이름
- `{{subject}}` - 제목
- `{{message}}` - 메시지 내용
- `{{request_type}}` - 요청 타입
- `{{priority}}` - 우선순위

## 🎨 사용법

### 컴포넌트 사용
```typescript
import { FloatingFeatureButton } from './features/feature-request';

export default function Layout() {
  return (
    <div>
      {/* 다른 컨텐츠 */}
      <FloatingFeatureButton />
    </div>
  );
}
```

### 커스텀 버튼
```typescript
import { FeatureRequestModal } from './features/feature-request';

function CustomButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        기능 제안하기
      </button>
      <FeatureRequestModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        initialType="feature"
      />
    </>
  );
}
```

## 📊 데이터 수집

전송되는 데이터:
- **사용자 입력**: 제목, 설명, 우선순위
- **선택적 정보**: 이름, 이메일
- **자동 수집**: 타임스탬프, 페이지 URL, User-Agent
- **요청 타입**: feature, bug, improvement, question

## 🔧 커스터마이징

### 스타일 수정
- `FloatingFeatureButton` 위치 변경 가능
- CSS 클래스를 통한 색상/크기 조절
- 모달 디자인 커스터마이징

### 기능 확장
- 새로운 요청 타입 추가
- 파일 첨부 기능
- 사용자 인증 연동
- 데이터베이스 저장
- 관리자 대시보드

## 🔐 보안 기능

- **이메일 주소 보호**: Base64 인코딩으로 소스코드에서 이메일 숨김
- **XSS 방지**: 사용자 입력에 대한 기본적인 스크립트 검증
- **길이 제한**: 제목 200자, 설명 1000자 제한
- **입력 검증**: 위험한 패턴 감지 및 차단

## 📧 이메일 형식

전송되는 이메일 예시:
```
제목: [🚀 새 기능 요청] 실시간 알림 기능

🌟 다모아봄 웹사이트 사용자 피드백 🌟

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 기본 정보
🏷️ 분류: 🚀 새 기능 요청
📌 제목: 실시간 알림 기능
⭐ 우선순위: 높음
📅 접수 시간: 2025-09-16 20:30:45
🌐 발생 페이지: https://www.damoabom.com/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 상세 내용:
가격 변동 시 브라우저 알림을 받고 싶습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 사용자 정보:
- 이름: 홍길동
- 이메일: user@example.com
- 브라우저: Chrome
- 요청 ID: req_1726492245123_abc123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💌 이 메시지는 다모아봄(damoabom.com)에서 자동 전송되었습니다.
사용자의 소중한 의견에 감사드립니다! 🙏

✅ 처리 상태: 접수 완료
📊 분석 후 검토하여 빠른 시일 내에 반영하겠습니다.
```

## 🚀 확장 가능성

- Slack, Discord 웹훅 연동
- 티켓팅 시스템 연동 (Jira, Linear)
- 투표 기능 (사용자들이 기능에 투표)
- 진행 상황 추적 및 알림
- AI 기반 유사 요청 탐지
