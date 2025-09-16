import { useState, useCallback } from 'react';
import { EmailService } from '../services/emailService';
import type { FeatureRequestForm, SubmissionState, FeatureRequest } from '../types';

/**
 * 기능 요청 관리 훅
 * 폼 상태 관리, 유효성 검사, 이메일 전송을 담당
 */
export function useFeatureRequest() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false
  });

  // 폼 초기값
  const initialForm: FeatureRequestForm = {
    type: 'feature',
    title: '',
    description: '',
    userEmail: '',
    userName: '',
    priority: 'medium'
  };

  const [form, setForm] = useState<FeatureRequestForm>(initialForm);

  /**
   * 폼 필드 업데이트
   */
  const updateForm = useCallback((field: keyof FeatureRequestForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  /**
   * 폼 유효성 검사
   */
  const validateForm = useCallback((formData: FeatureRequestForm): string | null => {
    if (!formData.title || !formData.title.trim()) {
      return '제목을 입력해주세요.';
    }

    if (!formData.description || !formData.description.trim()) {
      return '상세 설명을 입력해주세요.';
    }

    if (formData.userEmail && formData.userEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail.trim())) {
      return '올바른 이메일 형식을 입력해주세요.';
    }

    return null;
  }, []);

  /**
   * 기능 요청 제출
   */
  const submitRequest = useCallback(async (formData: FeatureRequestForm): Promise<boolean> => {
    try {
      // 유효성 검사
      const validationError = validateForm(formData);
      if (validationError) {
        setSubmissionState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: validationError
        });
        return false;
      }

      // 제출 시작
      setSubmissionState({
        isSubmitting: true,
        isSuccess: false,
        isError: false
      });

      // 요청 객체 생성
      const request: FeatureRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        timestamp: new Date(),
        currentPage: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
      };

      // 이메일 전송
      const success = await EmailService.sendFeatureRequest(request);

      if (success) {
        setSubmissionState({
          isSubmitting: false,
          isSuccess: true,
          isError: false
        });
        
        // 폼 초기화
        setForm(initialForm);
        
        return true;
      } else {
        throw new Error('이메일 전송에 실패했습니다.');
      }

    } catch (error) {
      console.error('기능 요청 제출 실패:', error);
      
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      });
      
      return false;
    }
  }, [validateForm, initialForm]);

  /**
   * 상태 초기화
   */
  const resetState = useCallback(() => {
    setSubmissionState({
      isSubmitting: false,
      isSuccess: false,
      isError: false
    });
  }, []);

  /**
   * 폼 초기화
   */
  const resetForm = useCallback(() => {
    setForm(initialForm);
    resetState();
  }, [initialForm, resetState]);

  return {
    // 상태
    form,
    submissionState,
    
    // 액션
    updateForm,
    submitRequest,
    resetForm,
    resetState,
    validateForm,
    
    // 편의 함수
    isValid: validateForm(form) === null
  };
}
