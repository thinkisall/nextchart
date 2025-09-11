import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PWAInstaller } from "./components/PWAInstaller";
import { StructuredData } from "./components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "다모아봄 - 실시간 암호화폐 차트",
  description: "빗썸 API를 활용한 실시간 암호화폐 시세 및 섹터 분석 서비스. 한국 투자자를 위한 전문 트레이딩 대시보드.",
  keywords: "암호화폐, 비트코인, 이더리움, 빗썸, 실시간 시세, 트레이딩, 대시보드, 다모아봄",
  authors: [{ name: "다모아봄" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "다모아봄",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "다모아봄",
    title: "다모아봄 - 실시간 암호화폐 차트",
    description: "실시간 암호화폐 가격, 차트, 섹터 분석을 제공하는 암호화폐 투자 도구",
    url: "https://www.damoabom.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "다모아봄 암호화폐 차트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "다모아봄 - 실시간 암호화폐 차트",
    description: "실시간 암호화폐 가격, 차트, 섹터 분석을 제공하는 암호화폐 투자 도구",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#1f2937",
      },
    ],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Search Console 인증 */}
        <meta name="google-site-verification" content="-FZw_8bxUpyUpVyhH0AKVeIM6UemTMyJ3JL6NTtVuuM" />
        
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="다모아봄 RSS Feed"
          href="/rss"
        />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3000971739024587"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StructuredData />
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
