'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 테이블 컴포넌트

export const MobileTable = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};

export const MobileTableBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

export const MobileTableRow = ({ children, className, onClick }: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
}) => {
  return (
    <div 
      className={cn(
        "block bg-card rounded-lg p-4 shadow-sm border",
        "transition-all duration-200",
        "hover:shadow-md hover:scale-[1.01]",
        "active:scale-[0.99]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const MobileTableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex justify-between items-center py-1", className)}>
      {children}
    </div>
  );
};
