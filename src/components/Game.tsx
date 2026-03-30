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
import StatsTab from './StatsTab'
import Tutorial from './Tutorial'
import BackgroundStars from './BackgroundStars'
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
  getFailStackBonus,
  canPrestige,
  getPrestigePoints,
  getPrestigeReward,
  getOfflineGold,
} from '@/lib/gameLogic'
import { type Achievement, getNewAchievements } from '@/lib/achievements'
import { playEnhanceStart, playSuccess, playMaintain, playDestroy, playCheckIn, playBuy, playAchievement, playClick } from '@/lib/sounds'
import { WEAPONS } from '@/lib/weapons'
import { getActiveEvents, getSuccessBoost, getCostDiscount } from '@/lib/events'
import {
  type DailyMissionState,
  getInitialMissionState,
  getMissionById,
} from '@/lib/missions'

const STORAGE_KEY = 'sword-enhance-v2'
const MISSIONS_KEY = 'sword-missions-v1'
type Tab = 'enhance' | 'shop' | 'missions' | 'achievements' | 'stats'

function loadState(): GameState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const v1 = localStorage.getItem('sword-enhance-v1')
      if (v1) {
        const old = JSON.parse(v1)
        return {
          ...INITIAL_STATE,
          ...old,
          weapons: { sword: { level: old.level ?? 0, highestLevel: old.highestLevel ?? 0 } },
        }
      }
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
  const [offlineReward, setOfflineReward] = useState<{ gold: number; minutes: number } | null>(null)

  const stateRef = useRef(state)
  stateRef.current = state
  const autoRef = useRef(false)
  autoRef.current = autoMode
  const missionsRef = useRef(missions)
  missionsRef.current = missions
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled

  useEffect(() => {
    const loaded = loadState()
    // Offline gold calculation
    if (loaded.lastOnline && loaded.lastOnline > 0) {
      const reward = getOfflineGold(loaded.lastOnline, loaded.prestige)
      if (reward.gold > 0) {
        loaded.gold += reward.gold
        setOfflineReward(reward)
        setTimeout(() => setOfflineReward(null), 4000)
      }
    }
    loaded.lastOnline = Date.now()
    setState(loaded)
    setMissions(loadMissions())
    setMounted(true)
    if (!localStorage.getItem('sword-tutorial-done')) setShowTutorial(true)
  }, [])

  useEffect(() => {
    if (mounted) saveState({ ...state, lastOnline: Date.now() })
  }, [state, mounted])
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

  const achQueueRef = useRef<Achievement[]>([])

  const awardAchievements = useCallback((s: GameState): GameState => {
    const fresh = getNewAchievements(s)
    if (fresh.length === 0) return s
    const ids = fresh.map(a => a.id)
    const bonus = fresh.reduce((sum, a) => sum + a.reward, 0)
    // Queue popups outside setState to avoid StrictMode double-invocation issues
    achQueueRef.current = [...achQueueRef.current, ...fresh]
    return { ...s, achievements: [...s.achievements, ...ids], gold: s.gold + bonus }
  }, [])

  // Process achievement popup queue
  useEffect(() => {
    if (achQueueRef.current.length === 0 || achPopup) return
    const next = achQueueRef.current[0]
    achQueueRef.current = achQueueRef.current.slice(1)
    setAchPopup(next)
    if (soundRef.current) playAchievement()
    const t = setTimeout(() => setAchPopup(null), 2500)
    return () => clearTimeout(t)
  }, [achPopup, state])

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
    // Bug fix: use weapon level, not state.level (which may be stale after weapon switch)
    const weaponLevel = s.weapons[s.activeWeapon]?.level ?? s.level
    if (weaponLevel >= MAX_LEVEL) return
    const baseCost = getEnhanceCost(weaponLevel)
    const discount = getCostDiscount()
    const cost = Math.max(1, Math.floor(baseCost * (1 - discount / 100)))
    if (s.gold < cost) { setAutoMode(false); return }

    const wantProtect = useProtection && s.protectionScrolls > 0
    const wantBless = useBlessing && s.blessingScrolls > 0
    const eventBoost = getSuccessBoost()

    const rawResult = rollEnhance(weaponLevel, wantBless, s.failStack + (s.prestigeBonus ?? 0) * 2 + eventBoost * 2)
    const wasDestroyed = rawResult === 'destroy'
    const r: EnhanceResult = wasDestroyed && wantProtect ? 'maintain' : rawResult

    setResult(r)
    if (soundRef.current) {
      if (r === 'success') playSuccess()
      else if (wasDestroyed) playDestroy()
      else if (r === 'downgrade') playDestroy()
      else playMaintain()
    }
    if (r === 'success') {
      setParticleType('success')
      setLevelBurst(true)
      setTimeout(() => { setParticleType(null); setLevelBurst(false) }, 1500)
    } else if (wasDestroyed && !wantProtect) {
      setParticleType('destroy')
      setTimeout(() => setParticleType(null), 1500)
    } else if (r === 'downgrade') {
      setParticleType('destroy')
      setTimeout(() => setParticleType(null), 1500)
    }

    setState(prev => {
      const curLevel = prev.weapons[prev.activeWeapon]?.level ?? prev.level
      const newLevel = r === 'success'
        ? curLevel + 1
        : r === 'downgrade'
          ? Math.max(0, curLevel - 1)
          : rawResult === 'destroy' && !wantProtect
            ? 0
            : curLevel
      const entry = { from: curLevel, result: r, ts: Date.now(), usedProtection: wantProtect, usedBlessing: wantBless }
      const wep = prev.weapons[prev.activeWeapon] ?? { level: 0, highestLevel: 0 }
      const updatedWeapons = { ...prev.weapons, [prev.activeWeapon]: { level: newLevel, highestLevel: Math.max(wep.highestLevel, newLevel) } }
      // Bug fix: count actual destroy (not protected maintain)
      const actualDestroy = wasDestroyed && !wantProtect
      const updated: GameState = {
        ...prev,
        level: newLevel,
        gold: prev.gold - cost,
        totalAttempts: prev.totalAttempts + 1,
        totalSuccess: prev.totalSuccess + (r === 'success' ? 1 : 0),
        totalMaintain: prev.totalMaintain + (r === 'maintain' ? 1 : 0),
        totalDestroy: prev.totalDestroy + (actualDestroy ? 1 : 0),
        highestLevel: Math.max(prev.highestLevel, newLevel),
        protectionScrolls: prev.protectionScrolls - (wantProtect ? 1 : 0),
        blessingScrolls: prev.blessingScrolls - (wantBless ? 1 : 0),
        enhanceLog: [entry, ...prev.enhanceLog.slice(0, MAX_LOG - 1)],
        weapons: updatedWeapons,
        totalGoldSpent: (prev.totalGoldSpent ?? 0) + cost,
        failStack: r === 'success' ? 0 : prev.failStack + 1,
        maxFailStack: Math.max(prev.maxFailStack, r === 'success' ? prev.failStack : prev.failStack + 1),
      }
      return awardAchievements(updated)
    })

    // Mission progress
    progressMission(['enhance5', 'enhance15', 'enhance30'])
    if (r === 'success') progressMission(['success3', 'success10'])
    // Bug fix: survive5 should only reset on actual destroy (not protected)
    if (wasDestroyed && !wantProtect) {
      resetMissionProgress('survive5')
    } else {
      progressMission(['survive5'])
    }
    if (wantProtect) progressMission(['useprotect'])
    if (wantBless) progressMission(['usebless'])

    const newLevel = r === 'success' ? weaponLevel + 1 : r === 'downgrade' ? Math.max(0, weaponLevel - 1) : (wasDestroyed && !wantProtect) ? 0 : weaponLevel
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
    const wLv = s.weapons[s.activeWeapon]?.level ?? s.level
    if (wLv >= MAX_LEVEL || s.gold < getEnhanceCost(wLv)) { setAutoMode(false); return }
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

  const handlePrestige = useCallback(() => {
    const s = stateRef.current
    if (!canPrestige(s.highestLevel)) return
    const points = getPrestigePoints(s.highestLevel)
    if (!confirm(`환생하시겠습니까?\n\n레벨, 무기, 주문서가 초기화됩니다.\n획득: 프레스티지 +${points}포인트\n(영구 성공률 보너스 + 골드 배율 증가)`)) return

    const newPrestige = s.prestige + points
    const { bonus, goldMultiplier } = getPrestigeReward(s.highestLevel, s.prestige)
    setState(prev => ({
      ...INITIAL_STATE,
      gold: 1000 + Math.floor(1000 * goldMultiplier),
      prestige: newPrestige,
      prestigeBonus: bonus,
      totalGoldSpent: prev.totalGoldSpent,
      achievements: prev.achievements,
      lastCheckIn: prev.lastCheckIn,
      checkInStreak: prev.checkInStreak,
      lastOnline: Date.now(),
    }))
    setAutoMode(false)
    if (soundRef.current) playAchievement()
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('정말 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      setAutoMode(false)
      setState(INITIAL_STATE)
      const today = new Date().toISOString().split('T')[0]
      setMissions(getInitialMissionState(today))
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
      <BackgroundStars level={state.level} color={tier.color} />
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
          {state.prestige > 0 && (
            <div className="text-center text-xs text-purple-400 mt-1">⭐ 프레스티지 {state.prestige} (성공률 +{(state.prestigeBonus ?? 0).toFixed(1)}%)</div>
          )}
          {checkInReward !== null && (
            <p className="text-center text-emerald-400 font-bold text-sm mt-2 animate-float-up">+{checkInReward}G 획득! (연속 {state.checkInStreak}일)</p>
          )}
          {offlineReward && (
            <div className="text-center mt-2 animate-result-in">
              <p className="text-yellow-400 font-bold text-sm">💤 오프라인 보상: +{offlineReward.gold.toLocaleString()}G</p>
              <p className="text-gray-500 text-xs">{offlineReward.minutes}분 동안 수집</p>
            </div>
          )}
        </header>

        {/* Active events banner */}
        {mounted && getActiveEvents().length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {getActiveEvents().map(e => (
                <div key={e.id} className="shrink-0 glass-card rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <span className="text-sm">{e.icon}</span>
                  <span className="text-[10px] text-gray-300 whitespace-nowrap">{e.name}: {e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
          {tab === 'shop' && (
            <div className="space-y-4">
              <ShopTab gold={state.gold} protectionScrolls={state.protectionScrolls} blessingScrolls={state.blessingScrolls} onBuy={handleBuy} />
              {/* Prestige section */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-bold text-purple-400 mb-2">⭐ 환생 (프레스티지)</h3>
                <p className="text-xs text-gray-400 mb-3">레벨과 무기를 초기화하고 영구 보너스를 획득합니다.</p>
                {canPrestige(state.highestLevel) ? (
                  <>
                    <div className="text-xs text-gray-300 mb-2 space-y-1">
                      <p>획득 포인트: <span className="text-purple-400 font-bold">+{getPrestigePoints(state.highestLevel)}</span></p>
                      <p>현재 보너스: 성공률 +{(state.prestigeBonus ?? 0).toFixed(1)}% / 골드 x{(1 + (state.prestige ?? 0) * 0.1).toFixed(1)}</p>
                    </div>
                    <button onClick={handlePrestige} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all active:scale-[0.98]">
                      ⭐ 환생하기
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">+10 이상 달성 시 환생 가능</p>
                )}
              </div>
            </div>
          )}
          {tab === 'missions' && <MissionsTab missions={missions} onClaim={handleClaimMission} />}
          {tab === 'achievements' && <AchievementsTab achieved={state.achievements} />}
          {tab === 'stats' && <StatsTab state={state} />}
        </div>

        <nav className="flex border-t border-gray-800/60 bg-gray-950/90 backdrop-blur">
          {([
            { key: 'enhance' as Tab, icon: '⚔️', label: '강화' },
            { key: 'shop' as Tab, icon: '🏪', label: '상점' },
            { key: 'missions' as Tab, icon: '📋', label: '미션', badge: unclaimedMissions },
            { key: 'achievements' as Tab, icon: '🏆', label: '업적' },
            { key: 'stats' as Tab, icon: '📊', label: '통계' },
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
  rates: { success: number; maintain: number; downgrade: number; destroy: number }
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
  const stackBonus = getFailStackBonus(state.failStack)
  const eventBonus = getSuccessBoost()
  const totalBonus = blessingBonus + stackBonus + eventBonus + (state.prestigeBonus ?? 0)
  const effectiveSuccess = Math.min(99, rates.success + totalBonus)

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
          <Sword level={state.level} color={tier.color} weaponType={state.activeWeapon} />
        </div>
        <div className="mt-2 text-center">
          <div className={`text-5xl font-black transition-all duration-300 text-glow ${result === 'success' ? 'animate-pop' : ''}`} style={{ color: tier.color }}>+{state.level}</div>
          <div className="text-sm font-bold mt-1 tracking-[0.3em] uppercase text-glow-sm" style={{ color: tier.color }}>{tier.name}</div>
        </div>
        {result && (
          <div className={`mt-2 text-center text-xl font-black animate-result-in text-glow ${result === 'success' ? 'text-yellow-400' : result === 'downgrade' ? 'text-orange-400' : result === 'maintain' ? 'text-blue-400' : 'text-red-500'}`}>
            {result === 'success' && '✨ 강화 성공!'}{result === 'maintain' && '😐 유지'}{result === 'downgrade' && '📉 하락!'}{result === 'destroy' && '💥 파괴!!!'}
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        {!maxed ? (
          <>
            {/* Level progress bar */}
            <div className="glass-card rounded-xl p-3">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>+0</span>
                <span>+30</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(state.level / 30) * 100}%`,
                    background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
                    boxShadow: `0 0 8px ${tier.color}60`,
                  }}
                />
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex justify-between text-sm mb-1 text-gray-300">
                <span>+{state.level} → +{state.level + 1}</span>
                <span className="text-yellow-400 font-medium">{cost.toLocaleString()}G</span>
              </div>
              {state.failStack > 0 && (
                <div className="text-xs text-orange-400 mb-2">
                  🔥 페일스택: {state.failStack} (성공률 +{stackBonus.toFixed(1)}%)
                </div>
              )}
              <div className="flex gap-1.5">
                <RateBox label="성공" value={effectiveSuccess} boosted={blessingBonus > 0 || stackBonus > 0} variant="emerald" />
                <RateBox label="유지" value={rates.maintain} variant="blue" />
                {rates.downgrade > 0 && <RateBox label="하락" value={rates.downgrade} variant="orange" />}
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
                <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${e.result === 'success' ? 'bg-emerald-900/40 text-emerald-400' : e.result === 'maintain' ? 'bg-blue-900/40 text-blue-400' : e.result === 'downgrade' ? 'bg-orange-900/40 text-orange-400' : 'bg-red-900/40 text-red-400'}`}>
                  +{e.from}{e.result === 'success' ? '→✨' : e.result === 'maintain' ? '→😐' : e.result === 'downgrade' ? '→📉' : '→💥'}
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
            <Stat label="소비" value={`${((state.totalGoldSpent ?? 0) / 1000).toFixed(0)}K`} color="text-gray-400" />
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
  const bg: Record<string, string> = { emerald: 'bg-emerald-900/30 text-emerald-400', blue: 'bg-blue-900/30 text-blue-400', orange: 'bg-orange-900/30 text-orange-400', red: 'bg-red-900/30 text-red-400' }
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
