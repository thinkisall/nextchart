'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 버튼 컴포넌트

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      // 기본 스타일
      "inline-flex items-center justify-center",
      "font-medium rounded-lg transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "select-none",
      
      // 모바일 최적화
      "touch-target", // 최소 44px 보장
      "mobile-tap-feedback", // 탭 피드백
      "touch-manipulation", // 터치 최적화
      
      // 크기별 스타일
      size === 'sm' && "px-3 py-2 text-sm min-h-[36px]",
      size === 'md' && "px-4 py-2.5 text-sm min-h-[44px]",
      size === 'lg' && "px-6 py-3 text-base min-h-[48px]",
      
      // 변형별 스타일 - Primary
      variant === 'primary' && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus:ring-primary/50 active:bg-primary/80",
      
      // Secondary  
      variant === 'secondary' && "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 focus:ring-secondary/50 active:bg-secondary/80",
      
      // Outline
      variant === 'outline' && "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 active:bg-accent/50",
      
      // Ghost
      variant === 'ghost' && "text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 active:bg-accent/50",
      
      // 전체 너비
      fullWidth && "w-full",
      
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

MobileButton.displayName = 'MobileButton';
