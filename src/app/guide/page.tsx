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
  { range: '+0 ~ +2', success: 95, maintain: 5, down: 0, destroy: 0, cost: 50, tier: '일반' },
  { range: '+3 ~ +4', success: 80, maintain: 15, down: 5, destroy: 0, cost: 150, tier: '고급' },
  { range: '+5 ~ +6', success: 65, maintain: 18, down: 10, destroy: 7, cost: 400, tier: '희귀' },
  { range: '+7 ~ +8', success: 50, maintain: 20, down: 15, destroy: 15, cost: 1000, tier: '영웅' },
  { range: '+9 ~ +10', success: 35, maintain: 20, down: 20, destroy: 25, cost: 2500, tier: '전설' },
  { range: '+11 ~ +12', success: 20, maintain: 18, down: 22, destroy: 40, cost: 6000, tier: '신화' },
  { range: '+13 ~ +14', success: 10, maintain: 15, down: 25, destroy: 50, cost: 15000, tier: '초월' },
  { range: '+15 ~ +16', success: 5, maintain: 10, down: 15, destroy: 70, cost: 40000, tier: '태초' },
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
                <th className="py-3 px-2 text-center text-orange-400">하락</th>
                <th className="py-3 px-2 text-center text-red-400">파괴</th>
                <th className="py-3 px-2 text-right text-yellow-400">비용</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map(r => (
                <tr key={r.range} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                  <td className="py-2.5 px-2 font-medium">{r.range}</td>
                  <td className="py-2.5 px-2 text-center text-emerald-400">{r.success}%</td>
                  <td className="py-2.5 px-2 text-center text-blue-400">{r.maintain}%</td>
                  <td className="py-2.5 px-2 text-center text-orange-400">{r.down}%</td>
                  <td className="py-2.5 px-2 text-center text-red-400">{r.destroy}%</td>
                  <td className="py-2.5 px-2 text-right text-yellow-400">{r.cost.toLocaleString()}G</td>
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
              <h3 className="font-bold text-white mb-1">4. 페일스택 활용</h3>
              <p>실패할 때마다 페일스택이 +1 쌓이고, 스택당 성공률 +0.5% (최대 +30%). 성공하면 리셋됩니다. 일부러 저레벨에서 스택을 쌓은 뒤 고레벨에서 강화하는 전략도 있습니다.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">5. 자동 강화 활용</h3>
              <p>저레벨 구간(+0~+6)은 자동 강화로 빠르게 올리세요.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">6. 출석체크 필수</h3>
              <p>연속 출석 보너스가 쌓이면 하루 최대 2,000G까지 받을 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">7. 일일 미션 확인</h3>
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

        {/* Prestige */}
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold">⭐ 환생 (프레스티지)</h2>
          <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/40 text-sm text-gray-300 space-y-2">
            <p>+10 이상 달성 시 상점에서 <strong className="text-purple-400">환생</strong>할 수 있습니다.</p>
            <p>환생하면 레벨과 무기가 초기화되지만, 영구 보너스를 획득합니다.</p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>5레벨당 프레스티지 포인트 1개</li>
              <li>포인트당 성공률 +0.5% (최대 +50%)</li>
              <li>포인트당 골드 배율 +0.1x (최대 5x)</li>
              <li>오프라인 골드 수익도 프레스티지에 비례</li>
            </ul>
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
