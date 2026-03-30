import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "어디갈까? | 주변 놀거리/먹거리 추천",
    template: "%s | 어디갈까?",
  },
  description:
    "현재 위치 기반으로 주변 맛집, 카페, 놀거리, 관광지를 추천해드립니다. 주말에 어디갈지 고민될 때, 어디갈까?",
  keywords: [
    "주변 맛집",
    "카페 추천",
    "놀거리",
    "관광지",
    "주변 추천",
    "주말 나들이",
    "데이트 코스",
    "어디갈까",
  ],
  authors: [{ name: "어디갈까?" }],
  creator: "어디갈까?",
  openGraph: {
    title: "어디갈까? | 주변 놀거리/먹거리 추천",
    description: "주변 놀거리/먹거리를 한눈에! 지금 어디갈지 고민될 때.",
    siteName: "어디갈까?",
    locale: "ko_KR",
    type: "website",
    url: "https://korea-playground.sjeff-dulee.workers.dev",
  },
  alternates: {
    canonical: "https://korea-playground.sjeff-dulee.workers.dev",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF9F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap" rel="stylesheet" />
        <meta name="google-adsense-account" content="ca-pub-3866845628289831" />
      </head>
      <body className="noise-bg min-h-full flex flex-col antialiased">
        {children}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3866845628289831"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
