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
    url: 'https://forgd.io',
  },
  metadataBase: new URL('https://forgd.io'),
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
        {/* Premium fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
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
        <footer className="relative bg-[#06080F] border-t border-white/[0.04] py-6">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px]">
              {[
                { href: '/', label: '홈' },
                { href: '/arena', label: '던전' },
                { href: '/pvp', label: 'PvP' },
                { href: '/notices', label: '공지' },
                { href: '/guide', label: '확률표' },
                { href: '/about', label: '소개' },
                { href: '/privacy', label: '개인정보' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-white/30 hover:text-white/70 transition-colors duration-300">{l.label}</Link>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] text-white/20 tracking-wider">© 2026 FORGD.IO — Sword Enhancement Simulator</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
