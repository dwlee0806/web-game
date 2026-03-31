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
import HeroGuide, { type GuideStep } from './HeroGuide'
import HeroAvatar from './HeroAvatar'
import BackgroundStars from './BackgroundStars'
import SwordEffects from './SwordEffects'
import GlobalFeed from './GlobalFeed'
import EnhanceGauge from './EnhanceGauge'
import AuthScreen from './AuthScreen'
import { getCurrentUser, logout, getUserSaveKey, isAdmin } from '@/lib/auth'
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
  rollSpecialSkin,
} from '@/lib/gameLogic'
import { type Achievement, ACHIEVEMENTS, getNewAchievements, checkEasterEgg } from '@/lib/achievements'
import { playEnhanceStart, playSuccess, playMaintain, playDestroy, playCheckIn, playBuy, playAchievement, playClick } from '@/lib/sounds'
import { WEAPONS } from '@/lib/weapons'
import { getActiveEvents, getSuccessBoost, getCostDiscount, getDestroyReduction } from '@/lib/events'
import { detectLocale, t, type Locale } from '@/lib/i18n'
import {
  type AllMissionsState,
  loadAllMissions,
  saveAllMissions,
  getMissionById,
  getMissionTag,
} from '@/lib/missions'

const DEFAULT_STORAGE_KEY = 'sword-enhance-v2'
// Missions now managed by missions.ts (v2)
type Tab = 'enhance' | 'shop' | 'missions' | 'achievements' | 'stats' | 'notices'

function loadState(userId: string | null): GameState {
  if (typeof window === 'undefined') return INITIAL_STATE
  const key = userId ? getUserSaveKey(userId) : DEFAULT_STORAGE_KEY
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      // v1 migration (guest only)
      if (!userId) {
        const v1 = localStorage.getItem('sword-enhance-v1')
        if (v1) {
          const old = JSON.parse(v1)
          return { ...INITIAL_STATE, ...old, weapons: { sword: { level: old.level ?? 0, highestLevel: old.highestLevel ?? 0 } } }
        }
      }
      return INITIAL_STATE
    }
    return { ...INITIAL_STATE, ...JSON.parse(raw) }
  } catch {
    return INITIAL_STATE
  }
}

function saveState(state: GameState, userId: string | null) {
  const key = userId ? getUserSaveKey(userId) : DEFAULT_STORAGE_KEY
  try { localStorage.setItem(key, JSON.stringify({ ...state, lastOnline: Date.now() })) } catch { /* */ }
}

// Missions now use loadAllMissions/saveAllMissions from missions.ts

export default function Game() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const [missions, setMissions] = useState<AllMissionsState>(() => loadAllMissions())
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<Tab>('enhance')
  const [enhancing, setEnhancing] = useState(false)
  const [result, setResult] = useState<EnhanceResult | null>(null)
  const [checkInReward, setCheckInReward] = useState<number | null>(null)
  const [useProtection, setUseProtection] = useState(false)
  const [useBlessing, setUseBlessing] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [autoTarget, setAutoTarget] = useState(16) // target level for auto-enhance
  const [achPopup, setAchPopup] = useState<Achievement | null>(null)
  const [particleType, setParticleType] = useState<'success' | 'destroy' | null>(null)
  const [showMagicCircle, setShowMagicCircle] = useState(false)
  const [levelBurst, setLevelBurst] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [guideStep, setGuideStep] = useState<GuideStep>(null)
  const [offlineReward, setOfflineReward] = useState<{ gold: number; minutes: number } | null>(null)
  const [locale, setLocale] = useState<Locale>('ko')
  const [gaugeActive, setGaugeActive] = useState(false)
  const [gaugeProgress, setGaugeProgress] = useState(0)
  const [shattered, setShattered] = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state
  const autoRef = useRef(false)
  autoRef.current = autoMode
  const autoTargetRef = useRef(autoTarget)
  autoTargetRef.current = autoTarget
  const missionsRef = useRef(missions)
  missionsRef.current = missions
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled

  const initGame = useCallback((uid: string | null) => {
    const loaded = loadState(uid)
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
    setMissions(loadAllMissions())
    setMounted(true)
    setLocale(detectLocale())
    if (!localStorage.getItem('sword-guide-done')) {
      setGuideStep('enhance_intro')
    }
  }, [])

  useEffect(() => {
    const existingUser = getCurrentUser()
    if (existingUser) {
      setUserId(existingUser)
      initGame(existingUser)
    }
    setAuthChecked(true)

    // Easter egg event listener
    const handleEE = (e: Event) => {
      const id = (e as CustomEvent).detail as string
      setState(prev => {
        if (prev.achievements.includes(id)) return prev
        const ach = ACHIEVEMENTS.find(a => a.id === id)
        if (!ach) return prev
        achQueueRef.current = [...achQueueRef.current, ach]
        return { ...prev, achievements: [...prev.achievements, id], gold: prev.gold + (ach.reward ?? 0) }
      })
    }
    window.addEventListener('easter-egg', handleEE)
    return () => window.removeEventListener('easter-egg', handleEE)
  }, [initGame])

  useEffect(() => {
    if (mounted) saveState(state, userId)
  }, [state, mounted, userId])
  useEffect(() => { if (mounted) saveAllMissions(missions) }, [missions, mounted, userId])

  // Helper: update progress for a specific period
  function updatePeriodProgress(prev: AllMissionsState, period: 'daily' | 'weekly' | 'monthly', updater: (progress: Record<string, number>, missions: string[], claimed: string[]) => Record<string, number>): AllMissionsState {
    const p = prev[period]
    const newProgress = updater({ ...p.data.progress }, p.missions, p.data.claimed)
    if (newProgress === p.data.progress) return prev
    const newData = { ...p.data, progress: newProgress }
    if (period === 'daily') return { ...prev, daily: { ...prev.daily, data: newData } }
    if (period === 'weekly') return { ...prev, weekly: { ...prev.weekly, data: newData } }
    return { ...prev, monthly: { ...prev.monthly, data: newData } }
  }

  // Tag-based mission progress: matches missions by their 'tag' field
  const progressMission = useCallback((tags: string[]) => {
    setMissions(prev => {
      let result = prev
      for (const period of ['daily', 'weekly', 'monthly'] as const) {
        result = updatePeriodProgress(result, period, (progress, missions, claimed) => {
          missions.forEach(mid => {
            const mTag = getMissionTag(mid)
            if (mTag && tags.includes(mTag) && !claimed.includes(mid)) {
              progress[mid] = (progress[mid] ?? 0) + 1
            }
          })
          return progress
        })
      }
      return result
    })
  }, [])

  const resetMissionProgress = useCallback((tag: string) => {
    setMissions(prev => {
      let result = prev
      for (const period of ['daily', 'weekly', 'monthly'] as const) {
        result = updatePeriodProgress(result, period, (progress, missions, claimed) => {
          missions.forEach(mid => {
            if (getMissionTag(mid) === tag && !claimed.includes(mid)) {
              progress[mid] = 0
            }
          })
          return progress
        })
      }
      return result
    })
  }, [])

  const setMissionLevel = useCallback((tag: string, level: number) => {
    setMissions(prev => {
      let result = prev
      for (const period of ['daily', 'weekly', 'monthly'] as const) {
        result = updatePeriodProgress(result, period, (progress, missions) => {
          missions.forEach(mid => {
            if (getMissionTag(mid) === tag) {
              progress[mid] = Math.max(progress[mid] ?? 0, level)
            }
          })
          return progress
        })
      }
      return result
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
    // Update streak missions
    setMissionLevel('streak', continued ? stateRef.current.checkInStreak + 1 : 1)
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
    const isAdminUser = isAdmin(stateRef.current ? userId : null)
    if (!isAdminUser && s.gold < cost) {
      setAutoMode(false)
      if (!localStorage.getItem('sword-guide-gold-shown')) {
        setGuideStep('gold_empty')
        localStorage.setItem('sword-guide-gold-shown', '1')
      }
      return
    }

    const wantProtect = useProtection && s.protectionScrolls > 0
    const wantBless = useBlessing && s.blessingScrolls > 0
    const eventBoost = getSuccessBoost()

    let rawResult = rollEnhance(weaponLevel, wantBless, s.failStack + (s.prestigeBonus ?? 0) * 2 + eventBoost * 2)
    // lunch_safe event: 50% chance to convert destroy → downgrade
    const destroyReduction = getDestroyReduction()
    if (rawResult === 'destroy' && destroyReduction > 0 && Math.random() * 100 < destroyReduction) {
      rawResult = 'downgrade'
    }
    const wasDestroyed = rawResult === 'destroy'
    const r: EnhanceResult = wasDestroyed && wantProtect ? 'maintain' : rawResult

    setResult(r)
    // Gauge final position: success = within success zone, fail = outside
    const rates = getEnhanceRates(weaponLevel)
    if (r === 'success') {
      setGaugeProgress(Math.random() * rates.success * 0.01)
    } else {
      // Near-miss: land just outside success boundary for drama
      const nearMiss = Math.random() < 0.3
      setGaugeProgress(nearMiss ? (rates.success + 2 + Math.random() * 5) * 0.01 : (rates.success + 10 + Math.random() * 40) * 0.01)
    }
    // Shatter on actual destroy
    if (wasDestroyed && !wantProtect) {
      setShattered(true)
      setTimeout(() => setShattered(false), 1500)
    }
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
      // Easter egg: 5% chance of special skin on destroy
      const newSkin = actualDestroy ? rollSpecialSkin(prev.discoveredSkins ?? []) : prev.specialSkin
      const newDiscovered = newSkin && actualDestroy && !(prev.discoveredSkins ?? []).includes(newSkin)
        ? [...(prev.discoveredSkins ?? []), newSkin]
        : (prev.discoveredSkins ?? [])
      const updated: GameState = {
        ...prev,
        level: newLevel,
        gold: isAdminUser ? prev.gold : prev.gold - cost,
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
        specialSkin: newSkin,
        discoveredSkins: newDiscovered,
      }
      return awardAchievements(updated)
    })

    // Mission progress
    // Mission progress (tag-based)
    progressMission(['enhance'])
    if (r === 'success') progressMission(['success'])
    if (wasDestroyed && !wantProtect) {
      resetMissionProgress('survive')
      progressMission(['destroy'])
    } else {
      progressMission(['survive'])
    }
    if (wantProtect) progressMission(['useprotect'])
    if (wantBless) progressMission(['usebless'])

    const newLevel = r === 'success' ? weaponLevel + 1 : r === 'downgrade' ? Math.max(0, weaponLevel - 1) : (wasDestroyed && !wantProtect) ? 0 : weaponLevel
    setMissionLevel('reach', newLevel)
  }, [useProtection, useBlessing, awardAchievements, progressMission, resetMissionProgress, setMissionLevel])

  const handleEnhance = useCallback(() => {
    if (enhancing) return
    setEnhancing(true)
    setResult(null)
    setShattered(false)
    const isAuto = autoRef.current
    setShowMagicCircle(!isAuto)
    if (!isAuto) { setGaugeActive(true); setGaugeProgress(0) }
    if (soundRef.current && !isAuto) playEnhanceStart()
    setTimeout(() => {
      setShowMagicCircle(false)
      doEnhance()
      // Set gauge final position based on result
      setTimeout(() => {
        setGaugeActive(false)
        setEnhancing(false)
        setResult(null)
      }, isAuto ? 400 : 1400)
    }, isAuto ? 150 : 800)
  }, [enhancing, doEnhance])

  useEffect(() => {
    if (!autoMode || !mounted || enhancing) return
    const s = stateRef.current
    const wLv = s.weapons[s.activeWeapon]?.level ?? s.level
    if (wLv >= MAX_LEVEL || wLv >= autoTargetRef.current || (!isAdmin(userId) && s.gold < getEnhanceCost(wLv))) { setAutoMode(false); return }
    const t = setTimeout(handleEnhance, 150)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode, enhancing, mounted, handleEnhance])

  const handleBuy = useCallback((item: ShopItem, qty: number) => {
    const price = SHOP[item].price * qty
    setState(prev => {
      if (prev.gold < price) return prev
      const key = item === 'protection' ? 'protectionScrolls' : 'blessingScrolls'
      return { ...prev, gold: prev.gold - price, [key]: prev[key] + qty }
    })
    progressMission(['buy'])
    if (soundRef.current) playBuy()
  }, [progressMission])

  const handleClaimMission = useCallback((missionId: string, type: 'daily' | 'weekly' | 'monthly') => {
    const mission = getMissionById(missionId)
    if (!mission) return
    setMissions(prev => {
      const p = prev[type]
      if (p.data.claimed.includes(missionId)) return prev
      const newData = { ...p.data, claimed: [...p.data.claimed, missionId] }
      if (type === 'daily') return { ...prev, daily: { ...prev.daily, data: newData } }
      if (type === 'weekly') return { ...prev, weekly: { ...prev.weekly, data: newData } }
      return { ...prev, monthly: { ...prev.monthly, data: newData } }
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
    progressMission(['prestige'])
    // Update weapon count mission
    setMissionLevel('weapons', Object.keys(stateRef.current.weapons ?? {}).length)
    if (soundRef.current) playAchievement()
  }, [progressMission, setMissionLevel])

  const handleLogout = useCallback(() => {
    logout()
    setUserId(null)
    setMounted(false)
    setAutoMode(false)
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('정말 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      setAutoMode(false)
      setState(INITIAL_STATE)
      // Clear missions from localStorage before reloading
      localStorage.removeItem('sword-missions-v2')
      setMissions(loadAllMissions())
    }
  }, [])

  if (!authChecked) return <div className="min-h-dvh bg-gray-950" />

  // Show auth screen if not logged in and not guest
  if (!mounted) {
    return (
      <AuthScreen
        onAuth={(uid) => { setUserId(uid); initGame(uid) }}
        onGuest={() => { setUserId(null); initGame(null) }}
      />
    )
  }

  const tier = getLevelTier(state.level)
  const rates = getEnhanceRates(state.level)
  const cost = getEnhanceCost(state.level)
  const canAfford = isAdmin(userId) || state.gold >= cost
  const maxed = state.level >= MAX_LEVEL
  const checkable = canCheckIn(state.lastCheckIn)
  const unclaimedMissions = (['daily', 'weekly', 'monthly'] as const).reduce((count, period) => {
    const p = missions[period]
    return count + p.missions.filter(id => {
      const m = getMissionById(id)
      return m && (p.data.progress[id] ?? 0) >= m.target && !p.data.claimed.includes(id)
    }).length
  }, 0)

  return (
    <div className="h-dvh bg-gray-950 lg:bg-transparent text-white flex flex-col select-none relative z-10 overflow-hidden">
      <HeroGuide step={guideStep} onDismiss={() => {
        if (guideStep === 'enhance_intro') {
          setGuideStep(null)
          localStorage.setItem('sword-guide-done', '1')
        } else if (guideStep === 'gold_empty') {
          setGuideStep(null)
        } else {
          setGuideStep(null)
        }
      }} />
      <BackgroundStars level={state.level} color={tier.color} />

      {/* Center panel backdrop with side fade */}
      <div className="fixed inset-0 pointer-events-none z-[1] hidden lg:block">
        <div className="absolute inset-0 flex justify-center">
          <div className="relative w-full max-w-lg">
            {/* Left fade */}
            <div className="absolute -left-32 top-0 bottom-0 w-32" style={{ background: 'linear-gradient(to right, transparent, rgba(3,7,18,0.85))' }} />
            {/* Center dark */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(3,7,18,0.82)' }} />
            {/* Right fade */}
            <div className="absolute -right-32 top-0 bottom-0 w-32" style={{ background: 'linear-gradient(to left, transparent, rgba(3,7,18,0.85))' }} />
          </div>
        </div>
      </div>
      {/* Mobile full dark bg */}
      <div className="fixed inset-0 pointer-events-none z-[1] lg:hidden bg-gray-950" />

      <div className="fixed inset-0 pointer-events-none transition-all duration-1000 z-[2]" style={{ background: `radial-gradient(ellipse at center 35%, ${tier.color}12 0%, transparent 55%)` }} />
      {result === 'destroy' && <div className="fixed inset-0 pointer-events-none z-50 animate-flash-red" />}
      {result === 'success' && <div className="fixed inset-0 pointer-events-none z-50 animate-flash-gold" />}

      {achPopup && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-start justify-center pt-16">
          {/* Burst rays */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-60 h-60 animate-ach-burst" style={{ background: `radial-gradient(circle, ${achPopup.icon === '👑' ? '#FFD700' : '#F59E0B'}30 0%, transparent 60%)` }} />
          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute animate-ach-confetti" style={{
              top: '10%', left: '50%',
              width: 4 + Math.random() * 4, height: 4 + Math.random() * 4,
              backgroundColor: ['#FFD700', '#EF4444', '#4ADE80', '#60A5FA', '#EC4899', '#A78BFA', '#F59E0B', '#10B981'][i],
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              animationDelay: `${i * 0.08}s`,
              '--confetti-x': `${(Math.random() - 0.5) * 200}px`,
              '--confetti-y': `${40 + Math.random() * 80}px`,
              '--confetti-r': `${Math.random() * 720 - 360}deg`,
            } as React.CSSProperties} />
          ))}
          {/* Card */}
          <div className="relative animate-ach-popup" style={{ animationDuration: '2.5s' }}>
            <div className="bg-gradient-to-b from-yellow-900/95 to-amber-950/95 backdrop-blur-lg border border-yellow-500/40 rounded-2xl px-6 py-4 shadow-2xl shadow-yellow-900/50">
              <div className="text-center">
                <div className="text-4xl mb-1 animate-ach-icon-bounce">{achPopup.icon}</div>
                <div className="text-yellow-300 font-black text-xs tracking-widest uppercase mb-0.5">Achievement</div>
                <div className="text-white font-bold text-base">{achPopup.name}</div>
                <div className="text-yellow-400/80 text-xs mt-0.5">{achPopup.desc}</div>
                <div className="text-yellow-400 font-black text-lg mt-1">+{achPopup.reward.toLocaleString()}G</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-20 flex flex-col flex-1 max-w-md mx-auto w-full">
        {/* Global feed ticker */}
        <div className="px-4 pt-1.5"><GlobalFeed /></div>

        <header className="px-4 pt-1 pb-1.5">
          {/* Row 1: Title (left) + User (right) */}
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="font-display text-base font-bold text-white/80 tracking-tight">⚔️ {t('title', locale)}</h1>
            <div className="flex items-center gap-2">
              {userId ? (
                <button onClick={handleLogout} className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/50 transition-colors">
                  <HeroAvatar size={14} expression="normal" />
                  <span className="max-w-[60px] truncate">{userId}</span>
                  <span className="text-white/20">·</span>
                  <span>로그아웃</span>
                </button>
              ) : (
                <button onClick={() => { setMounted(false); setAutoMode(false) }} className="text-[9px] text-white/30 hover:text-white/50 transition-colors">로그인</button>
              )}
            </div>
          </div>
          {/* Row 2: Gold (left) + Check-in (right) */}
          <div className="flex items-center justify-between">
            <div className="text-yellow-400 font-bold text-base tabular-nums">💰 {state.gold.toLocaleString()}G</div>
            <button onClick={handleCheckIn} disabled={!checkable} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 active:scale-95 ${checkable ? 'gradient-primary text-white shadow-sm' : 'bg-white/[0.04] text-white/30 cursor-not-allowed'}`}>
              {checkable ? `📅 ${t('checkin', locale)}` : `✅ ${t('checkin_done', locale)}`}
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
              <p className="text-yellow-400 font-bold text-sm">💤 {t('offline_reward', locale)}: +{offlineReward.gold.toLocaleString()}G</p>
              <p className="text-gray-500 text-xs">{offlineReward.minutes}{t('offline_collected', locale)}</p>
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

        {/* Main enhance view (always visible, fits 1 screen) */}
        <div className="flex-1 overflow-hidden px-4 pb-2 flex flex-col">
          <EnhanceContent
            state={state} tier={tier} rates={rates} cost={cost} canAfford={canAfford} maxed={maxed}
            enhancing={enhancing} result={result} autoMode={autoMode}
            useProtection={useProtection} useBlessing={useBlessing} particleType={particleType}
            showMagicCircle={showMagicCircle} levelBurst={levelBurst}
            soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled(s => !s)}
            gaugeActive={gaugeActive} gaugeProgress={gaugeProgress} shattered={shattered}
            autoTarget={autoTarget} onAutoTargetChange={setAutoTarget}
            onEnhance={handleEnhance} onToggleAuto={() => setAutoMode(a => !a)}
            onToggleProtection={() => { setUseProtection(p => !p); if (soundEnabled) playClick() }}
            onToggleBlessing={() => { setUseBlessing(b => !b); if (soundEnabled) playClick() }}
            onSelectWeapon={handleSelectWeapon} onUnlockWeapon={handleUnlockWeapon}
            onReset={handleReset}
          />
        </div>

        {/* Bottom quick-access bar */}
        <nav className="flex shrink-0 border-t border-white/[0.04] bg-[#06080F]/90 backdrop-blur-sm relative z-20">
          {([
            { key: 'shop' as Tab, icon: '🏪', label: '상점' },
            { key: 'missions' as Tab, icon: '📋', label: '미션', badge: unclaimedMissions },
            { key: 'achievements' as Tab, icon: '🏆', label: '업적' },
            { key: 'stats' as Tab, icon: '📊', label: '통계' },
            { key: 'notices' as Tab, icon: '📢', label: '공지', href: '/notices' },
          ]).map(tb => (
            tb.href ? (
              <a key={tb.key} href={tb.href} className="flex-1 py-2 text-center text-white/30 hover:text-white/50 transition-colors">
                <div className="text-sm leading-none">{tb.icon}</div>
                <div className="text-[8px] mt-0.5 truncate">{tb.label}</div>
              </a>
            ) : (
              <button key={tb.key} onClick={() => { setAutoMode(false); setTab(tab === tb.key ? 'enhance' : tb.key) }} className={`flex-1 py-2 text-center transition-colors duration-200 relative ${tab === tb.key ? 'text-white' : 'text-white/30 hover:text-white/50'}`}>
                <div className="text-sm leading-none">{tb.icon}</div>
                <div className="text-[8px] mt-0.5 truncate">{tb.label}</div>
                {tb.badge != null && tb.badge > 0 && (
                  <span className="absolute top-0.5 right-[15%] bg-red-500 text-white text-[7px] font-bold w-3 h-3 rounded-full flex items-center justify-center">{tb.badge}</span>
                )}
              </button>
            )
          ))}
        </nav>

        {/* Side panel overlay */}
        {tab !== 'enhance' && (
          <div className="fixed inset-0 z-30 flex items-end justify-center" onClick={() => setTab('enhance')}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative w-full max-w-md bg-gray-950 rounded-t-2xl max-h-[70vh] overflow-y-auto border-t border-gray-700/50" style={{ overscrollBehavior: 'contain' }} onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/40 px-4 py-3 flex items-center justify-between z-10">
                <h2 className="font-bold text-sm">
                  {tab === 'shop' && '🏪 상점'}
                  {tab === 'missions' && '📋 미션'}
                  {tab === 'achievements' && '🏆 업적'}
                  {tab === 'stats' && '📊 통계'}
                </h2>
                <button onClick={() => setTab('enhance')} className="text-gray-500 hover:text-white text-lg" aria-label="Close">✕</button>
              </div>
              <div className="p-4">
                {tab === 'shop' && (
                  <div className="space-y-4">
                    <ShopTab gold={state.gold} protectionScrolls={state.protectionScrolls} blessingScrolls={state.blessingScrolls} onBuy={handleBuy} />
                    <div className="glass-card rounded-xl p-4">
                      <h3 className="text-sm font-bold text-purple-400 mb-2">⭐ 환생</h3>
                      {canPrestige(state.highestLevel) ? (
                        <>
                          <p className="text-xs text-gray-300 mb-2">포인트 +{getPrestigePoints(state.highestLevel)} / 성공률 +{(state.prestigeBonus ?? 0).toFixed(1)}%</p>
                          <button onClick={handlePrestige} className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm transition-all active:scale-[0.98]">환생하기</button>
                        </>
                      ) : <p className="text-xs text-gray-600">+7 이상 달성 시 가능</p>}
                    </div>
                    <AdBanner className="min-h-[80px] rounded-xl overflow-hidden" />
                    <ShareButton state={state} />
                    <button onClick={handleReset} className="w-full py-1.5 text-[10px] text-gray-700 hover:text-gray-500">데이터 초기화</button>
                  </div>
                )}
                {tab === 'missions' && <MissionsTab missions={missions} onClaim={handleClaimMission} />}
                {tab === 'achievements' && <AchievementsTab achieved={state.achievements} />}
                {tab === 'stats' && <StatsTab state={state} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ───── Enhance Tab ───── */

function EnhanceContent({
  state, tier, rates, cost, canAfford, maxed, enhancing, result, autoMode,
  useProtection, useBlessing, particleType, showMagicCircle, levelBurst,
  soundEnabled, onToggleSound, gaugeActive, gaugeProgress, shattered,
  autoTarget, onAutoTargetChange, onSelectWeapon, onUnlockWeapon,
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
  gaugeActive: boolean; gaugeProgress: number; shattered: boolean
  onSelectWeapon: (id: string) => void; onUnlockWeapon: (id: string) => void
  autoTarget: number; onAutoTargetChange: (v: number) => void
  onEnhance: () => void; onToggleAuto: () => void
  onToggleProtection: () => void; onToggleBlessing: () => void; onReset: () => void
}) {
  const blessingBonus = useBlessing && state.blessingScrolls > 0 ? 10 : 0
  const stackBonus = getFailStackBonus(state.failStack)
  const eventBonus = getSuccessBoost()
  const totalBonus = blessingBonus + stackBonus + eventBonus + (state.prestigeBonus ?? 0)
  const effectiveSuccess = Math.min(99, rates.success + totalBonus)

  return (
    <div className="flex flex-col">
      {/* Weapon select (compact) */}
      <WeaponSelect state={state} onSelect={onSelectWeapon} onUnlock={onUnlockWeapon} />

      {/* Sword + Level (compact) */}
      <div className="flex items-center justify-center gap-3 py-2">
        {/* Weapon container: sword + effects aligned together */}
        <div className="relative shrink-0">
          <Particles type={particleType} />
          <MagicCircle active={showMagicCircle} color={tier.color} />
          <SwordEffects level={state.level} color={tier.color} result={result} weaponType={state.activeWeapon} />
          {levelBurst && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-level-burst" style={{ border: `2px solid ${tier.color}`, boxShadow: `0 0 20px ${tier.color}` }} />}

          <div className={`${enhancing && !result ? 'animate-enhance' : ''} ${result === 'destroy' ? 'animate-shake' : ''} ${!enhancing && state.level > 0 ? 'animate-sword-breathe' : ''} ${shattered ? 'opacity-0' : ''}`} style={{ transform: 'scale(0.65)', transformOrigin: 'center', transition: 'opacity 0.3s' }}>
            <Sword level={state.level} color={tier.color} weaponType={state.activeWeapon} specialSkin={state.specialSkin} />
          </div>
        {/* Shatter fragments */}
        {shattered && (
          <div className="relative" style={{ width: 78, height: 143 }}>
            <div className="absolute inset-0 animate-shatter-left" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}>
              <div style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}><Sword level={0} color="#666" /></div>
            </div>
            <div className="absolute inset-0 animate-shatter-right" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}>
              <div style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}><Sword level={0} color="#666" /></div>
            </div>
          </div>
        )}
        </div>{/* end weapon container */}

        <div className="text-center min-w-0">
          <div className={`text-4xl font-black text-glow ${result === 'success' ? 'animate-pop' : ''}`} style={{ color: tier.color }}>+{state.level}</div>
          <div className="text-xs font-bold tracking-[0.2em] text-glow-sm" style={{ color: tier.color }}>{tier.name}</div>
          {/* Progress bar inline */}
          <div className="mt-1.5 h-1.5 w-28 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(state.level / 16) * 100}%`, background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})` }} />
          </div>
          {result && (
            <div className={`mt-1 text-sm font-black animate-result-in text-glow ${result === 'success' ? 'text-yellow-400' : result === 'downgrade' ? 'text-orange-400' : result === 'maintain' ? 'text-blue-400' : 'text-red-500'}`}>
              {result === 'success' && '✨ 성공!'}{result === 'maintain' && '😐 유지'}{result === 'downgrade' && '📉 하락!'}{result === 'destroy' && '💥 파괴!!!'}
            </div>
          )}
        </div>
      </div>

      {/* Controls (always visible, no scroll needed) */}
      <div className="w-full space-y-2 mt-1">
        {!maxed ? (
          <>
            {/* Rates (compact) + sunk cost display */}
            <div className="glass-card rounded-xl p-3">
              <div className="flex justify-between text-xs mb-0.5 text-gray-400">
                <span>+{state.level} → +{state.level + 1}</span>
                <span className="text-yellow-400 font-medium">{cost.toLocaleString()}G</span>
                {state.failStack > 0 && <span className="text-orange-400">🔥{state.failStack}</span>}
              </div>
              {/* Sunk cost: sword value */}
              {state.level >= 3 && (
                <div className="text-[9px] text-gray-500 mb-1.5">
                  💎 검 가치: <span className="text-yellow-400/80 font-medium">{Math.floor(state.level * state.level * 50).toLocaleString()}G</span>
                  {' '}· 파괴 시 전액 손실
                </div>
              )}
              <div className="flex gap-1">
                <RateBox label="성공" value={effectiveSuccess} boosted={totalBonus > 0} variant="emerald" />
                <RateBox label="유지" value={rates.maintain} variant="blue" />
                {rates.downgrade > 0 && <RateBox label="하락" value={rates.downgrade} variant="orange" />}
                <RateBox label="파괴" value={useProtection && state.protectionScrolls > 0 ? 0 : rates.destroy} variant="red" shielded={useProtection && state.protectionScrolls > 0 && rates.destroy > 0} />
              </div>
            </div>

            {/* Item toggles + buttons in 2 rows */}
            <div className="flex gap-1.5">
              <ItemToggle icon="🛡️" label="보호" count={state.protectionScrolls} active={useProtection && state.protectionScrolls > 0} disabled={state.protectionScrolls === 0} onToggle={onToggleProtection} />
              <ItemToggle icon="✨" label="축복" count={state.blessingScrolls} active={useBlessing && state.blessingScrolls > 0} disabled={state.blessingScrolls === 0} onToggle={onToggleBlessing} />
            </div>

            {/* Enhance gauge (shown during enhance) */}
            <EnhanceGauge active={gaugeActive} progress={gaugeProgress} result={result} successRate={effectiveSuccess} />

            <button onClick={onEnhance} disabled={enhancing || !canAfford || autoMode} className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${enhancing || autoMode ? 'bg-amber-700/40 cursor-wait' : canAfford ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-[0.98] shadow-lg shadow-orange-900/40' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
              {enhancing ? '🔮 강화 중…' : canAfford ? '🔥 강화하기' : '💰 골드 부족'}
            </button>

            <div className="flex gap-2">
              <button onClick={onToggleAuto} disabled={!canAfford && !autoMode} className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${autoMode ? 'bg-red-700 hover:bg-red-600 ring-2 ring-red-400/50 animate-pulse-ring' : canAfford ? 'bg-white/[0.04] hover:bg-white/[0.07] text-white/60' : 'bg-white/[0.02] text-white/20 cursor-not-allowed'}`}>
                {autoMode ? '⏹️ 중지' : '⚡ 자동'}
              </button>
              {/* Auto target level selector */}
              <div className="flex items-center gap-1 px-2 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[9px] text-white/30">목표</span>
                <select
                  value={autoTarget}
                  onChange={e => onAutoTargetChange(Number(e.target.value))}
                  className="bg-transparent text-white/70 text-xs font-bold w-10 text-center focus:outline-none cursor-pointer"
                  style={{ appearance: 'none' }}
                >
                  {Array.from({ length: 16 }, (_, i) => i + 1).map(lv => (
                    <option key={lv} value={lv} className="bg-gray-900 text-white">+{lv}</option>
                  ))}
                </select>
              </div>
              <button onClick={onToggleSound} className={`px-3 py-2.5 rounded-xl text-xs transition-colors ${soundEnabled ? 'bg-gray-800 text-gray-300' : 'bg-gray-900 text-gray-600'}`} aria-label="Toggle sound">
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-yellow-400 text-xl font-black animate-pulse">🏆 최고 레벨!</div>
        )}

        {/* Log (compact) */}
        {state.enhanceLog.length > 0 && (
          <div className="flex flex-wrap gap-0.5 px-1">
            {state.enhanceLog.slice(0, 8).map((e, i) => (
              <span key={i} className={`text-[10px] px-1 py-0.5 rounded ${e.result === 'success' ? 'bg-emerald-900/30 text-emerald-400' : e.result === 'maintain' ? 'bg-blue-900/30 text-blue-400' : e.result === 'downgrade' ? 'bg-orange-900/30 text-orange-400' : 'bg-red-900/30 text-red-400'}`}>
                +{e.from}{e.result === 'success' ? '✨' : e.result === 'maintain' ? '😐' : e.result === 'downgrade' ? '📉' : '💥'}
              </span>
            ))}
          </div>
        )}

        {/* Battle CTAs */}
        <div className="flex gap-2">
          <a href="/arena" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-600 hover:to-orange-500 font-bold text-center transition-all active:scale-[0.98] shadow-lg shadow-red-900/30">
            <span className="text-sm">🗡️ 던전</span>
            <span className="block text-[8px] text-red-200/60">몬스터 토벌</span>
          </a>
          <a href="/pvp" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-700 to-indigo-600 hover:from-violet-600 hover:to-indigo-500 font-bold text-center transition-all active:scale-[0.98] shadow-lg shadow-violet-900/30">
            <span className="text-sm">⚔️ PvP</span>
            <span className="block text-[8px] text-violet-200/60">1대1 대전</span>
          </a>
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

