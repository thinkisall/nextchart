"use client";
import { useState, useEffect } from "react";
import { RouletteWheel } from "./RouletteWheel";
import { CoinResult } from "./CoinResult";

// 바이낸스 및 바이낸스 알파 코인 목록 (샘플)
const BINANCE_COINS = [
  { symbol: "1INCH", name: "1인치", isAlpha: true, color: "#277DA1" },
  { symbol: "A", name: "에이", isAlpha: true, color: "#FFD166" },
  { symbol: "AAVE", name: "에이브", isAlpha: true, color: "#F9C74F" },
  { symbol: "ACE", name: "에이스", isAlpha: true, color: "#D81159" },
  { symbol: "ACH", name: "알케미페이", isAlpha: true, color: "#F3722C" },
  { symbol: "ACX", name: "어크로스프로토콜", isAlpha: true, color: "#F0B8B8" },
  { symbol: "ADA", name: "에이다", isAlpha: true, color: "#F0B8B8" },
  { symbol: "AGLD", name: "어드벤처골드", isAlpha: true, color: "#00BBF9" },
  { symbol: "ALGO", name: "알고랜드", isAlpha: true, color: "#577590" },
  { symbol: "ALICE", name: "앨리스", isAlpha: true, color: "#F8A055" },
  { symbol: "ALT", name: "알트레이어", isAlpha: true, color: "#4ECDC4" },
  { symbol: "AMP", name: "앰프", isAlpha: true, color: "#81B29A" },
  { symbol: "ANIME", name: "애니미", isAlpha: true, color: "#81B29A" },
  { symbol: "ANKR", name: "앵커", isAlpha: true, color: "#F7B801" },
  { symbol: "APE", name: "에이프코인", isAlpha: true, color: "#06D6A0" },
  { symbol: "API3", name: "에이피아이쓰리", isAlpha: true, color: "#F0B8B8" },
  { symbol: "APT", name: "앱토스", isAlpha: true, color: "#F8A055" },
  { symbol: "AR", name: "알위브", isAlpha: true, color: "#F3722C" },
  { symbol: "ARB", name: "아비트럼", isAlpha: true, color: "#FED766" },
  { symbol: "ARDR", name: "아더", isAlpha: true, color: "#00BBF9" },
  { symbol: "ARK", name: "아크", isAlpha: true, color: "#90BE6D" },
  { symbol: "ARKM", name: "아캄", isAlpha: true, color: "#90BE6D" },
  { symbol: "ARPA", name: "알파체인", isAlpha: true, color: "#FF6B6B" },
  { symbol: "ASTR", name: "아스타", isAlpha: true, color: "#F8A055" },
  { symbol: "ATOM", name: "코스모스", isAlpha: true, color: "#577590" },
  { symbol: "AUCTION", name: "옥션", isAlpha: true, color: "#00F5D4" },
  { symbol: "AUDIO", name: "오디우스", isAlpha: true, color: "#F15BB5" },
  { symbol: "AVAX", name: "아발란체", isAlpha: true, color: "#A8E6CF" },
  { symbol: "AWE", name: "어위", isAlpha: true, color: "#43AA8B" },
  { symbol: "AXS", name: "엑시인피니티", isAlpha: true, color: "#43AA8B" },
  { symbol: "BABY", name: "베이비", isAlpha: true, color: "#81B29A" },
  { symbol: "BAT", name: "베이직어텐션토큰", isAlpha: true, color: "#73D2DE" },
  { symbol: "BB", name: "바운스빗", isAlpha: true, color: "#F8961E" },
  { symbol: "BCH", name: "비트코인캐시", isAlpha: true, color: "#218380" },
  { symbol: "BEL", name: "벨라프로토콜", isAlpha: true, color: "#F7B801" },
  { symbol: "BERA", name: "베라", isAlpha: true, color: "#45B7D1" },
  { symbol: "BICO", name: "바이코노미", isAlpha: true, color: "#81B29A" },
  { symbol: "BIGTIME", name: "빅타임", isAlpha: true, color: "#EF476F" },
  { symbol: "BIO", name: "바이오", isAlpha: true, color: "#577590" },
  { symbol: "BLUR", name: "블러", isAlpha: true, color: "#9B5DE5" },
  { symbol: "BMT", name: "비엠티", isAlpha: true, color: "#F8A055" },
  { symbol: "BNB", name: "비앤비", isAlpha: true, color: "#FFD166" },
  { symbol: "BNT", name: "뱅코르", isAlpha: true, color: "#F9C74F" },
  { symbol: "BONK", name: "봉크", isAlpha: true, color: "#8F2D56" },
  { symbol: "BTC", name: "비트코인", isAlpha: true, color: "#577590" },
  { symbol: "C", name: "씨", isAlpha: true, color: "#F7B801" },
  { symbol: "C98", name: "코인98", isAlpha: true, color: "#45B7D1" },
  { symbol: "CAKE", name: "팬케이크스왑", isAlpha: true, color: "#00BBF9" },
  { symbol: "CELO", name: "셀로", isAlpha: true, color: "#00BBF9" },
  { symbol: "CELR", name: "셀러네트워크", isAlpha: true, color: "#3D405B" },
  { symbol: "CFX", name: "콘플럭스", isAlpha: true, color: "#073B4C" },
  { symbol: "CHR", name: "크로미아", isAlpha: true, color: "#4ECDC4" },
  { symbol: "CHZ", name: "칠리즈", isAlpha: true, color: "#A8E6CF" },
  { symbol: "CKB", name: "너보스네트워크", isAlpha: true, color: "#F8961E" },
  { symbol: "COMP", name: "컴파운드", isAlpha: true, color: "#073B4C" },
  { symbol: "COOKIE", name: "쿠키", isAlpha: true, color: "#F3722C" },
  { symbol: "COS", name: "콘텐츠오스", isAlpha: true, color: "#F2CC8F" },
  { symbol: "COTI", name: "코티", isAlpha: true, color: "#FFD166" },
  { symbol: "COW", name: "카우", isAlpha: true, color: "#FF6B6B" },
  { symbol: "CRV", name: "커브", isAlpha: true, color: "#9B5DE5" },
  { symbol: "CTK", name: "써틱", isAlpha: true, color: "#218380" },
  { symbol: "CTSI", name: "카르테시", isAlpha: true, color: "#FEE440" },
  { symbol: "CVC", name: "시빅", isAlpha: true, color: "#73D2DE" },
  { symbol: "CYBER", name: "사이버", isAlpha: true, color: "#43AA8B" },
  { symbol: "D", name: "디", isAlpha: true, color: "#00BBF9" },
  { symbol: "DOGE", name: "도지코인", isAlpha: true, color: "#8F2D56" },
  { symbol: "DOT", name: "폴카닷", isAlpha: true, color: "#577590" },
  { symbol: "DYDX", name: "디와이디엑스", isAlpha: true, color: "#73D2DE" },
  { symbol: "EDU", name: "이디유", isAlpha: true, color: "#9B5DE5" },
  { symbol: "EGLD", name: "멀티버스엑스", isAlpha: true, color: "#73D2DE" },
  { symbol: "EIGEN", name: "아이겐", isAlpha: true, color: "#EF476F" },
  { symbol: "ENA", name: "에테나", isAlpha: true, color: "#FEE440" },
  { symbol: "ENJ", name: "엔진코인", isAlpha: true, color: "#45B7D1" },
  {
    symbol: "ENS",
    name: "이더리움네임서비스",
    isAlpha: true,
    color: "#00F5D4",
  },
  { symbol: "ERA", name: "에라", isAlpha: true, color: "#F94144" },
  { symbol: "ETC", name: "이더리움클래식", isAlpha: true, color: "#00F5D4" },
  { symbol: "ETH", name: "이더리움", isAlpha: true, color: "#E07A5F" },
  { symbol: "ETHFI", name: "이더파이", isAlpha: true, color: "#D81159" },
  { symbol: "FET", name: "페치", isAlpha: true, color: "#73D2DE" },
  { symbol: "FIDA", name: "보니다", isAlpha: true, color: "#218380" },
  { symbol: "FIL", name: "파일코인", isAlpha: true, color: "#218380" },
  { symbol: "FLOKI", name: "플로키", isAlpha: true, color: "#EF476F" },
  { symbol: "FLOW", name: "플로우", isAlpha: true, color: "#EF476F" },
  { symbol: "FLUX", name: "플럭스", isAlpha: true, color: "#06D6A0" },
  { symbol: "FXS", name: "프랙스셰어", isAlpha: true, color: "#00B2A9" },
  { symbol: "G", name: "지", isAlpha: true, color: "#90BE6D" },
  { symbol: "GALA", name: "갈라", isAlpha: true, color: "#F15BB5" },
  { symbol: "GAS", name: "가스", isAlpha: true, color: "#FEE440" },
  { symbol: "GLM", name: "골렘", isAlpha: true, color: "#118AB2" },
  { symbol: "GMT", name: "스테픈", isAlpha: true, color: "#277DA1" },
  { symbol: "GMX", name: "지엠엑스", isAlpha: true, color: "#073B4C" },
  { symbol: "GNO", name: "노시스", isAlpha: true, color: "#118AB2" },
  { symbol: "GRT", name: "더그래프", isAlpha: true, color: "#F8A055" },
  { symbol: "GTC", name: "깃코인", isAlpha: true, color: "#06D6A0" },
  { symbol: "HAEDAL", name: "해달", isAlpha: true, color: "#218380" },
  { symbol: "HBAR", name: "헤데라", isAlpha: true, color: "#90BE6D" },
  { symbol: "HFT", name: "해시플로우", isAlpha: true, color: "#81B29A" },
  { symbol: "HIGH", name: "하이블록", isAlpha: true, color: "#F7B801" },
  { symbol: "HIVE", name: "하이브", isAlpha: true, color: "#9B5DE5" },
  { symbol: "HOME", name: "홈", isAlpha: true, color: "#F3722C" },
  { symbol: "HOOK", name: "훅트프로토콜", isAlpha: true, color: "#FED766" },
  { symbol: "HUMA", name: "휴마", isAlpha: true, color: "#118AB2" },
  { symbol: "HYPER", name: "하이퍼", isAlpha: true, color: "#FFD166" },
  { symbol: "ICP", name: "인터넷컴퓨터", isAlpha: true, color: "#45B7D1" },
  { symbol: "ICX", name: "아이콘", isAlpha: true, color: "#F94144" },
  { symbol: "ID", name: "아이디", isAlpha: true, color: "#3D405B" },
  { symbol: "ILV", name: "일루비움", isAlpha: true, color: "#90BE6D" },
  { symbol: "IMX", name: "이뮤터블엑스", isAlpha: true, color: "#577590" },
  { symbol: "INIT", name: "이니셔티브", isAlpha: true, color: "#9B5DE5" },
  { symbol: "INJ", name: "인젝티브", isAlpha: true, color: "#00BBF9" },
  { symbol: "IO", name: "아이오", isAlpha: true, color: "#4ECDC4" },
  { symbol: "IOST", name: "이오스트", isAlpha: true, color: "#9B5DE5" },
  { symbol: "IOTA", name: "아이오타", isAlpha: true, color: "#FEE440" },
  { symbol: "IOTX", name: "아이오텍스", isAlpha: true, color: "#FEE440" },
  { symbol: "IQ", name: "아이큐", isAlpha: true, color: "#F94144" },
  { symbol: "JASMY", name: "재스미코인", isAlpha: true, color: "#06D6A0" },
  { symbol: "JOE", name: "조", isAlpha: true, color: "#F0B8B8" },
  { symbol: "JST", name: "저스트", isAlpha: true, color: "#4ECDC4" },
  { symbol: "JTO", name: "지토", isAlpha: true, color: "#F8A055" },
  { symbol: "JUP", name: "주피터", isAlpha: true, color: "#43AA8B" },
  { symbol: "KAIA", name: "카이아", isAlpha: true, color: "#F8A055" },
  { symbol: "KAITO", name: "카이토", isAlpha: true, color: "#73D2DE" },
  { symbol: "KAVA", name: "카바", isAlpha: true, color: "#90BE6D" },
  { symbol: "KERNEL", name: "커널", isAlpha: true, color: "#F8A055" },
  { symbol: "KNC", name: "카이버네트워크", isAlpha: true, color: "#F2CC8F" },
  { symbol: "KSM", name: "쿠사마", isAlpha: true, color: "#D81159" },
  { symbol: "LA", name: "엘에이", isAlpha: true, color: "#118AB2" },
  { symbol: "LAYER", name: "레이어", isAlpha: true, color: "#00BBF9" },
  { symbol: "LDO", name: "라이도", isAlpha: true, color: "#8F2D56" },
  { symbol: "LINEA", name: "리네아", isAlpha: true, color: "#D81159" },
  { symbol: "LINK", name: "체인링크", isAlpha: true, color: "#E07A5F" },
  { symbol: "LISTA", name: "리스타", isAlpha: true, color: "#FFD166" },
  { symbol: "LPT", name: "라이브피어", isAlpha: true, color: "#FED766" },
  { symbol: "LRC", name: "루프링", isAlpha: true, color: "#3D405B" },
  { symbol: "LSK", name: "리스크", isAlpha: true, color: "#43AA8B" },
  { symbol: "MAGIC", name: "매직", isAlpha: true, color: "#277DA1" },
  { symbol: "MANA", name: "디센트럴랜드", isAlpha: true, color: "#073B4C" },
  { symbol: "MANTA", name: "만타", isAlpha: true, color: "#F0B8B8" },
  { symbol: "MASK", name: "마스크네트워크", isAlpha: true, color: "#90BE6D" },
  { symbol: "MAV", name: "매버릭프로토콜", isAlpha: true, color: "#06D6A0" },
  { symbol: "MBL", name: "무비블록", isAlpha: true, color: "#E07A5F" },
  { symbol: "ME", name: "미", isAlpha: true, color: "#F15BB5" },
  { symbol: "METIS", name: "메티스", isAlpha: true, color: "#00BBF9" },
  { symbol: "MINA", name: "미나", isAlpha: true, color: "#90BE6D" },
  { symbol: "MOVE", name: "무브", isAlpha: true, color: "#00F5D4" },
  { symbol: "MTL", name: "메탈", isAlpha: true, color: "#4ECDC4" },
  { symbol: "NEAR", name: "니어프로토콜", isAlpha: true, color: "#81B29A" },
  { symbol: "NEIRO", name: "네이로", isAlpha: true, color: "#00BBF9" },
  { symbol: "NEO", name: "네오", isAlpha: true, color: "#277DA1" },
  { symbol: "NEWT", name: "뉴트", isAlpha: true, color: "#45B7D1" },
  { symbol: "NIL", name: "닐", isAlpha: true, color: "#00F5D4" },
  { symbol: "NMR", name: "뉴메레르", isAlpha: true, color: "#A8E6CF" },
  { symbol: "NXPC", name: "엔엑스피씨", isAlpha: true, color: "#F7B801" },
  { symbol: "OGN", name: "오리진프로토콜", isAlpha: true, color: "#F94144" },
  { symbol: "OM", name: "옴", isAlpha: true, color: "#FFD166" },
  { symbol: "OMNI", name: "옴니", isAlpha: true, color: "#81B29A" },
  { symbol: "ONDO", name: "온도", isAlpha: true, color: "#9B5DE5" },
  { symbol: "ONG", name: "온톨로지가스", isAlpha: true, color: "#F8961E" },
  { symbol: "ONT", name: "온톨로지", isAlpha: true, color: "#FF6B6B" },
  { symbol: "OP", name: "옵티미즘", isAlpha: true, color: "#FF6B6B" },
  { symbol: "OPEN", name: "오픈", isAlpha: true, color: "#FFC4D6" },
  { symbol: "ORCA", name: "오르카", isAlpha: true, color: "#E07A5F" },
  { symbol: "OSMO", name: "오스모시스", isAlpha: true, color: "#FFD166" },
  { symbol: "OXT", name: "오키드", isAlpha: true, color: "#F94144" },
  { symbol: "PARTI", name: "파티", isAlpha: true, color: "#FEE440" },
  { symbol: "PONKE", name: "퐁케", isAlpha: true, color: "#43AA8B" },
  { symbol: "PAXG", name: "팍스골드", isAlpha: true, color: "#073B4C" },
  { symbol: "PENDLE", name: "펜들", isAlpha: true, color: "#277DA1" },
  { symbol: "PENGU", name: "펭구", isAlpha: true, color: "#4ECDC4" },
  { symbol: "PEPE", name: "페페", isAlpha: true, color: "#F0B8B8" },
  { symbol: "PLUME", name: "플룸", isAlpha: true, color: "#00BBF9" },
  { symbol: "POL", name: "폴", isAlpha: true, color: "#D81159" },
  { symbol: "POLYX", name: "폴리매쉬", isAlpha: true, color: "#073B4C" },
  { symbol: "POWR", name: "파워렛저", isAlpha: true, color: "#577590" },
  { symbol: "PROVE", name: "프루브", isAlpha: true, color: "#EF476F" },
  { symbol: "PUMP", name: "펌프", isAlpha: true, color: "#00B2A9" },
  { symbol: "PUNDIX", name: "펀디엑스", isAlpha: true, color: "#4ECDC4" },
  { symbol: "PYR", name: "피라", isAlpha: true, color: "#FED766" },
  { symbol: "PYTH", name: "파이쓰네트워크", isAlpha: true, color: "#118AB2" },
  { symbol: "QKC", name: "쿼크체인", isAlpha: true, color: "#F9C74F" },
  { symbol: "QTUM", name: "퀀텀", isAlpha: true, color: "#FED766" },
  { symbol: "RAD", name: "래디클", isAlpha: true, color: "#8F2D56" },
  { symbol: "RAY", name: "레이디움", isAlpha: true, color: "#4ECDC4" },
  { symbol: "RED", name: "레드", isAlpha: true, color: "#FFC4D6" },
  { symbol: "REI", name: "레이", isAlpha: true, color: "#073B4C" },
  { symbol: "RENDER", name: "렌더토큰", isAlpha: true, color: "#81B29A" },
  { symbol: "REQ", name: "리퀘스트", isAlpha: true, color: "#F8961E" },
  { symbol: "RESOLV", name: "리졸브", isAlpha: true, color: "#4ECDC4" },
  { symbol: "REZ", name: "렌조", isAlpha: true, color: "#F9C74F" },
  { symbol: "RLC", name: "아이젝", isAlpha: true, color: "#F7B801" },
  { symbol: "RPL", name: "로켓풀", isAlpha: true, color: "#E07A5F" },
  { symbol: "RSR", name: "리저브라이트", isAlpha: true, color: "#F7B801" },
  { symbol: "RVN", name: "레이븐코인", isAlpha: true, color: "#FED766" },
  { symbol: "S", name: "에스", isAlpha: true, color: "#8F2D56" },
  { symbol: "SAHARA", name: "사하라", isAlpha: true, color: "#073B4C" },
  { symbol: "SAND", name: "더샌드박스", isAlpha: true, color: "#FED766" },
  { symbol: "SC", name: "시아코인", isAlpha: true, color: "#F7B801" },
  { symbol: "SCR", name: "에스씨알", isAlpha: true, color: "#FFC4D6" },
  { symbol: "SEI", name: "세이", isAlpha: true, color: "#FEE440" },
  { symbol: "SFP", name: "세이프팔", isAlpha: true, color: "#81B29A" },
  { symbol: "SHELL", name: "쉘", isAlpha: true, color: "#4ECDC4" },
  { symbol: "SHIB", name: "시바이누", isAlpha: true, color: "#43AA8B" },
  { symbol: "SIGN", name: "사인", isAlpha: true, color: "#00F5D4" },
  { symbol: "SKL", name: "스케일네트워크", isAlpha: true, color: "#F8A055" },
  { symbol: "SLF", name: "에스엘에프", isAlpha: true, color: "#EF476F" },
  { symbol: "SNX", name: "신세틱스", isAlpha: true, color: "#9B5DE5" },
  { symbol: "SOL", name: "솔라나", isAlpha: true, color: "#FEE440" },
  { symbol: "SOLV", name: "솔브", isAlpha: true, color: "#F15BB5" },
  { symbol: "SOPH", name: "소프", isAlpha: true, color: "#277DA1" },
  { symbol: "SPK", name: "에스피케이", isAlpha: true, color: "#F0B8B8" },
  { symbol: "STEEM", name: "스팀", isAlpha: true, color: "#EF476F" },
  {
    symbol: "STG",
    name: "스타게이트파이낸스",
    isAlpha: true,
    color: "#F7B801",
  },
  { symbol: "STORJ", name: "스토리지", isAlpha: true, color: "#F0B8B8" },
  { symbol: "STRAX", name: "스트라티스", isAlpha: true, color: "#577590" },
  { symbol: "STRK", name: "스타크넷", isAlpha: true, color: "#FFD166" },
  { symbol: "STX", name: "스택스", isAlpha: true, color: "#F3722C" },
  { symbol: "SUI", name: "수이", isAlpha: true, color: "#F94144" },
  { symbol: "SUN", name: "썬", isAlpha: true, color: "#06D6A0" },
  { symbol: "SUSHI", name: "스시스왑", isAlpha: true, color: "#81B29A" },
  { symbol: "SXP", name: "스와이프", isAlpha: true, color: "#218380" },
  { symbol: "SXT", name: "에스엑스티", isAlpha: true, color: "#90BE6D" },
  { symbol: "SYRUP", name: "시럽", isAlpha: true, color: "#F15BB5" },
  { symbol: "T", name: "티", isAlpha: true, color: "#90BE6D" },
  { symbol: "TFUEL", name: "세타퓨엘", isAlpha: true, color: "#F8A055" },
  { symbol: "THE", name: "더", isAlpha: true, color: "#73D2DE" },
  { symbol: "THETA", name: "세타토큰", isAlpha: true, color: "#F94144" },
  { symbol: "TIA", name: "셀레스티아", isAlpha: true, color: "#43AA8B" },
  { symbol: "TON", name: "톤코인", isAlpha: true, color: "#73D2DE" },
  { symbol: "TOWNS", name: "타운즈", isAlpha: true, color: "#73D2DE" },
  { symbol: "TREE", name: "트리", isAlpha: true, color: "#8F2D56" },
  { symbol: "TRUMP", name: "트럼프", isAlpha: true, color: "#00BBF9" },
  { symbol: "TRX", name: "트론", isAlpha: true, color: "#00B2A9" },
  { symbol: "TURBO", name: "터보", isAlpha: true, color: "#218380" },
  { symbol: "UMA", name: "우마", isAlpha: true, color: "#F9C74F" },
  { symbol: "UNI", name: "유니스왑", isAlpha: true, color: "#E07A5F" },
  { symbol: "USD1", name: "유에스디원", isAlpha: true, color: "#577590" },
  { symbol: "USDC", name: "유에스디코인", isAlpha: true, color: "#81B29A" },
  { symbol: "USDT", name: "테더", isAlpha: true, color: "#43AA8B" },
  { symbol: "VANA", name: "바나", isAlpha: true, color: "#73D2DE" },
  { symbol: "VET", name: "비체인", isAlpha: true, color: "#073B4C" },
  { symbol: "VIRTUAL", name: "버추얼", isAlpha: true, color: "#FF6B6B" },
  { symbol: "VTHO", name: "비토르", isAlpha: true, color: "#F2CC8F" },
  { symbol: "W", name: "웜홀", isAlpha: true, color: "#00B2A9" },
  { symbol: "WAXP", name: "왁스", isAlpha: true, color: "#073B4C" },
  { symbol: "WCT", name: "더블유씨티", isAlpha: true, color: "#73D2DE" },
  { symbol: "WIF", name: "도그위햇", isAlpha: true, color: "#73D2DE" },
  { symbol: "WLD", name: "월드코인", isAlpha: true, color: "#E07A5F" },
  { symbol: "WLFI", name: "더블유엘에프아이", isAlpha: true, color: "#9B5DE5" },
  { symbol: "WOO", name: "우네트워크", isAlpha: true, color: "#FFD166" },
  { symbol: "XAI", name: "자이", isAlpha: true, color: "#73D2DE" },
  { symbol: "XEC", name: "이캐시", isAlpha: true, color: "#218380" },
  { symbol: "XLM", name: "스텔라루멘", isAlpha: true, color: "#9B5DE5" },
  { symbol: "XRP", name: "리플", isAlpha: true, color: "#218380" },
  { symbol: "XTZ", name: "테조스", isAlpha: true, color: "#06D6A0" },
  { symbol: "XVS", name: "비너스", isAlpha: true, color: "#F8961E" },
  { symbol: "YFI", name: "연파이낸스", isAlpha: true, color: "#73D2DE" },
  { symbol: "YGG", name: "일드길드게임즈", isAlpha: true, color: "#577590" },
  { symbol: "ZIL", name: "질리카", isAlpha: true, color: "#FFD166" },
  { symbol: "ZK", name: "지케이", isAlpha: true, color: "#277DA1" },
  { symbol: "ZRO", name: "지로", isAlpha: true, color: "#FED766" },
  { symbol: "ZRX", name: "제로엑스", isAlpha: true, color: "#E07A5F" },

  // 바이낸스 알파 코인들
  { symbol: "AERO", name: "에어로", isAlpha: true, color: "#FF6B6B" },
  { symbol: "ATH", name: "아테나", isAlpha: true, color: "#4ECDC4" },
  { symbol: "AVAIL", name: "어베일", isAlpha: true, color: "#45B7D1" },
  { symbol: "ai16z", name: "a16z", isAlpha: true, color: "#FED766" },
  { symbol: "AVL", name: "에이브이엘", isAlpha: true, color: "#F0B8B8" },
  { symbol: "B3", name: "비쓰리", isAlpha: true, color: "#00B2A9" },
  { symbol: "BLUE", name: "블루", isAlpha: true, color: "#F8A055" },
  { symbol: "CARV", name: "카브", isAlpha: true, color: "#A8E6CF" },
  { symbol: "DRIFT", name: "드리프트", isAlpha: true, color: "#3D405B" },
  { symbol: "EPT", name: "이피티", isAlpha: true, color: "#FFD166" },
  { symbol: "F", name: "에프", isAlpha: true, color: "#06D6A0" },
  { symbol: "FLOCK", name: "플록", isAlpha: true, color: "#118AB2" },
  { symbol: "G", name: "지", isAlpha: true, color: "#073B4C" },
  { symbol: "GOAT", name: "고트", isAlpha: true, color: "#EF476F" },
  { symbol: "GRASS", name: "그래스", isAlpha: true, color: "#FFC4D6" },
  { symbol: "H", name: "에이치", isAlpha: true, color: "#9B5DE5" },
  { symbol: "MEW", name: "뮤", isAlpha: true, color: "#F15BB5" },
  { symbol: "MOODENG", name: "무뎅", isAlpha: true, color: "#FEE440" },
  { symbol: "NFT", name: "엔에프티", isAlpha: true, color: "#00F5D4" },
  { symbol: "OBT", name: "오비티", isAlpha: true, color: "#00BBF9" },
  { symbol: "ORDER", name: "오더", isAlpha: true, color: "#F7B801" },
  { symbol: "PEFFUR", name: "페퍼", isAlpha: true, color: "#F3722C" },
  { symbol: "PEAQ", name: "피크", isAlpha: true, color: "#F94144" },
  { symbol: "PLUME", name: "플룸", isAlpha: true, color: "#F8961E" },
  { symbol: "POKT", name: "포켓", isAlpha: true, color: "#F9C74F" },
  { symbol: "PROMPT", name: "프롬프트", isAlpha: true, color: "#90BE6D" },
  { symbol: "PUMP", name: "펌프", isAlpha: true, color: "#43AA8B" },
  { symbol: "PUMPBTC", name: "펌프비티씨", isAlpha: true, color: "#577590" },
  { symbol: "RESOLV", name: "리졸브", isAlpha: true, color: "#277DA1" },
  { symbol: "SAFE", name: "세이프", isAlpha: true, color: "#D81159" },
  { symbol: "SD", name: "에스디", isAlpha: true, color: "#8F2D56" },
  { symbol: "SUNDOG", name: "선도그", isAlpha: true, color: "#218380" },
  { symbol: "TAIKO", name: "타이코", isAlpha: true, color: "#73D2DE" },
  { symbol: "TOWNS", name: "타운즈", isAlpha: true, color: "#E07A5F" },
  { symbol: "XTER", name: "엑스터", isAlpha: true, color: "#3D405B" },
  { symbol: "ZETA", name: "제타", isAlpha: true, color: "#81B29A" },
  { symbol: "ZRC", name: "지알씨", isAlpha: true, color: "#F2CC8F" },
];

export function CoinRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<(typeof BINANCE_COINS)[0] | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowResult(false);

    // 3초 후 결과 표시
    setTimeout(() => {
      const randomCoin =
        BINANCE_COINS[Math.floor(Math.random() * BINANCE_COINS.length)];
      setResult(randomCoin);
      setIsSpinning(false);

      // 결과 표시
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }, 3000);
  };

  const resetRoulette = () => {
    setResult(null);
    setShowResult(false);
    setIsSpinning(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 메인 룰렛 카드 */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/30 shadow-2xl overflow-hidden">
        {/* 카드 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">🎰 코인 룰렛</h2>
          <p className="text-purple-100">행운의 코인을 찾아보세요!</p>
        </div>

        {/* 룰렛 휠 영역 */}
        <div className="p-8">
          <RouletteWheel
            isSpinning={isSpinning}
            coins={BINANCE_COINS}
            result={result}
          />

          {/* 컨트롤 버튼들 */}
          <div className="flex justify-center space-x-4 mt-8">
            {!result ? (
              <button
                onClick={startRoulette}
                disabled={isSpinning}
                className={`
                  px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
                  ${
                    isSpinning
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  }
                `}
              >
                {isSpinning ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>돌리는 중...</span>
                  </div>
                ) : (
                  "🎯 룰렛 시작!"
                )}
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={startRoulette}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  🔄 다시 돌리기
                </button>
                <button
                  onClick={resetRoulette}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  🗑️ 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 표시 영역 */}
      {result && showResult && (
        <div className="mt-8">
          <CoinResult coin={result} />
        </div>
      )}

      {/* 설명 카드 */}
      <div className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
          <span className="mr-2">ℹ️</span>
          룰렛 이용 안내
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
              📍 대상 코인
            </h4>
            <ul className="space-y-1">
              <li>
                • 바이낸스 메인 코인 (
                {BINANCE_COINS.filter((c) => !c.isAlpha).length}개)
              </li>
              <li>
                • 바이낸스 알파 코인 (
                {BINANCE_COINS.filter((c) => c.isAlpha).length}개)
              </li>
              <li>• 총 {BINANCE_COINS.length}개 코인 중 랜덤 선택</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
              ⚠️ 주의사항
            </h4>
            <ul className="space-y-1">
              <li>• 이는 오락용 기능입니다</li>
              <li>• 투자 조언이 아닙니다</li>
              <li>• 자신의 판단으로 투자하세요</li>
              <li>• 손실에 대한 책임지지 않습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
