// 한국 프로젝트 섹터 매핑
export const KOREAN_PROJECTS_SECTORS: { [key: string]: string } = {
  // 한국 L1/L2
  ICX: "한국/L1",
  BFC: "한국/L1",
  TOKAMAK: "한국/L2",
  
  // 한국 콘텐츠/게임
  BORA: "한국/콘텐츠",
  META: "한국/DID",
  MVL: "한국/모빌리티",
  MED: "한국/DID",
  MLK: "한국/콘텐츠",
  HUNT: "한국/콘텐츠",
  WEMIX: "한국/게임",
  SSX: "한국/콘텐츠",
  MBL: "한국/콘텐츠",
  
  // 한국 기업/공급망
  TEMCO: "한국/공급망",
};

// 결제/송금 섹터 매핑
export const PAYMENT_SECTORS: { [key: string]: string } = {
  // 메인 결제/송금
  XRP: "결제/송금",
  LTC: "결제/기축",
  BCH: "결제/기축",
  XLM: "결제/송금",
  DASH: "결제/송금",
  ACH: "결제/송금",
  XCN: "결제/송금",
  REQ: "결제/인보이스",
  
  // 결제 인프라
  AMP: "결제 담보 토큰",
  MTL: "결제/라이선스",
  XPR: "결제/신원인증",
  PUNDIX: "결제/송금",
  SXP: "결제/송금",
  PCI: "결제/상거래",
  COTI: "결제/송금",
  APM: "결제/B2B(apM코인)",
  MVC: "결제/마일리지통합(마일벌스)",
  
  // 위치/오라클 결제
  XYO: "위치 오라클/결제",
};
