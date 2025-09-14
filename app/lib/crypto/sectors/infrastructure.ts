// 인프라, DePIN, 프라이버시 섹터 매핑
export const INFRASTRUCTURE_SECTORS: { [key: string]: string } = {
  // 블록체인 인프라
  GRT: "인프라/블록체인인덱싱(TheGraph)",
  ANKR: "인프라/스테이킹",
  RAD: "인프라/개발자 도구",
  RLC: "인프라/컴퓨팅",
  FLUX: "인프라/분산컴퓨팅",
  POKT: "인프라/노드",
  RSS3: "인프라/정보피드",
  ORDER: "인프라/옴니체인유동성",
  FCT2: "인프라/전자계약(피르마체인)",
  POLA: "인프라/지식공유(폴라리스쉐어)",
  
  // DePIN (탈중앙화 물리적 인프라)
  RENDER: "DePIN/분산GPU렌더링",
  IO: "DePIN/분산GPU클라우드(io.net)",
  AIOZ: "DePIN/분산CDN",
  AKT: "분산 컴퓨팅/DePIN",
  GLM: "분산 컴퓨팅/DePIN",
  ATH: "DePIN/GPU",
  PEAQ: "DePIN/머신 경제",
  VANA: "DePIN/데이터",
  AWE: "AI/DePIN",
  GHX: "DePIN/GPU공유(게이머해시)",
  POWR: "DePIN/P2P에너지거래",
  GRASS: "DePIN/대역폭공유",
  
  // 미디어/콘텐츠 인프라
  THETA: "인프라/미디어",
  BAT: "광고/브라우저",
  LPT: "인프라/미디어",
  TFUEL: "인프라/미디어",
  LIVEPEER: "인프라/미디어",
  
  // 지갑/DID 인프라
  SLF: "DID/지갑",
  KEY: "DID/신원인증(SelfKey)",
  SFP: "인프라/지갑(세이프팔)",
  BICO: "인프라/지갑·레저",
  BIOT: "DID/의료데이터(바이오패스포트)",
  
  // 프라이버시
  ZEC: "프라이버시",
  XMR: "프라이버시",
  EVZ: "프라이버시/DeFi",
  T: "프라이버시",
  ARPA: "프라이버시",
  OXT: "프라이버시",
  OBSR: "프라이버시",
  SCRT: "Cosmos/프라이버시",
  ELX: "인프라/프라이버시", // 엘릭서 - 영지식 증명 기반 메시징 플랫폼
  NIL: "데이터/프라이버시", // 닐리온 - 블라인드 컴퓨팅, 프라이버시 보호
  
  // 보안 인프라
  CTK: "블록체인 보안",
  FORT: "보안/인프라",
  NCT: "보안", // 폴리스웜 - 블록체인 보안, 멀웨어 탐지 플랫폼
  BOUNTY: "보안", // 체인바운티 - 블록체인 보안 인텔리전스
  
  // 브릿지/인터체인
  OBT: "인프라/브릿지",
  ZRO: "인터체인",
  STG: "인터체인",
  W: "인터체인/브릿지",
  CELR: "인터체인/브릿지",
  REN: "인터체인/브릿지",
  OMNI: "인터체인",
  MAPO: "인터체인",
  ASTR: "L1/인터체인",
  WAXL: "인터체인/브릿지",
  
  // 오라클
  LINK: "오라클",
  BAND: "오라클",
  API3: "오라클",
  PYTH: "오라클",
  UMA: "오라클",
  REP: "오라클",
  RED: "오라클",
  
  // IoT 인프라
  IOTA: "IoT/분산원장(Tangle)",
  JASMY: "IoT/데이터주권",
  IOTX: "IoT/블록체인",
  
  // 스토리지 인프라
  FIL: "스토리지",
  AR: "스토리지",
  STORJ: "스토리지",
  BTT: "스토리지/파일공유",
  SC: "스토리지",
  WAL: "스토리지/인프라",
  
  // 공급망/물류
  VET: "물류/공급망",
  TEMCO: "한국/공급망",
  
  // 의료 인프라
  HP: "의료", // 히포 프로토콜 - 의료 분야 블록체인 프로젝트
};
