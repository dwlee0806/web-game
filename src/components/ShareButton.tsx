'use client'

import { useCallback, useState } from 'react'
import type { GameState } from '@/lib/gameLogic'
import { getLevelTier } from '@/lib/gameLogic'
import { generateResultCard } from '@/lib/resultCard'

export default function ShareButton({ state }: { state: GameState }) {
  const [generating, setGenerating] = useState(false)

  const handleShareText = useCallback(async () => {
    const tier = getLevelTier(state.level)
    const successRate = state.totalAttempts > 0
      ? Math.round((state.totalSuccess / state.totalAttempts) * 100)
      : 0

    const text = [
      `⚔️ 검 강화 시뮬레이터`,
      ``,
      `🗡️ +${state.level} (${tier.name})`,
      `🏆 최고: +${state.highestLevel}`,
      `📊 ${state.totalAttempts}회 시도 | 성공률 ${successRate}%`,
      `💀 파괴 ${state.totalDestroy}회`,
      ``,
      `나도 도전 👇`,
      `https://forgd.io`,
    ].join('\n')

    if (navigator.share) {
      try { await navigator.share({ title: '검 강화 시뮬레이터', text }); return } catch { /* */ }
    }
    try { await navigator.clipboard.writeText(text); alert('클립보드에 복사됨!') } catch { /* */ }
  }, [state])

  const handleShareImage = useCallback(async () => {
    setGenerating(true)
    try {
      const blob = await generateResultCard(state)
      const file = new File([blob], 'enhance-result.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '검 강화 시뮬레이터' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'enhance-result.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('[ShareButton] Card generation failed:', err)
      alert('카드 생성에 실패했습니다. 다시 시도해 주세요.')
    }
    setGenerating(false)
  }, [state])

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShareText}
        className="flex-1 py-3 rounded-xl bg-indigo-600/70 hover:bg-indigo-500/70 text-sm font-medium transition-all active:scale-[0.98]"
      >
        📤 텍스트 공유
      </button>
      <button
        onClick={handleShareImage}
        disabled={generating}
        className="flex-1 py-3 rounded-xl bg-violet-600/70 hover:bg-violet-500/70 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {generating ? '생성중…' : '🖼️ 카드 저장'}
      </button>
    </div>
  )
}
