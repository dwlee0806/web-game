import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보 처리방침 | 검 강화 시뮬레이터',
  description: '검 강화 시뮬레이터 개인정보 처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">개인정보 처리방침</h1>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. 수집하는 개인정보</h2>
            <p>
              본 서비스는 별도의 회원가입이 없으며, 서버에 개인정보를 수집하거나
              저장하지 않습니다. 게임 데이터는 사용자의 브라우저(localStorage)에만
              저장됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. 쿠키 및 광고</h2>
            <p>
              본 서비스는 Google AdSense를 통한 광고를 게재할 수 있습니다. Google
              AdSense는 사용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할
              수 있습니다. 쿠키 사용에 대한 자세한 내용은{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-indigo-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google 광고 정책
              </a>
              을 참고하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. 데이터 저장</h2>
            <p>
              게임 진행 데이터(레벨, 골드, 업적 등)는 사용자의 브라우저
              localStorage에 저장됩니다. 브라우저 데이터를 삭제하면 게임 데이터도
              함께 삭제됩니다. 서버에는 어떠한 사용자 데이터도 전송되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. 제3자 서비스</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Google AdSense (광고 게재)</li>
              <li>Cloudflare (호스팅 및 CDN)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. 문의</h2>
            <p>개인정보 관련 문의사항은 사이트 관리자에게 연락해 주세요.</p>
          </section>

          <p className="text-gray-500 text-xs pt-4">
            최종 수정일: 2026년 3월 30일
          </p>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
            ← 게임으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
