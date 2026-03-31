'use client'

import { useState, useCallback } from 'react'
import { register, login } from '@/lib/auth'
import HeroAvatar from './HeroAvatar'

interface AuthScreenProps {
  onAuth: (userId: string) => void
  onGuest: () => void
}

export default function AuthScreen({ onAuth, onGuest }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = mode === 'register'
      ? await register(id.trim(), password)
      : await login(id.trim(), password)

    setLoading(false)

    if (result.ok) {
      onAuth(id.trim())
    } else {
      setError(result.error ?? 'Error')
    }
  }, [mode, id, password, onAuth])

  return (
    <div className="min-h-dvh bg-[#06080F] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <HeroAvatar size={72} expression="excited" />
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            FORGD
          </h1>
          <p className="text-[13px] text-white/40 mt-1 tracking-wider font-medium">Sword Enhancement Simulator</p>
        </div>

        {/* Auth card */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          {/* Tab toggle */}
          <div className="flex rounded-xl bg-white/[0.04] p-1">
            <button
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              로그인
            </button>
            <button
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] text-white/40 font-medium mb-1.5 tracking-wider uppercase">아이디</label>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="영문, 숫자, _ (2~20자)"
                autoComplete="username"
                spellCheck={false}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 font-medium mb-1.5 tracking-wider uppercase">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="4자 이상"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30 transition-all duration-300"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 text-xs">⚠</span>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
                <span className="text-amber-400 text-xs mt-0.5">⚠️</span>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  아이디와 비밀번호를 잊으면 복구할 수 없습니다.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !id.trim() || !password}
              className="w-full py-3.5 rounded-xl gradient-primary font-bold text-sm tracking-wide transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {loading ? '처리 중…' : mode === 'register' ? '계정 만들기' : '로그인'}
            </button>
          </form>
        </div>

        {/* Guest play */}
        <button
          onClick={onGuest}
          className="w-full mt-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-semibold text-[15px] transition-all duration-300 active:scale-[0.98]"
        >
          🎮 바로 플레이하기
        </button>

        <p className="text-center text-[10px] text-white/15 mt-8 tracking-wider">
          FORGD.IO — Data stored locally in your browser
        </p>
      </div>
    </div>
  )
}
