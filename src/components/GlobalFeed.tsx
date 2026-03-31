'use client'

import { useState, useEffect, memo } from 'react'
import { getLevelTier } from '@/lib/gameLogic'

// 가짜 글로벌 피드 — 커뮤니티 느낌 연출
const NAMES = ['검은바람', '달빛기사', '용감한양', '불의마법사', '그림자도적', '하늘궁수', '철벽수호', '바다의칼', '숲의현자', '별빛전사', '붉은늑대', '은하기사']

function generateFakeEvent(): { text: string; color: string } {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]
  const roll = Math.random()

  if (roll < 0.3) {
    // Enhancement success
    const lv = Math.floor(Math.random() * 14) + 3
    const tier = getLevelTier(lv)
    return { text: `${name}님이 +${lv} ${tier.name} 달성! ✨`, color: tier.color }
  } else if (roll < 0.5) {
    // Destruction
    const lv = Math.floor(Math.random() * 10) + 5
    return { text: `${name}님의 +${lv} 검이 파괴되었습니다... 💀`, color: '#EF4444' }
  } else if (roll < 0.7) {
    // Dungeon clear
    const wave = Math.floor(Math.random() * 15) + 3
    return { text: `${name}님이 던전 Wave ${wave} 클리어! ⚔️`, color: '#4ADE80' }
  } else if (roll < 0.85) {
    // PvP win
    const opponent = NAMES[Math.floor(Math.random() * NAMES.length)]
    return { text: `${name}님이 ${opponent}님에게 승리! 🏆`, color: '#A78BFA' }
  } else {
    // Prestige
    return { text: `${name}님이 환생했습니다! ⭐`, color: '#EC4899' }
  }
}

export default memo(function GlobalFeed() {
  const [events, setEvents] = useState<Array<{ text: string; color: string; id: number }>>([])
  const [nextId, setNextId] = useState(0)

  useEffect(() => {
    // Generate initial event
    const e = generateFakeEvent()
    setEvents([{ ...e, id: 0 }])
    setNextId(1)

    // Generate new events periodically
    const interval = setInterval(() => {
      const e = generateFakeEvent()
      setNextId(prev => {
        const id = prev
        setEvents(evts => [{ ...e, id }, ...evts].slice(0, 1))
        return prev + 1
      })
    }, 6000 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [])

  if (events.length === 0) return null

  return (
    <div className="w-full overflow-hidden h-5 relative">
      {events.map(e => (
        <div key={e.id} className="absolute inset-0 flex items-center justify-center animate-feed-slide text-[10px] font-medium" style={{ color: e.color }}>
          {e.text}
        </div>
      ))}
    </div>
  )
})
