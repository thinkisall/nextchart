// 섹터별 색상 매핑 - 2024년 최신 분류 반영 (다크모드 호환)
export const SECTOR_COLORS: { [key: string]: string } = {
  // 통합 메인 섹터
  "L1 블록체인": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "L2/확장성": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "AI 생태계": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "DeFi": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "밈코인": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "GameFi": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "NFT": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "RWA/스테이블": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "결제/송금": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "인프라/데이터": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  "한국 프로젝트": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "인터체인": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "프라이버시": "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300",
  "소셜/DAO": "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",

  // L1 블록체인 세부
  "결제/기축": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "L1": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "L1/특화": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "L1/DeFi": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "L1/게임특화": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "L1/사이드체인": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "L1/인터체인": "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  "L1/비트코인 리스테이킹": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "L1 유틸리티": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  
  // L2 & 확장성 세부
  "L2": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "L2/ZK": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "L2/SVM 롤업": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "L2/멀티체인 인프라": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "L2/비트코인": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",

  // AI 생태계 세부
  "AI/데이터": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI·에이전트 생태": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI/INFRASTRUCTURE": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI/데이터 분석": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI/DePIN": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI/소셜 게이밍": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "AI/콘텐츠생성": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",

  // DeFi 세부
  "DEX/AMM": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DEX/애그리게이션": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DEX/프로토콜": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DEX/MEV": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  "DEX/런치패드": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  "AMM/유동성": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  "렌딩": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "파생/Perp": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "수익토큰화": "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "디파이/유동성": "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
  "DeFi/파생상품": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "DeFi/유동성": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  "DeFi/RWA": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DeFi/신용": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DeFi/자산 관리": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "DeFi/대출": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "DeFi/유동성스테이킹": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "DeFi/비트코인": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",

  // 스테이킹/LST & LRT
  "스테이킹/LST": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "LSD/LST 디파이": "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
  "LRT/리스티킹": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "스테이킹/LRT": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",

  // 스테이블코인 & RWA
  "스테이블코인": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "RWA/유동성 인프라": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "RWA/디파이": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "RWA/증권토큰": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",

  // 밈코인 세부
  "밈/커뮤니티": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "밈·커뮤니티": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "밈/콘텐츠": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",

  // GameFi 세부
  "GameFi/메타버스": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "GameFi/NFT": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "GameFi/L1": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "GameFi/MMO": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "GameFi/L3": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "GameFi/퍼블리싱": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "GameFi/플랫폼": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "게이밍 길드": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "NFT 마켓플레이스": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "NFT/마켓플레이스(매직에덴)": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "NFT/커뮤니티(PudgyPenguins)": "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
  "메타버스": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "메타버스/GameFi": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "메타버스·커머스": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "M2E/피트니스": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "M2E": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",

  // 결제 & 송금 세부
  "결제/인보이스": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  "위치 오라클/결제": "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "결제 담보 토큰": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "결제/라이선스": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "결제/신원인증": "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "결제/상거래": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",

  // 오라클/데이터
  "오라클": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "IoT/데이터": "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
  "데이터/분석": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  "데이터 마켓/브라우저": "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  "게이밍 DID/데이터": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",

  // 스토리지
  "스토리지": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "스토리지/파일공유": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "스토리지/인프라": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",

  // 한국 프로젝트 세부
  "한국/L1": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "한국/콘텐츠": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  "한국/공급망": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  "한국/DID": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  "한국/게임": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  "한국/모빌리티": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  "한국/L2": "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",

  // 인터체인/브릿지 세부
  "인터체인/브릿지": "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",

  // 프라이버시/보안 세부
  "프라이버시/DeFi": "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-300",
  "블록체인 보안": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "보안/인프라": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "보안/토큰화": "bg-neutral-50 text-neutral-700 dark:bg-neutral-900/20 dark:text-neutral-400",
  "보안/인증": "bg-neutral-50 text-neutral-700 dark:bg-neutral-900/20 dark:text-neutral-400",

  // 소셜 & DAO 세부
  "소셜/아이덴티티": "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  "소셜/커뮤니티": "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  "소셜/콘텐츠 수익화": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",
  "DAO/공공재 펀딩": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",
  "DAO/커뮤니티": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",
  "DAO 툴링/거버넌스": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",
  "DAO/멀티시그·DeFi": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",
  "DID/지갑": "bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400",

  // 새로 추가된 섹터들
  "L1/IP&AI": "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
  "L2/DID&생체인증": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "LST/비트코인": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "밈코인/런치패드": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",

  // 상위 20위 코인 새로운 섹터들 (2025)
  "NFT/콘텐츠": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "인프라/프라이버시": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300", 
  "스테이블코인 연관 자산": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "데이터/프라이버시": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  "클라우드 컴퓨팅": "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "의료": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "레이어1": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "보안": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "게임": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",

  // 기타 (기본값)
  "기타": "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
  "기타/테스트": "bg-gray-50 text-gray-500 dark:bg-gray-900/20 dark:text-gray-500",
};