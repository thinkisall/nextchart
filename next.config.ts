import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 압축 활성화
  compress: true,
  
  // PWA 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          // API 응답 캐싱 (암호화폐 데이터는 자주 변경되므로 짧게)
          {
            key: 'Cache-Control',
            value: 'public, max-age=30', // 30초 캐시
          },
        ],
      },
      // 정적 자산 강력한 캐싱 - 안전한 패턴 사용
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1년 캐시
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 24시간 캐시
          },
        ],
      },
      // PWA 관련 헤더
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 24시간 캐시
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // 이미지 최적화 활성화
  images: {
    formats: ['image/webp', 'image/avif'], // 최신 압축 포맷 사용
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐시
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // 반응형 크기
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 아이콘 크기
  },

  // JavaScript 번들 압축 (Next.js 15에서는 기본 활성화)
  
  // 실험적 기능 비활성화 (빌드 에러 방지)
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;