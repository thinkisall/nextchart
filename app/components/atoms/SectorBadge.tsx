import { SECTOR_COLORS } from '../../lib/crypto/colors';

interface SectorBadgeProps {
  sector: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function SectorBadge({ 
  sector, 
  size = 'sm',
  className = '' 
}: SectorBadgeProps) {
  // 섹터 색상 가져오기 (없으면 기본값)
  const sectorColorClass = SECTOR_COLORS[sector] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  
  // 크기별 스타일
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium'
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full
        ${sectorColorClass}
        ${sizeClasses[size]}
        ${className}
      `}
      title={`섹터: ${sector}`}
    >
      {sector}
    </span>
  );
}