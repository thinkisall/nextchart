import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.damoabom.com'
  const currentDate = new Date().toISOString()
  const buildDate = new Date().toUTCString()
  
  // XML 특수문자 이스케이프 함수
  const escapeXml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  // 주요 섹터들 (빌드 시점에 고정된 값 사용)
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
  
  // 섹터 아이템들 생성
  const sectorItems = mainSectors
    .map((sector) => {
      const encodedSector = encodeURIComponent(sector)
      const escapedSector = escapeXml(sector)
      
      return `    <item>
      <title>${escapedSector} 섹터 암호화폐 시세</title>
      <description>${escapedSector} 섹터에 속한 암호화폐들의 실시간 시세 및 분석 정보</description>
      <link>${baseUrl}/sector/${encodedSector}</link>
      <guid isPermaLink="true">${baseUrl}/sector/${encodedSector}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>${escapedSector}</category>
      <content:encoded><![CDATA[
        <h2>${escapedSector} 섹터 분석</h2>
        <p>${escapedSector} 섹터에 속한 암호화폐들의 상세 정보:</p>
        <ul>
          <li>섹터별 코인 목록 및 시가총액</li>
          <li>실시간 가격 변동 추이</li>
          <li>섹터 전체 성과 분석</li>
          <li>주요 코인들의 기술적 지표</li>
        </ul>
        <p>투자 결정에 도움이 되는 전문적인 섹터 분석을 제공합니다.</p>
      ]]></content:encoded>
    </item>`
    }).join('\n')
  
  // RSS 피드 XML 생성
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>다모아봄 - 실시간 암호화폐 차트</title>
    <description>실시간 암호화폐 시세, 섹터 분석 및 트레이딩 정보를 제공하는 전문 플랫폼</description>
    <link>${baseUrl}</link>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>contact@damoabom.com (다모아봄)</managingEditor>
    <webMaster>contact@damoabom.com (다모아봄)</webMaster>
    <category>투자/금융</category>
    <category>암호화폐</category>
    <category>블록체인</category>
    <generator>Next.js RSS Generator</generator>
    <copyright>Copyright 2024 다모아봄. All rights reserved.</copyright>
    
    <item>
      <title>실시간 암호화폐 시세 대시보드</title>
      <description>빗썸 API를 활용한 실시간 암호화폐 가격 정보 및 섹터별 분석</description>
      <link>${baseUrl}</link>
      <guid isPermaLink="true">${baseUrl}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>대시보드</category>
      <content:encoded><![CDATA[
        <h2>실시간 암호화폐 시세</h2>
        <p>다모아봄에서 제공하는 실시간 암호화폐 시세 정보:</p>
        <ul>
          <li>빗썸 API 기반 실시간 가격 업데이트</li>
          <li>섹터별 암호화폐 분류 및 분석</li>
          <li>24시간 변동률 및 거래량 정보</li>
          <li>즐겨찾기 및 가격 알림 기능</li>
          <li>CSV 데이터 다운로드</li>
        </ul>
        <p>전문 트레이더를 위한 고급 기능과 직관적인 사용자 인터페이스를 제공합니다.</p>
      ]]></content:encoded>
    </item>
    
${sectorItems}
    
    <item>
      <title>암호화폐 섹터 분석 도구</title>
      <description>전문적인 암호화폐 섹터 분석 및 비교 도구</description>
      <link>${baseUrl}#sector-analysis</link>
      <guid isPermaLink="false">sector-analysis-${Date.now()}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>분석도구</category>
      <content:encoded><![CDATA[
        <h2>고급 섹터 분석 기능</h2>
        <p>다모아봄의 섹터 분석 도구를 활용하여:</p>
        <ul>
          <li>섹터별 성과 비교 분석</li>
          <li>시가총액 기준 섹터 순위</li>
          <li>24시간/주간/월간 성과 추이</li>
          <li>섹터별 주요 종목 식별</li>
          <li>투자 포트폴리오 다양화 가이드</li>
        </ul>
      ]]></content:encoded>
    </item>
    
    <item>
      <title>실시간 가격 알림 서비스</title>
      <description>설정한 가격대에 도달 시 즉시 알림을 받을 수 있는 서비스</description>
      <link>${baseUrl}#price-alerts</link>
      <guid isPermaLink="false">price-alerts-${Date.now()}</guid>
      <pubDate>${buildDate}</pubDate>
      <category>알림서비스</category>
      <content:encoded><![CDATA[
        <h2>스마트 가격 알림</h2>
        <p>놓치고 싶지 않은 투자 기회를 위한 알림 서비스:</p>
        <ul>
          <li>목표가 도달 시 즉시 알림</li>
          <li>손절가 알림 설정</li>
          <li>급등/급락 알림</li>
          <li>섹터별 알림 설정</li>
          <li>다중 알림 조건 설정</li>
        </ul>
      ]]></content:encoded>
    </item>
    
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}