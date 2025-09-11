// PWA 아이콘 생성 도구
// 사용법: node generate-icons.js

const fs = require('fs');
const path = require('path');

// 기본 SVG 아이콘 (간단한 차트 아이콘)
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- 배경 -->
  <rect width="512" height="512" fill="#1f2937" rx="80"/>
  
  <!-- 차트 바 -->
  <rect x="80" y="320" width="40" height="120" fill="#10b981" rx="4"/>
  <rect x="140" y="280" width="40" height="160" fill="#3b82f6" rx="4"/>
  <rect x="200" y="200" width="40" height="240" fill="#f59e0b" rx="4"/>
  <rect x="260" y="160" width="40" height="280" fill="#ef4444" rx="4"/>
  <rect x="320" y="120" width="40" height="320" fill="#8b5cf6" rx="4"/>
  <rect x="380" y="240" width="40" height="200" fill="#06b6d4" rx="4"/>
  
  <!-- 상승 화살표 -->
  <path d="M400 100 L440 140 L420 140 L420 180 L400 180 L400 140 L380 140 Z" fill="#10b981"/>
  
  <!-- 텍스트 -->
  <text x="256" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">₩</text>
</svg>
`;

// 아이콘 디렉토리 생성
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG 파일 저장
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), iconSvg);

console.log('✅ PWA 아이콘 SVG 생성 완료!');
console.log('📝 다음 단계:');
console.log('1. https://realfavicongenerator.net/ 또는');
console.log('2. https://www.pwabuilder.com/imageGenerator 에서');
console.log('3. 생성된 icon.svg를 업로드하여 모든 크기 생성');
console.log('4. 생성된 아이콘들을 /public/icons/ 폴더에 저장');

// 기본 파비콘도 생성 (간단한 버전)
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#1f2937" rx="6"/>
  <rect x="4" y="20" width="3" height="8" fill="#10b981"/>
  <rect x="8" y="18" width="3" height="10" fill="#3b82f6"/>
  <rect x="12" y="14" width="3" height="14" fill="#f59e0b"/>
  <rect x="16" y="12" width="3" height="16" fill="#ef4444"/>
  <rect x="20" y="10" width="3" height="18" fill="#8b5cf6"/>
  <rect x="24" y="16" width="3" height="12" fill="#06b6d4"/>
  <text x="16" y="8" font-family="Arial" font-size="6" font-weight="bold" text-anchor="middle" fill="white">₩</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);
console.log('✅ 파비콘 SVG도 생성 완료!');
