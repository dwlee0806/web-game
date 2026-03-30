'use client'

import { useState, useEffect, useCallback } from 'react'
import HeroAvatar from './HeroAvatar'

export type GuideStep = 'enhance_intro' | 'gold_empty' | 'dungeon_intro' | null

interface HeroGuideProps {
  step: GuideStep
  onDismiss: () => void
  targetRef?: string // CSS selector for highlight target
}

const GUIDE_TEXT: Record<string, { message: string; expression: 'normal' | 'happy' | 'excited' | 'wink' }> = {
  enhance_intro: { message: '검을 강화해보세요! 🔥\n버튼을 눌러 강화에 도전!', expression: 'excited' },
  gold_empty: { message: '골드가 다 떨어졌어요!\n던전에서 골드를 벌어볼까요? 💰', expression: 'wink' },
  dungeon_intro: { message: '던전에서 몬스터를 잡으면\n골드를 얻을 수 있어요! ⚔️', expression: 'happy' },
}

export default function HeroGuide({ step, onDismiss }: HeroGuideProps) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (step) {
      setLeaving(false)
      const t = setTimeout(() => setVisible(true), 300)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [step])

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => {
      setVisible(false)
      onDismiss()
    }, 400)
  }, [onDismiss])

  if (!step || !visible) return null

  const guide = GUIDE_TEXT[step]
  if (!guide) return null

  return (
    <>
      {/* Pulse highlight overlay for target */}
      {step === 'enhance_intro' && (
        <div className="absolute inset-x-0 bottom-[30%] flex justify-center pointer-events-none z-30">
          <div className="w-[90%] max-w-sm h-14 rounded-xl animate-guide-pulse" style={{ boxShadow: '0 0 0 3px #FFD700, 0 0 20px #FFD70060' }} />
        </div>
      )}
      {step === 'gold_empty' && (
        <div className="absolute inset-x-0 bottom-[8%] flex justify-center pointer-events-none z-30">
          <div className="w-[90%] max-w-sm h-14 rounded-xl animate-guide-pulse" style={{ boxShadow: '0 0 0 3px #EF4444, 0 0 20px #EF444460' }} />
        </div>
      )}

      {/* Hero guide bubble */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[55] max-w-xs w-full px-4 ${leaving ? 'animate-guide-exit' : 'animate-guide-enter'}`}
        onClick={dismiss}
      >
        <div className="flex items-end gap-3">
          {/* Hero character */}
          <div className="shrink-0 animate-hero-bounce">
            <HeroAvatar size={52} expression={guide.expression} />
          </div>

          {/* Speech bubble */}
          <div className="flex-1 relative">
            {/* Bubble tail */}
            <div className="absolute -left-2 bottom-3 w-0 h-0" style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '8px solid rgba(30,41,59,0.95)' }} />
            <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-600/40 rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-sm text-white whitespace-pre-line leading-relaxed">{guide.message}</p>
              <p className="text-[9px] text-slate-500 mt-1.5">터치하여 닫기</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
