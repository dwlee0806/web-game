'use client'

import { WEAPONS, type WeaponDef } from '@/lib/weapons'
import type { GameState } from '@/lib/gameLogic'
import { getLevelTier } from '@/lib/gameLogic'

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

        if (!owned) {
          return (
            <button
              key={w.id}
              onClick={() => onUnlock(w.id)}
              disabled={!canAfford}
              className={`relative px-3 py-2 rounded-xl text-center transition-all ${
                canAfford
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50'
                  : 'bg-gray-900/50 border border-gray-800/30 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="text-xl grayscale opacity-60">{w.icon}</div>
              <div className="text-[9px] text-yellow-400 mt-0.5">{w.unlockCost.toLocaleString()}G</div>
            </button>
          )
        }

        return (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className={`relative px-3 py-2 rounded-xl text-center transition-all ${
              active
                ? 'bg-indigo-600/30 ring-2 ring-indigo-400/50 border border-indigo-500/30'
                : 'bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/30'
            }`}
          >
            <div className="text-xl">{w.icon}</div>
            <div className="text-[10px] font-bold mt-0.5" style={{ color: tier?.color ?? '#9CA3AF' }}>
              +{wData.level}
            </div>
          </button>
        )
      })}
    </div>
  )
}
