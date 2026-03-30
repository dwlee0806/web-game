'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ArenaGame from '@/components/ArenaGame'
import { INITIAL_STATE, type GameState } from '@/lib/gameLogic'

const STORAGE_KEY = 'sword-enhance-v2'

function loadSwordLevel(): number {
  try {
    const session = localStorage.getItem('sword-session')
    const key = session ? `sword-save-${session}` : STORAGE_KEY
    const raw = localStorage.getItem(key)
    if (raw) {
      const state: GameState = { ...INITIAL_STATE, ...JSON.parse(raw) }
      return state.weapons?.[state.activeWeapon]?.level ?? state.level
    }
  } catch { /* */ }
  return 0
}

function addGold(amount: number) {
  try {
    const session = localStorage.getItem('sword-session')
    const key = session ? `sword-save-${session}` : STORAGE_KEY
    const raw = localStorage.getItem(key)
    if (raw) {
      const state = { ...INITIAL_STATE, ...JSON.parse(raw) }
      state.gold += amount
      localStorage.setItem(key, JSON.stringify(state))
    }
  } catch { /* */ }
}

export default function ArenaPage() {
  const router = useRouter()
  const [swordLevel, setSwordLevel] = useState(0)
  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setSwordLevel(loadSwordLevel())
    setReady(true)
  }, [])

  const handleExit = useCallback((gold: number) => {
    if (gold > 0) addGold(gold)
    router.push('/')
  }, [router])

  if (!ready) return <div className="min-h-dvh bg-black" />

  if (!started) {
    return (
      <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-3xl font-black mb-2">전장</h1>
          <p className="text-gray-400 text-sm mb-6">
            강화한 검으로 몬스터를 무찌르세요!<br />
            오래 살아남을수록 더 많은 골드를 획득합니다.
          </p>

          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-400 mb-1">현재 검 레벨</div>
            <div className="text-3xl font-black text-yellow-400">+{swordLevel}</div>
            <div className="text-xs text-gray-500 mt-1">레벨이 높을수록 데미지 & 체력 증가</div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-900/40"
          >
            🗡️ 전장 입장
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← 강화하러 돌아가기
          </button>

          <div className="mt-6 text-left glass-card rounded-xl p-4">
            <h3 className="text-xs text-gray-400 font-bold mb-2">조작법</h3>
            <p className="text-xs text-gray-500">🖥️ PC: WASD / 방향키로 이동</p>
            <p className="text-xs text-gray-500">📱 모바일: 터치 & 드래그</p>
            <p className="text-xs text-gray-500">⚔️ 검은 자동으로 회전 공격</p>
          </div>
        </div>
      </div>
    )
  }

  return <ArenaGame swordLevel={swordLevel} onExit={handleExit} />
}
