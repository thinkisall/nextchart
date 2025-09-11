import { MetadataRoute } from 'next'
import { CRYPTO_SECTORS } from './lib/crypto'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.damoabom.com'
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
  
  // 섹터 페이지들 동적 생성
  const sectorPages: MetadataRoute.Sitemap = Array.from(new Set(Object.values(CRYPTO_SECTORS)))
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