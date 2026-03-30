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
    <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-100 animate-slide-up">
      <div className="p-5">
        {/* 닫기 핸들 */}
        <div className="flex justify-center mb-3">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-1 bg-gray-300 rounded-full"
            aria-label="닫기"
          />
        </div>

        {/* 장소 이름 */}
        <h2 className="text-xl font-bold text-gray-900">{place.name}</h2>
        <p className="text-sm text-gray-500 mt-1">{place.category}</p>

        {/* 정보 리스트 */}
        <div className="mt-4 space-y-3">
          {/* 주소 */}
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 mt-0.5 shrink-0"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="text-sm text-gray-800">
                {place.roadAddress || place.address}
              </p>
              {place.roadAddress && place.address !== place.roadAddress && (
                <p className="text-xs text-gray-400 mt-0.5">{place.address}</p>
              )}
            </div>
          </div>

          {/* 전화 */}
          {place.phone && (
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 shrink-0"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a
                href={`tel:${place.phone}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {place.phone}
              </a>
            </div>
          )}

          {/* 거리 */}
          {place.distance && (
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-sm text-gray-600">
                현재 위치에서 {formatDistance(place.distance)}
              </p>
            </div>
          )}
        </div>

        {/* 카카오맵에서 보기 버튼 */}
        <a
          href={place.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-[#FEE500] text-gray-900 font-semibold rounded-xl hover:bg-[#FAD800] transition-colors"
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
