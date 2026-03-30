'use client'

import { useState, useEffect, useCallback } from 'react'
import HeroAvatar from './HeroAvatar'

export type GuideStep = 'enhance_intro' | 'gold_empty' | 'dungeon_intro' | null

interface HeroGuideProps {
  step: GuideStep
  onDismiss: () => void
}

const GUIDE_TEXT: Record<string, { message: string; expression: 'normal' | 'happy' | 'excited' | 'wink' }> = {
  enhance_intro: { message: '검을 강화해보세요! 🔥\n아래 버튼을 눌러 강화에 도전!', expression: 'excited' },
  gold_empty: { message: '골드가 다 떨어졌어요!\n던전에서 골드를 벌어볼까요? 💰', expression: 'wink' },
  dungeon_intro: { message: '던전에서 몬스터를 잡으면\n골드를 얻을 수 있어요! ⚔️', expression: 'happy' },
}

// Spotlight cutout positions relative to viewport
// These are approximate — the actual buttons are in the middle of the screen
const SPOTLIGHT: Record<string, { top: string; height: string }> = {
  enhance_intro: { top: '58%', height: '52px' },
  gold_empty: { top: '78%', height: '48px' },
}

export default function HeroGuide({ step, onDismiss }: HeroGuideProps) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (step) {
      setLeaving(false)
      const t = setTimeout(() => setVisible(true), 400)
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

  const spot = SPOTLIGHT[step]

  return (
    <div className="fixed inset-0 z-[80]" onClick={dismiss}>
      {/* Dark overlay with spotlight cutout */}
      {spot && (
        <>
          {/* Top dark */}
          <div className="absolute top-0 left-0 right-0 bg-black/75" style={{ height: spot.top }} />
          {/* Bottom dark */}
          <div className="absolute left-0 right-0 bottom-0 bg-black/75" style={{ top: `calc(${spot.top} + ${spot.height})` }} />
          {/* Left dark of spotlight */}
          <div className="absolute bg-black/75" style={{ top: spot.top, height: spot.height, left: 0, width: 'calc(50% - 180px)' }} />
          {/* Right dark of spotlight */}
          <div className="absolute bg-black/75" style={{ top: spot.top, height: spot.height, right: 0, width: 'calc(50% - 180px)' }} />
          {/* Spotlight glow border */}
          <div className="absolute left-1/2 -translate-x-1/2 rounded-xl pointer-events-none" style={{
            top: spot.top,
            height: spot.height,
            width: '360px',
            maxWidth: '90vw',
            boxShadow: step === 'enhance_intro'
              ? '0 0 0 3px #FFD700, 0 0 30px #FFD70050, inset 0 0 20px #FFD70020'
              : '0 0 0 3px #EF4444, 0 0 30px #EF444450, inset 0 0 20px #EF444420',
            animation: 'guide-pulse 1.5s ease-in-out infinite',
          }} />
        </>
      )}

      {/* No spotlight = just dark overlay */}
      {!spot && <div className="absolute inset-0 bg-black/60" />}

      {/* Hero + speech bubble */}
      <div className={`absolute bottom-28 left-1/2 -translate-x-1/2 max-w-xs w-full px-4 ${leaving ? 'animate-guide-exit' : 'animate-guide-enter'}`}>
        <div className="flex items-end gap-3">
          {/* Hero bouncing */}
          <div className="shrink-0 animate-hero-bounce">
            <HeroAvatar size={56} expression={guide.expression} />
          </div>

          {/* Speech bubble */}
          <div className="flex-1 relative">
            <div className="absolute -left-2 bottom-4 w-0 h-0" style={{ borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '9px solid rgba(30,41,59,0.97)' }} />
            <div className="bg-slate-800/97 backdrop-blur-xl border border-slate-600/50 rounded-2xl px-4 py-3.5 shadow-2xl shadow-black/40">
              <p className="text-sm text-white whitespace-pre-line leading-relaxed font-medium">{guide.message}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[9px] text-slate-500">터치하여 닫기</p>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
