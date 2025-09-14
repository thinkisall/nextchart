// DeFi 프로토콜 섹터 매핑
export const DEFI_SECTORS: { [key: string]: string } = {
  // DEX/AMM
  UNI: "DEX/AMM(이더리움)",
  SUSHI: "DEX/AMM(멀티체인)",
  CRV: "DEX/AMM(스테이블스왑)",
  BAL: "DEX/AMM(유동성풀)",
  CAKE: "DEX/AMM(BNB체인)",
  JOE: "DEX/AMM(Avalanche)",
  JUP: "DEX/애그리게이터(솔라나)",
  RAY: "DEX/AMM(솔라나)",
  ORCA: "DEX/AMM(솔라나)",
  BNT: "DEX/AMM",
  OSMO: "DEX/AMM(코스모스)",
  MAV: "DEX/자동화AMM",
  VELODROME: "DEX/AMM(Optimism)",
  AERO: "DEX/AMM(Base)",
  VELO: "DEX/AMM(Optimism)",
  BLUE: "DEX/파생상품(블루핀)",
  DRIFT: "DEX/파생상품(솔라나)",
  ZETA: "DEX/파생상품(솔라나)",
  
  // DEX 애그리게이터
  "1INCH": "DEX/애그리게이터",
  ZRX: "DEX/유동성프로토콜",
  KNC: "DEX/애그리게이터",
  COW: "DEX/MEV방지애그리게이터",
  HFT: "DEX/애그리게이터",
  
  // 파생상품/Perp
  DYDX: "DEX/파생상품(Perp)",
  GMX: "DEX/파생상품(Perp,멀티체인)",
  F: "DeFi/파생상품",
  
  // 렌딩/대출
  AAVE: "DeFi/렌딩",
  COMP: "DeFi/렌딩",
  XVS: "DeFi/렌딩(BNB체인)",
  RDNT: "DeFi/렌딩(멀티체인)",
  JST: "DeFi/트론기반렌딩",
  SYRUP: "DeFi/대출",
  MORPHO: "DeFi/렌딩최적화",
  
  // CDP/스테이블코인 발행
  MKR: "DeFi/CDP(DAI발행)",
  LISTA: "CDP&LRT/스테이블코인&리스테이킹",
  
  // 수익 최적화
  YFI: "DeFi/수익애그리게이터",
  BEL: "DeFi/수익애그리게이터(벨라)",
  PENDLE: "DeFi/수익토큰화(YT/PT)",
  
  // 파생상품/신세틱스
  SNX: "DeFi/파생상품(신세틱스)",
  UMA: "오라클",
  
  // 기타 DeFi
  MEV: "DeFi/MEV솔루션",
  WOO: "CEX/DEX유동성네트워크",
  SPK: "DeFi/유동성",
  HUMA: "DeFi/RWA(토큰화신용)",
  CTC: "DeFi/신용(Creditcoin)",
  SXT: "DeFi/자산관리",
  SUN: "DeFi/트론AMM",
  FIDA: "DeFi/솔라나생태계",
  AUCTION: "DeFi/경매플랫폼",
  UXLINK: "DeFi/소셜",
  HAEDAL: "DeFi/유동성스테이킹",
  AVL: "DeFi/비트코인",
  PUMP: "DEX/런치패드",
  SIX: "RWA/실물자산토큰화",
  SWAP: "DeFi/런치패드(트러스트스왑)",
  SOFI: "DeFi/소셜트레이딩(RAI파이낸스)",
  C98: "DeFi/게이트웨이(Coin98)",
};
