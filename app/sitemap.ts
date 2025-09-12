import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.damoabom.com'
  const currentDate = new Date()
  
  // 기본 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rss`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.3,
    },
  ]
  
  // 주요 섹터 페이지들 (빌드 시점에 고정된 값 사용)
  const mainSectors = [
    'L1/스마트컨트랙트',
    'L2/옵티미스틱롤업',
    'DEX/AMM',
    'DeFi/렌딩',
    'GameFi/메타버스',
    'AI/데이터',
    '스테이블코인',
    '밈/커뮤니티'
  ]
  
  const sectorPages: MetadataRoute.Sitemap = mainSectors
    .map((sector) => ({
      url: `${baseUrl}/sector/${encodeURIComponent(sector)}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))
  
  // 추가 유용한 URL들 (향후 확장용)
  const additionalPages: MetadataRoute.Sitemap = [
    // API 문서 (공개되는 경우)
    // {
    //   url: `${baseUrl}/api-docs`,
    //   lastModified: currentDate,
    //   changeFrequency: 'weekly',
    //   priority: 0.5,
    // },
    // 이용약관 등 (추가되는 경우)
    // {
    //   url: `${baseUrl}/terms`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.3,
    // },
  ]
  
  return [
    ...staticPages,
    ...sectorPages,
    ...additionalPages,
  ]
}