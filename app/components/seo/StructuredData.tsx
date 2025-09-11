'use client';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "다모아봄",
    "description": "실시간 암호화폐 시세 및 섹터 분석 플랫폼",
    "url": "https://www.damoabom.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "creator": {
      "@type": "Organization",
      "name": "다모아봄",
      "url": "https://www.damoabom.com"
    },
    "featureList": [
      "실시간 암호화폐 시세",
      "섹터별 분석",
      "가격 알림",
      "CSV 데이터 다운로드",
      "즐겨찾기 관리"
    ],
    "screenshot": "https://www.damoabom.com/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    },
    "mainEntity": {
      "@type": "Dataset",
      "name": "암호화폐 시세 데이터",
      "description": "빗썸 API를 통한 실시간 암호화폐 가격 정보",
      "provider": {
        "@type": "Organization",
        "name": "빗썸",
        "url": "https://www.bithumb.com"
      },
      "distribution": [
        {
          "@type": "DataDownload",
          "encodingFormat": "CSV",
          "contentUrl": "https://www.damoabom.com/api/crypto"
        }
      ],
      "temporalCoverage": "2024-01-01/..",
      "spatialCoverage": {
        "@type": "Place",
        "name": "대한민국"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}