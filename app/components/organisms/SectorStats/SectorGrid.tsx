import { SectorCard } from "./SectorCard";

interface SectorGridProps {
  sectors: [string, {
    count: number;
    totalVolume: number;
    avgChange: number;
    positiveCount: number;
  }][];
  onSectorClick: (sector: string) => void;
  formatNumber: (num: number) => string;
}

export function SectorGrid({ sectors, onSectorClick, formatNumber }: SectorGridProps) {
  return (
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sectors.map(([sector, stats]) => (
        <div key={sector} className="p-1">
          <SectorCard
            sector={sector}
            stats={stats}
            onSectorClick={onSectorClick}
            formatNumber={formatNumber}
          />
        </div>
      ))}
    </div>
  );
}
