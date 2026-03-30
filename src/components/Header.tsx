"use client";

import Link from "next/link";

interface HeaderProps {
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRetryLocation: () => void;
}

export default function Header({ loading, error, onRetryLocation }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold gradient-text tracking-tight">
            어디갈까?
          </h1>
          <nav className="hidden sm:flex items-center gap-2 ml-2">
            <Link href="/about" className="text-[11px] text-[var(--foreground)]/40 hover:text-[var(--coral)] transition-colors">
              소개
            </Link>
            <span className="text-[var(--foreground)]/20">|</span>
            <Link href="/privacy" className="text-[11px] text-[var(--foreground)]/40 hover:text-[var(--coral)] transition-colors">
              개인정보
            </Link>
          </nav>
        </div>
        <button
          type="button"
          onClick={onRetryLocation}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-[var(--cream)] hover:bg-[var(--peach)]/30 transition-all duration-300"
          aria-label="현재 위치 새로고침"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M12 2a10 10 0 0 1 10 10" />
            <path d="M12 2a10 10 0 0 0-10 10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-[var(--foreground)]/70 text-[13px]">
            {loading ? "찾는 중..." : error ? "재시도" : "내 위치"}
          </span>
        </button>
      </div>
    </header>
  );
}
