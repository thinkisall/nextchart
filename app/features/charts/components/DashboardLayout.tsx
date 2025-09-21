"use client";

import { ReactNode } from 'react';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  onExport?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

export function DashboardLayout({ 
  children, 
  title = "Chart Dashboard",
  description = "실시간 데이터 시각화 대시보드",
  onExport,
  onRefresh,
  onSettings
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <span className="text-primary">📊</span>
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                실시간 연결됨
              </Badge>
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <span className="mr-2">💾</span>
                  <span className="hidden sm:inline">내보내기</span>
                </Button>
              )}
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  🔄
                </Button>
              )}
              {onSettings && (
                <Button variant="outline" size="sm" onClick={onSettings}>
                  ⚙️
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <span>📈</span>
                <span className="hidden sm:inline">개요</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <span>📊</span>
                <span className="hidden sm:inline">라인</span>
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <span>📊</span>
                <span className="hidden sm:inline">바</span>
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <span>🥧</span>
                <span className="hidden sm:inline">파이</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 NextChart Dashboard</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Powered by Chart.js & shadcn/ui</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                시스템 정상
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}