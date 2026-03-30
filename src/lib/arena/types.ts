export interface Vec2 {
  x: number
  y: number
}

export interface Player {
  pos: Vec2
  hp: number
  maxHp: number
  speed: number
  damage: number
  xp: number
  level: number
  xpToNext: number
  swordRange: number
  swordSpeed: number
  swordAngle: number
  invincibleUntil: number
}

export interface Enemy {
  id: number
  pos: Vec2
  hp: number
  maxHp: number
  speed: number
  damage: number
  size: number
  type: EnemyType
  knockbackUntil: number
  knockbackDir: Vec2
}

export type EnemyType = 'slime' | 'bat' | 'skeleton' | 'ghost' | 'demon'

export interface Particle {
  pos: Vec2
  vel: Vec2
  life: number
  maxLife: number
  color: string
  size: number
}

export interface XpOrb {
  pos: Vec2
  value: number
  life: number
}

export interface Skill {
  id: string
  name: string
  icon: string
  desc: string
  apply: (player: Player, state: ArenaState) => void
}

export interface ArenaState {
  player: Player
  enemies: Enemy[]
  particles: Particle[]
  xpOrbs: XpOrb[]
  time: number
  kills: number
  wave: number
  paused: boolean
  gameOver: boolean
  levelUpChoices: Skill[] | null
  swordLevel: number
  goldEarned: number
  nextEnemyId: number
  spawnTimer: number
  extraProjectiles: number
  orbitals: number
  thorns: number
}

export const ARENA_W = 800
export const ARENA_H = 600
