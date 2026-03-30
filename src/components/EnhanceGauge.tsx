'use client'

import { memo } from 'react'

interface EnhanceGaugeProps {
  active: boolean
  progress: number // 0-1
  result: 'success' | 'maintain' | 'downgrade' | 'destroy' | null
  successRate: number // percentage
}

export default memo(function EnhanceGauge({ active, progress, result, successRate }: EnhanceGaugeProps) {
  if (!active && !result) return null

  const successWidth = successRate
  const pct = progress * 100

  // Needle position
  const needleX = pct

  // Near-miss: needle lands very close to success boundary
  const isNearMiss = result && result !== 'success' && Math.abs(pct - successWidth) < 8

  return (
    <div className="w-full mb-2">
      {/* Gauge bar */}
      <div className="relative h-6 rounded-full overflow-hidden bg-gray-800/80 border border-gray-700/50">
        {/* Success zone */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-full"
          style={{ width: `${successWidth}%`, background: 'linear-gradient(90deg, #065F46, #059669, #34D399)' }}
        />

        {/* Fail zone */}
        <div
          className="absolute inset-y-0 rounded-r-full"
          style={{ left: `${successWidth}%`, right: 0, background: 'linear-gradient(90deg, #92400E, #DC2626, #7F1D1D)' }}
        />

        {/* Success boundary line */}
        <div className="absolute inset-y-0 w-0.5 bg-white/40" style={{ left: `${successWidth}%` }} />

        {/* Animated needle */}
        {(active || result) && (
          <div
            className={`absolute top-0 bottom-0 w-1 transition-all ${active ? 'animate-gauge-sweep' : ''}`}
            style={{
              left: `${needleX}%`,
              backgroundColor: result === 'success' ? '#34D399' : result ? '#EF4444' : '#FFFFFF',
              boxShadow: `0 0 8px ${result === 'success' ? '#34D399' : result ? '#EF4444' : '#FFFFFF'}`,
              transitionDuration: active ? '0ms' : '200ms',
            }}
          />
        )}

        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] font-bold pointer-events-none">
          <span className="text-emerald-200/70">성공 {successRate}%</span>
          <span className="text-red-200/70">실패</span>
        </div>
      </div>

      {/* Near-miss text */}
      {isNearMiss && (
        <div className="text-center text-xs text-orange-400 font-bold mt-1 animate-result-in">
          😱 아깝다! 거의 성공할 뻔!
        </div>
      )}
    </div>
  )
})
