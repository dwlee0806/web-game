'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'cookie-consent'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setShow(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 bg-gray-900/95 backdrop-blur border-t border-gray-800/60">
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
        <p className="text-xs text-gray-400 text-center sm:text-left flex-1">
          이 사이트는 광고 제공 및 서비스 개선을 위해 쿠키를 사용합니다.
          계속 이용하시면 쿠키 사용에 동의하는 것으로 간주됩니다.{' '}
          <Link href="/privacy" className="text-indigo-400 hover:underline">
            자세히 보기
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-all active:scale-95"
        >
          동의
        </button>
      </div>
    </div>
  )
}
