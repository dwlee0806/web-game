'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PvpBattle from '@/components/PvpBattle'
import { getLevelTier } from '@/lib/gameLogic'
import { addGoldToSave, loadPlayerInfo } from '@/lib/saveUtils'

export default function PvpPage() {
  const router = useRouter()
  const [playerData, setPlayerData] = useState({ level: 0, name: 'Guest', weapon: 'sword' })
  const [ready, setReady] = useState(false)
  const [fighting, setFighting] = useState(false)

  useEffect(() => {
    setPlayerData(loadPlayerInfo())
    setReady(true)
  }, [])

  const handleFinish = useCallback((won: boolean, gold: number, _points: number) => {
    if (gold > 0) addGoldToSave(gold)
    // TODO: persist arenaPoints when server-side storage is available
    setFighting(false)
  }, [])

  if (!ready) return <div className="min-h-dvh bg-gray-950" />

  if (fighting) {
    return <PvpBattle playerLevel={playerData.level} playerName={playerData.name} weapon={playerData.weapon} onFinish={handleFinish} />
  }

  const tier = getLevelTier(playerData.level)

  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 text-center max-w-sm w-full">
        <div className="text-5xl mb-3">⚔️</div>
        <h1 className="text-2xl font-black mb-1">PvP 아레나</h1>
        <p className="text-gray-400 text-sm mb-6">
          타이밍을 맞춰 공격하고 패링하세요!<br />
          상대보다 컨트롤이 좋으면 이길 수 있습니다.
        </p>

        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="text-sm text-gray-400">내 전투력</div>
          <div className="text-3xl font-black" style={{ color: tier.color }}>+{playerData.level}</div>
          <div className="text-xs" style={{ color: tier.color }}>{tier.name}</div>
          <div className="text-[10px] text-gray-500 mt-1">매칭 범위: +{Math.max(0, playerData.level - 2)} ~ +{Math.min(16, playerData.level + 2)}</div>
        </div>

        <div className="glass-card rounded-xl p-4 mb-6 text-left text-xs text-gray-400 space-y-1">
          <p>⚔️ 초록 영역에서 터치 → 공격 (정확할수록 강력)</p>
          <p>🛡️ 상대 공격 시 터치 → 패링 (데미지 50% 감소)</p>
          <p>🏆 승리: 골드 + 아레나 포인트 획득</p>
          <p>⏱️ 4라운드, 약 15초 소요</p>
        </div>

        <button onClick={() => setFighting(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-900/40">
          ⚔️ 매칭 시작
        </button>
        <button onClick={() => router.push('/')} className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors">← 강화하러 돌아가기</button>
      </div>
    </div>
  )
}
