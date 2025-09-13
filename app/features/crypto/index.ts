// 새로운 분리된 구조의 CryptoMarket 컴포넌트
export { CryptoMarketContainer as CryptoMarket } from './CryptoMarketContainer';

// 개별 컴포넌트들도 export (필요시 독립적으로 사용 가능)
export { CryptoMarketContainer } from './CryptoMarketContainer';
export { CryptoMarketView } from './CryptoMarketView';
export { CryptoDataTableSection } from './components/CryptoDataTableSection';
export { CryptoFooter } from './components/CryptoFooter';
export { SelectedCoinInfo } from './components/SelectedCoinInfo';

// 훅들도 export
export { useCryptoData } from './hooks/useCryptoData';
export { useCryptoFilters } from './hooks/useCryptoFilters';
export { useConnectionManager } from './hooks/useConnectionManager';

// 서비스도 export
export { CryptoDataService } from './services/cryptoDataService';