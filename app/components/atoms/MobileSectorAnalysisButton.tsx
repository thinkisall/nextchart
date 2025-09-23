'use client';

import Link from 'next/link';
import { MobileCard, MobileCardContent } from '../../../components/mobile';
import { Badge } from '../../../components/ui/badge';

export function MobileSectorAnalysisButton() {
  return (
    <Link href="/sector" className="block">
      <MobileCard className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-purple-200/60 dark:border-purple-700/40 overflow-hidden">
        {/* 백그라운드 효과 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)] group-hover:bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_50%)] transition-all duration-300"></div>
        
        <MobileCardContent className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate">
                    섹터별 성과 분석
                  </h3>
                  <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 text-xs px-1.5 py-0.5 flex-shrink-0">
                    NEW
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  <span className="text-purple-600 dark:text-purple-400 font-medium">22개 섹터</span> 실시간 동향 📊
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800/50 dark:to-indigo-800/50 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300 shadow-sm">
                <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </MobileCardContent>
      </MobileCard>
    </Link>
  );
}