'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Sword from './Sword'
import Particles from './Particles'
import MagicCircle from './MagicCircle'
import AdBanner from './AdBanner'
import ShareButton from './ShareButton'
import WeaponSelect from './WeaponSelect'
import ShopTab from './ShopTab'
import AchievementsTab from './AchievementsTab'
import MissionsTab from './MissionsTab'
import Tutorial from './Tutorial'
import {
  type GameState,
  type EnhanceResult,
  type ShopItem,
  INITIAL_STATE,
  MAX_LEVEL,
  MAX_LOG,
  SHOP,
  getEnhanceRates,
  getEnhanceCost,
  rollEnhance,
  getCheckInReward,
  canCheckIn,
  isStreakContinued,
  getLevelTier,
} from '@/lib/gameLogic'
import { type Achievement, getNewAchievements } from '@/lib/achievements'
import { playEnhanceStart, playSuccess, playMaintain, playDestroy, playCheckIn, playBuy, playAchievement, playClick } from '@/lib/sounds'
import { WEAPONS } from '@/lib/weapons'
import {
  type DailyMissionState,
  getInitialMissionState,
  getMissionById,
} from '@/lib/missions'

const STORAGE_KEY = 'sword-enhance-v2'
const MISSIONS_KEY = 'sword-missions-v1'
type Tab = 'enhance' | 'shop' | 'achievements' | 'missions'

function loadState(): GameState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const v1 = localStorage.getItem('sword-enhance-v1')
      if (v1) return { ...INITIAL_STATE, ...JSON.parse(v1) }
      return INITIAL_STATE
    }
    return { ...INITIAL_STATE, ...JSON.parse(raw) }
  } catch {
    return INITIAL_STATE
  }
}

function saveState(state: GameState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* */ }
}

function loadMissions(): DailyMissionState {
  const today = new Date().toISOString().split('T')[0]
  if (typeof window === 'undefined') return getInitialMissionState(today)
  try {
    const raw = localStorage.getItem(MISSIONS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DailyMissionState
      if (parsed.date === today) return parsed
    }
  } catch { /* */ }
  return getInitialMissionState(today)
}

function saveMissions(m: DailyMissionState) {
  try { localStorage.setItem(MISSIONS_KEY, JSON.stringify(m)) } catch { /* */ }
}

export default function Game() {
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const [missions, setMissions] = useState<DailyMissionState>(() => getInitialMissionState(new Date().toISOString().split('T')[0]))
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<Tab>('enhance')
  const [enhancing, setEnhancing] = useState(false)
  const [result, setResult] = useState<EnhanceResult | null>(null)
  const [checkInReward, setCheckInReward] = useState<number | null>(null)
  const [useProtection, setUseProtection] = useState(false)
  const [useBlessing, setUseBlessing] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [achPopup, setAchPopup] = useState<Achievement | null>(null)
  const [particleType, setParticleType] = useState<'success' | 'destroy' | null>(null)
  const [showMagicCircle, setShowMagicCircle] = useState(false)
  const [levelBurst, setLevelBurst] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state
  const autoRef = useRef(false)
  autoRef.current = autoMode
  const missionsRef = useRef(missions)
  missionsRef.current = missions
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled

  useEffect(() => {
    setState(loadState())
    setMissions(loadMissions())
    setMounted(true)
    if (!localStorage.getItem('sword-tutorial-done')) setShowTutorial(true)
  }, [])

  useEffect(() => { if (mounted) saveState(state) }, [state, mounted])
  useEffect(() => { if (mounted) saveMissions(missions) }, [missions, mounted])

  const progressMission = useCallback((ids: string[], amounts?: Record<string, number>) => {
    setMissions(prev => {
      const progress = { ...prev.progress }
      ids.forEach(id => {
        if (prev.missionIds.includes(id) && !prev.claimed.includes(id)) {
          progress[id] = (progress[id] ?? 0) + (amounts?.[id] ?? 1)
        }
      })
      return { ...prev, progress }
    })
  }, [])

  const resetMissionProgress = useCallback((id: string) => {
    setMissions(prev => {
      if (!prev.missionIds.includes(id)) return prev
      return { ...prev, progress: { ...prev.progress, [id]: 0 } }
    })
  }, [])

  const setMissionLevel = useCallback((id: string, level: number) => {
    setMissions(prev => {
      if (!prev.missionIds.includes(id)) return prev
      return { ...prev, progress: { ...prev.progress, [id]: Math.max(prev.progress[id] ?? 0, level) } }
    })
  }, [])

  const awardAchievements = useCallback((s: GameState): GameState => {
    const fresh = getNewAchievements(s)
    if (fresh.length === 0) return s
    const ids = fresh.map(a => a.id)
    const bonus = fresh.reduce((sum, a) => sum + a.reward, 0)
    setAchPopup(fresh[0])
    playAchievement()
    setTimeout(() => setAchPopup(null), 2500)
    return { ...s, achievements: [...s.achievements, ...ids], gold: s.gold + bonus }
  }, [])

  const handleCheckIn = useCallback(() => {
    if (!canCheckIn(stateRef.current.lastCheckIn)) return
    const today = new Date().toISOString().split('T')[0]
    const continued = isStreakContinued(stateRef.current.lastCheckIn)
    const streak = continued ? stateRef.current.checkInStreak + 1 : 1
    const reward = getCheckInReward(streak)
    setState(prev => awardAchievements({ ...prev, gold: prev.gold + reward, lastCheckIn: today, checkInStreak: streak }))
    setCheckInReward(reward)
    setTimeout(() => setCheckInReward(null), 2000)
    progressMission(['checkin'])
    if (soundRef.current) playCheckIn()
  }, [awardAchievements, progressMission])

  const doEnhance = useCallback(() => {
    const s = stateRef.current
    if (s.level >= MAX_LEVEL) return
    const cost = getEnhanceCost(s.level)
    if (s.gold < cost) { setAutoMode(false); return }

    const wantProtect = useProtection && s.protectionScrolls > 0
    const wantBless = useBlessing && s.blessingScrolls > 0

    let r = rollEnhance(s.level, wantBless)
    if (r === 'destroy' && wantProtect) r = 'maintain'

    setResult(r)
    if (soundRef.current) {
      if (r === 'success') playSuccess()
      else if (r === 'maintain') playMaintain()
      else playDestroy()
    }
    if (r === 'success') {
      setParticleType('success')
      setLevelBurst(true)
      setTimeout(() => { setParticleType(null); setLevelBurst(false) }, 1500)
    } else if (r === 'destroy') {
      setParticleType('destroy')
      setTimeout(() => setParticleType(null), 1500)
    }

    setState(prev => {
      const curLevel = prev.weapons[prev.activeWeapon]?.level ?? prev.level
      const newLevel = r === 'success' ? curLevel + 1 : r === 'destroy' ? 0 : curLevel
      const entry = { from: curLevel, result: r, ts: Date.now(), usedProtection: wantProtect, usedBlessing: wantBless }
      const wep = prev.weapons[prev.activeWeapon] ?? { level: 0, highestLevel: 0 }
      const updatedWeapons = { ...prev.weapons, [prev.activeWeapon]: { level: newLevel, highestLevel: Math.max(wep.highestLevel, newLevel) } }
      const updated: GameState = {
        ...prev,
        level: newLevel,
        gold: prev.gold - cost,
        totalAttempts: prev.totalAttempts + 1,
        totalSuccess: prev.totalSuccess + (r === 'success' ? 1 : 0),
        totalMaintain: prev.totalMaintain + (r === 'maintain' ? 1 : 0),
        totalDestroy: prev.totalDestroy + (r === 'destroy' ? 1 : 0),
        highestLevel: Math.max(prev.highestLevel, newLevel),
        protectionScrolls: prev.protectionScrolls - (wantProtect ? 1 : 0),
        blessingScrolls: prev.blessingScrolls - (wantBless ? 1 : 0),
        enhanceLog: [entry, ...prev.enhanceLog.slice(0, MAX_LOG - 1)],
        weapons: updatedWeapons,
      }
      return awardAchievements(updated)
    })

    // Mission progress
    progressMission(['enhance5', 'enhance15', 'enhance30'])
    if (r === 'success') progressMission(['success3', 'success10'])
    if (r === 'destroy') {
      resetMissionProgress('survive5')
    } else {
      progressMission(['survive5'])
    }
    if (wantProtect) progressMission(['useprotect'])
    if (wantBless) progressMission(['usebless'])

    // Reach missions — need to check after state update
    const newLevel = r === 'success' ? s.level + 1 : r === 'destroy' ? 0 : s.level
    setMissionLevel('reach5', newLevel)
    setMissionLevel('reach10', newLevel)
  }, [useProtection, useBlessing, awardAchievements, progressMission, resetMissionProgress, setMissionLevel])

  const handleEnhance = useCallback(() => {
    if (enhancing) return
    setEnhancing(true)
    setResult(null)
    setShowMagicCircle(!autoRef.current)
    if (soundRef.current && !autoRef.current) playEnhanceStart()
    setTimeout(() => {
      setShowMagicCircle(false)
      doEnhance()
      setTimeout(() => { setEnhancing(false); setResult(null) }, autoRef.current ? 400 : 1200)
    }, autoRef.current ? 150 : 700)
  }, [enhancing, doEnhance])

  useEffect(() => {
    if (!autoMode || !mounted || enhancing) return
    const s = stateRef.current
    if (s.level >= MAX_LEVEL || s.gold < getEnhanceCost(s.level)) { setAutoMode(false); return }
    const t = setTimeout(handleEnhance, 150)
    return () => clearTimeout(t)
  }, [autoMode, enhancing, mounted, state, handleEnhance])

  const handleBuy = useCallback((item: ShopItem, qty: number) => {
    const price = SHOP[item].price * qty
    setState(prev => {
      if (prev.gold < price) return prev
      const key = item === 'protection' ? 'protectionScrolls' : 'blessingScrolls'
      return { ...prev, gold: prev.gold - price, [key]: prev[key] + qty }
    })
    progressMission(['buyitem'])
    if (soundRef.current) playBuy()
  }, [progressMission])

  const handleClaimMission = useCallback((missionId: string) => {
    const mission = getMissionById(missionId)
    if (!mission) return
    setMissions(prev => {
      if (prev.claimed.includes(missionId)) return prev
      return { ...prev, claimed: [...prev.claimed, missionId] }
    })
    setState(prev => ({ ...prev, gold: prev.gold + mission.reward }))
  }, [])

  const handleSelectWeapon = useCallback((weaponId: string) => {
    setState(prev => {
      if (!prev.weapons[weaponId]) return prev
      const wep = prev.weapons[weaponId]
      return { ...prev, activeWeapon: weaponId, level: wep.level }
    })
    setAutoMode(false)
    if (soundRef.current) playClick()
  }, [])

  const handleUnlockWeapon = useCallback((weaponId: string) => {
    const wDef = WEAPONS.find(w => w.id === weaponId)
    if (!wDef) return
    setState(prev => {
      if (prev.gold < wDef.unlockCost || prev.weapons[weaponId]) return prev
      return {
        ...prev,
        gold: prev.gold - wDef.unlockCost,
        weapons: { ...prev.weapons, [weaponId]: { level: 0, highestLevel: 0 } },
        activeWeapon: weaponId,
        level: 0,
      }
    })
    if (soundRef.current) playBuy()
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('정말 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      setAutoMode(false)
      setState(INITIAL_STATE)
    }
  }, [])

  if (!mounted) return <div className="min-h-dvh bg-gray-950" />

  const tier = getLevelTier(state.level)
  const rates = getEnhanceRates(state.level)
  const cost = getEnhanceCost(state.level)
  const canAfford = state.gold >= cost
  const maxed = state.level >= MAX_LEVEL
  const checkable = canCheckIn(state.lastCheckIn)
  const unclaimedMissions = missions.missionIds.filter(id => {
    const m = getMissionById(id)
    return m && (missions.progress[id] ?? 0) >= m.target && !missions.claimed.includes(id)
  }).length

  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col select-none">
      {showTutorial && <Tutorial onComplete={() => { setShowTutorial(false); localStorage.setItem('sword-tutorial-done', '1') }} />}
      <div className="fixed inset-0 pointer-events-none transition-all duration-1000" style={{ background: `radial-gradient(ellipse at center 35%, ${tier.color}12 0%, transparent 55%)` }} />
      {result === 'destroy' && <div className="fixed inset-0 pointer-events-none z-50 animate-flash-red" />}
      {result === 'success' && <div className="fixed inset-0 pointer-events-none z-50 animate-flash-gold" />}

      {achPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-yellow-900/90 backdrop-blur border border-yellow-600/50 rounded-2xl px-5 py-3 animate-result-in shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{achPopup.icon}</span>
            <div>
              <div className="font-bold text-yellow-300 text-sm">업적 달성!</div>
              <div className="text-white text-sm">{achPopup.name}</div>
              <div className="text-yellow-400 text-xs font-bold">+{achPopup.reward.toLocaleString()}G</div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full">
        <header className="px-4 pt-5 pb-2">
          <h1 className="text-center text-lg font-bold text-gray-300 mb-3">⚔️ 검 강화 시뮬레이터</h1>
          <div className="flex items-center justify-between">
            <div className="text-yellow-400 font-bold text-lg">💰 {state.gold.toLocaleString()}G</div>
            <button onClick={handleCheckIn} disabled={!checkable} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${checkable ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
              {checkable ? '📅 출석체크' : '✅ 출석완료'}
            </button>
          </div>
          {checkInReward !== null && (
            <p className="text-center text-emerald-400 font-bold text-sm mt-2 animate-float-up">+{checkInReward}G 획득! (연속 {state.checkInStreak}일)</p>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tab === 'enhance' && (
            <EnhanceContent
              state={state} tier={tier} rates={rates} cost={cost} canAfford={canAfford} maxed={maxed}
              enhancing={enhancing} result={result} autoMode={autoMode}
              useProtection={useProtection} useBlessing={useBlessing} particleType={particleType}
              showMagicCircle={showMagicCircle} levelBurst={levelBurst}
              soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled(s => !s)}
              onEnhance={handleEnhance} onToggleAuto={() => setAutoMode(a => !a)}
              onToggleProtection={() => { setUseProtection(p => !p); if (soundEnabled) playClick() }}
              onToggleBlessing={() => { setUseBlessing(b => !b); if (soundEnabled) playClick() }}
              onSelectWeapon={handleSelectWeapon} onUnlockWeapon={handleUnlockWeapon}
              onReset={handleReset}
            />
          )}
          {tab === 'shop' && <ShopTab gold={state.gold} protectionScrolls={state.protectionScrolls} blessingScrolls={state.blessingScrolls} onBuy={handleBuy} />}
          {tab === 'missions' && <MissionsTab missions={missions} onClaim={handleClaimMission} />}
          {tab === 'achievements' && <AchievementsTab achieved={state.achievements} />}
        </div>

        <nav className="flex border-t border-gray-800/60 bg-gray-950/90 backdrop-blur">
          {([
            { key: 'enhance' as Tab, icon: '⚔️', label: '강화' },
            { key: 'shop' as Tab, icon: '🏪', label: '상점' },
            { key: 'missions' as Tab, icon: '📋', label: '미션', badge: unclaimedMissions },
            { key: 'achievements' as Tab, icon: '🏆', label: '업적' },
          ]).map(t => (
            <button key={t.key} onClick={() => { setAutoMode(false); setTab(t.key) }} className={`flex-1 py-3 text-center transition-colors relative ${tab === t.key ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              <div className="text-lg">{t.icon}</div>
              <div className="text-[11px] mt-0.5">{t.label}</div>
              {t.badge != null && t.badge > 0 && (
                <span className="absolute top-1.5 right-1/4 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{t.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

/* ───── Enhance Tab ───── */

function EnhanceContent({
  state, tier, rates, cost, canAfford, maxed, enhancing, result, autoMode,
  useProtection, useBlessing, particleType, showMagicCircle, levelBurst,
  soundEnabled, onToggleSound, onSelectWeapon, onUnlockWeapon,
  onEnhance, onToggleAuto, onToggleProtection, onToggleBlessing, onReset,
}: {
  state: GameState; tier: { name: string; color: string }
  rates: { success: number; maintain: number; destroy: number }
  cost: number; canAfford: boolean; maxed: boolean; enhancing: boolean
  result: EnhanceResult | null; autoMode: boolean
  useProtection: boolean; useBlessing: boolean
  particleType: 'success' | 'destroy' | null
  showMagicCircle: boolean; levelBurst: boolean
  soundEnabled: boolean; onToggleSound: () => void
  onEnhance: () => void; onToggleAuto: () => void
  onToggleProtection: () => void; onToggleBlessing: () => void
  onSelectWeapon: (id: string) => void; onUnlockWeapon: (id: string) => void; onReset: () => void
}) {
  const blessingBonus = useBlessing && state.blessingScrolls > 0 ? 10 : 0
  const effectiveSuccess = Math.min(99, rates.success + blessingBonus)

  const weaponDef = WEAPONS.find(w => w.id === state.activeWeapon)

  return (
    <div className="flex flex-col items-center">
      {/* Weapon selector */}
      <WeaponSelect state={state} onSelect={onSelectWeapon} onUnlock={onUnlockWeapon} />

      <div className="py-4 relative">
        <Particles type={particleType} />
        <MagicCircle active={showMagicCircle} color={tier.color} />

        {/* Level-up burst ring */}
        {levelBurst && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full animate-level-burst" style={{ border: `2px solid ${tier.color}`, boxShadow: `0 0 30px ${tier.color}` }} />
        )}

        <div className={`${enhancing && !result ? 'animate-enhance' : ''} ${result === 'destroy' ? 'animate-shake' : ''} ${!enhancing && state.level > 0 ? 'animate-sword-breathe' : ''}`}>
          <Sword level={state.level} color={tier.color} />
        </div>
        <div className="mt-2 text-center">
          <div className={`text-5xl font-black transition-all duration-300 text-glow ${result === 'success' ? 'animate-pop' : ''}`} style={{ color: tier.color }}>+{state.level}</div>
          <div className="text-sm font-bold mt-1 tracking-[0.3em] uppercase text-glow-sm" style={{ color: tier.color }}>{tier.name}</div>
        </div>
        {result && (
          <div className={`mt-2 text-center text-xl font-black animate-result-in text-glow ${result === 'success' ? 'text-yellow-400' : result === 'maintain' ? 'text-blue-400' : 'text-red-500'}`}>
            {result === 'success' && '✨ 강화 성공!'}{result === 'maintain' && '😐 유지'}{result === 'destroy' && '💥 파괴!!!'}
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        {!maxed ? (
          <>
            <div className="glass-card rounded-xl p-4">
              <div className="flex justify-between text-sm mb-3 text-gray-300">
                <span>+{state.level} → +{state.level + 1}</span>
                <span className="text-yellow-400 font-medium">{cost.toLocaleString()}G</span>
              </div>
              <div className="flex gap-2">
                <RateBox label="성공" value={effectiveSuccess} boosted={blessingBonus > 0} variant="emerald" />
                <RateBox label="유지" value={rates.maintain} variant="blue" />
                <RateBox label="파괴" value={useProtection && state.protectionScrolls > 0 ? 0 : rates.destroy} variant="red" shielded={useProtection && state.protectionScrolls > 0 && rates.destroy > 0} />
              </div>
            </div>

            <div className="flex gap-2">
              <ItemToggle icon="🛡️" label="보호" count={state.protectionScrolls} active={useProtection && state.protectionScrolls > 0} disabled={state.protectionScrolls === 0} onToggle={onToggleProtection} />
              <ItemToggle icon="✨" label="축복" count={state.blessingScrolls} active={useBlessing && state.blessingScrolls > 0} disabled={state.blessingScrolls === 0} onToggle={onToggleBlessing} />
            </div>

            <button onClick={onEnhance} disabled={enhancing || !canAfford || autoMode} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${enhancing || autoMode ? 'bg-amber-700/40 cursor-wait' : canAfford ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98] shadow-lg shadow-orange-900/40' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
              {enhancing ? '🔮 강화 중...' : canAfford ? '🔥 강화하기' : '💰 골드 부족'}
            </button>
            <button onClick={onToggleAuto} disabled={!canAfford && !autoMode} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${autoMode ? 'bg-red-700 hover:bg-red-600 ring-2 ring-red-400/50 animate-pulse-ring' : canAfford ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-900 text-gray-600 cursor-not-allowed'}`}>
              {autoMode ? '⏹️ 자동 강화 중지' : '⚡ 자동 강화'}
            </button>
          </>
        ) : (
          <div className="text-center py-6 text-yellow-400 text-xl font-black animate-pulse">🏆 최고 레벨 달성!</div>
        )}

        {state.enhanceLog.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800/30">
            <div className="text-xs text-gray-500 mb-2">최근 강화 기록</div>
            <div className="flex flex-wrap gap-1">
              {state.enhanceLog.slice(0, 12).map((e, i) => (
                <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${e.result === 'success' ? 'bg-emerald-900/40 text-emerald-400' : e.result === 'maintain' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'}`}>
                  +{e.from}{e.result === 'success' ? '→✨' : e.result === 'maintain' ? '→😐' : '→💥'}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-800/40">
          <div className="grid grid-cols-3 gap-y-3 text-sm text-center">
            <Stat label="시도" value={state.totalAttempts} />
            <Stat label="성공" value={state.totalSuccess} color="text-emerald-400" />
            <Stat label="파괴" value={state.totalDestroy} color="text-red-400" />
            <Stat label="유지" value={state.totalMaintain} color="text-blue-400" />
            <Stat label="최고" value={`+${state.highestLevel}`} color="text-yellow-400" />
            <Stat label="출석" value={`${state.checkInStreak}일`} />
          </div>
        </div>

        <AdBanner className="my-2 min-h-[100px] rounded-xl overflow-hidden" />

        <ShareButton state={state} />

        <div className="flex gap-2">
          <button onClick={onToggleSound} className={`flex-1 py-2 rounded-lg text-xs transition-colors ${soundEnabled ? 'bg-gray-800 text-gray-300' : 'bg-gray-900 text-gray-600'}`}>
            {soundEnabled ? '🔊 사운드 ON' : '🔇 사운드 OFF'}
          </button>
          <button onClick={onReset} className="flex-1 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 bg-gray-900 transition-colors">초기화</button>
        </div>
      </div>
    </div>
  )
}

/* ───── Sub-components ───── */

function RateBox({ label, value, variant, boosted, shielded }: { label: string; value: number; variant: string; boosted?: boolean; shielded?: boolean }) {
  const bg: Record<string, string> = { emerald: 'bg-emerald-900/30 text-emerald-400', blue: 'bg-blue-900/30 text-blue-400', red: 'bg-red-900/30 text-red-400' }
  return (
    <div className={`flex-1 rounded-lg p-2 text-center ${bg[variant]}`}>
      <div className="font-bold">
        {shielded ? <span className="line-through opacity-50">{value}%</span> : `${value}%`}
        {boosted && <span className="text-[10px] text-yellow-400 ml-0.5">↑</span>}
        {shielded && <span className="text-[10px] ml-1">🛡️</span>}
      </div>
      <div className="text-[11px] text-gray-400">{label}</div>
    </div>
  )
}

function ItemToggle({ icon, label, count, active, disabled, onToggle }: { icon: string; label: string; count: number; active: boolean; disabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} disabled={disabled} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${active ? 'bg-indigo-600/80 ring-2 ring-indigo-400/40 text-white' : disabled ? 'bg-gray-900 text-gray-600 cursor-not-allowed' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
      <span>{icon}</span><span>{label}</span>
      <span className={`text-xs ${active ? 'text-indigo-200' : 'text-gray-500'}`}>x{count}</span>
    </button>
  )
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div>
      <div className={`font-bold ${color ?? 'text-white'}`}>{value}</div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  )
}
