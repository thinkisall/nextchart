'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MobileSearch = ({
  value,
  onChange,
  onClear,
  placeholder = "검색...",
  className,
  disabled = false
}: MobileSearchProps) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn(
      "relative flex items-center",
      "bg-background border border-input rounded-lg",
      "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent",
      "transition-all duration-200",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      {/* 검색 아이콘 */}
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      
      {/* 입력 필드 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "mobile-form-field", // 모바일 최적화된 폼 필드
          "flex-1 pl-10 pr-10 py-3",
          "bg-transparent border-none outline-none",
          "placeholder:text-muted-foreground",
          "text-foreground"
        )}
      />
      
      {/* 클리어 버튼 */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 p-1 rounded-full",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            "touch-target" // 터치 타겟 보장
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// 필터와 함께 사용하는 고급 검색
interface MobileSearchWithFiltersProps extends MobileSearchProps {
  filters?: React.ReactNode;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export const MobileSearchWithFilters = ({
  filters,
  showFilters = false,
  onToggleFilters,
  ...searchProps
}: MobileSearchWithFiltersProps) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <MobileSearch {...searchProps} className="flex-1" />
        
        {filters && onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className={cn(
              "touch-target px-3 rounded-lg border",
              "flex items-center justify-center",
              "transition-colors duration-200",
              showFilters 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background text-foreground border-input hover:bg-accent"
            )}
          >
            필터
          </button>
        )}
      </div>
      
      {/* 필터 영역 */}
      {showFilters && filters && (
        <div className={cn(
          "p-4 bg-muted/30 rounded-lg border",
          "animate-fade-in"
        )}>
          {filters}
        </div>
      )}
    </div>
  );
};

// 검색 결과 하이라이팅
interface MobileSearchResultProps {
  children: React.ReactNode;
  searchTerm: string;
  className?: string;
}

export const MobileSearchResult = ({
  children,
  searchTerm,
  className
}: MobileSearchResultProps) => {
  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={cn("mobile-search-result", className)}>
      {typeof children === 'string' ? highlightText(children, searchTerm) : children}
    </div>
  );
};
