"use client";

import { useRouter } from "next/navigation";
import { CryptoPrice } from "../../lib/types";
import { SectorHeader } from "./SectorStats/SectorHeader";
import { MarketOverview } from "./SectorStats/MarketOverview";
import { SectorCarousel } from "./SectorStats/SectorCarousel";
import { SectorGrid } from "./SectorStats/SectorGrid";
import { useSectorStats } from "./SectorStats/useSectorStats";

interface SectorStatsProps {
  cryptos: CryptoPrice[];
}

export function SectorStats({ cryptos }: SectorStatsProps) {
  const router = useRouter();
  
  const {
    sortedSectors,
    sectorStats,
    totalPositive,
    totalNegative,
    positivePercentage,
    formatNumber,
  } = useSectorStats(cryptos);

  const handleSectorClick = (sectorName: string) => {
    router.push(`/sector/${encodeURIComponent(sectorName)}`);
  };

  return (
    <div className="bg-transparent">
      <SectorHeader activeSectors={Object.keys(sectorStats).length} />
      
      <MarketOverview
        totalAssets={cryptos.length}
        totalPositive={totalPositive}
        totalNegative={totalNegative}
        positivePercentage={positivePercentage}
      />

      <div className="p-4 sm:p-6">
        <SectorCarousel
          sectors={sortedSectors}
          onSectorClick={handleSectorClick}
          formatNumber={formatNumber}
        />
        
        <SectorGrid
          sectors={sortedSectors}
          onSectorClick={handleSectorClick}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}
