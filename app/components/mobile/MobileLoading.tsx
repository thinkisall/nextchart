'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 로딩 컴포넌트

interface MobileLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

export const MobileLoading = ({ 
  size = 'md', 
  variant = 'spinner',
  className,
  text 
}: MobileLoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className={cn(
          "animate-spin rounded-full border-2 border-muted",
          "border-t-primary",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-muted-foreground mobile-body">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-pulse",
                size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm text-muted-foreground mobile-body">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className={cn(
          "bg-primary rounded-full animate-pulse",
          sizeClasses[size]
        )} />
        {text && (
          <p className="text-sm text-muted-foreground mobile-body">
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// 스켈레톤 로딩 컴포넌트
interface MobileSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const MobileSkeleton = ({
  className,
  variant = 'text',
  width,
  height
}: MobileSkeletonProps) => {
  const baseClasses = cn(
    "skeleton-loading bg-muted animate-pulse",
    variant === 'rectangular' && 'rounded',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'rounded-sm'
  );

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text') {
    return (
      <div 
        className={cn(baseClasses, 'h-4', className)} 
        style={style}
      />
    );
  }

  return (
    <div 
      className={cn(baseClasses, className)} 
      style={style}
    />
  );
};

// 리스트용 스켈레톤
export const MobileListSkeleton = ({ 
  items = 5,
  className 
}: { 
  items?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="p-4 bg-card rounded-lg border space-y-3">
          <div className="flex items-center space-x-3">
            <MobileSkeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <MobileSkeleton className="h-4 w-3/4" />
              <MobileSkeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <MobileSkeleton className="h-3 w-full" />
            <MobileSkeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 카드용 스켈레톤
export const MobileCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("p-6 bg-card rounded-lg border", className)}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MobileSkeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <MobileSkeleton className="h-5 w-3/4" />
            <MobileSkeleton className="h-4 w-1/2" />
          </div>
        </div>
        
        <div className="space-y-3">
          <MobileSkeleton className="h-4 w-full" />
          <MobileSkeleton className="h-4 w-5/6" />
          <MobileSkeleton className="h-4 w-4/6" />
        </div>
        
        <div className="flex space-x-2">
          <MobileSkeleton className="h-8 w-20" />
          <MobileSkeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};
