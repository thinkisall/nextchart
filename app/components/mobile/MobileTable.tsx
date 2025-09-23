'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 테이블 컴포넌트

interface MobileTableProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileTable = ({ children, className }: MobileTableProps) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};

interface MobileTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileTableHeader = ({ children, className }: MobileTableHeaderProps) => {
  return (
    <div className={cn(
      "hidden md:block", // 모바일에서는 헤더 숨김
      className
    )}>
      {children}
    </div>
  );
};

interface MobileTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileTableBody = ({ children, className }: MobileTableBodyProps) => {
  return (
    <div className={cn("space-y-2 md:space-y-0", className)}>
      {children}
    </div>
  );
};

interface MobileTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileTableRow = ({ children, className, onClick }: MobileTableRowProps) => {
  return (
    <div 
      className={cn(
        // 모바일에서는 카드 스타일
        "md:table-row",
        "block md:table-row",
        "bg-card rounded-lg p-4 mb-2 shadow-sm border",
        "md:bg-transparent md:rounded-none md:p-0 md:mb-0 md:shadow-none md:border-0",
        "transition-all duration-200",
        "hover:shadow-md hover:scale-[1.01] md:hover:bg-muted/50 md:hover:scale-100 md:hover:shadow-none",
        "active:scale-[0.99] md:active:scale-100",
        "touch-target mobile-tap-feedback",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface MobileTableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileTableHead = ({ children, className }: MobileTableHeadProps) => {
  return (
    <div className={cn(
      "md:table-cell font-medium text-muted-foreground p-2",
      "hidden md:block", // 모바일에서 숨김
      className
    )}>
      {children}
    </div>
  );
};

interface MobileTableCellProps {
  children: React.ReactNode;
  className?: string;
  label?: string; // 모바일에서 라벨로 사용
}

export const MobileTableCell = ({ children, className, label }: MobileTableCellProps) => {
  return (
    <div className={cn(
      "md:table-cell md:p-2",
      "flex justify-between items-center py-1 md:py-0",
      "md:block md:justify-start",
      className
    )}>
      {/* 모바일에서만 보이는 라벨 */}
      {label && (
        <span className="text-sm text-muted-foreground font-medium md:hidden">
          {label}
        </span>
      )}
      <div className="text-right md:text-left">
        {children}
      </div>
    </div>
  );
};
