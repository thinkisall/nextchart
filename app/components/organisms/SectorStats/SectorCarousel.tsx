import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { SectorCard } from "./SectorCard";

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
  return (
    <div className="block md:hidden">
      <Carousel
        opts={{
          align: "start",
          loop: false,
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
