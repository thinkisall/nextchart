// 섹터 분석 피처 모듈 인덱스
export { SectorAnalysisContainer } from './components/SectorAnalysisContainer';
export { SectorCard } from './components/SectorCard';
export { SectorGrid, SectorFilter } from './components/SectorGrid';
export { SectorCarousel } from './components/SectorCarousel';
export { MarketOverview } from './components/MarketOverview';
export { SectorDetail } from './components/SectorDetail';

export { useSectorAnalysis, useSectorDetail } from './hooks/useSectorAnalysis';

export { 
  SectorAnalysisService,
  type SectorAnalysis,
  type ModularSectorGroups 
} from './services/SectorAnalysisService';

export { SectorNavigationUtils } from './utils/SectorNavigationUtils';

// 편의를 위한 재export
export type {
  SectorAnalysis as SectorAnalysisType,
  ModularSectorGroups as SectorGroupsType
} from './services/SectorAnalysisService';
