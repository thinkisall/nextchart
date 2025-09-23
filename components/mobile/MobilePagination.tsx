'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 페이지네이션

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const MobilePagination = ({ currentPage, totalPages, onPageChange, className }: MobilePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2 py-4", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded border bg-background disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="px-4 py-2 text-sm">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded border bg-background disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
