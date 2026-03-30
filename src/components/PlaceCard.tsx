"use client";

import type { Place } from "@/types/place";

interface PlaceCardProps {
  readonly place: Place;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

function formatDistance(meters: string): string {
  const m = parseInt(meters, 10);
  if (isNaN(m)) return "";
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function getCategoryShort(category: string): string {
  const parts = category.split(" > ");
  return parts[parts.length - 1] || category;
}

function getCategoryEmoji(category: string): string {
  if (category.includes("음식") || category.includes("식당")) return "\uD83C\uDF5C";
  if (category.includes("카페") || category.includes("커피")) return "\u2615";
  if (category.includes("문화") || category.includes("여가")) return "\uD83C\uDFAE";
  if (category.includes("관광") || category.includes("명소")) return "\uD83C\uDFDB\uFE0F";
  return "\uD83D\uDCCD";
}

export default function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        place-card w-full text-left p-4 rounded-2xl
        ${
          isSelected
            ? "bg-gradient-to-br from-[var(--coral)] to-[var(--coral-light)] text-white shadow-lg shadow-[var(--coral)]/25"
            : "bg-[var(--warm-white)] hover:bg-white border border-[var(--peach)]/20"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">{getCategoryEmoji(place.category)}</span>
            <h3 className="font-bold text-[15px] truncate">{place.name}</h3>
          </div>
          <p
            className={`text-xs mt-1 ${isSelected ? "text-white/70" : "text-[var(--foreground)]/50"}`}
          >
            {getCategoryShort(place.category)}
          </p>
          <p
            className={`text-[13px] mt-1.5 truncate ${isSelected ? "text-white/80" : "text-[var(--foreground)]/60"}`}
          >
            {place.roadAddress || place.address}
          </p>
        </div>
        {place.distance && (
          <span
            className={`text-xs font-bold shrink-0 px-2.5 py-1 rounded-full ${
              isSelected
                ? "bg-white/20 text-white"
                : "bg-[var(--sunny)]/30 text-[var(--foreground)]/70"
            }`}
          >
            {formatDistance(place.distance)}
          </span>
        )}
      </div>
    </button>
  );
}
