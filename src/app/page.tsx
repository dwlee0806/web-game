"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import BottomSheet from "@/components/BottomSheet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useKakaoSearch } from "@/hooks/useKakaoSearch";
import type { Place, CategoryKey } from "@/types/place";
import type { MapHandle } from "@/components/Map";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const geo = useGeolocation();
  const { places, loading: searchLoading, error: searchError, hasMore, search, loadMore } =
    useKakaoSearch();

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const mapRef = useRef<MapHandle>(null);

  const handleCategorySelect = useCallback(
    (key: CategoryKey) => {
      setSelectedCategory(key);
      setSelectedPlace(null);
      setDetailPlace(null);
      search(key, geo.lat, geo.lng);
    },
    [geo.lat, geo.lng, search]
  );

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handlePlaceDetail = useCallback((place: Place) => {
    setDetailPlace(place);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailPlace(null);
  }, []);

  // 위치 변경 시 선택된 카테고리로 재검색
  useEffect(() => {
    if (!geo.loading && selectedCategory) {
      search(selectedCategory, geo.lat, geo.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.lat, geo.lng, geo.loading]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <Header
        loading={geo.loading}
        error={geo.error}
        onRetryLocation={geo.retry}
      />

      <CategoryBar
        selected={selectedCategory}
        onSelect={handleCategorySelect}
        loading={searchLoading}
      />

      {/* 지도 영역 */}
      <div className="absolute inset-0 pt-14">
        <Map
          ref={mapRef}
          lat={geo.lat}
          lng={geo.lng}
          places={places}
          selectedPlaceId={selectedPlace?.id ?? null}
          onSelectPlace={handlePlaceSelect}
        />
      </div>

      {/* 에러 표시 */}
      {(geo.error || searchError) && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg shadow-md">
          {geo.error || searchError}
        </div>
      )}

      {/* 안내 메시지 (카테고리 미선택 시) */}
      {!selectedCategory && !geo.loading && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm text-gray-600 text-sm px-5 py-3 rounded-full shadow-lg border border-gray-100">
          카테고리를 선택해서 주변 장소를 찾아보세요
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {searchLoading && places.length === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-white text-gray-600 text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          주변 장소를 찾고 있어요...
        </div>
      )}

      {/* 장소 목록 (하단 시트) */}
      {places.length > 0 && (
        <BottomSheet>
          {/* 상세 뷰 */}
          {detailPlace ? (
            <PlaceDetail place={detailPlace} onClose={handleCloseDetail} />
          ) : (
            <>
              <div className="py-2">
                <p className="text-sm text-gray-500">
                  주변 장소 <span className="font-semibold text-gray-800">{places.length}</span>곳
                </p>
              </div>
              <div className="space-y-2">
                {places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isSelected={selectedPlace?.id === place.id}
                    onClick={() => {
                      handlePlaceSelect(place);
                      handlePlaceDetail(place);
                    }}
                  />
                ))}
              </div>
              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={searchLoading}
                  className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  {searchLoading ? "불러오는 중..." : "더 보기"}
                </button>
              )}
            </>
          )}
        </BottomSheet>
      )}
    </div>
  );
}
