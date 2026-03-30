'use client'

import { ACHIEVEMENTS } from '@/lib/achievements'

interface AchievementsTabProps {
  achieved: string[]
}

export default function AchievementsTab({ achieved }: AchievementsTabProps) {
  const done = achieved.length
  const total = ACHIEVEMENTS.length

  return (
    <div className="px-1">
      <p className="text-center text-gray-400 text-sm mb-4">
        달성{' '}
        <span className="text-yellow-400 font-bold">
          {done}/{total}
        </span>
      </p>

      <div className="space-y-2">
        {ACHIEVEMENTS.map(a => {
          const unlocked = achieved.includes(a.id)
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
                unlocked
                  ? 'bg-gray-900/80 border-yellow-800/40'
                  : 'bg-gray-900/40 border-gray-800/30 opacity-50'
              }`}
            >
              <span className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>
                {a.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{a.name}</div>
                <div className="text-xs text-gray-400">{a.desc}</div>
              </div>
              <div className="text-right shrink-0">
                {unlocked ? (
                  <span className="text-xs text-yellow-400 font-bold">
                    +{a.reward.toLocaleString()}G ✅
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">
                    {a.reward.toLocaleString()}G
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
