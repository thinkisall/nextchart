'use client';

import Link from 'next/link';
import { TrendingUpIcon, BarChart3Icon, PieChartIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { MobileCard, MobileCardContent } from '../../../components/mobile';

/**
 * 메인페이지에서 섹터 분석 페이지로 이동하는 CTA 버튼
 * 시각적 매력과 기능성을 모두 고려한 디자인
 */
export function SectorAnalysisButton() {
  return (
    <MobileCard className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 group">
      {/* 백그라운드 장식 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,69,255,0.05)_25%,rgba(139,69,255,0.05)_50%,transparent_50%,transparent_75%,rgba(139,69,255,0.05)_75%)] bg-[length:20px_20px]"></div>
      
      {/* 글로우 효과 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
      
      <MobileCardContent className="relative p-6">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아이콘과 텍스트 */}
          <div className="flex items-center space-x-4">
            {/* 아이콘 그룹 */}
            <div className="relative">
              {/* 메인 아이콘 */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3Icon className="w-6 h-6 text-white" />
              </div>
              
              {/* 작은 보조 아이콘들 */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <TrendingUpIcon className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* 텍스트 정보 */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  섹터별 성과 분석
                </h3>
                <Badge variant="secondary" className="bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 text-xs">
                  NEW
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                암호화폐 섹터별 실시간 성과와 트렌드를 한눈에
              </p>
              
              {/* 주요 섹터 미리보기 */}
              <div className="flex items-center space-x-1 mt-2">
                <div className="flex space-x-1">
                  {['L1', 'DeFi', 'AI', 'GameFi'].map((sector) => (
                    <span 
                      key={sector}
                      className="px-2 py-0.5 bg-white/60 dark:bg-gray-800/60 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      {sector}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-xs text-muted-foreground">
                    +18개
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: CTA 버튼 */}
          <div className="flex flex-col items-end space-y-2">
            <Link href="/sector" className="w-full">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex items-center space-x-2"
              >
                <span className="font-medium">분석 보기</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            
            {/* 실시간 지표 미리보기 */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>실시간</span>
              </div>
              <span>•</span>
              <span>22개 섹터</span>
            </div>
          </div>
        </div>

        {/* 하단 성과 요약 (옵션) */}
        <div className="mt-4 pt-4 border-t border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <PieChartIcon className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">상승 섹터:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">12</span>
              </div>
              <div className="flex items-center space-x-1">
                <PieChartIcon className="w-3 h-3 text-red-500" />
                <span className="text-muted-foreground">하락 섹터:</span>
                <span className="text-red-600 dark:text-red-400 font-medium">10</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              24시간 기준
            </div>
          </div>
        </div>
      </MobileCardContent>
    </MobileCard>
  );
}