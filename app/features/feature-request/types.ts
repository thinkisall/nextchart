/**
 * 기능 요청 시스템 타입 정의
 */

export interface FeatureRequest {
  id: string;
  type: 'feature' | 'bug' | 'improvement' | 'question';
  title: string;
  description: string;
  userEmail?: string;
  userName?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  userAgent?: string;
  currentPage: string;
}

export interface FeatureRequestForm {
  type: FeatureRequest['type'];
  title: string;
  description: string;
  userEmail?: string;
  userName?: string;
  priority: FeatureRequest['priority'];
}

export interface EmailTemplate {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params: {
    to_email: string;
    from_name: string;
    from_email: string;
    subject: string;
    message: string;
    request_type: string;
    priority: string;
    timestamp: string;
    page_url: string;
    user_agent: string;
  };
}

export interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}
