import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import CookieConsent from '@/components/CookieConsent'
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
    'MMORPG 강화',
    '강화 확률',
  ],
  openGraph: {
    title: '검 강화 시뮬레이터',
    description: '매일 출석체크하고 검을 강화하세요! 성공? 파괴? 당신의 운을 시험하세요.',
    type: 'website',
    url: 'https://web-game-6cy.pages.dev',
  },
  metadataBase: new URL('https://web-game-6cy.pages.dev'),
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="google-adsense-account" content="ca-pub-3866845628289831" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RJSRHLX57D" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-RJSRHLX57D')` }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3866845628289831"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '검 강화 시뮬레이터',
              description: '매일 출석체크로 골드를 모으고 검을 강화하는 무료 웹 게임',
              applicationCategory: 'GameApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
              inLanguage: 'ko',
            }),
          }}
        />
      </head>
      <body className="bg-gray-950 antialiased">
        {children}
        <CookieConsent />
        <footer className="bg-gray-950 border-t border-gray-800/40 py-4 text-center text-xs text-gray-600">
          <div className="flex justify-center gap-4">
            <Link href="/" className="hover:text-gray-400 transition-colors">홈</Link>
            <Link href="/arena" className="hover:text-gray-400 transition-colors">전장</Link>
            <Link href="/pvp" className="hover:text-gray-400 transition-colors">PvP</Link>
            <Link href="/guide" className="hover:text-gray-400 transition-colors">확률표</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">소개</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">개인정보처리방침</Link>
          </div>
          <p className="mt-2">© 2026 검 강화 시뮬레이터</p>
        </footer>
      </body>
    </html>
  )
}
