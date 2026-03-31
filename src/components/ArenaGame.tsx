'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { createInitialState, updateGame, applySkill } from '@/lib/arena/engine'
import { renderGame } from '@/lib/arena/renderer'
import { ARENA_W, ARENA_H, type ArenaState, type Vec2 } from '@/lib/arena/types'
import { playArenaHit, playArenaKill, playArenaDamage, playArenaBossAlert, playArenaLevelUp, playArenaDash, playArenaBossKill } from '@/lib/sounds'

interface ArenaGameProps {
  swordLevel: number
  onExit: (goldEarned: number, wave?: number, kills?: number, time?: number) => void
}

export default function ArenaGame({ swordLevel, onExit }: ArenaGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<ArenaState>(createInitialState(swordLevel))
  const inputRef = useRef<Vec2>({ x: 0, y: 0 })
  const dashRef = useRef(false)
  const animRef = useRef<number>(0)
  const [gameOver, setGameOver] = useState(false)
  const [levelUp, setLevelUp] = useState(false)
  const [paused, setPaused] = useState(false)
  const [finalState, setFinalState] = useState<ArenaState | null>(null)
  const touchRef = useRef<{ id: number; startX: number; startY: number } | null>(null)
  const soundEnabled = useRef(true)

  // Keyboard input
  useEffect(() => {
    const keys = new Set<string>()
    const onDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase())
      // Prevent page scroll on arrow keys and space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === ' ') dashRef.current = true
      if (e.key === 'Escape') setPaused(p => !p)
      updateInput()
    }
    const onUp = (e: KeyboardEvent) => { keys.delete(e.key.toLowerCase()); updateInput() }

    function updateInput() {
      let x = 0, y = 0
      if (keys.has('w') || keys.has('arrowup')) y -= 1
      if (keys.has('s') || keys.has('arrowdown')) y += 1
      if (keys.has('a') || keys.has('arrowleft')) x -= 1
      if (keys.has('d') || keys.has('arrowright')) x += 1
      inputRef.current = { x, y }
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  // Touch joystick + double-tap dash
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let lastTapTime = 0

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      const now = Date.now()
      if (now - lastTapTime < 300) dashRef.current = true
      lastTapTime = now
      touchRef.current = { id: t.identifier, startX: t.clientX, startY: t.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchRef.current) return
      const t = Array.from(e.touches).find(t => t.identifier === touchRef.current!.id)
      if (!t) return
      const dx = t.clientX - touchRef.current.startX
      const dy = t.clientY - touchRef.current.startY
      inputRef.current = { x: Math.max(-1, Math.min(1, dx / 40)), y: Math.max(-1, Math.min(1, dy / 40)) }
    }
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault(); touchRef.current = null; inputRef.current = { x: 0, y: 0 }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => { canvas.removeEventListener('touchstart', onTouchStart); canvas.removeEventListener('touchmove', onTouchMove); canvas.removeEventListener('touchend', onTouchEnd) }
  }, [])

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    function loop() {
      const state = stateRef.current
      if (!state.gameOver && !state.levelUpChoices && !paused) {
        const { state: newState, events } = updateGame(state, inputRef.current, 1, dashRef.current)
        dashRef.current = false
        stateRef.current = newState

        // Sound effects
        if (soundEnabled.current) {
          if (events.hit) playArenaHit()
          if (events.kill) playArenaKill()
          if (events.playerDamage) playArenaDamage()
          if (events.bossSpawn) playArenaBossAlert()
          if (events.bossKill) playArenaBossKill()
          if (events.levelUp) playArenaLevelUp()
          if (events.dash) playArenaDash()
        }
      }

      renderGame(ctx!, stateRef.current)

      // Draw pause overlay on canvas
      if (paused) {
        ctx!.fillStyle = 'rgba(0,0,0,0.6)'
        ctx!.fillRect(0, 0, ARENA_W, ARENA_H)
        ctx!.fillStyle = '#FFF'
        ctx!.font = 'bold 32px sans-serif'
        ctx!.textAlign = 'center'
        ctx!.fillText('⏸ PAUSED', ARENA_W / 2, ARENA_H / 2)
        ctx!.font = '14px sans-serif'
        ctx!.fillStyle = '#999'
        ctx!.fillText('ESC to resume', ARENA_W / 2, ARENA_H / 2 + 30)
      }

      if (stateRef.current.gameOver && !gameOver) {
        setGameOver(true)
        setFinalState({ ...stateRef.current })
      }
      if (stateRef.current.levelUpChoices && !levelUp) setLevelUp(true)

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameOver, levelUp, paused])

  const handleSkillSelect = useCallback((index: number) => {
    stateRef.current = applySkill(stateRef.current, index)
    setLevelUp(false)
  }, [])

  const handleExit = useCallback(() => {
    if (finalState) {
      onExit(finalState.goldEarned, finalState.wave, finalState.kills, finalState.time)
    } else {
      onExit(0)
    }
  }, [finalState, onExit])

  return (
    <div className="relative flex flex-col items-center justify-center h-dvh bg-black p-2 overflow-hidden" lang="en">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        width={ARENA_W}
        height={ARENA_H}
        className="border border-gray-800 rounded-lg max-w-full"
        style={{ imageRendering: 'pixelated', maxHeight: '70vh', aspectRatio: `${ARENA_W}/${ARENA_H}` }}
      />

      {/* Controls hint */}
      <div className="flex gap-4 mt-2 text-gray-600 text-xs">
        <span className="hidden md:inline">WASD 이동 · Space 대시 · ESC 일시정지</span>
        <span className="md:hidden">터치 드래그 이동 · 더블탭 대시</span>
        <button onClick={() => setPaused(p => !p)} className="text-gray-500 hover:text-gray-300" aria-label="Toggle pause">⏸</button>
        <button onClick={() => { soundEnabled.current = !soundEnabled.current }} className="text-gray-500 hover:text-gray-300" aria-label="Toggle sound">🔊</button>
      </div>

      {/* Level-up overlay */}
      {levelUp && stateRef.current.levelUpChoices && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full mx-4 space-y-3">
            <h2 className="text-center text-xl font-black text-yellow-400">⬆️ 레벨 업!</h2>
            <p className="text-center text-sm text-gray-400">스킬을 선택하세요</p>
            {stateRef.current.levelUpChoices.map((skill, i) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(i)}
                className="w-full py-3 px-4 glass-card rounded-xl text-left hover:ring-2 hover:ring-indigo-500/50 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{skill.name}</div>
                    <div className="text-xs text-gray-400">{skill.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameOver && finalState && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 animate-result-in">
            <h2 className="text-center text-2xl font-black text-red-400">💀 전사했습니다</h2>
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="glass-card rounded-xl p-3"><div className="text-lg font-bold text-yellow-400">{finalState.kills}</div><div className="text-[10px] text-gray-500">처치</div></div>
              <div className="glass-card rounded-xl p-3"><div className="text-lg font-bold text-yellow-400">Lv.{finalState.player.level}</div><div className="text-[10px] text-gray-500">도달 레벨</div></div>
              <div className="glass-card rounded-xl p-3"><div className="text-lg font-bold text-emerald-400">Wave {finalState.wave}</div><div className="text-[10px] text-gray-500">웨이브</div></div>
              <div className="glass-card rounded-xl p-3"><div className="text-lg font-bold text-yellow-400">{finalState.goldEarned.toLocaleString()}G</div><div className="text-[10px] text-gray-500">획득 골드</div></div>
            </div>
            <button onClick={handleExit} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 font-bold text-sm transition-all active:scale-[0.98]">
              🔥 골드 수령 & 강화하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
