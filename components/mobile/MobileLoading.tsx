'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// 모바일 최적화된 로딩 컴포넌트

export const MobileLoading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
    </div>
  );
};

export const MobileListSkeleton = ({ items = 5 }: { items?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="p-4 bg-card rounded-lg border space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
