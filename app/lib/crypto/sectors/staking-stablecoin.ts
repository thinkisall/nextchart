// 스테이킹/LST/LRT 섹터 매핑
export const STAKING_SECTORS: { [key: string]: string } = {
  // 리퀴드 스테이킹 토큰 (LST)
  LDO: "LST/리퀴드스테이킹(Lido)",
  RPL: "LST/리퀴드스테이킹(RocketPool)",
  JTO: "LST/솔라나MEV스테이킹(Jito)",
  SWELL: "LST&LRT/리퀴드(리)스테이킹",
  SD: "LST/멀티체인리퀴드스테이킹(Stader)",
  SWISE: "LST/리퀴드스테이킹(StakeWise)",
  FRXETH: "LST/Frax생태계ETH",
  STETH: "LST/Lido의ETH토큰",
  RETH: "LST/RocketPool의ETH토큰",
  
  // 리퀴드 리스테이킹 토큰 (LRT)
  EIGEN: "리스테이킹/LRT",
  ETHFI: "리스테이킹/LRT",
  PUFFER: "리스테이킹/LRT",
  REZ: "LRT/리스테이킹(Renzo)",
  LISTA: "CDP&LRT/스테이블코인&리스테이킹",
  
  // 비트코인 스테이킹
  BABY: "LST/비트코인스테이킹(Babylon)",
  PUMPBTC: "LST/비트코인",
};

// 스테이블코인 섹터 매핑
export const STABLECOIN_SECTORS: { [key: string]: string } = {
  // 메인 스테이블코인
  USDT: "스테이블코인",
  USDC: "스테이블코인",
  DAI: "스테이블코인",
  FRAX: "스테이블코인",
  BUSD: "스테이블코인",
  TUSD: "스테이블코인",
  USDS: "스테이블코인",
  RSR: "스테이블코인",
  
  // RWA 스테이블코인
  USUAL: "RWA/스테이블코인(USD0)",
  ENA: "스테이블코인/합성달러(USDe)",
  USD1: "RWA/스테이블",
  FXS: "RWA/스테이블",
  SKY: "스테이블코인 연관 자산", // 스카이 프로토콜 - 탈중앙화 스테이블코인 발행 플랫폼
  
  // 금 연동 스테이블코인
  PAXG: "금 연동 스테이블", // PAXG - 금 연동 스테이블코인
};
