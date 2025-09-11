import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "실시간 암호화폐 시세 | 빗썸 API 트레이딩 대시보드",
  description: "빗썸 API를 활용한 실시간 암호화폐 시세 및 섹터 분석 서비스. 한국 투자자를 위한 전문 트레이딩 대시보드.",
  keywords: "암호화폐, 비트코인, 이더리움, 빗썸, 실시간 시세, 트레이딩, 대시보드",
  authors: [{ name: "Crypto Dashboard" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
