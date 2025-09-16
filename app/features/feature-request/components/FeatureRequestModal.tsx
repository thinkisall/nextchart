import { memo, useEffect } from 'react';
import { useFeatureRequest } from '../hooks/useFeatureRequest';
import type { FeatureRequestForm } from '../types';

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: FeatureRequestForm['type'];
}

/**
 * 기능 요청 모달 컴포넌트
 * 사용자가 기능 요청, 버그 신고 등을 할 수 있는 모달
 */
export const FeatureRequestModal = memo<FeatureRequestModalProps>(({ 
  isOpen, 
  onClose,
  initialType = 'feature'
}) => {
  const {
    form,
    submissionState,
    updateForm,
    submitRequest,
    resetForm,
    isValid
  } = useFeatureRequest();

  // 모달이 열릴 때 초기 타입 설정
  useEffect(() => {
    if (isOpen) {
      updateForm('type', initialType);
    }
  }, [isOpen, initialType, updateForm]);

  // 성공 시 3초 후 모달 닫기
  useEffect(() => {
    if (submissionState.isSuccess) {
      const timer = setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submissionState.isSuccess, onClose, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest(form);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => resetForm(), 300); // 애니메이션 후 초기화
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* 모달 컨테이너 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl 
          bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all">
          
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {submissionState.isSuccess ? '✅ 전송 완료!' : '💡 아이디어 제안하기'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 성공 메시지 */}
          {submissionState.isSuccess && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                  소중한 의견 감사합니다!
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  관리자가 검토 후 빠른 시일 내에 반영하겠습니다.
                </p>
              </div>
            </div>
          )}

          {/* 폼 */}
          {!submissionState.isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 요청 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  요청 타입
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'feature', label: '🚀 새 기능', color: 'blue' },
                    { value: 'improvement', label: '✨개선 제안', color: 'green' },
                    { value: 'bug', label: '🐛 버그 신고', color: 'red' },
                    { value: 'question', label: '❓ 문의사항', color: 'yellow' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateForm('type', type.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="간단하고 명확하게 작성해주세요"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* 상세 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  상세 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="어떤 기능이 필요한지, 왜 필요한지 자세히 설명해주세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              {/* 우선순위 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  우선순위
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => updateForm('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">낮음 - 언젠가는 있으면 좋을 기능</option>
                  <option value="medium">보통 - 꽤 유용할 것 같은 기능</option>
                  <option value="high">높음 - 꼭 필요한 기능</option>
                </select>
              </div>

              {/* 사용자 정보 (선택적) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름 (선택)
                  </label>
                  <input
                    type="text"
                    value={form.userName}
                    onChange={(e) => updateForm('userName', e.target.value)}
                    placeholder="익명"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이메일 (선택)
                  </label>
                  <input
                    type="email"
                    value={form.userEmail}
                    onChange={(e) => updateForm('userEmail', e.target.value)}
                    placeholder="답변 받을 이메일"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* 테스트 버튼 (개발 환경에서만) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <button
                    type="button"
                    onClick={async () => {
                      console.log('🧪 EmailJS 테스트 시작');
                      const { EmailService } = await import('../services/emailService');
                      const result = await EmailService.sendTestEmail();
                      alert(result ? '테스트 이메일 전송 성공!' : '테스트 이메일 전송 실패!');
                    }}
                    className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-medium"
                  >
                    🧪 EmailJS 테스트 (개발자용)
                  </button>
                </div>
              )}

              {/* 폼 검증 상태 표시 (디버깅용) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div>제목: {form.title.length}글자 {form.title.trim().length > 0 ? '✅' : '❌'}</div>
                  <div>설명: {form.description.length}글자 {form.description.trim().length > 0 ? '✅' : '❌'}</div>
                  <div>유효함: {isValid ? '✅' : '❌'}</div>
                </div>
              )}

              {/* 에러 메시지 */}
              {submissionState.isError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {submissionState.errorMessage}
                  </p>
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                    hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!isValid || submissionState.isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                    hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500
                    text-white rounded-lg font-medium transition-all transform hover:scale-105 
                    disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  title={!isValid ? '필수 항목을 모두 입력해주세요' : '제안하기'}
                >
                  {submissionState.isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>전송 중...</span>
                    </>
                  ) : (
                    <>
                      <span>✉️</span>
                      <span>제안하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

FeatureRequestModal.displayName = 'FeatureRequestModal';
