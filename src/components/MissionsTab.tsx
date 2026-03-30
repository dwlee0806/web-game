'use client'

import type { DailyMissionState } from '@/lib/missions'
import { getMissionById } from '@/lib/missions'

interface MissionsTabProps {
  missions: DailyMissionState
  onClaim: (missionId: string) => void
}

export default function MissionsTab({ missions, onClaim }: MissionsTabProps) {
  return (
    <div className="px-1 space-y-3">
      <p className="text-center text-gray-400 text-sm">
        매일 자정에 미션이 갱신됩니다
      </p>

      {missions.missionIds.map(id => {
        const mission = getMissionById(id)
        if (!mission) return null

        const progress = missions.progress[id] ?? 0
        const completed = progress >= mission.target
        const claimed = missions.claimed.includes(id)
        const pct = Math.min(100, Math.round((progress / mission.target) * 100))

        return (
          <div
            key={id}
            className={`glass-card rounded-xl p-4 transition-all ${
              claimed
                ? 'opacity-60'
                : completed
                  ? 'ring-1 ring-emerald-600/30'
                  : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{mission.icon}</span>
                <span className="font-medium text-sm">{mission.name}</span>
              </div>
              <span className="text-yellow-400 text-sm font-bold">
                {mission.reward.toLocaleString()}G
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completed ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {progress}/{mission.target}
              </span>
              {claimed ? (
                <span className="text-xs text-yellow-400 font-bold">
                  ✅ 수령완료
                </span>
              ) : completed ? (
                <button
                  onClick={() => onClaim(id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-all active:scale-95"
                >
                  보상 수령
                </button>
              ) : (
                <span className="text-xs text-gray-600">진행중</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
