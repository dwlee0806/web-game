// PvP Timing Arena - Core Logic

export interface PvpFighter {
  name: string
  level: number
  hp: number
  maxHp: number
  attack: number
  weaponType: string
}

export interface PvpRound {
  attackerAccuracy: number // 0-1, how close to center
  defenderParry: boolean
  damage: number
  attacker: 'player' | 'ai'
}

export interface PvpState {
  player: PvpFighter
  opponent: PvpFighter
  rounds: PvpRound[]
  currentRound: number
  maxRounds: number
  phase: 'ready' | 'player_attack' | 'ai_attack' | 'player_parry' | 'result'
  gaugeAngle: number // 0-360, spinning gauge
  gaugeSpeed: number
  sweetSpotCenter: number // angle of sweet spot center
  sweetSpotSize: number // size of sweet spot in degrees
  playerScore: number
  aiScore: number
  winner: 'player' | 'ai' | null
  goldReward: number
  arenaPoints: number
}

// Create fighter from level
export function createFighter(name: string, level: number, weapon: string): PvpFighter {
  return {
    name,
    level,
    hp: 100 + level * 15,
    maxHp: 100 + level * 15,
    attack: 10 + level * 10,
    weaponType: weapon,
  }
}

// Generate AI opponent (±2 level range)
export function generateOpponent(playerLevel: number): PvpFighter {
  const names = ['검은기사', '은둔마법사', '방랑검객', '숲의사냥꾼', '불의전사', '얼음마녀', '그림자도적', '철벽수호자']
  const offset = Math.floor(Math.random() * 5) - 2 // -2 to +2
  const aiLevel = Math.max(0, Math.min(16, playerLevel + offset))
  const name = names[Math.floor(Math.random() * names.length)]
  return createFighter(name, aiLevel, 'sword')
}

// Calculate damage from accuracy (0-1)
export function calculateDamage(baseAttack: number, accuracy: number, parried: boolean): number {
  // accuracy 1.0 = perfect center = 1.3x
  // accuracy 0.0 = edge of sweet spot = 0.7x
  const multiplier = 0.7 + accuracy * 0.6
  const damage = Math.floor(baseAttack * multiplier)
  return parried ? Math.floor(damage * 0.5) : damage
}

// AI timing accuracy based on level
export function getAiAccuracy(level: number): number {
  // Higher level = better average accuracy
  const baseAccuracy = 0.5 + level * 0.025 // 0.5 at lv0, 0.9 at lv16
  const variance = 0.15 // random spread
  return Math.max(0.1, Math.min(1.0, baseAccuracy + (Math.random() - 0.5) * variance * 2))
}

// AI parry success rate
export function aiParryChance(level: number): boolean {
  const chance = 0.2 + level * 0.03 // 20% at lv0, 68% at lv16
  return Math.random() < chance
}

// Calculate accuracy from gauge angle and sweet spot
export function calculateAccuracy(hitAngle: number, sweetSpotCenter: number, sweetSpotSize: number): number {
  let diff = Math.abs(hitAngle - sweetSpotCenter)
  if (diff > 180) diff = 360 - diff
  const halfSize = sweetSpotSize / 2
  if (diff > halfSize) return 0 // miss (outside sweet spot)
  return 1 - (diff / halfSize) // 1.0 = perfect center, 0.0 = edge
}

export function createPvpState(playerLevel: number, playerName: string, weapon: string): PvpState {
  const player = createFighter(playerName, playerLevel, weapon)
  const opponent = generateOpponent(playerLevel)
  const baseSpeed = 3 + Math.min(playerLevel, 10) * 0.3 // gauge speed increases with level

  return {
    player,
    opponent,
    rounds: [],
    currentRound: 0,
    maxRounds: 4,
    phase: 'ready',
    gaugeAngle: 0,
    gaugeSpeed: baseSpeed,
    sweetSpotCenter: Math.random() * 360,
    sweetSpotSize: 60 - Math.min(playerLevel, 12) * 2, // smaller at higher levels (60° -> 36°)
    playerScore: 0,
    aiScore: 0,
    winner: null,
    goldReward: 0,
    arenaPoints: 0,
  }
}
