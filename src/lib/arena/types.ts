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
  dashCooldown: number
  dashUntil: number
  hpRegen: number
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
  isBoss: boolean
  bossPhase: number
  attackCooldown: number
}

export type EnemyType = 'slime' | 'bat' | 'skeleton' | 'ghost' | 'demon'
export interface DamageNumber {
  pos: Vec2
  value: number
  life: number
  color: string
  crit: boolean
}

export interface Projectile {
  pos: Vec2
  vel: Vec2
  damage: number
  life: number
  size: number
  color: string
  pierce: number
  hitIds: number[]
}

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

export interface WaveAnnouncement {
  text: string
  life: number
  color: string
}

export interface ArenaState {
  player: Player
  enemies: Enemy[]
  particles: Particle[]
  xpOrbs: XpOrb[]
  damageNumbers: DamageNumber[]
  projectiles: Projectile[]
  time: number
  kills: number
  wave: number
  prevWave: number
  paused: boolean
  gameOver: boolean
  levelUpChoices: Skill[] | null
  swordLevel: number
  goldEarned: number
  nextEnemyId: number
  spawnTimer: number
  armorStacks: number
  goldBoostStacks: number
  orbitals: number
  thorns: number
  screenShake: number
  waveAnnouncement: WaveAnnouncement | null
  projectileTimer: number
  projectileDamage: number
  aoeDamage: number
  aoeTimer: number
  aoeInterval: number
  magnetRange: number
  bossActive: boolean
  mapTransition: number // 0 = none, >0 = transition progress (0-1)
  combo: number
  comboTimer: number
  hitstop: number
  healDrops: HealDrop[]
}

export interface HealDrop {
  pos: Vec2
  value: number
  life: number
}

export const ARENA_W = 800
export const ARENA_H = 600

export interface ArenaRecord {
  highestWave: number
  mostKills: number
  longestSurvival: number
  totalGoldEarned: number
  totalRuns: number
}
