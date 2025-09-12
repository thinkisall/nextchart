"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // 이미 로드된 경우 중복 방지
    if (isLoaded.current) return;

    // 광고 요소가 존재하는지 확인
    if (!adRef.current) return;

    // 이미 광고가 로드된 요소인지 확인
    if (adRef.current.getAttribute("data-adsbygoogle-status")) {
      return;
    }

    try {
      // 광고 로드
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // 컴포넌트 언마운트 시 상태 리셋
  useEffect(() => {
    return () => {
      isLoaded.current = false;
    };
  }, []);

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
      ></ins>
    </div>
  );
}

// 사전 정의된 광고 슬롯들
export function HeaderAd() {
  return (
    <div key="header-ad">
      <AdSense
        adSlot="9663590188"
        adFormat="horizontal"
        className="mb-4"
        style={{
          display: "block",
          height: "90px",
          maxWidth: "728px",
          margin: "0 auto",
          maxHeight: "390px",
        }}
      />
    </div>
  );
}

export function SidebarAd() {
  return (
    <div key="sidebar-ad">
      <AdSense
        adSlot="3057847482"
        adFormat="auto"
        className="my-4"
        style={{
          display: "block",
          width: "300px",
          height: "250px",
        }}
      />
    </div>
  );
}

export function FooterAd() {
  return (
    <div key="footer-ad">
      <AdSense
        adSlot="9180402707"
        adFormat="horizontal"
        className="mt-8 mb-4"
        style={{
          display: "block",
          height: "90px",
          maxWidth: "728px",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

// 반응형 광고 (모든 위치에 사용 가능)
export function ResponsiveAd({ adSlot }: { adSlot: string }) {
  return <AdSense adSlot={adSlot} adFormat="auto" className="my-4" />;
}
