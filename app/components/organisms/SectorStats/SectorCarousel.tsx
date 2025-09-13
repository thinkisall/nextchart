import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { SectorCard } from "./SectorCard";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";

interface SectorCarouselProps {
  sectors: [string, {
    count: number;
    totalVolume: number;
    avgChange: number;
    positiveCount: number;
  }][];
  onSectorClick: (sector: string) => void;
  formatNumber: (num: number) => string;
}

export function SectorCarousel({ sectors, onSectorClick, formatNumber }: SectorCarouselProps) {
  const autoplayRef = useRef(
    Autoplay({
      delay: 5000, // 5초로 증가
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

  return (
    <div className="block lg:hidden">
      {/* 고급스러운 헤더 섹션 */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🎭</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">섹터 트렌드</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">실시간 섹터별 동향</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 상태 인디케이터 */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {isPlaying ? 'AUTO' : 'PAUSED'}
                </span>
              </div>
              
              {/* 컨트롤 버튼 */}
              <button
                onClick={toggleAutoplay}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-700/30 shadow-md hover:shadow-lg hover:scale-105"
                title={isPlaying ? "자동 재생 정지" : "자동 재생 시작"}
              >
                {isPlaying ? (
                  <span className="text-sm">⏸</span>
                ) : (
                  <span className="text-sm">▶</span>
                )}
              </button>
            </div>
          </div>
          
          {/* 프로그레스 바 */}
          {isPlaying && (
            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 h-1 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 캐러셀 */}
      <Carousel
        plugins={[autoplayRef.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {sectors.map(([sector, stats]) => (
            <CarouselItem key={sector} className="pl-3 basis-[320px] min-w-0">
              <div className="p-1">
                <SectorCard
                  sector={sector}
                  stats={stats}
                  onSectorClick={onSectorClick}
                  formatNumber={formatNumber}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* 커스텀 네비게이션 버튼 */}
        <CarouselPrevious className="left-3 w-12 h-12 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" />
        <CarouselNext className="right-3 w-12 h-12 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border-white/40 dark:border-gray-700/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" />
      </Carousel>

      {/* 하단 정보 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          좌우 스와이프하여 다른 섹터를 확인하세요 • 총 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sectors.length}</span>개 섹터
        </p>
      </div>
    </div>
  );
}