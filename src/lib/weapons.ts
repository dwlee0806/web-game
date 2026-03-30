export interface WeaponDef {
  id: string
  name: string
  icon: string
  bladeShape: 'sword' | 'bow' | 'staff' | 'axe'
  unlockCost: number
}

export const WEAPONS: WeaponDef[] = [
  { id: 'sword', name: '검', icon: '🗡️', bladeShape: 'sword', unlockCost: 0 },
  { id: 'bow', name: '활', icon: '🏹', bladeShape: 'bow', unlockCost: 3000 },
  { id: 'staff', name: '지팡이', icon: '🪄', bladeShape: 'staff', unlockCost: 5000 },
  { id: 'axe', name: '도끼', icon: '🪓', bladeShape: 'axe', unlockCost: 8000 },
]

export interface WeaponState {
  level: number
  highestLevel: number
}

export function getWeaponById(id: string): WeaponDef | undefined {
  return WEAPONS.find(w => w.id === id)
}
