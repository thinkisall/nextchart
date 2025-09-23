'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 카드 컴포넌트

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'filled';
}

export const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ children, className, onClick, variant = 'default', ...props }, ref) => {
    const baseClasses = cn(
      "rounded-lg border transition-all duration-200",
      "bg-card text-card-foreground",
      
      // 모바일 최적화
      "mobile-shadow", // 모바일 전용 그림자
      
      // 인터랙션 스타일
      ...(onClick ? [
        "cursor-pointer",
        "hover:shadow-md hover:scale-[1.01]",
        "active:scale-[0.99]",
        "mobile-tap-feedback"
      ] : []),
      
      // 변형별 스타일
      variant === 'default' && "border-border shadow-sm",
      variant === 'outline' && "border-2 border-primary/20 shadow-sm", 
      variant === 'filled' && "bg-muted/50 border-muted shadow-sm",
      
      className
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = 'MobileCard';

interface MobileCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardHeader = ({ children, className }: MobileCardHeaderProps) => {
  return (
    <div className={cn(
      "flex flex-col space-y-1.5 p-4 pb-2",
      "md:p-6 md:pb-3", // 데스크톱에서 더 큰 패딩
      className
    )}>
      {children}
    </div>
  );
};

interface MobileCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardTitle = ({ children, className }: MobileCardTitleProps) => {
  return (
    <h3 className={cn(
      "mobile-title", // 모바일 최적화된 타이포그래피
      "font-semibold leading-none tracking-tight",
      "text-base md:text-lg", // 반응형 폰트 크기
      className
    )}>
      {children}
    </h3>
  );
};

interface MobileCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardDescription = ({ children, className }: MobileCardDescriptionProps) => {
  return (
    <p className={cn(
      "mobile-body", // 모바일 최적화된 타이포그래피
      "text-muted-foreground",
      "text-sm md:text-base", // 반응형 폰트 크기
      className
    )}>
      {children}
    </p>
  );
};

interface MobileCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardContent = ({ children, className }: MobileCardContentProps) => {
  return (
    <div className={cn(
      "p-4 pt-0",
      "md:p-6 md:pt-0", // 데스크톱에서 더 큰 패딩
      className
    )}>
      {children}
    </div>
  );
};

interface MobileCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCardFooter = ({ children, className }: MobileCardFooterProps) => {
  return (
    <div className={cn(
      "flex items-center p-4 pt-0",
      "md:p-6 md:pt-0",
      className
    )}>
      {children}
    </div>
  );
};
