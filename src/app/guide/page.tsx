import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '강화 확률표 & 공략 | 검 강화 시뮬레이터',
  description:
    '검 강화 시뮬레이터 레벨별 성공/유지/파괴 확률, 강화 비용, 등급 시스템, 팁 총정리. 효율적인 강화 전략을 알아보세요.',
  keywords: [
    '강화 확률',
    '강화 시뮬레이터 확률표',
    '강화 비용',
    '강화 공략',
    '강화 팁',
  ],
}

const RATES = [
  { range: '+0 ~ +2', success: 95, maintain: 5, destroy: 0, cost: 50, tier: '일반→고급' },
  { range: '+3 ~ +4', success: 85, maintain: 15, destroy: 0, cost: 100, tier: '고급' },
  { range: '+5 ~ +6', success: 70, maintain: 20, destroy: 10, cost: 300, tier: '고급→희귀' },
  { range: '+7 ~ +9', success: 55, maintain: 25, destroy: 20, cost: 600, tier: '희귀' },
  { range: '+10 ~ +12', success: 40, maintain: 30, destroy: 30, cost: 1500, tier: '영웅' },
  { range: '+13 ~ +15', success: 25, maintain: 30, destroy: 45, cost: 3000, tier: '영웅→전설' },
  { range: '+16 ~ +19', success: 15, maintain: 25, destroy: 60, cost: 8000, tier: '전설' },
  { range: '+20 ~ +24', success: 7, maintain: 18, destroy: 75, cost: 20000, tier: '신화' },
  { range: '+25 ~ +29', success: 3, maintain: 12, destroy: 85, cost: 50000, tier: '초월' },
]

export default function GuidePage() {
  return (
    <div className="min-h-dvh bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">📊 강화 확률표 & 공략</h1>
        <p className="text-gray-400 text-sm mb-8">
          레벨별 성공/유지/파괴 확률과 비용을 한눈에 확인하세요.
        </p>

        {/* Rates table */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-3 px-2 text-left">레벨</th>
                <th className="py-3 px-2 text-center text-emerald-400">성공</th>
                <th className="py-3 px-2 text-center text-blue-400">유지</th>
                <th className="py-3 px-2 text-center text-red-400">파괴</th>
                <th className="py-3 px-2 text-right text-yellow-400">비용</th>
                <th className="py-3 px-2 text-right">등급</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(r => (
                <tr key={r.range} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="py-2.5 px-2 font-medium">{r.range}</td>
                  <td className="py-2.5 px-2 text-center text-emerald-400">{r.success}%</td>
                  <td className="py-2.5 px-2 text-center text-blue-400">{r.maintain}%</td>
                  <td className="py-2.5 px-2 text-center text-red-400">{r.destroy}%</td>
                  <td className="py-2.5 px-2 text-right text-yellow-400">{r.cost.toLocaleString()}G</td>
                  <td className="py-2.5 px-2 text-right text-gray-400">{r.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold">💡 강화 팁</h2>

          <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/40 space-y-3 text-sm text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-1">1. 저레벨에서는 그냥 강화</h3>
              <p>+0~+4는 파괴 확률이 0%입니다. 보호/축복 주문서를 아끼세요.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">2. +10 이상부터 보호 주문서 추천</h3>
              <p>파괴 확률이 30%를 넘기 시작합니다. 보호 주문서로 레벨을 지키세요.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">3. 축복 주문서는 고레벨에서 효과적</h3>
              <p>성공률 +10% 보너스는 기본 확률이 낮을수록 체감이 큽니다.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">4. 자동 강화 활용</h3>
              <p>저레벨 구간(+0~+6)은 자동 강화로 빠르게 올리세요.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">5. 출석체크 필수</h3>
              <p>연속 출석 보너스가 쌓이면 하루 최대 2,000G까지 받을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">6. 일일 미션 확인</h3>
              <p>매일 3개 미션을 완료하면 추가 골드를 받을 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* Item info */}
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold">🏪 상점 아이템</h2>
          <div className="grid gap-3">
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/40">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🛡️</span>
                <span className="font-bold">파괴방지 주문서</span>
                <span className="text-yellow-400 text-sm ml-auto">800G</span>
              </div>
              <p className="text-sm text-gray-400">파괴 판정 시 레벨이 유지됩니다. +10 이상에서 사용을 권장합니다.</p>
            </div>
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/40">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">✨</span>
                <span className="font-bold">축복 주문서</span>
                <span className="text-yellow-400 text-sm ml-auto">500G</span>
              </div>
              <p className="text-sm text-gray-400">강화 성공 확률이 10% 증가합니다. 고레벨 강화에서 효과적입니다.</p>
            </div>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link href="/" className="inline-block bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 rounded-xl font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all">
            🔥 지금 강화하러 가기
          </Link>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← 게임으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
