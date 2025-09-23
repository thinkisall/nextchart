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
      
      // 인터랙션 스타일
      onClick && [
        "cursor-pointer",
        "hover:shadow-md hover:scale-[1.01]",
        "active:scale-[0.99]"
      ],
      
      // 변형별 스타일
      {
        "border-border shadow-sm": variant === 'default',
        "border-2 border-primary/20 shadow-sm": variant === 'outline', 
        "bg-muted/50 border-muted shadow-sm": variant === 'filled',
      },
      
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

export const MobileCardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-4 pb-2", className)}>
      {children}
    </div>
  );
};

export const MobileCardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h3 className={cn("font-semibold leading-none tracking-tight text-base", className)}>
      {children}
    </h3>
  );
};

export const MobileCardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("p-4 pt-0", className)}>
      {children}
    </div>
  );
};

export const MobileCardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </p>
  );
};
