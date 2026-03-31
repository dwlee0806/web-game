'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Notice {
  id: number
  title: string
  desc: string
  date: string
  category: string
  pinned?: boolean
}

const NOTICES: Notice[] = [
  { id: 1, title: 'forgd.io 오픈! 검 강화 시뮬레이터 정식 오픈', desc: '강화, 던전, PvP 아레나까지 — 검을 강화하고 몬스터를 사냥하세요! 많은 플레이 부탁드립니다.', date: '2026.03.31', category: '공지', pinned: true },
  { id: 2, title: 'PvP 타이밍 아레나 업데이트', desc: '1대1 대전 시스템이 추가되었습니다. 타이밍을 맞춰 공격하고, 패링으로 상대의 공격을 막아보세요. 승리 시 골드와 아레나 포인트를 획득합니다.', date: '2026.03.31', category: '업데이트' },
  { id: 3, title: '강화 시스템 리뉴얼 (+30 → +16)', desc: '강화 최대 레벨이 +16으로 변경되었습니다. 2레벨마다 등급이 올라가며, 등급별로 검의 외형이 변합니다. 하락 시스템도 추가되었습니다.', date: '2026.03.31', category: '업데이트' },
  { id: 4, title: '업적 시스템 대규모 확장 (50개)', desc: '업적이 50개로 확장되었습니다. 히든 업적 10개, 이스터에그 업적 3개가 포함되어 있습니다. 배경 캐릭터를 10번 클릭해보세요!', date: '2026.03.31', category: '업데이트' },
  { id: 5, title: '일일/주간/월간 미션 시스템', desc: '미션이 3단계로 세분화되었습니다. 일일 미션 3개, 주간 미션 3개, 월간 미션 2개가 매 주기마다 갱신됩니다.', date: '2026.03.31', category: '업데이트' },
  { id: 6, title: '던전 시스템 (뱀파이어 서바이벌 스타일)', desc: '강화한 검으로 몬스터를 무찌르세요! 보스, 스킬 레벨업, 콤보 시스템, 힐팩 드롭 등 풍성한 전투를 즐길 수 있습니다.', date: '2026.03.31', category: '콘텐츠' },
  { id: 7, title: '프레스티지(환생) 시스템 추가', desc: '+7 이상 달성 시 환생할 수 있습니다. 레벨은 초기화되지만 영구 성공률 보너스와 골드 배율이 증가합니다.', date: '2026.03.31', category: '콘텐츠' },
  { id: 8, title: '오프라인 골드 수익', desc: '접속하지 않는 동안에도 골드가 쌓입니다. 프레스티지 레벨에 따라 수익이 증가합니다. (최대 8시간)', date: '2026.03.31', category: '콘텐츠' },
  { id: 9, title: '시간대별 이벤트 안내', desc: '해피아워(20~23시): 성공률 +5%, 얼리버드(6~9시): 골드 2배, 주말 세일: 비용 -20%, 점심 안전시간(12~13시): 파괴 확률 절반', date: '2026.03.31', category: '이벤트' },
  { id: 10, title: '보안 업데이트 완료', desc: 'OWASP Top 10 기준 보안 점검을 완료했습니다. 비밀번호 해싱이 PBKDF2로 강화되었고, 브루트포스 방지 기능이 추가되었습니다.', date: '2026.03.31', category: '안내' },
]

const CATEGORIES = ['전체', '공지', '업데이트', '콘텐츠', '이벤트', '안내']

const CATEGORY_STYLES: Record<string, string> = {
  '공지': 'bg-red-500/10 text-red-400 border-red-500/20',
  '업데이트': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  '콘텐츠': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  '이벤트': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  '안내': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function NoticesPage() {
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return NOTICES.filter(n => {
      if (category !== '전체' && n.category !== category) return false
      if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }, [category, search])

  return (
    <div className="min-h-dvh bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-indigo-500/10 text-indigo-400 rounded-full mb-3">
            Announcements
          </span>
          <h1 className="text-3xl font-black tracking-tight">공지사항</h1>
          <p className="mt-2 text-sm text-gray-500">업데이트 소식과 이벤트를 확인하세요.</p>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="제목 검색…"
              spellCheck={false}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notice list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notice => (
              <article
                key={notice.id}
                className={`glass-card rounded-xl p-4 transition-all hover:ring-1 hover:ring-gray-700/50 ${
                  notice.pinned ? 'ring-1 ring-indigo-500/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_STYLES[notice.category] ?? CATEGORY_STYLES['안내']}`}>
                    {notice.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-white leading-snug">{notice.title}</h3>
                      <span className="text-[10px] text-gray-500 shrink-0 mt-0.5">{notice.date}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400 leading-relaxed line-clamp-2">{notice.desc}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {notice.pinned && (
                        <span className="text-[9px] text-indigo-400 flex items-center gap-0.5">📌 고정</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">← 게임으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
