// 섹터 파일들을 통합하는 인덱스 파일
import { L1_BLOCKCHAIN_SECTORS } from './l1-blockchain';
import { L2_SCALING_SECTORS } from './l2-scaling';
import { DEFI_SECTORS } from './defi';
import { AI_SECTORS } from './ai';
import { MEME_SECTORS } from './meme';
import { GAMEFI_NFT_SECTORS } from './gamefi-nft';
import { STAKING_SECTORS, STABLECOIN_SECTORS } from './staking-stablecoin';
import { INFRASTRUCTURE_SECTORS } from './infrastructure';
import { KOREAN_PROJECTS_SECTORS, PAYMENT_SECTORS } from './korean-payment';
import { SOCIAL_DAO_SECTORS } from './social-dao';
import { RWA_SECTORS, COSMOS_SECTORS, MISCELLANEOUS_SECTORS } from './rwa-cosmos-misc';

/**
 * 모든 암호화폐 섹터를 통합한 매핑 객체
 * 
 * 구조적 원칙:
 * - 기능 중심 구조: 각 섹터별로 파일 분리
 * - 단일 책임 원칙: 각 파일은 특정 섹터만 담당
 * - DRY 원칙: 중복 제거 및 재사용성
 * - 확장성: 새로운 섹터 추가 시 해당 파일만 수정
 */
export const CRYPTO_SECTORS: { [key: string]: string } = {
  // L1 블록체인 (75개 토큰)
  ...L1_BLOCKCHAIN_SECTORS,
  
  // L2 & 확장성 (35개 토큰)
  ...L2_SCALING_SECTORS,
  
  // DeFi 프로토콜 (65개 토큰)
  ...DEFI_SECTORS,
  
  // AI & 에이전트 (40개 토큰)
  ...AI_SECTORS,
  
  // 밈코인 (30개 토큰)
  ...MEME_SECTORS,
  
  // GameFi, NFT, 메타버스 (60개 토큰)
  ...GAMEFI_NFT_SECTORS,
  
  // 스테이킹 & 스테이블코인 (35개 토큰)
  ...STAKING_SECTORS,
  ...STABLECOIN_SECTORS,
  
  // 인프라, DePIN, 프라이버시 (70개 토큰)
  ...INFRASTRUCTURE_SECTORS,
  
  // 한국 프로젝트 & 결제 (30개 토큰)
  ...KOREAN_PROJECTS_SECTORS,
  ...PAYMENT_SECTORS,
  
  // 소셜, DAO, 콘텐츠 (35개 토큰)
  ...SOCIAL_DAO_SECTORS,
  
  // RWA, 코스모스, 기타 (40개 토큰)
  ...RWA_SECTORS,
  ...COSMOS_SECTORS,
  ...MISCELLANEOUS_SECTORS,
};

// 개별 섹터 매핑도 export (필요시 독립적 사용 가능)
export {
  L1_BLOCKCHAIN_SECTORS,
  L2_SCALING_SECTORS,
  DEFI_SECTORS,
  AI_SECTORS,
  MEME_SECTORS,
  GAMEFI_NFT_SECTORS,
  STAKING_SECTORS,
  STABLECOIN_SECTORS,
  INFRASTRUCTURE_SECTORS,
  KOREAN_PROJECTS_SECTORS,
  PAYMENT_SECTORS,
  SOCIAL_DAO_SECTORS,
  RWA_SECTORS,
  COSMOS_SECTORS,
  MISCELLANEOUS_SECTORS,
};

/**
 * 섹터 통계 정보
 */
export const SECTOR_STATS = {
  totalTokens: Object.keys(CRYPTO_SECTORS).length,
  totalSectors: new Set(Object.values(CRYPTO_SECTORS)).size,
  fileCount: 11, // 분리된 섹터 파일 수
  lastUpdated: "2025-09-14",
};

/**
 * 섹터 카테고리별 토큰 수 (대략적)
 */
export const SECTOR_DISTRIBUTION = {
  "L1 블록체인": 75,
  "L2 & 확장성": 35,
  "DeFi 프로토콜": 65,
  "AI & 에이전트": 40,
  "밈코인": 30,
  "GameFi/NFT/메타버스": 60,
  "스테이킹 & 스테이블코인": 35,
  "인프라/DePIN/프라이버시": 70,
  "한국 프로젝트 & 결제": 30,
  "소셜/DAO/콘텐츠": 35,
  "RWA/코스모스/기타": 40,
};
