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
    <div className="relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10" />
      
      <SectorHeader activeSectors={Object.keys(sectorStats).length} />
      
      <MarketOverview
        totalAssets={cryptos.length}
        totalPositive={totalPositive}
        totalNegative={totalNegative}
        positivePercentage={positivePercentage}
      />

      <div className="relative p-4 sm:p-6 lg:p-8">
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
