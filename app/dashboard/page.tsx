"use client";

import { DashboardLayout } from '../features/charts/components/DashboardLayout';
import { ChartGrid } from '../features/charts/components/ChartGrid';
import { TrendingDashboard } from '../components/organisms/TrendingDashboard';
import { GlobalNavigation } from '../components/organisms/GlobalNavigation';
import { FloatingFeatureButton } from '../features/feature-request';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const handleExport = () => {
    // 차트 데이터 내보내기 로직
    const dataUrl = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        charts: 'dashboard_export',
        note: 'NextChart Dashboard Export'
      })
    );
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `nextchart-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleRefresh = () => {
    // 전체 대시보드 새로고침 로직
    window.location.reload();
  };

  const handleSettings = () => {
    // 설정 페이지로 이동 또는 모달 열기
    alert('설정 기능은 준비 중입니다.');
  };

  return (
    <>
      <GlobalNavigation />
      <div className="pt-16">
        <DashboardLayout
          title="NextChart Dashboard"
          description="shadcn/ui와 Chart.js로 구축된 실시간 암호화폐 차트 대시보드"
          onExport={handleExport}
          onRefresh={handleRefresh}
          onSettings={handleSettings}
        >
          {/* 트렌딩 데이터 섹션 */}
          <div className="mb-8">
            <TrendingDashboard />
          </div>
          
          <Separator className="my-8" />
          
          {/* 기존 차트 그리드 */}
          <ChartGrid />
        </DashboardLayout>
      </div>
      
      {/* 플로팅 기능 요청 버튼 */}
      <FloatingFeatureButton />
    </>
  );
}