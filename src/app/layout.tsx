import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '검 강화 시뮬레이터 | 무료 웹 강화 게임',
  description:
    '매일 출석체크로 골드를 모으고, 검을 강화하세요! 성공, 유지, 파괴의 스릴을 느껴보세요. 무료 브라우저 강화 시뮬레이터.',
  keywords: [
    '강화 시뮬레이터',
    '검 강화',
    '웹 게임',
    '무료 게임',
    '강화 게임',
    '시간 때우기 게임',
  ],
  openGraph: {
    title: '검 강화 시뮬레이터',
    description: '매일 출석체크하고 검을 강화하세요!',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#030712',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-950 antialiased">{children}</body>
    </html>
  )
}
