"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import BottomSheet from "@/components/BottomSheet";
import DistancePicker from "@/components/DistancePicker";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useKakaoSearch } from "@/hooks/useKakaoSearch";
import type { Place, CategoryKey } from "@/types/place";
import type { MapHandle } from "@/components/Map";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const geo = useGeolocation();
  const {
    places,
    loading: searchLoading,
    error: searchError,
    hasMore,
    search,
    loadMore,
  } = useKakaoSearch();

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);
  const [clickedPosition, setClickedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchMode, setSearchMode] = useState<"walk" | "drive" | null>(null);
  const mapRef = useRef<MapHandle>(null);

  const handleCategorySelect = useCallback(
    (key: CategoryKey) => {
      setSelectedCategory(key);
      setSelectedPlace(null);
      setDetailPlace(null);
      setClickedPosition(null);
      setSearchMode(null);
      mapRef.current?.clearClickMarker();
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

  // 지도 클릭 핸들러
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setClickedPosition({ lat, lng });
      setSearchMode(null);
      setDetailPlace(null);
      setSelectedPlace(null);

      // 카테고리가 선택 안 되어 있으면 기본 맛집으로
      if (!selectedCategory) {
        setSelectedCategory("FD6");
      }
    },
    [selectedCategory]
  );

  // 거리 모드 선택 핸들러
  const handleDistanceSelect = useCallback(
    (mode: "walk" | "drive") => {
      if (!clickedPosition) return;
      const category = selectedCategory || "FD6";
      setSearchMode(mode);
      setDetailPlace(null);
      setSelectedPlace(null);

      const radius = mode === "walk" ? 1000 : 10000;
      const size = mode === "walk" ? 5 : 10;

      search(category, clickedPosition.lat, clickedPosition.lng, {
        radius,
        size,
        sort: "accuracy",
      });
    },
    [clickedPosition, selectedCategory, search]
  );

  const handleCloseDistancePicker = useCallback(() => {
    setClickedPosition(null);
    setSearchMode(null);
    mapRef.current?.clearClickMarker();
  }, []);

  // 위치 변경 시 지도 이동 + 재검색
  useEffect(() => {
    if (!geo.loading) {
      mapRef.current?.goToMyLocation(geo.lat, geo.lng);
      if (selectedCategory && !clickedPosition) {
        search(selectedCategory, geo.lat, geo.lng);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.lat, geo.lng, geo.loading]);

  // 반경 원 데이터
  const radiusCircleData =
    clickedPosition && searchMode
      ? {
          lat: clickedPosition.lat,
          lng: clickedPosition.lng,
          radius: searchMode === "walk" ? 1000 : 10000,
          mode: searchMode,
        }
      : null;

  // 결과 헤더 텍스트
  const resultLabel = searchMode
    ? searchMode === "walk"
      ? "도보권 핫플 TOP 5"
      : "차량권 핫플 TOP 10"
    : `주변 장소 ${places.length}곳`;

  // 장소 목록 렌더 함수 (모바일/데스크톱 공용)
  const renderPlaceList = () => (
    <>
      {detailPlace ? (
        <PlaceDetail place={detailPlace} onClose={handleCloseDetail} />
      ) : (
        <>
          <div className="py-2">
            <p className="text-sm text-[var(--foreground)]/50">
              {searchMode ? (
                <span className="font-bold text-[var(--coral)]">
                  {resultLabel}
                </span>
              ) : (
                <>
                  주변 장소{" "}
                  <span className="font-bold text-[var(--coral)]">
                    {places.length}
                  </span>
                  곳
                </>
              )}
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
          {hasMore && !searchMode && (
            <button
              type="button"
              onClick={loadMore}
              disabled={searchLoading}
              className="w-full mt-3 py-3 text-sm text-[var(--coral)] hover:text-[var(--coral-light)] font-medium transition-colors disabled:opacity-50"
            >
              {searchLoading ? "불러오는 중..." : "더 보기"}
            </button>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden flex flex-col">
      <Header
        loading={geo.loading}
        error={geo.error}
        onRetryLocation={() => {
          geo.retry();
          setClickedPosition(null);
          setSearchMode(null);
          mapRef.current?.clearClickMarker();
          // geo 업데이트 후 지도 이동은 아래 effect에서 처리
        }}
      />

      <div className="relative z-20 mt-14">
        <CategoryBar
          selected={selectedCategory}
          onSelect={handleCategorySelect}
          loading={searchLoading}
        />
      </div>

      <div className="flex-1 relative md:flex md:flex-row overflow-hidden">
        {/* 데스크톱 사이드 패널 */}
        {places.length > 0 && (
          <div className="hidden md:flex md:flex-col md:w-[380px] md:shrink-0 border-r border-[var(--peach)]/20 bg-[var(--warm-white)] overflow-y-auto custom-scrollbar">
            <div className="p-4">{renderPlaceList()}</div>
          </div>
        )}

        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <Map
            ref={mapRef}
            lat={geo.lat}
            lng={geo.lng}
            places={places}
            selectedPlaceId={selectedPlace?.id ?? null}
            onSelectPlace={handlePlaceSelect}
            onMapClick={handleMapClick}
            radiusCircle={radiusCircleData}
          />

          {/* 거리 모드 선택 팝업 */}
          {clickedPosition && !searchMode && (
            <DistancePicker
              onSelect={handleDistanceSelect}
              onClose={handleCloseDistancePicker}
              loading={searchLoading}
            />
          )}
        </div>

        {/* 모바일 하단 시트 */}
        {places.length > 0 && (
          <div className="md:hidden">
            <BottomSheet>{renderPlaceList()}</BottomSheet>
          </div>
        )}
      </div>

      {/* 에러 표시 */}
      {(geo.error || searchError) && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 glass text-[var(--coral)] text-sm px-5 py-2.5 rounded-2xl shadow-lg animate-bounce-in">
          {geo.error || searchError}
        </div>
      )}

      {/* 안내 메시지 */}
      {!selectedCategory && !geo.loading && !clickedPosition && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 glass text-[var(--foreground)]/70 text-sm px-6 py-3.5 rounded-full shadow-lg border-[var(--peach)]/30 animate-float">
          🗺️ 카테고리를 선택하거나 지도를 클릭해보세요
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {searchLoading && places.length === 0 && !clickedPosition && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 glass text-[var(--foreground)]/70 text-sm px-6 py-3.5 rounded-full shadow-lg flex items-center gap-2.5 animate-bounce-in">
          <div className="w-4 h-4 border-2 border-[var(--peach)] border-t-[var(--coral)] rounded-full animate-spin" />
          주변 장소를 찾고 있어요...
        </div>
      )}
    </div>
  );
}
