'use client';

import React, { useState } from 'react';
import { Menu, X, Home, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MobileButton } from '../mobile/MobileButton';
import { MobileModal } from '../mobile/MobileModal';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation = ({ className }: MobileNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: '홈', href: '/', active: true },
    { icon: TrendingUp, label: '실시간 순위', href: '/ranking' },
    { icon: BarChart3, label: '차트', href: '/dashboard' },
    { icon: TrendingUp, label: '섹터 분석', href: '/sector' },
    { icon: Settings, label: '설정', href: '/settings' },
  ];

  return (
    <>
      {/* 고정 네비게이션 바 */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-40",
        "bg-background/95 backdrop-blur-sm border-b border-border",
        "safe-area-top",
        className
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* 로고 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="text-foreground font-bold text-lg">
              <span className="hidden sm:inline">DAMOABOM</span>
              <span className="sm:hidden">다모아봄</span>
            </span>
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 라이브 상태 */}
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100/80 dark:bg-green-900/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300 text-xs font-medium">LIVE</span>
            </div>

            {/* 메뉴 버튼 */}
            <MobileButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </MobileButton>
          </div>
        </div>
      </nav>

      {/* 메뉴 모달 */}
      <MobileModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="메뉴"
        size="sm"
      >
        <div className="p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "mobile-tap-feedback touch-target",
                    item.active && "bg-primary/10 text-primary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              실시간 암호화폐 데이터
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 다모아봄
            </p>
          </div>
        </div>
      </MobileModal>
    </>
  );
};

// 하단 탭 네비게이션 (옵션)
interface MobileTabNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MobileTabNavigation = ({ 
  activeTab = 'home',
  onTabChange 
}: MobileTabNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'ranking', icon: TrendingUp, label: '순위' },
    { id: 'chart', icon: BarChart3, label: '차트' },
    { id: 'sector', icon: TrendingUp, label: '섹터' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom">
      <div className="bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg",
                  "transition-colors duration-200 touch-target",
                  "mobile-tap-feedback",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
