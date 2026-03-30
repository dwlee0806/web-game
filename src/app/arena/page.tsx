'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ArenaGame from '@/components/ArenaGame'
import type { ArenaRecord } from '@/lib/arena/types'
import { addGoldToSave, loadSwordLevel } from '@/lib/saveUtils'
import HeroAvatar from '@/components/HeroAvatar'

const RECORDS_KEY = 'sword-arena-records'

function loadRecords(): ArenaRecord {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    return raw ? JSON.parse(raw) : { highestWave: 0, mostKills: 0, longestSurvival: 0, totalGoldEarned: 0, totalRuns: 0 }
  } catch { return { highestWave: 0, mostKills: 0, longestSurvival: 0, totalGoldEarned: 0, totalRuns: 0 } }
}

function updateRecords(wave: number, kills: number, survivalSec: number, gold: number) {
  const r = loadRecords()
  r.highestWave = Math.max(r.highestWave, wave)
  r.mostKills = Math.max(r.mostKills, kills)
  r.longestSurvival = Math.max(r.longestSurvival, survivalSec)
  r.totalGoldEarned += gold
  r.totalRuns++
  localStorage.setItem(RECORDS_KEY, JSON.stringify(r))
}

export default function ArenaPage() {
  const router = useRouter()
  const [swordLevel, setSwordLevel] = useState(0)
  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)
  const [records, setRecords] = useState<ArenaRecord>({ highestWave: 0, mostKills: 0, longestSurvival: 0, totalGoldEarned: 0, totalRuns: 0 })

  useEffect(() => {
    setSwordLevel(loadSwordLevel())
    setRecords(loadRecords())
    setReady(true)
  }, [])

  const handleExit = useCallback((gold: number, wave?: number, kills?: number, time?: number) => {
    if (gold > 0) addGoldToSave(gold)
    if (wave && kills && time) updateRecords(wave, kills, Math.floor(time / 60), gold)
    router.push('/')
  }, [router])

  if (!ready) return <div className="min-h-dvh bg-black" />

  if (!started) {
    return (
      <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="mb-4"><HeroAvatar size={64} expression="excited" /></div>
          <h1 className="text-3xl font-black mb-2">던전</h1>
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
            🗡️ 던전 입장
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
            <p className="text-xs text-gray-500">💨 Space/더블탭으로 대시 (무적)</p>
          </div>

          {/* Records */}
          {records.totalRuns > 0 && (
            <div className="mt-4 glass-card rounded-xl p-4">
              <h3 className="text-xs text-gray-400 font-bold mb-2">🏆 최고 기록</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">최고 웨이브:</span> <span className="text-yellow-400 font-bold">{records.highestWave}</span></div>
                <div><span className="text-gray-500">최다 킬:</span> <span className="text-yellow-400 font-bold">{records.mostKills}</span></div>
                <div><span className="text-gray-500">최장 생존:</span> <span className="text-yellow-400 font-bold">{Math.floor(records.longestSurvival / 60)}m {records.longestSurvival % 60}s</span></div>
                <div><span className="text-gray-500">총 골드:</span> <span className="text-yellow-400 font-bold">{records.totalGoldEarned.toLocaleString()}G</span></div>
              </div>
              <div className="text-center text-[10px] text-gray-600 mt-2">{records.totalRuns}회 도전</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <ArenaGame swordLevel={swordLevel} onExit={handleExit} />
}
