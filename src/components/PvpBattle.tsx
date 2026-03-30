'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  createPvpState, calculateAccuracy, calculateDamage,
  getAiAccuracy, aiParryChance,
  type PvpState,
} from '@/lib/pvp'
import { getLevelTier } from '@/lib/gameLogic'
import HeroAvatar from './HeroAvatar'

interface PvpBattleProps {
  playerLevel: number
  playerName: string
  weapon: string
  onFinish: (won: boolean, gold: number, points: number) => void
}

export default function PvpBattle({ playerLevel, playerName, weapon, onFinish }: PvpBattleProps) {
  const [state, setState] = useState<PvpState>(() => createPvpState(playerLevel, playerName, weapon))
  const animRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Gauge animation
  useEffect(() => {
    if (state.phase !== 'player_attack' && state.phase !== 'player_parry') return

    function tick() {
      setState(prev => {
        const newAngle = (prev.gaugeAngle + prev.gaugeSpeed) % 360
        return { ...prev, gaugeAngle: newAngle }
      })
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [state.phase])

  // Draw gauge
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const s = 200, c = s / 2, r = 80

    ctx.clearRect(0, 0, s, s)

    // Background circle
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 16
    ctx.beginPath()
    ctx.arc(c, c, r, 0, Math.PI * 2)
    ctx.stroke()

    // Sweet spot (green arc)
    const startRad = ((state.sweetSpotCenter - state.sweetSpotSize / 2) * Math.PI) / 180
    const endRad = ((state.sweetSpotCenter + state.sweetSpotSize / 2) * Math.PI) / 180
    ctx.strokeStyle = '#4ADE80'
    ctx.lineWidth = 16
    ctx.shadowColor = '#4ADE80'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(c, c, r, startRad - Math.PI / 2, endRad - Math.PI / 2)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Perfect center mark
    const centerRad = (state.sweetSpotCenter * Math.PI) / 180 - Math.PI / 2
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(c + Math.cos(centerRad) * r, c + Math.sin(centerRad) * r, 5, 0, Math.PI * 2)
    ctx.fill()

    // Spinning needle
    if (state.phase === 'player_attack' || state.phase === 'player_parry') {
      const needleRad = (state.gaugeAngle * Math.PI) / 180 - Math.PI / 2
      const nx = c + Math.cos(needleRad) * (r - 10)
      const ny = c + Math.sin(needleRad) * (r - 10)
      const nx2 = c + Math.cos(needleRad) * (r + 10)
      const ny2 = c + Math.sin(needleRad) * (r + 10)

      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      ctx.shadowColor = '#FFFFFF'
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.moveTo(nx, ny)
      ctx.lineTo(nx2, ny2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Center text
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      state.phase === 'player_attack' ? '⚔️ 공격!' : state.phase === 'player_parry' ? '🛡️ 패링!' : '',
      c, c + 5,
    )
  }, [state.gaugeAngle, state.sweetSpotCenter, state.sweetSpotSize, state.phase])

  // Player action (tap gauge)
  const handleTap = useCallback(() => {
    setState(prev => {
      if (prev.phase === 'player_attack') {
        const accuracy = calculateAccuracy(prev.gaugeAngle, prev.sweetSpotCenter, prev.sweetSpotSize)
        const parried = false // AI doesn't parry player's attack (they auto-defend later)
        const damage = accuracy > 0 ? calculateDamage(prev.player.attack, accuracy, parried) : 0

        const newOpponentHp = Math.max(0, prev.opponent.hp - damage)
        const round = { attackerAccuracy: accuracy, defenderParry: false, damage, attacker: 'player' as const }

        return {
          ...prev,
          opponent: { ...prev.opponent, hp: newOpponentHp },
          rounds: [...prev.rounds, round],
          phase: 'ai_attack' as const,
          sweetSpotCenter: Math.random() * 360,
        }
      }

      if (prev.phase === 'player_parry') {
        const parryAccuracy = calculateAccuracy(prev.gaugeAngle, prev.sweetSpotCenter, prev.sweetSpotSize)
        const parrySuccess = parryAccuracy > 0.3

        // AI attack
        const aiAcc = getAiAccuracy(prev.opponent.level)
        const rawDamage = calculateDamage(prev.opponent.attack, aiAcc, parrySuccess)
        const newPlayerHp = Math.max(0, prev.player.hp - rawDamage)
        const round = { attackerAccuracy: aiAcc, defenderParry: parrySuccess, damage: rawDamage, attacker: 'ai' as const }
        const newRound = prev.currentRound + 1

        const finished = newPlayerHp <= 0 || newRound >= prev.maxRounds
        const playerWins = newPlayerHp > 0 && (newPlayerHp >= prev.opponent.hp || prev.opponent.hp <= 0)
        const gold = playerWins ? 200 + prev.player.level * 50 : 50
        const points = playerWins ? 10 + prev.player.level : 2

        return {
          ...prev,
          player: { ...prev.player, hp: newPlayerHp },
          rounds: [...prev.rounds, round],
          currentRound: newRound,
          phase: finished ? 'result' as const : 'player_attack' as const,
          winner: finished ? (playerWins ? 'player' : 'ai') : null,
          goldReward: finished ? gold : 0,
          arenaPoints: finished ? points : 0,
          sweetSpotCenter: Math.random() * 360,
        }
      }

      return prev
    })
  }, [])

  // AI attack phase auto-transition
  useEffect(() => {
    if (state.phase !== 'ai_attack') return
    const t = setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'player_parry', gaugeAngle: 0, sweetSpotCenter: Math.random() * 360 }))
    }, 800)
    return () => clearTimeout(t)
  }, [state.phase])

  // Start battle
  const startBattle = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'player_attack' }))
  }, [])

  const playerTier = getLevelTier(state.player.level)
  const opponentTier = getLevelTier(state.opponent.level)

  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      {/* Fighters */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4">
        {/* Player */}
        <div className="text-center">
          <HeroAvatar size={36} expression="excited" />
          <div className="text-sm font-bold mt-1">{state.player.name}</div>
          <div className="text-xs font-bold" style={{ color: playerTier.color }}>+{state.player.level} {playerTier.name}</div>
          <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(state.player.hp / state.player.maxHp) * 100}%` }} />
          </div>
          <div className="text-[10px] text-gray-400">{state.player.hp}/{state.player.maxHp}</div>
        </div>

        <div className="text-2xl font-black text-gray-600">VS</div>

        {/* Opponent */}
        <div className="text-center">
          <div className="text-2xl mb-1">👤</div>
          <div className="text-sm font-bold">{state.opponent.name}</div>
          <div className="text-xs font-bold" style={{ color: opponentTier.color }}>+{state.opponent.level} {opponentTier.name}</div>
          <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(state.opponent.hp / state.opponent.maxHp) * 100}%` }} />
          </div>
          <div className="text-[10px] text-gray-400">{state.opponent.hp}/{state.opponent.maxHp}</div>
        </div>
      </div>

      {/* Round indicator */}
      <div className="text-xs text-gray-500 mb-2">Round {state.currentRound + 1} / {state.maxRounds}</div>

      {/* Gauge */}
      <div className="relative mb-4">
        <canvas ref={canvasRef} width={200} height={200} onClick={handleTap} className="cursor-pointer" />
      </div>

      {/* Action area */}
      {state.phase === 'ready' && (
        <button onClick={startBattle} className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold text-lg transition-all active:scale-95">
          ⚔️ 전투 시작!
        </button>
      )}

      {state.phase === 'ai_attack' && (
        <div className="text-center animate-pulse">
          <div className="text-xl">⚡</div>
          <div className="text-sm text-red-400 font-bold">상대 공격 중…</div>
        </div>
      )}

      {(state.phase === 'player_attack' || state.phase === 'player_parry') && (
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">
            {state.phase === 'player_attack' ? '초록 영역에서 터치하여 공격!' : '초록 영역에서 터치하여 패링!'}
          </div>
          <button onClick={handleTap} className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold text-lg transition-all active:scale-90">
            {state.phase === 'player_attack' ? '⚔️ 공격!' : '🛡️ 패링!'}
          </button>
        </div>
      )}

      {/* Last round result */}
      {state.rounds.length > 0 && state.phase !== 'result' && (
        <div className="mt-3 text-center text-xs text-gray-500">
          {(() => {
            const last = state.rounds[state.rounds.length - 1]
            return last.attacker === 'player'
              ? `내 공격: ${last.damage > 0 ? `${last.damage} 데미지!` : 'MISS!'}`
              : `상대 공격: ${last.damage} 데미지${last.defenderParry ? ' (패링!)' : ''}`
          })()}
        </div>
      )}

      {/* Result */}
      {state.phase === 'result' && (
        <div className="glass-card rounded-2xl p-6 max-w-sm w-full animate-result-in">
          <h2 className={`text-center text-2xl font-black mb-3 ${state.winner === 'player' ? 'text-yellow-400' : 'text-red-400'}`}>
            {state.winner === 'player' ? '🏆 승리!' : '💀 패배'}
          </h2>

          <div className="space-y-1 text-sm text-center mb-4">
            {state.rounds.map((r, i) => (
              <div key={i} className={`text-xs ${r.attacker === 'player' ? 'text-emerald-400' : 'text-red-400'}`}>
                R{Math.floor(i / 2) + 1} {r.attacker === 'player' ? '⚔️' : '🛡️'} {r.damage > 0 ? `${r.damage}dmg` : 'MISS'}
                {r.defenderParry && ' (패링!)'}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 glass-card rounded-xl p-3 text-center">
              <div className="text-yellow-400 font-bold">{state.goldReward}G</div>
              <div className="text-[9px] text-gray-500">골드</div>
            </div>
            <div className="flex-1 glass-card rounded-xl p-3 text-center">
              <div className="text-purple-400 font-bold">{state.arenaPoints}pt</div>
              <div className="text-[9px] text-gray-500">아레나 포인트</div>
            </div>
          </div>

          <button
            onClick={() => onFinish(state.winner === 'player', state.goldReward, state.arenaPoints)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 font-bold text-sm transition-all active:scale-95"
          >
            돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
