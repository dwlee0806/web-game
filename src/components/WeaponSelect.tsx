'use client'

import { WEAPONS } from '@/lib/weapons'
import type { GameState } from '@/lib/gameLogic'
import { getLevelTier } from '@/lib/gameLogic'
import { getWeaponIcon } from './WeaponIcons'

interface WeaponSelectProps {
  state: GameState
  onSelect: (weaponId: string) => void
  onUnlock: (weaponId: string) => void
}

export default function WeaponSelect({ state, onSelect, onUnlock }: WeaponSelectProps) {
  return (
    <div className="flex gap-2 justify-center mb-2">
      {WEAPONS.map(w => {
        const owned = w.id in state.weapons
        const active = state.activeWeapon === w.id
        const wData = state.weapons[w.id]
        const tier = wData ? getLevelTier(wData.level) : null
        const canAfford = state.gold >= w.unlockCost
        const Icon = getWeaponIcon(w.id)

        if (!owned) {
          return (
            <button
              key={w.id}
              onClick={() => onUnlock(w.id)}
              disabled={!canAfford}
              className={`relative px-3 py-2 rounded-xl text-center transition-all duration-300 ${
                canAfford
                  ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                  : 'bg-white/[0.01] border border-white/[0.03] opacity-30 cursor-not-allowed'
              }`}
              aria-label={`${w.name} 해금 (${w.unlockCost}G)`}
            >
              <div className="opacity-40 grayscale"><Icon size={28} /></div>
              <div className="text-[9px] text-yellow-400/70 mt-0.5">{w.unlockCost.toLocaleString()}G</div>
            </button>
          )
        }

        return (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className={`relative px-3 py-2 rounded-xl text-center transition-all duration-300 ${
              active
                ? 'bg-indigo-500/15 ring-2 ring-indigo-400/40 border border-indigo-500/20'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
            }`}
            aria-label={`${w.name} 선택`}
          >
            <Icon size={28} color={tier?.color ?? '#9CA3AF'} />
            <div className="text-[10px] font-bold mt-0.5" style={{ color: tier?.color ?? '#9CA3AF' }}>
              +{wData.level}
            </div>
          </button>
        )
      })}
    </div>
  )
}
