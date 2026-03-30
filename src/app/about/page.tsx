import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '소개 | 검 강화 시뮬레이터',
  description: '검 강화 시뮬레이터 소개 페이지. 매일 출석체크하고 검을 강화하는 무료 웹 게임.',
}

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">⚔️ 검 강화 시뮬레이터</h1>

        <section className="space-y-4 text-gray-300 text-sm leading-relaxed">
          <p>
            검 강화 시뮬레이터는 한국 MMORPG의 강화 시스템을 웹에서 간편하게
            체험할 수 있는 무료 브라우저 게임입니다.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">게임 방법</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>매일 출석체크로 골드를 획득하세요 (연속 출석 시 보너스!)</li>
            <li>골드를 사용해 검을 강화하세요 (+0 ~ +30)</li>
            <li>레벨이 올라갈수록 성공 확률이 낮아지고, 파괴 확률이 올라갑니다</li>
            <li>상점에서 보호 주문서와 축복 주문서를 구매할 수 있습니다</li>
            <li>다양한 업적을 달성하고 보상을 받으세요</li>
          </ul>

          <h2 className="text-lg font-bold text-white pt-4">등급 시스템</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-400">+0 일반</span>
            <span className="text-blue-400">+1~4 고급</span>
            <span className="text-purple-400">+5~9 희귀</span>
            <span className="text-yellow-400">+10~14 영웅</span>
            <span className="text-orange-400">+15~19 전설</span>
            <span className="text-red-400">+20~24 신화</span>
            <span className="text-pink-400">+25~29 초월</span>
            <span className="text-amber-300">+30 태초</span>
          </div>

          <h2 className="text-lg font-bold text-white pt-4">특징</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>회원가입 불필요 — 브라우저에 데이터 자동 저장</li>
            <li>완전 무료 — 과금 요소 없음</li>
            <li>모바일/PC 모두 지원</li>
            <li>자동 강화 모드 지원</li>
          </ul>
        </section>

        <div className="mt-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
            ← 게임으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
