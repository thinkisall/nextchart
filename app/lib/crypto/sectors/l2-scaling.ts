// L2 및 확장성 솔루션 섹터 매핑
export const L2_SCALING_SECTORS: { [key: string]: string } = {
  // 이더리움 L2
  ARB: "L2/옵티미스틱롤업",
  OP: "L2/옵티미스틱롤업",
  MATIC: "L2/PoS사이드체인&플라즈마",
  POL: "L2/생태계레이어",
  STRK: "L2/ZK롤업(STARK)",
  METIS: "L2/옵티미스틱롤업(하이브리드)",
  BOBA: "L2/옵티미스틱롤업(멀티체인)",
  LRC: "L2/ZK롤업(DEX특화)",
  BLAST: "L2/옵티미스틱롤업(네이티브이자수익)",
  SCROLL: "L2/ZK롤업(EVM호환)",
  SCR: "L2/ZK롤업(프라이버시)",
  LINEA: "L2/ZK롤업(EVM호환)",
  ZK: "L2/ZK롤업",
  TAIKO: "L2/ZK롤업(Based)",
  MNT: "L2/모듈러(옵티미스틱)",
  ZRC: "L2/ZK롤업",
  MANTA: "L2/모듈러(ZK&프라이버시)",
  SKL: "L2/이더리움멀티체인네트워크",
  CTSI: "L2/옵티미스틱롤업(오프체인연산)",
  CYBER: "L2/소셜네트워크",
  
  // 비트코인 L2
  STX: "L2/비트코인레이어",
  MERL: "L2/비트코인레이어",
  HYPER: "L2/비트코인(네이티브수익)",
  LAYER: "L2/비트코인(솔레이어)",
  
  // 모듈러/특수 L2
  MOVE: "L2/모듈러(Move언어)",
  ES: "L2/SVM 롤업", // 이클립스 - 이더리움 L2, 솔라나 SVM 융합
  H: "L2/DID&생체인증",
  
  // 모듈러 DA레이어
  AVAIL: "모듈러/DA레이어",
  TIA: "모듈러/DA레이어(셀레스티아)",
  
  // 롤업 인프라
  ALT: "롤업 인프라/애그리게이션",
  ERA: "롤업 인프라/RaaS",
  SOON: "인프라/롤업",
  PROVE: "인프라/ZK",
};
