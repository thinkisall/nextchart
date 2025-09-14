// 모바일 섹터 캐러셀 컴포넌트
'use client';

import { useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../../components/ui/carousel';
import { SectorAnalysis } from '../services/SectorAnalysisService';
import { SectorCard } from './SectorCard';

interface SectorCarouselProps {
  analyses: SectorAnalysis[];
  onSectorClick?: (analysis: SectorAnalysis) => void;
  className?: string;
}

export function SectorCarousel({ analyses, onSectorClick, className = '' }: SectorCarouselProps) {
  const autoplayRef = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );
  
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAutoplay = () => {
    const autoplay = autoplayRef.current;
    if (autoplay) {
      if (isPlaying) {
        autoplay.stop();
      } else {
        autoplay.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 lg:hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">섹터 분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`block lg:hidden ${className}`}>
      {/* 캐러셀 헤더 */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                📊 섹터별 분석
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {analyses.length}개 섹터의 실시간 분석 정보
              </p>
            </div>
            
            {/* 자동재생 토글 버튼 */}
            <button
              onClick={toggleAutoplay}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur border border-white/20 dark:border-gray-600/20 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200"
              aria-label={isPlaying ? "자동재생 중지" : "자동재생 시작"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 캐러셀 컨테이너 - 중앙 정렬 강화 */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {/* 캐러셀 */}
          <Carousel
            plugins={[autoplayRef.current]}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              dragFree: true,
            }}
          >
            <CarouselContent className="ml-0">
              {analyses.map((analysis) => (
                <CarouselItem key={analysis.name} className="basis-full">
                  <div className="px-2">
                    <SectorCard
                      analysis={analysis}
                      onClick={() => onSectorClick?.(analysis)}
                      className="h-full shadow-lg mx-auto"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* 네비게이션 버튼 */}
            <CarouselPrevious className="left-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-700" />
            <CarouselNext className="right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-700" />
          </Carousel>
        </div>
      </div>
      
      {/* 하단 인디케이터 */}
      <div className="flex justify-center mt-4 space-x-1">
        {analyses.slice(0, Math.min(8, analyses.length)).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 opacity-60"
          />
        ))}
        {analyses.length > 8 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            +{analyses.length - 8}개 더
          </div>
        )}
      </div>
    </div>
  );
}
