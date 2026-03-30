"use client";

import { CATEGORIES, type CategoryKey } from "@/types/place";

interface CategoryBarProps {
  readonly selected: CategoryKey | null;
  readonly onSelect: (key: CategoryKey) => void;
  readonly loading: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  utensils: "\uD83C\uDF5C",
  coffee: "\u2615",
  gamepad: "\uD83C\uDFAE",
  landmark: "\uD83C\uDFDB\uFE0F",
};

const CATEGORY_COLORS: Record<string, { bg: string; active: string }> = {
  FD6: { bg: "bg-red-50", active: "from-[var(--coral)] to-[var(--coral-light)]" },
  CE7: { bg: "bg-amber-50", active: "from-amber-400 to-orange-400" },
  CT1: { bg: "bg-violet-50", active: "from-violet-500 to-purple-500" },
  AT4: { bg: "bg-teal-50", active: "from-[var(--mint)] to-[var(--sky)]" },
};

export default function CategoryBar({ selected, onSelect, loading }: CategoryBarProps) {
  return (
    <div className="px-4 py-2.5 glass">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat, i) => {
          const isSelected = selected === cat.key;
          const colors = CATEGORY_COLORS[cat.key];
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              disabled={loading}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`
                cat-pill animate-bounce-in
                flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium
                whitespace-nowrap shadow-sm
                ${
                  isSelected
                    ? `bg-gradient-to-r ${colors.active} text-white shadow-lg shadow-[var(--coral)]/20`
                    : `${colors.bg} text-[var(--foreground)] hover:shadow-md`
                }
                ${loading ? "opacity-60 cursor-wait" : ""}
              `}
            >
              <span className="text-base">{CATEGORY_EMOJIS[cat.icon]}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
