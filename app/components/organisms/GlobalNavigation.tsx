"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// shadcn/ui imports
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

export function GlobalNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: '메인',
      icon: '🏠',
      description: '실시간 순위'
    },
    {
      href: '/dashboard',
      label: '대시보드',
      icon: '📊',
      description: '차트 분석'
    }
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 backdrop-blur-md border rounded-full px-4 py-2 shadow-lg">
      <div className="flex items-center space-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-accent'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline text-xs font-medium">
                  {item.label}
                </span>
                {isActive && (
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs px-1.5 py-0.5">
                    현재
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}