"use client";

interface HeaderProps {
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRetryLocation: () => void;
}

export default function Header({ loading, error, onRetryLocation }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-bold text-gray-900">
          어디갈까?
        </h1>
        <button
          type="button"
          onClick={onRetryLocation}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="현재 위치 새로고침"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M12 2a10 10 0 0 1 10 10" />
            <path d="M12 2a10 10 0 0 0-10 10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="hidden sm:inline">
            {loading ? "위치 확인 중..." : error ? "위치 재시도" : "내 위치"}
          </span>
        </button>
      </div>
    </header>
  );
}
