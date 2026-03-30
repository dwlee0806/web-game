"use client";

import type { Place } from "@/types/place";

interface PlaceDetailProps {
  readonly place: Place;
  readonly onClose: () => void;
}

function formatDistance(meters: string): string {
  const m = parseInt(meters, 10);
  if (isNaN(m)) return "";
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  return (
    <div className="animate-slide-up">
      <div className="py-3">
        {/* 뒤로가기 */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-[var(--coral)] hover:text-[var(--coral-light)] transition-colors mb-4 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          목록으로
        </button>

        {/* 장소 이름 */}
        <h2 className="text-2xl font-bold text-[var(--foreground)]">{place.name}</h2>
        <p className="text-sm text-[var(--foreground)]/50 mt-1">{place.category}</p>

        {/* 정보 카드 */}
        <div className="mt-5 space-y-3">
          {/* 주소 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream)]">
            <span className="text-base mt-0.5">📍</span>
            <div>
              <p className="text-sm text-[var(--foreground)]">
                {place.roadAddress || place.address}
              </p>
              {place.roadAddress && place.address !== place.roadAddress && (
                <p className="text-xs text-[var(--foreground)]/40 mt-0.5">{place.address}</p>
              )}
            </div>
          </div>

          {/* 전화 */}
          {place.phone && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--cream)]">
              <span className="text-base">📞</span>
              <a
                href={`tel:${place.phone}`}
                className="text-sm text-[var(--coral)] font-medium hover:underline"
              >
                {place.phone}
              </a>
            </div>
          )}

          {/* 거리 */}
          {place.distance && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--cream)]">
              <span className="text-base">🚶</span>
              <p className="text-sm text-[var(--foreground)]/70">
                여기서 {formatDistance(place.distance)}
              </p>
            </div>
          )}
        </div>

        {/* 카카오맵 버튼 */}
        <a
          href={place.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#FEE500] to-[#FFD43B] text-[var(--foreground)] font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FEE500]/30 transition-all duration-300 active:scale-[0.98]"
        >
          카카오맵에서 보기
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
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
