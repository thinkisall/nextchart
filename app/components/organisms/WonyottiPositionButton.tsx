import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ExternalLink, TrendingUp, BarChart3 } from "lucide-react";

// 워뇨띠 포지션 버튼 컴포넌트
export function WonyottiPositionButton() {
  const handleClick = () => {
    window.open(
      'https://www.binance.com/en/futures-activity/leaderboard/user/um?encryptedUid=14EA12E7412DC5A21DFF5E7EAC6013B9',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Card className="my-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 왼쪽 정보 섹션 */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                🔥 워뇨띠 포지션
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                바이낸스 리더보드 실시간 포지션 확인
              </p>
              <div className="flex items-center gap-2 mt-2">
                <BarChart3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                  LIVE 트레이딩 현황
                </span>
              </div>
            </div>
          </div>
          
          {/* 오른쪽 버튼 섹션 */}
          <div className="flex flex-col items-center gap-2">
            <Button 
              onClick={handleClick}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              포지션 보러가기
              <ExternalLink className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              새창에서 열림
            </span>
          </div>
        </div>
        
        {/* 하단 추가 정보 */}
        <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-700/30">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>실시간 업데이트</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>바이낸스 공식 데이터</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>리더보드 순위</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}