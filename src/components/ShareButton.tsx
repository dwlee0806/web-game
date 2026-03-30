'use client'

import { useCallback } from 'react'
import type { GameState } from '@/lib/gameLogic'
import { getLevelTier } from '@/lib/gameLogic'

export default function ShareButton({ state }: { state: GameState }) {
  const handleShare = useCallback(async () => {
    const tier = getLevelTier(state.level)
    const successRate = state.totalAttempts > 0
      ? Math.round((state.totalSuccess / state.totalAttempts) * 100)
      : 0

    const text = [
      `⚔️ 검 강화 시뮬레이터 결과`,
      ``,
      `🗡️ 현재: +${state.level} (${tier.name})`,
      `🏆 최고: +${state.highestLevel}`,
      `📊 ${state.totalAttempts}번 시도 | 성공률 ${successRate}%`,
      `💀 파괴 ${state.totalDestroy}회`,
      ``,
      `나도 도전하기 👇`,
      `https://web-game-6cy.pages.dev`,
    ].join('\n')

    if (navigator.share) {
      try {
        await navigator.share({ title: '검 강화 시뮬레이터', text })
        return
      } catch { /* user cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(text)
      alert('결과가 클립보드에 복사되었습니다!')
    } catch {
      prompt('아래 텍스트를 복사해주세요:', text)
    }
  }, [state])

  return (
    <button
      onClick={handleShare}
      className="w-full py-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-sm font-medium transition-all active:scale-[0.98]"
    >
      📤 내 기록 공유하기
    </button>
  )
}
