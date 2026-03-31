'use client'

import { memo } from 'react'

interface EnhanceGaugeProps {
  active: boolean
  progress: number
  result: 'success' | 'maintain' | 'downgrade' | 'destroy' | null
  successRate: number
}

export default memo(function EnhanceGauge({ active, progress, result, successRate }: EnhanceGaugeProps) {
  const successWidth = successRate
  const pct = progress * 100
  const isNearMiss = result && result !== 'success' && Math.abs(pct - successWidth) < 8

  return (
    <div className="w-full">
      {/* Always-visible gauge bar */}
      <div className="relative h-5 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.06]">
        {/* Success zone */}
        <div className="absolute inset-y-0 left-0 rounded-l-full" style={{ width: `${successWidth}%`, background: 'linear-gradient(90deg, #065F46, #059669, #34D399)' }} />

        {/* Fail zone */}
        <div className="absolute inset-y-0 rounded-r-full" style={{ left: `${successWidth}%`, right: 0, background: 'linear-gradient(90deg, #7F1D1D80, #DC262640, #7F1D1D30)' }} />

        {/* Boundary */}
        <div className="absolute inset-y-0 w-px bg-white/30" style={{ left: `${successWidth}%` }} />

        {/* Needle: only during enhance */}
        {(active || result) && (
          <div
            className={`absolute top-0 bottom-0 w-1 ${active ? 'animate-gauge-sweep' : ''}`}
            style={{
              left: `${pct}%`,
              backgroundColor: result === 'success' ? '#34D399' : result ? '#EF4444' : '#FFF',
              boxShadow: `0 0 8px ${result === 'success' ? '#34D399' : result ? '#EF4444' : '#FFF'}`,
              transition: active ? 'none' : 'left 0.2s',
            }}
          />
        )}

        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[7px] font-bold pointer-events-none">
          <span className="text-emerald-200/60">성공 {Math.round(successRate)}%</span>
          <span className="text-red-200/40">실패</span>
        </div>
      </div>

      {isNearMiss && (
        <div className="text-center text-[10px] text-orange-400 font-bold mt-0.5 animate-result-in">😱 아깝다!</div>
      )}
    </div>
  )
})
