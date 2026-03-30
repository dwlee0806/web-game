'use client'

import { useState, useEffect, useCallback } from 'react'
import Sword from './Sword'
import {
  type GameState,
  type EnhanceResult,
  INITIAL_STATE,
  MAX_LEVEL,
  getEnhanceRates,
  getEnhanceCost,
  rollEnhance,
  getCheckInReward,
  canCheckIn,
  isStreakContinued,
  getLevelTier,
} from '@/lib/gameLogic'

const STORAGE_KEY = 'sword-enhance-v1'

function loadState(): GameState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* quota exceeded or private mode */ }
}

export default function Game() {
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const [mounted, setMounted] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [result, setResult] = useState<EnhanceResult | null>(null)
  const [checkInReward, setCheckInReward] = useState<number | null>(null)

  useEffect(() => {
    setState(loadState())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveState(state)
  }, [state, mounted])

  const handleCheckIn = useCallback(() => {
    if (!canCheckIn(state.lastCheckIn)) return
    const today = new Date().toISOString().split('T')[0]
    const continued = isStreakContinued(state.lastCheckIn)
    const streak = continued ? state.checkInStreak + 1 : 1
    const reward = getCheckInReward(streak)

    setState(prev => ({
      ...prev,
      gold: prev.gold + reward,
      lastCheckIn: today,
      checkInStreak: streak,
    }))
    setCheckInReward(reward)
    setTimeout(() => setCheckInReward(null), 2000)
  }, [state.lastCheckIn, state.checkInStreak])

  const handleEnhance = useCallback(() => {
    if (enhancing || state.level >= MAX_LEVEL) return
    const cost = getEnhanceCost(state.level)
    if (state.gold < cost) return

    setEnhancing(true)
    setResult(null)

    setTimeout(() => {
      const r = rollEnhance(state.level)
      setResult(r)

      setState(prev => {
        const newLevel =
          r === 'success' ? prev.level + 1 : r === 'destroy' ? 0 : prev.level
        return {
          ...prev,
          level: newLevel,
          gold: prev.gold - cost,
          totalAttempts: prev.totalAttempts + 1,
          totalSuccess: prev.totalSuccess + (r === 'success' ? 1 : 0),
          totalMaintain: prev.totalMaintain + (r === 'maintain' ? 1 : 0),
          totalDestroy: prev.totalDestroy + (r === 'destroy' ? 1 : 0),
          highestLevel: Math.max(prev.highestLevel, newLevel),
        }
      })

      setTimeout(() => {
        setEnhancing(false)
        setResult(null)
      }, 1500)
    }, 900)
  }, [enhancing, state.level, state.gold])

  const handleReset = useCallback(() => {
    if (confirm('정말 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      setState(INITIAL_STATE)
    }
  }, [])

  if (!mounted) return <div className="min-h-dvh bg-gray-950" />

  const tier = getLevelTier(state.level)
  const rates = getEnhanceRates(state.level)
  const cost = getEnhanceCost(state.level)
  const canAfford = state.gold >= cost
  const maxed = state.level >= MAX_LEVEL
  const checkable = canCheckIn(state.lastCheckIn)

  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col select-none">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center 40%, ${tier.color}15 0%, transparent 60%)`,
        }}
      />

      {result === 'destroy' && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-flash-red" />
      )}
      {result === 'success' && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-flash-gold" />
      )}

      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-4">
        {/* Header */}
        <header className="pt-6 pb-2">
          <h1 className="text-center text-lg font-bold text-gray-300 mb-4">
            ⚔️ 검 강화 시뮬레이터
          </h1>
          <div className="flex items-center justify-between">
            <div className="text-yellow-400 font-bold text-lg">
              💰 {state.gold.toLocaleString()}G
            </div>
            <button
              onClick={handleCheckIn}
              disabled={!checkable}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                checkable
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {checkable ? '📅 출석체크' : '✅ 출석완료'}
            </button>
          </div>
          {checkInReward !== null && (
            <p className="text-center text-emerald-400 font-bold text-sm mt-2 animate-float-up">
              +{checkInReward}G 획득! (연속 {state.checkInStreak}일)
            </p>
          )}
        </header>

        {/* Sword */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div
            className={`${enhancing && !result ? 'animate-enhance' : ''} ${result === 'destroy' ? 'animate-shake' : ''}`}
          >
            <Sword level={state.level} color={tier.color} />
          </div>

          <div className="mt-4 text-center">
            <div
              className={`text-5xl font-black transition-all duration-300 ${result === 'success' ? 'animate-pop' : ''}`}
              style={{ color: tier.color }}
            >
              +{state.level}
            </div>
            <div
              className="text-sm font-bold mt-1 tracking-widest"
              style={{ color: tier.color }}
            >
              {tier.name}
            </div>
          </div>

          {result && (
            <div
              className={`mt-3 text-xl font-black animate-result-in ${
                result === 'success'
                  ? 'text-yellow-400'
                  : result === 'maintain'
                    ? 'text-blue-400'
                    : 'text-red-500'
              }`}
            >
              {result === 'success' && '✨ 강화 성공!'}
              {result === 'maintain' && '😐 유지'}
              {result === 'destroy' && '💥 파괴!!!'}
            </div>
          )}
        </div>

        {/* Panel */}
        <div className="pb-8 space-y-3">
          {!maxed ? (
            <>
              <div className="bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-800/60">
                <div className="flex justify-between text-sm mb-3 text-gray-300">
                  <span>
                    +{state.level} → +{state.level + 1}
                  </span>
                  <span className="text-yellow-400 font-medium">
                    {cost.toLocaleString()}G
                  </span>
                </div>
                <div className="flex gap-2">
                  <RateBox label="성공" value={rates.success} variant="emerald" />
                  <RateBox label="유지" value={rates.maintain} variant="blue" />
                  <RateBox label="파괴" value={rates.destroy} variant="red" />
                </div>
              </div>

              <button
                onClick={handleEnhance}
                disabled={enhancing || !canAfford}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  enhancing
                    ? 'bg-amber-700/40 cursor-wait'
                    : canAfford
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98] shadow-lg shadow-orange-900/40'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {enhancing
                  ? '🔮 강화 중...'
                  : canAfford
                    ? '🔥 강화하기'
                    : '💰 골드 부족'}
              </button>
            </>
          ) : (
            <div className="text-center py-6 text-yellow-400 text-xl font-black animate-pulse">
              🏆 최고 레벨 달성!
            </div>
          )}

          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-800/40">
            <div className="grid grid-cols-3 gap-y-3 text-sm text-center">
              <Stat label="시도" value={state.totalAttempts} />
              <Stat label="성공" value={state.totalSuccess} color="text-emerald-400" />
              <Stat label="파괴" value={state.totalDestroy} color="text-red-400" />
              <Stat label="유지" value={state.totalMaintain} color="text-blue-400" />
              <Stat label="최고" value={`+${state.highestLevel}`} color="text-yellow-400" />
              <Stat label="출석" value={`${state.checkInStreak}일`} />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}

function RateBox({ label, value, variant }: { label: string; value: number; variant: string }) {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-900/30 text-emerald-400',
    blue: 'bg-blue-900/30 text-blue-400',
    red: 'bg-red-900/30 text-red-400',
  }
  return (
    <div className={`flex-1 rounded-lg p-2 text-center ${styles[variant]}`}>
      <div className="font-bold">{value}%</div>
      <div className="text-[11px] text-gray-400">{label}</div>
    </div>
  )
}

function Stat({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div>
      <div className={`font-bold ${color ?? 'text-white'}`}>{value}</div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  )
}
