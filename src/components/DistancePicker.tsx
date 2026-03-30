"use client";

interface DistancePickerProps {
  readonly onSelect: (mode: "walk" | "drive") => void;
  readonly onClose: () => void;
  readonly loading: boolean;
}

export default function DistancePicker({
  onSelect,
  onClose,
  loading,
}: DistancePickerProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 animate-bounce-in">
      <div className="glass rounded-3xl shadow-2xl p-5 min-w-[300px] border border-[var(--peach)]/30">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[var(--foreground)]">
            ✨ 주변 핫플 찾기
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--cream)] text-[var(--foreground)]/40 hover:text-[var(--coral)] hover:bg-[var(--coral)]/10 transition-all"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onSelect("walk")}
            disabled={loading}
            className="flex-1 flex flex-col items-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/50 transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <span className="text-2xl animate-float">🚶</span>
            <span className="text-sm font-bold text-emerald-700">도보권</span>
            <span className="text-[11px] text-emerald-500 font-medium">1km · TOP 5</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect("drive")}
            disabled={loading}
            className="flex-1 flex flex-col items-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border border-blue-200/50 transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <span className="text-2xl animate-float" style={{ animationDelay: "0.5s" }}>🚗</span>
            <span className="text-sm font-bold text-blue-700">차량권</span>
            <span className="text-[11px] text-blue-500 font-medium">10km · TOP 10</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--coral)] font-medium">
            <div className="w-4 h-4 border-2 border-[var(--peach)] border-t-[var(--coral)] rounded-full animate-spin" />
            핫플 찾는 중...
          </div>
        )}
      </div>
    </div>
  );
}
