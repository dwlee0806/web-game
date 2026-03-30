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

export default function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl transition-all
        ${
          isSelected
            ? "bg-gray-900 text-white shadow-lg"
            : "bg-white hover:bg-gray-50 border border-gray-100 shadow-sm"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[15px] truncate">{place.name}</h3>
          <p
            className={`text-xs mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}
          >
            {getCategoryShort(place.category)}
          </p>
          <p
            className={`text-sm mt-1 truncate ${isSelected ? "text-gray-200" : "text-gray-600"}`}
          >
            {place.roadAddress || place.address}
          </p>
        </div>
        {place.distance && (
          <span
            className={`text-xs font-medium shrink-0 px-2 py-1 rounded-full ${
              isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {formatDistance(place.distance)}
          </span>
        )}
      </div>
    </button>
  );
}
