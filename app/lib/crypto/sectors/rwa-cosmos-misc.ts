// RWA (실물자산) 섹터 매핑
export const RWA_SECTORS: { [key: string]: string } = {
  // RWA 메인 프로젝트
  ONDO: "RWA/토큰화증권",
  POLYX: "RWA/증권토큰",
  PLUME: "RWA/디파이",
  OM: "RWA/디파이",
  SOLV: "RWA/디파이",
  SIX: "RWA/실물자산토큰화",
  POLY: "RWA/증권형토큰(폴리매쓰)",
  
  // RWA 스테이블코인
  HOME: "RWA/스테이블",
  USUAL: "RWA/스테이블코인(USD0)",
  USD1: "RWA/스테이블",
  FXS: "RWA/스테이블",
  
  // RWA 부동산/농업
  EL: "RWA/부동산디지털화(엘리시아)",
  BLY: "RWA/농수산물유통(블로서리)",
  
  // RWA 신용/IP
  HUMA: "DeFi/RWA(토큰화신용)",
  AQT: "RWA/IP거래(알파쿼크)",
};

// 코스모스 생태계 섹터 매핑
export const COSMOS_SECTORS: { [key: string]: string } = {
  // 코스모스 스마트컨트랙트
  JUNO: "Cosmos/스마트컨트랙트",
  
  // 코스모스 EVM 호환
  EVMOS: "Cosmos/EVM호환",
  
  // 구 테라 생태계
  LUNA: "Cosmos/스테이블(구Terra)",
  UST: "Cosmos/스테이블(구Terra)",
  MIR: "Cosmos/합성자산(미러 프로토콜)",
  ANC: "Cosmos/렌딩(앵커 프로토콜)",
  
  // 코스모스 프라이버시
  SCRT: "Cosmos/프라이버시",
};

// 기타/특수 섹터 매핑
export const MISCELLANEOUS_SECTORS: { [key: string]: string } = {
  // 거래소 관련
  TREE: "거래소", // 트리 - 다중 거래소 상장 코인
  
  // 테스트/기타
  A: "기타/테스트",
  FANC: "기타", // 팬시
  
  // PerpDEX
  HYPE: "PerpDEX/L1(자체체인)",
};
