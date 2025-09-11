// 섹터별 색상 매핑
export const SECTOR_COLORS: { [key: string]: string } = {
  // 기본 L1/L2 섹터
  "결제/기축": "bg-yellow-100 text-yellow-800",
  L1: "bg-blue-100 text-blue-800",
  L2: "bg-indigo-100 text-indigo-800",
  "L1/특화": "bg-blue-50 text-blue-700",
  "L2/ZK": "bg-indigo-100 text-indigo-800",
  "L2/SVM 롤업": "bg-indigo-100 text-indigo-800",
  "L2/멀티체인 인프라": "bg-indigo-100 text-indigo-800",
  인터체인: "bg-purple-100 text-purple-800",
  "인터체인/브릿지": "bg-purple-50 text-purple-700",
  모듈러: "bg-pink-100 text-pink-800",

  // 인프라/데이터
  "인프라/인덱싱": "bg-gray-100 text-gray-800",
  "인프라/컴퓨팅": "bg-gray-100 text-gray-800",
  "인프라/미디어": "bg-gray-100 text-gray-800",
  "인프라/스테이킹": "bg-indigo-50 text-indigo-700",
  "인프라/지갑·레저": "bg-gray-50 text-gray-700",
  "분산 컴퓨팅/DePIN": "bg-gray-100 text-gray-800",
  "인프라/노드": "bg-gray-50 text-gray-700",
  "인프라/분산컴퓨팅": "bg-slate-100 text-slate-800",

  // 스토리지
  스토리지: "bg-green-100 text-green-800",
  "스토리지/파일공유": "bg-green-100 text-green-800",

  // 오라클/데이터
  오라클: "bg-orange-100 text-orange-800",
  "AI/데이터": "bg-fuchsia-100 text-fuchsia-800",
  "AI·에이전트 생태": "bg-fuchsia-50 text-fuchsia-700",
  "IoT/데이터": "bg-cyan-50 text-cyan-700",
  "데이터 마켓/브라우저": "bg-gray-50 text-gray-700",
  "게이밍 DID/데이터": "bg-red-50 text-red-700",
  "콘텐츠/지식플랫폼": "bg-emerald-50 text-emerald-700",

  // DeFi 프로토콜
  "DEX/AMM": "bg-emerald-100 text-emerald-800",
  "DEX/애그리게이션": "bg-emerald-100 text-emerald-800",
  "DEX/프로토콜": "bg-emerald-100 text-emerald-800",
  "DEX/MEV": "bg-emerald-50 text-emerald-700",
  "DEX/런치패드": "bg-emerald-50 text-emerald-700",
  "AMM/유동성": "bg-emerald-50 text-emerald-700",
  렌딩: "bg-teal-100 text-teal-800",
  "파생/Perp": "bg-cyan-100 text-cyan-800",
  수익토큰화: "bg-sky-100 text-sky-800",
  "디파이/유동성": "bg-teal-50 text-teal-700",

  // 스테이킹/LST
  스테이킹: "bg-violet-100 text-violet-800",
  "스테이킹/LST": "bg-violet-100 text-violet-800",
  "LSD/LST 디파이": "bg-violet-50 text-violet-700",
  "LRT/리스티킹": "bg-violet-100 text-violet-800",

  // 스테이블코인/RWA
  스테이블코인: "bg-slate-100 text-slate-800",
  RWA: "bg-stone-100 text-stone-800",
  "RWA/스테이블": "bg-stone-100 text-stone-800",
  "RWA/유동성 인프라": "bg-stone-100 text-stone-800",
  "RWA/디파이": "bg-stone-100 text-stone-800",

  // 결제/송금
  "결제/송금": "bg-amber-100 text-amber-800",
  "결제/인보이스": "bg-yellow-50 text-yellow-700",
  "위치 오라클/결제": "bg-orange-50 text-orange-700",
  "결제 담보 토큰": "bg-amber-50 text-amber-700",
  "결제/라이선스": "bg-amber-50 text-amber-700",

  // GameFi/NFT
  "GameFi/메타버스": "bg-red-100 text-red-800",
  "GameFi/NFT": "bg-rose-100 text-rose-800",
  "GameFi/L1": "bg-red-100 text-red-800",
  "GameFi/MMO": "bg-red-100 text-red-800",
  GameFi: "bg-red-100 text-red-800",
  "NFT 마켓플레이스": "bg-rose-100 text-rose-800",
  "게이밍 길드": "bg-red-50 text-red-700",
  "게임 퍼블리싱": "bg-red-50 text-red-700",
  "M2E/피트니스": "bg-green-50 text-green-700",
  M2E: "bg-green-50 text-green-700",

  // 소셜/아이덴티티
  "소셜/아이덴티티": "bg-lime-100 text-lime-800",
  소셜: "bg-lime-50 text-lime-700",
  "콘텐츠 플랫폼/소셜": "bg-lime-50 text-lime-700",
  "음악 스트리밍/콘텐츠": "bg-purple-50 text-purple-700",
  "에듀테크/콘텐츠": "bg-green-50 text-green-700",
  "교육·소셜·게이미피케이션": "bg-lime-50 text-lime-700",

  // 밈/커뮤니티
  "밈/커뮤니티": "bg-yellow-50 text-yellow-700",
  "밈·커뮤니티": "bg-yellow-50 text-yellow-700",
  "밈/콘텐츠": "bg-yellow-50 text-yellow-700",

  // 한국 프로젝트
  "한국/L1": "bg-red-50 text-red-700",
  "한국/콘텐츠": "bg-red-50 text-red-700",
  "한국/공급망": "bg-red-50 text-red-700",
  "한국/DID": "bg-red-50 text-red-700",
  "한국/게임": "bg-red-50 text-red-700",
  "한국/모빌리티": "bg-red-50 text-red-700",
  "한국/L2": "bg-red-50 text-red-700",

  // 프라이버시/보안
  프라이버시: "bg-neutral-100 text-neutral-800",
  "보안/토큰화": "bg-neutral-50 text-neutral-700",
  "보안/인증": "bg-neutral-50 text-neutral-700",
  "금고/멀티시그": "bg-slate-50 text-slate-700",

  // 거버넌스/DAO
  "거버넌스/투표": "bg-lime-50 text-lime-700",
  "DAO 툴링/거버넌스": "bg-lime-50 text-lime-700",
  "DAO/멀티시그·DeFi": "bg-lime-50 text-lime-700",

  // 기타 특수 섹터
  "물류/공급망": "bg-orange-50 text-orange-700",
  "에너지/거래": "bg-green-50 text-green-700",
  "광고/브라우저": "bg-orange-50 text-orange-700",
  "스포츠/팬토큰": "bg-green-50 text-green-700",
  "L1 유틸리티": "bg-blue-50 text-blue-700",
  "L1/인터체인": "bg-purple-50 text-purple-700",
  "SVM 인프라·앱": "bg-indigo-50 text-indigo-700",
  "롤업 인프라/애그리게이션": "bg-indigo-50 text-indigo-700",
  "DePIN/머신 경제": "bg-gray-50 text-gray-700",
  "메타버스·커머스": "bg-red-50 text-red-700",
  솔레이어: "bg-indigo-50 text-indigo-700",
  "오덜리 네트워크": "bg-emerald-50 text-emerald-700",

  // Cosmos 생태계
  "Cosmos/DEX": "bg-purple-50 text-purple-700",
  "Cosmos/스마트컨트랙트": "bg-purple-50 text-purple-700",
  "Cosmos/EVM": "bg-purple-50 text-purple-700",
  "Cosmos/프라이버시": "bg-purple-50 text-purple-700",
  "Cosmos/스테이블": "bg-purple-50 text-purple-700",
  "Cosmos/신세틱": "bg-purple-50 text-purple-700",
  "Cosmos/렌딩": "bg-purple-50 text-purple-700",

  // 지갑/유틸리티
  "월렛/디파이 허브": "bg-cyan-50 text-cyan-700",
  "월렛/보안 유틸리티": "bg-slate-50 text-slate-700",
  "DID/지갑": "bg-lime-50 text-lime-700",

  // 기타 (기본값)
  기타: "bg-gray-100 text-gray-600",

  // 새로운 섹터들
  "RWA/증권토큰": "bg-stone-100 text-stone-800",
  "인프라/ZK": "bg-gray-100 text-gray-800",
  "인프라/롤업": "bg-indigo-50 text-indigo-700",
  "인프라/데이터": "bg-gray-100 text-gray-800",
  "DeFi/비트코인": "bg-orange-100 text-orange-800",
  "DeFi/파생상품": "bg-cyan-100 text-cyan-800",
  "DeFi/수익최적화": "bg-teal-50 text-teal-700",
  "IP/콘텐츠": "bg-purple-50 text-purple-700",
  "GameFi/플랫폼": "bg-red-100 text-red-800",
  "GameFi/퍼블리싱": "bg-red-100 text-red-800",
  "L2/비트코인": "bg-orange-100 text-orange-800",
  "L1/게임특화": "bg-red-100 text-red-800",
  "L1/멀티체인": "bg-purple-100 text-purple-800",
  "L1/사이드체인": "bg-blue-50 text-blue-700",
  "롤업 인프라/RaaS": "bg-indigo-100 text-indigo-800",
  "데이터/분석": "bg-gray-100 text-gray-800",
  "소셜/커뮤니티": "bg-lime-100 text-lime-800",
  "DID/헬스케어": "bg-green-50 text-green-700",
  "콘텐츠/지식공유": "bg-emerald-50 text-emerald-700",
  "콘텐츠/스포츠": "bg-emerald-50 text-emerald-700",
  "리워드/커머스": "bg-yellow-50 text-yellow-700",
  "커머스/결제": "bg-amber-100 text-amber-800",
  "결제/상거래": "bg-amber-100 text-amber-800",
  "DePIN/머신경제": "bg-gray-100 text-gray-800",

  // 새로 추가된 섹터들
  "DePIN/GPU": "bg-gray-100 text-gray-800",
  "보안/인프라": "bg-slate-100 text-slate-800",
  "스토리지/인프라": "bg-green-100 text-green-800",
  "DeFi/유동성스테이킹": "bg-violet-100 text-violet-800",
  "DID/신원증명": "bg-lime-50 text-lime-700",
  "DeFi/대출": "bg-teal-100 text-teal-800",
  "AI/콘텐츠생성": "bg-fuchsia-100 text-fuchsia-800",

  // 추가 섹터 색상들
  "L2/특화": "bg-indigo-50 text-indigo-700",
  "콘텐츠/플랫폼": "bg-emerald-50 text-emerald-700",
};
