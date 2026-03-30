'use client'

import { useState } from 'react'

const STEPS = [
  { icon: '⚔️', title: '검 강화 시뮬레이터', desc: '매일 출석체크하고 검을 강화하는 게임입니다.\n+30 태초의 검을 만들어보세요!' },
  { icon: '📅', title: '출석체크', desc: '매일 골드를 받을 수 있어요.\n연속 출석할수록 보너스가 커집니다.' },
  { icon: '🔥', title: '강화하기', desc: '골드를 써서 검을 강화하세요.\n레벨이 높을수록 파괴 위험이 커집니다.' },
  { icon: '🛡️', title: '주문서 활용', desc: '상점에서 보호/축복 주문서를 구매하세요.\n파괴를 막거나 확률을 올릴 수 있어요.' },
  { icon: '🏆', title: '업적 & 미션', desc: '업적을 달성하고 일일 미션을 완료하면\n추가 골드를 받을 수 있습니다.' },
]

interface TutorialProps {
  onComplete: () => void
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-6 max-w-sm w-full text-center space-y-4 animate-result-in">
        <div className="text-5xl">{s.icon}</div>
        <h2 className="text-xl font-black text-white">{s.title}</h2>
        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{s.desc}</p>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-indigo-400 w-5' : 'bg-gray-600'}`} />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-all">
              이전
            </button>
          )}
          <button
            onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold transition-all"
          >
            {isLast ? '시작하기!' : '다음'}
          </button>
        </div>

        <button onClick={onComplete} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          건너뛰기
        </button>
      </div>
    </div>
  )
}
