/**
 * 기능 요청 시스템 모듈 export
 * 기능 중심 구조에 따른 통합 export
 */

// 메인 컴포넌트들 (외부에서 사용할 주요 컴포넌트)
export { FloatingFeatureButton } from './components/FloatingFeatureButton';
export { FeatureRequestModal } from './components/FeatureRequestModal';

// 훅 (비즈니스 로직)
export { useFeatureRequest } from './hooks/useFeatureRequest';

// 서비스 (데이터 처리)
export { EmailService } from './services/emailService';

// 타입
export type {
  FeatureRequest,
  FeatureRequestForm,
  EmailTemplate,
  SubmissionState
} from './types';
