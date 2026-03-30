import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "어디갈까? | 주변 놀거리/먹거리 추천",
  description:
    "현재 위치 기반으로 주변 맛집, 카페, 놀거리, 관광지를 추천해드립니다.",
  openGraph: {
    title: "어디갈까?",
    description: "주변 놀거리/먹거리를 한눈에! 지금 어디갈지 고민될 때.",
    siteName: "어디갈까?",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)] antialiased">
        {children}
      </body>
    </html>
  );
}
