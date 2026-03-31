'use client'

import type { AllMissionsState, MissionProgress } from '@/lib/missions'
import { getMissionById } from '@/lib/missions'

interface MissionsTabProps {
  missions: AllMissionsState
  onClaim: (missionId: string, type: 'daily' | 'weekly' | 'monthly') => void
}

export default function MissionsTab({ missions, onClaim }: MissionsTabProps) {
  return (
    <div className="px-1 space-y-4">
      <MissionSection title="📅 일일 미션" subtitle="매일 자정 초기화" missions={missions.daily.missions} data={missions.daily.data} type="daily" onClaim={onClaim} accentColor="emerald" />
      <MissionSection title="📆 주간 미션" subtitle="매주 월요일 초기화" missions={missions.weekly.missions} data={missions.weekly.data} type="weekly" onClaim={onClaim} accentColor="blue" />
      <MissionSection title="🗓️ 월간 미션" subtitle="매월 1일 초기화" missions={missions.monthly.missions} data={missions.monthly.data} type="monthly" onClaim={onClaim} accentColor="purple" />
    </div>
  )
}

function MissionSection({ title, subtitle, missions: missionIds, data, type, onClaim, accentColor }: {
  title: string; subtitle: string; missions: string[]; data: MissionProgress
  type: 'daily' | 'weekly' | 'monthly'; onClaim: (id: string, type: 'daily' | 'weekly' | 'monthly') => void
  accentColor: string
}) {
  const colors: Record<string, { bar: string; badge: string }> = {
    emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-600' },
    blue: { bar: 'bg-blue-500', badge: 'bg-blue-600' },
    purple: { bar: 'bg-purple-500', badge: 'bg-purple-600' },
  }
  const c = colors[accentColor]

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="text-[9px] text-gray-500">{subtitle}</span>
      </div>
      <div className="space-y-2">
        {missionIds.map(id => {
          const mission = getMissionById(id)
          if (!mission) return null

          const progress = data.progress[id] ?? 0
          const completed = progress >= mission.target
          const claimed = data.claimed.includes(id)
          const pct = Math.min(100, Math.round((progress / mission.target) * 100))

          return (
            <div key={id} className={`glass-card rounded-xl p-3 transition-all ${claimed ? 'opacity-50' : completed ? 'ring-1 ring-emerald-600/30' : ''}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{mission.icon}</span>
                  <span className="font-medium text-xs">{mission.name}</span>
                </div>
                <span className="text-yellow-400 text-xs font-bold">{mission.reward.toLocaleString()}G</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1.5">
                <div className={`h-full rounded-full transition-all duration-500 ${completed ? 'bg-emerald-500' : c.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">{progress}/{mission.target}</span>
                {claimed ? (
                  <span className="text-[10px] text-yellow-400 font-bold">✅ 수령</span>
                ) : completed ? (
                  <button onClick={() => onClaim(id, type)} className={`px-3 py-1 ${c.badge} hover:opacity-80 rounded-lg text-[10px] font-bold transition-all active:scale-95`}>
                    보상 수령
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-600">진행중</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
