// 암호화폐 데이터 관련 모든 모듈 export
export * from './korean-names';
export * from './sectors';
export * from './colors';
export * from './categories';
export * from './utils';
export * from './consolidation';

// 편의를 위한 재export (기존 코드 호환성)
export { getCryptoInfo } from './utils';
export { CRYPTO_KOREAN_NAMES } from './korean-names';
export { CRYPTO_SECTORS } from './sectors';
export { SECTOR_COLORS } from './colors';
export { CRYPTO_CATEGORIES } from './categories';
export { getConsolidatedSector, SECTOR_PRIORITY } from './consolidation';
