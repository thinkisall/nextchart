'use client';

import Link from 'next/link';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

/**
 * 섹터별 성과 분석 페이지로 이동하는 디자인된 버튼 컴포넌트
 */
export function SectorAnalysisButton() {
  return (
    <Link href="/sector" className="block">
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700/50 overflow-hidden">
        {/* 백그라운드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.05)_25%,rgba(139,92,246,0.05)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.05)_75%)] bg-[length:12px_12px] group-hover:animate-pulse"></div>
        
        {/* 글로우 효과 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1/2 -translate-x-1/2"></div>
        
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex items-center justify-between">
            {/* 왼쪽 콘텐츠 */}
            <div className="flex items-center space-x-4">
              {/* 아이콘 */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
              </div>
              
              {/* 텍스트 콘텐츠 */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    섹터별 성과 분석
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 text-xs px-2 py-0.5"
                  >
                    NEW
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  DeFi, Layer 1, AI, GameFi 등<br />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    카테고리별 시장 동향을 한눈에
                  </span>
                </p>
              </div>
            </div>
            
            {/* 오른쪽 화살표 */}
            <div className="flex-shrink-0 ml-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300">
                <svg 
                  className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 하단 추가 정보 */}
          <div className="mt-4 pt-3 border-t border-purple-200/30 dark:border-purple-700/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>실시간 업데이트</span>
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                22개 섹터 분석
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}