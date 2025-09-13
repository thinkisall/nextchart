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
      delay: 4000,
      stopOnInteraction: false, // 사용자 인터랙션 후에도 자동 재생 유지
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
    <div className="block md:hidden">
      {/* 자동 재생 컨트롤 */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {isPlaying ? '자동 슬라이드' : '일시 정지'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">4초</span>
          <button
            onClick={toggleAutoplay}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-300 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/30 shadow-lg hover:shadow-xl hover:scale-105"
            title={isPlaying ? "자동 재생 정지" : "자동 재생 시작"}
          >
            {isPlaying ? (
              <span className="text-base">⏸️</span>
            ) : (
              <span className="text-base">▶️</span>
            )}
          </button>
        </div>
      </div>
      
      {/* 진행률 표시기 */}
      {isPlaying && (
        <div className="mb-3 px-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
      
      <Carousel
        plugins={[autoplayRef.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {sectors.map(([sector, stats]) => (
            <CarouselItem key={sector} className="pl-2 basis-[280px] min-w-0">
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
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}
