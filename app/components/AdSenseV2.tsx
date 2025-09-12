"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  adKey?: string; // 고유 식별자
}

function AdSenseComponent({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
  adKey = "default",
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 이미 로드되었거나 에러가 발생한 경우 스킵
    if (isLoaded || hasError) return;

    // 광고 요소가 존재하지 않으면 대기
    if (!adRef.current) return;

    // 이미 광고가 로드된 요소인지 확인
    if (adRef.current.getAttribute("data-adsbygoogle-status")) {
      setIsLoaded(true);
      return;
    }

    // AdSense 스크립트가 로드될 때까지 대기
    const checkAdSense = () => {
      // @ts-ignore
      if (typeof window !== "undefined" && window.adsbygoogle) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        } catch (err) {
          console.error(`AdSense error for ${adKey}:`, err);
          setHasError(true);
        }
      } else {
        // AdSense 스크립트가 아직 로드되지 않은 경우 재시도
        setTimeout(checkAdSense, 100);
      }
    };

    // 짧은 지연 후 광고 로드 (중복 방지)
    const timer = setTimeout(checkAdSense, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [adKey, isLoaded, hasError]);

  // 개발 모드에서 광고 대신 표시할 플레이스홀더
  if (process.env.NODE_ENV === "development" && !isLoaded && !hasError) {
    return (
      <div
        className={`${className} border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm`}
        style={style}
      >
        광고 영역 ({adKey})
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3000971739024587"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        key={`adsense-${adKey}-${adSlot}`}
      ></ins>
    </div>
  );
}

// 동적 import로 클라이언트 사이드에서만 렌더링
export const AdSense = dynamic(() => Promise.resolve(AdSenseComponent), {
  ssr: false,
  loading: () => (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
      style={{ height: "90px", minHeight: "90px" }}
    >
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        광고 로딩 중...
      </div>
    </div>
  ),
});

// 사전 정의된 광고 슬롯들
export function HeaderAd() {
  return (
    <AdSense
      adSlot="9663590188"
      adFormat="horizontal"
      className="mb-4"
      adKey="header"
      style={{
        display: "block",
        height: "90px",
        maxWidth: "728px",
        margin: "0 auto",
      }}
    />
  );
}

export function SidebarAd() {
  return (
    <div className="flex justify-center">
      <AdSense
        adSlot="2688496950"
        adFormat="auto"
        className="my-4 max-w-full"
        adKey="sidebar"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

export function FooterAd() {
  return (
    <AdSense
      adSlot="9663590188"
      adFormat="horizontal"
      className="mt-8 mb-4"
      adKey="footer"
      style={{
        display: "block",
        width: "100%", // 추가: 컨테이너 너비를 부모 폭만큼 채움
        maxWidth: "728px",
        height: "90px",
        margin: "0 auto",
      }}
    />
  );
}

// 반응형 광고 (모든 위치에 사용 가능)
export function ResponsiveAd({ adSlot }: { adSlot: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      className="my-4"
      adKey={`responsive-${adSlot}`}
    />
  );
}
