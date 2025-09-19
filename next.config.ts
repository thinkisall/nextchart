import type { NextConfig } from "next";

// 번들 분석기
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // 압축 및 기본 설정
  compress: true, // gzip 압축
  poweredByHeader: false, // X-Powered-By 헤더 제거
  
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
          // API 응답 캐싱 개선 (Fast Origin Transfer 절약)
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300', // 60초 캐시, 5분 stale
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

  // 이미지 최적화 완전 비활성화 (Fast Origin Transfer 비용 절약)
  images: {
    unoptimized: true, // 이미지 최적화 완전 비활성화
    minimumCacheTTL: 2678400, // 31일 캐시 (최대한 길게)
  },

  // 성능 최적화
  experimental: {
    optimizeCss: false, // CSS 최적화 비활성화 (빌드 에러 방지)
  },
  
  // 서버 외부 패키지 최적화
  serverExternalPackages: [],

  // 웹팩 최적화
  webpack: (config, { dev, isServer }) => {
    // 프로덕션 환경에서만 최적화 적용
    if (!dev) {
      // 번들 크기 줄이기
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);