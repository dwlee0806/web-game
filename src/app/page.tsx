'use client'

import { useCallback, useRef } from 'react'
import Game from '@/components/Game'
import VillageBackground from '@/components/VillageBackground'

export default function Page() {
  const npcClickCount = useRef(0)

  const handleNpcClick = useCallback(() => {
    npcClickCount.current++
    if (npcClickCount.current >= 10) {
      // Easter egg: award achievement via localStorage event
      const key = 'sword-ee-npc-clicks'
      const current = parseInt(localStorage.getItem(key) ?? '0', 10)
      localStorage.setItem(key, String(current + 1))
      if (npcClickCount.current === 10) {
        // Dispatch custom event for Game to pick up
        window.dispatchEvent(new CustomEvent('easter-egg', { detail: 'ee_npc_click' }))
      }
    }
  }, [])

  return (
    <>
      <VillageBackground onNpcClick={handleNpcClick} />
      <Game />
    </>
  )
}
