'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MobileButton } from './MobileButton';

interface MobileModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const MobileModal = ({
  children,
  isOpen,
  onClose,
  title,
  className,
  size = 'md'
}: MobileModalProps) => {
  React.useEffect(() => {
    if (isOpen) {
      // 모바일에서 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalSizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md md:max-w-lg',
    lg: 'max-w-lg md:max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="mobile-overlay"
        onClick={handleBackdropClick}
      />

      {/* 모달 컨텐츠 */}
      <div
        className={cn(
          // 기본 스타일
          "relative z-10 w-full bg-background",
          "border border-border shadow-lg",
          
          // 모바일 스타일 (하단에서 올라오는 효과)
          "rounded-t-xl md:rounded-xl",
          "max-h-[90vh] md:max-h-[80vh]",
          "animate-slide-up md:animate-fade-in",
          
          // 크기별 스타일
          modalSizeClasses[size],
          "md:mx-4",
          
          className
        )}
      >
        {/* 헤더 */}
        {(title || true) && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold mobile-title">
              {title || ''}
            </h2>
            <MobileButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </MobileButton>
          </div>
        )}

        {/* 컨텐츠 영역 */}
        <div className="overflow-y-auto max-h-[calc(90vh-64px)] md:max-h-[calc(80vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// 간단한 알림 모달
interface MobileAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export const MobileAlert = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = '확인',
  cancelText,
  onConfirm
}: MobileAlertProps) => {
  const iconMap = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colorMap = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  };

  return (
    <MobileModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="mx-4"
    >
      <div className="p-6 text-center">
        <div className={cn("text-4xl mb-4", colorMap[type])}>
          {iconMap[type]}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 mobile-title">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 mobile-body">
          {message}
        </p>

        <div className="flex gap-3">
          {cancelText && (
            <MobileButton
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              {cancelText}
            </MobileButton>
          )}
          
          <MobileButton
            variant="primary"
            fullWidth
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {confirmText}
          </MobileButton>
        </div>
      </div>
    </MobileModal>
  );
};
