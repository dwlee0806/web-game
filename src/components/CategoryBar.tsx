"use client";

import { CATEGORIES, type CategoryKey } from "@/types/place";

interface CategoryBarProps {
  readonly selected: CategoryKey | null;
  readonly onSelect: (key: CategoryKey) => void;
  readonly loading: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  utensils: "M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2 M7 2v20 M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  coffee: "M17 8h1a4 4 0 1 1 0 8h-1 M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z M6 2v4 M10 2v4 M14 2v4",
  gamepad: "M6 12h4m-2-2v4 M14.5 11h.01 M18.5 13h.01 M2 15.5V8.5A2.5 2.5 0 0 1 4.5 6h15A2.5 2.5 0 0 1 22 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 15.5z",
  landmark: "M3 22h18 M6 18v-7 M10 18v-7 M14 18v-7 M18 18v-7 M12 2l8 9H4z",
};

export default function CategoryBar({ selected, onSelect, loading }: CategoryBarProps) {
  return (
    <div className="absolute z-20 left-0 right-0 top-14 px-3 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              disabled={loading}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                whitespace-nowrap transition-all shadow-sm
                ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }
                ${loading ? "opacity-60 cursor-wait" : ""}
              `}
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
              >
                <path d={CATEGORY_ICONS[cat.icon]} />
              </svg>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
