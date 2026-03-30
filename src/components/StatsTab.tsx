'use client'

import type { GameState } from '@/lib/gameLogic'
import { getLevelTier } from '@/lib/gameLogic'

export default function StatsTab({ state }: { state: GameState }) {
  const successRate = state.totalAttempts > 0
    ? ((state.totalSuccess / state.totalAttempts) * 100).toFixed(1)
    : '0.0'
  const destroyRate = state.totalAttempts > 0
    ? ((state.totalDestroy / state.totalAttempts) * 100).toFixed(1)
    : '0.0'
  const tier = getLevelTier(state.level)

  const weaponEntries = Object.entries(state.weapons ?? {})

  return (
    <div className="px-1 space-y-4">
      {/* Current weapon summary */}
      <div className="glass-card rounded-xl p-4 text-center">
        <div className="text-4xl font-black text-glow mb-1" style={{ color: tier.color }}>+{state.level}</div>
        <div className="text-sm font-bold tracking-wider" style={{ color: tier.color }}>{tier.name}</div>
        <div className="text-xs text-gray-500 mt-1">최고 기록: +{state.highestLevel}</div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="총 시도" value={state.totalAttempts.toLocaleString()} icon="🎯" />
        <MetricCard label="성공률" value={`${successRate}%`} icon="✨" color="text-emerald-400" />
        <MetricCard label="파괴율" value={`${destroyRate}%`} icon="💀" color="text-red-400" />
        <MetricCard label="소비 골드" value={`${((state.totalGoldSpent ?? 0) / 1000).toFixed(1)}K`} icon="💰" color="text-yellow-400" />
        <MetricCard label="프레스티지" value={`${state.prestige ?? 0}P`} icon="⭐" color="text-purple-400" />
        <MetricCard label="최대 스택" value={`${state.maxFailStack ?? 0}`} icon="🔥" color="text-orange-400" />
      </div>

      {/* Result breakdown */}
      {state.totalAttempts > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-xs text-gray-500 mb-3">강화 결과 분포</h3>
          <div className="space-y-2">
            <ResultBar label="성공" count={state.totalSuccess} total={state.totalAttempts} color="bg-emerald-500" />
            <ResultBar label="유지" count={state.totalMaintain} total={state.totalAttempts} color="bg-blue-500" />
            <ResultBar label="파괴" count={state.totalDestroy} total={state.totalAttempts} color="bg-red-500" />
          </div>
        </div>
      )}

      {/* Weapon collection */}
      {weaponEntries.length > 1 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-xs text-gray-500 mb-3">무기 컬렉션</h3>
          <div className="space-y-2">
            {weaponEntries.map(([id, w]) => {
              const wTier = getLevelTier(w.level)
              return (
                <div key={id} className="flex items-center justify-between text-sm">
                  <span className={id === state.activeWeapon ? 'font-bold' : 'text-gray-400'}>
                    {id === 'sword' ? '🗡️' : id === 'bow' ? '🏹' : id === 'staff' ? '🪄' : '🪓'} {id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: wTier.color }}>+{w.level}</span>
                    <span className="text-xs text-gray-600">(최고 +{w.highestLevel})</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Fun facts */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-xs text-gray-500 mb-3">재미있는 통계</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          {state.totalAttempts > 0 && (
            <p>평균 {(state.totalGoldSpent ?? 0) > 0 ? `${Math.round((state.totalGoldSpent ?? 0) / state.totalAttempts).toLocaleString()}G` : '?G'}/회 소비</p>
          )}
          {state.totalDestroy > 0 && (
            <p>평균 {Math.round(state.totalAttempts / state.totalDestroy)}회에 1번 파괴</p>
          )}
          {state.checkInStreak > 0 && (
            <p>현재 {state.checkInStreak}일 연속 출석 중</p>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className={`text-lg font-bold ${color ?? 'text-white'}`}>{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  )
}

function ResultBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = (count / total) * 100
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">{count} ({pct.toFixed(1)}%)</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
