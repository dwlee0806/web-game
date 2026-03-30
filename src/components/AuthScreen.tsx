'use client'

import { useState, useCallback } from 'react'
import { register, login } from '@/lib/auth'

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
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center 40%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚔️</div>
          <h1 className="text-2xl font-black tracking-tight">검 강화 시뮬레이터</h1>
          <p className="text-sm text-gray-500 mt-1">Sword Enhancement Simulator</p>
        </div>

        {/* Auth card */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          {/* Tab toggle */}
          <div className="flex rounded-xl bg-gray-800/60 p-1">
            <button
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              로그인
            </button>
            <button
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">아이디</label>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="영문, 숫자, _ (2~20자)"
                autoComplete="username"
                spellCheck={false}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700/50 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="4자 이상"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700/50 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center animate-result-in">{error}</p>
            )}

            {mode === 'register' && (
              <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-3">
                <p className="text-xs text-red-300 text-center leading-relaxed">
                  ⚠️ 아이디와 비밀번호를 잊으면 복구할 수 없습니다.<br />
                  반드시 기억해 두세요!
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !id.trim() || !password}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중…' : mode === 'register' ? '계정 만들기' : '로그인'}
            </button>
          </form>
        </div>

        {/* Guest play */}
        <button
          onClick={onGuest}
          className="w-full mt-4 py-3.5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white font-medium text-base transition-all active:scale-[0.98]"
        >
          🎮 바로 플레이하기
        </button>

        <p className="text-center text-[10px] text-gray-700 mt-6">
          데이터는 이 브라우저에 저장됩니다
        </p>
      </div>
    </div>
  )
}
