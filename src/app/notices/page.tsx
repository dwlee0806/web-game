'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'

interface Notice {
  id: number
  title: string
  desc: string
  date: string
  category: string
  pinned?: boolean
}

const STORAGE_KEY = 'forgd-notices'

const DEFAULT_NOTICES: Notice[] = [
  { id: 1, title: 'FORGD.IO 오픈! 검 강화 시뮬레이터 정식 오픈', desc: '강화, 던전, PvP 아레나까지 — 검을 강화하고 몬스터를 사냥하세요!', date: '2026.03.31', category: '공지', pinned: true },
  { id: 2, title: 'PvP 타이밍 아레나 업데이트', desc: '1대1 대전 시스템이 추가되었습니다. 타이밍을 맞춰 공격하고, 패링으로 상대의 공격을 막아보세요.', date: '2026.03.31', category: '업데이트' },
  { id: 3, title: '강화 시스템 리뉴얼 (+16 체제)', desc: '강화 최대 레벨이 +16으로 변경. 2레벨마다 등급이 올라가며, 등급별로 검의 외형이 변합니다.', date: '2026.03.31', category: '업데이트' },
  { id: 4, title: '업적 시스템 대규모 확장 (50개)', desc: '업적 50개. 히든 업적 10개, 이스터에그 업적 3개 포함.', date: '2026.03.31', category: '업데이트' },
  { id: 5, title: '일일/주간/월간 미션 시스템', desc: '미션이 3단계로 세분화. 일일 3개, 주간 3개, 월간 2개.', date: '2026.03.31', category: '업데이트' },
  { id: 6, title: '던전 시스템 (뱀서 스타일)', desc: '강화한 검으로 몬스터를 무찌르세요! 보스, 스킬 레벨업, 콤보 시스템.', date: '2026.03.31', category: '콘텐츠' },
  { id: 7, title: '프레스티지(환생) + 오프라인 골드', desc: '+7 이상에서 환생 가능. 영구 보너스 획득. 오프라인 골드 최대 8시간.', date: '2026.03.31', category: '콘텐츠' },
  { id: 8, title: '시간대별 이벤트', desc: '해피아워(20~23시) 성공률+5%, 주말세일 비용-20%, 점심안전시간 파괴↓', date: '2026.03.31', category: '이벤트' },
  { id: 9, title: '보안 업데이트', desc: 'OWASP Top 10 기준 보안 점검 완료. PBKDF2 + 브루트포스 방지.', date: '2026.03.31', category: '안내' },
]

const CATEGORIES = ['전체', '공지', '업데이트', '콘텐츠', '이벤트', '안내']

const CATEGORY_STYLES: Record<string, string> = {
  '공지': 'bg-red-500/10 text-red-400 border-red-500/20',
  '업데이트': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  '콘텐츠': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  '이벤트': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  '안내': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

function loadNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_NOTICES
  } catch { return DEFAULT_NOTICES }
}

function saveNotices(notices: Notice[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices))
}

export default function NoticesPage() {
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES)
  const [admin, setAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCat, setNewCat] = useState('공지')
  const [newPinned, setNewPinned] = useState(false)

  useEffect(() => {
    setNotices(loadNotices())
    setAdmin(isAdmin(getCurrentUser()))
  }, [])

  const filtered = useMemo(() => {
    return notices.filter(n => {
      if (category !== '전체' && n.category !== category) return false
      if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }, [category, search, notices])

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return
    const today = new Date()
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
    const newNotice: Notice = {
      id: Date.now(),
      title: newTitle.trim(),
      desc: newDesc.trim(),
      date: dateStr,
      category: newCat,
      pinned: newPinned,
    }
    const updated = [newNotice, ...notices]
    setNotices(updated)
    saveNotices(updated)
    setNewTitle(''); setNewDesc(''); setNewPinned(false); setShowForm(false)
  }, [newTitle, newDesc, newCat, newPinned, notices])

  const handleDelete = useCallback((id: number) => {
    if (!confirm('삭제하시겠습니까?')) return
    const updated = notices.filter(n => n.id !== id)
    setNotices(updated)
    saveNotices(updated)
  }, [notices])

  const handleTogglePin = useCallback((id: number) => {
    const updated = notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    setNotices(updated)
    saveNotices(updated)
  }, [notices])

  return (
    <div className="min-h-dvh bg-[#06080F] text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-indigo-500/10 text-indigo-400 rounded-full mb-3">Announcements</span>
          <h1 className="font-display text-3xl font-black tracking-tight">공지사항</h1>
          <p className="mt-2 text-sm text-white/40">업데이트 소식과 이벤트를 확인하세요.</p>
        </div>

        {/* Admin: Add notice button */}
        {admin && (
          <div className="mb-4">
            <button onClick={() => setShowForm(f => !f)} className="px-4 py-2 rounded-xl gradient-primary text-sm font-bold transition-all active:scale-95">
              {showForm ? '취소' : '+ 공지 작성'}
            </button>
          </div>
        )}

        {/* Admin: New notice form */}
        {admin && showForm && (
          <div className="glass-card rounded-xl p-4 mb-6 space-y-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="제목" className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="내용" rows={3} className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" />
            <div className="flex items-center gap-3">
              <select value={newCat} onChange={e => setNewCat(e.target.value)} className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white">
                {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="flex items-center gap-1.5 text-xs text-white/50">
                <input type="checkbox" checked={newPinned} onChange={e => setNewPinned(e.target.checked)} /> 📌 고정
              </label>
              <button onClick={handleAdd} disabled={!newTitle.trim()} className="ml-auto px-4 py-2 rounded-lg gradient-primary text-xs font-bold disabled:opacity-30 transition-all active:scale-95">게시</button>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="제목 검색…" spellCheck={false} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300" />
          </div>
        </div>

        <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${category === cat ? 'bg-white/10 text-white' : 'bg-white/[0.03] text-white/30 hover:text-white/50'}`}>{cat}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-2 opacity-30">📭</div>
            <p className="text-sm text-white/30">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notice => (
              <article key={notice.id} className={`glass-card glass-card-hover rounded-xl p-4 ${notice.pinned ? 'ring-1 ring-indigo-500/20' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_STYLES[notice.category] ?? CATEGORY_STYLES['안내']}`}>{notice.category}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-white leading-snug">{notice.title}</h3>
                      <span className="text-[10px] text-white/25 shrink-0 mt-0.5">{notice.date}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-white/40 leading-relaxed line-clamp-2">{notice.desc}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {notice.pinned && <span className="text-[9px] text-indigo-400">📌 고정</span>}
                      {admin && (
                        <>
                          <button onClick={() => handleTogglePin(notice.id)} className="text-[9px] text-white/20 hover:text-white/50 transition-colors">{notice.pinned ? '고정해제' : '고정'}</button>
                          <button onClick={() => handleDelete(notice.id)} className="text-[9px] text-red-400/40 hover:text-red-400 transition-colors">삭제</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-indigo-400/60 hover:text-indigo-400 text-sm transition-colors duration-300">← 게임으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
