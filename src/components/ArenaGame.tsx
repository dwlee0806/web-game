'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { createInitialState, updateGame, applySkill } from '@/lib/arena/engine'
import { renderGame } from '@/lib/arena/renderer'
import { ARENA_W, ARENA_H, type ArenaState, type Vec2 } from '@/lib/arena/types'

interface ArenaGameProps {
  swordLevel: number
  onExit: (goldEarned: number) => void
}

export default function ArenaGame({ swordLevel, onExit }: ArenaGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<ArenaState>(createInitialState(swordLevel))
  const inputRef = useRef<Vec2>({ x: 0, y: 0 })
  const animRef = useRef<number>(0)
  const [gameOver, setGameOver] = useState(false)
  const [levelUp, setLevelUp] = useState(false)
  const [finalState, setFinalState] = useState<ArenaState | null>(null)
  const touchRef = useRef<{ id: number; startX: number; startY: number } | null>(null)

  // Keyboard input
  useEffect(() => {
    const keys = new Set<string>()
    const onDown = (e: KeyboardEvent) => { keys.add(e.key.toLowerCase()); updateInput() }
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

  // Touch joystick
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      touchRef.current = { id: t.identifier, startX: t.clientX, startY: t.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!touchRef.current) return
      const t = Array.from(e.touches).find(t => t.identifier === touchRef.current!.id)
      if (!t) return
      const dx = t.clientX - touchRef.current.startX
      const dy = t.clientY - touchRef.current.startY
      const maxDist = 40
      inputRef.current = {
        x: Math.max(-1, Math.min(1, dx / maxDist)),
        y: Math.max(-1, Math.min(1, dy / maxDist)),
      }
    }
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      touchRef.current = null
      inputRef.current = { x: 0, y: 0 }
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    function loop() {
      const state = stateRef.current
      if (!state.gameOver && !state.levelUpChoices) {
        stateRef.current = updateGame(state, inputRef.current, 1)
      }

      renderGame(ctx!, stateRef.current)

      if (stateRef.current.gameOver && !gameOver) {
        setGameOver(true)
        setFinalState({ ...stateRef.current })
      }
      if (stateRef.current.levelUpChoices && !levelUp) {
        setLevelUp(true)
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameOver, levelUp])

  const handleSkillSelect = useCallback((index: number) => {
    stateRef.current = applySkill(stateRef.current, index)
    setLevelUp(false)
  }, [])

  const handleExit = useCallback(() => {
    const gold = finalState?.goldEarned ?? 0
    onExit(gold)
  }, [finalState, onExit])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh bg-black p-2">
      <canvas
        ref={canvasRef}
        width={ARENA_W}
        height={ARENA_H}
        className="border border-gray-800 rounded-lg max-w-full"
        style={{ imageRendering: 'pixelated', maxHeight: '70vh', aspectRatio: `${ARENA_W}/${ARENA_H}` }}
      />

      {/* Mobile controls hint */}
      <p className="text-gray-600 text-xs mt-2 md:hidden">화면을 터치하고 드래그하여 이동</p>
      <p className="text-gray-600 text-xs mt-2 hidden md:block">WASD / 방향키로 이동 · 검은 자동 공격</p>

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
              <div className="glass-card rounded-xl p-3">
                <div className="text-lg font-bold text-yellow-400">{finalState.kills}</div>
                <div className="text-[10px] text-gray-500">처치</div>
              </div>
              <div className="glass-card rounded-xl p-3">
                <div className="text-lg font-bold text-yellow-400">Lv.{finalState.player.level}</div>
                <div className="text-[10px] text-gray-500">도달 레벨</div>
              </div>
              <div className="glass-card rounded-xl p-3">
                <div className="text-lg font-bold text-emerald-400">Wave {finalState.wave}</div>
                <div className="text-[10px] text-gray-500">웨이브</div>
              </div>
              <div className="glass-card rounded-xl p-3">
                <div className="text-lg font-bold text-yellow-400">{finalState.goldEarned.toLocaleString()}G</div>
                <div className="text-[10px] text-gray-500">획득 골드</div>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 font-bold text-sm transition-all active:scale-[0.98]"
            >
              🔥 골드 수령 & 강화하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
