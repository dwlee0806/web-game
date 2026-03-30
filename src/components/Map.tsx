"use client";

import { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import Script from "next/script";
import type { Place } from "@/types/place";

interface RadiusCircle {
  readonly lat: number;
  readonly lng: number;
  readonly radius: number;
  readonly mode: "walk" | "drive";
}

interface MapProps {
  readonly lat: number;
  readonly lng: number;
  readonly places: readonly Place[];
  readonly selectedPlaceId: string | null;
  readonly onSelectPlace: (place: Place) => void;
  readonly onMapClick?: (lat: number, lng: number) => void;
  readonly radiusCircle?: RadiusCircle | null;
}

export interface MapHandle {
  panTo: (lat: number, lng: number) => void;
  clearClickMarker: () => void;
  goToMyLocation: (lat: number, lng: number) => void;
}

const KAKAO_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;

const CIRCLE_STYLES = {
  walk: {
    strokeColor: "#10B981",
    strokeOpacity: 0.8,
    fillColor: "#10B981",
    fillOpacity: 0.08,
  },
  drive: {
    strokeColor: "#3B82F6",
    strokeOpacity: 0.8,
    fillColor: "#3B82F6",
    fillOpacity: 0.06,
  },
};

const Map = forwardRef<MapHandle, MapProps>(function Map(
  { lat, lng, places, selectedPlaceId, onSelectPlace, onMapClick, radiusCircle },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const clickMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const circleRef = useRef<kakao.maps.Circle | null>(null);
  const circleLabelRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const myLocationMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  onMapClickRef.current = onMapClick;

  useImperativeHandle(ref, () => ({
    panTo: (newLat: number, newLng: number) => {
      if (mapRef.current) {
        mapRef.current.panTo(new kakao.maps.LatLng(newLat, newLng));
      }
    },
    clearClickMarker: () => {
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
        clickMarkerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      if (circleLabelRef.current) {
        circleLabelRef.current.setMap(null);
        circleLabelRef.current = null;
      }
    },
    goToMyLocation: (newLat: number, newLng: number) => {
      const map = mapRef.current;
      if (!map || !window.kakao?.maps) return;

      const position = new kakao.maps.LatLng(newLat, newLng);
      map.panTo(position);
      map.setLevel(4);

      // 내 위치 마커 업데이트
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setPosition(position);
      }
    },
  }));

  const initMap = useCallback(() => {
    if (!containerRef.current) {
      setMapError("지도 컨테이너를 찾을 수 없습니다.");
      return;
    }
    if (!window.kakao?.maps) {
      setMapError("카카오맵 SDK 로드에 실패했습니다. 도메인이 카카오 개발자 콘솔에 등록되어 있는지 확인해주세요.");
      return;
    }

    try {
      kakao.maps.load(() => {
        if (!containerRef.current) return;

        const center = new kakao.maps.LatLng(lat, lng);
        const map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 4,
        });
        mapRef.current = map;
        setSdkLoaded(true);

        // 현재 위치 마커
        const myMarker = new kakao.maps.Marker({
          position: center,
          map,
          image: new kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            new kakao.maps.Size(24, 35)
          ),
        });
        myLocationMarkerRef.current = myMarker;

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, "click", (mouseEvent: { latLng: kakao.maps.LatLng }) => {
          const clickLat = mouseEvent.latLng.getLat();
          const clickLng = mouseEvent.latLng.getLng();

          // 기존 클릭 마커 + 원 제거
          if (clickMarkerRef.current) clickMarkerRef.current.setMap(null);
          if (circleRef.current) circleRef.current.setMap(null);
          if (circleLabelRef.current) circleLabelRef.current.setMap(null);

          // 새 클릭 마커
          const marker = new kakao.maps.Marker({
            position: mouseEvent.latLng,
            map,
            image: new kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
              new kakao.maps.Size(33, 36)
            ),
          });
          clickMarkerRef.current = marker;

          if (onMapClickRef.current) {
            onMapClickRef.current(clickLat, clickLng);
          }
        });
      });
    } catch (err) {
      setMapError(`지도 초기화 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    }
  }, [lat, lng]);

  // 반경 원 그리기
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao?.maps) return;

    // 기존 원 제거
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    if (circleLabelRef.current) {
      circleLabelRef.current.setMap(null);
      circleLabelRef.current = null;
    }

    if (!radiusCircle) return;

    const style = CIRCLE_STYLES[radiusCircle.mode];
    const center = new kakao.maps.LatLng(radiusCircle.lat, radiusCircle.lng);

    const circle = new kakao.maps.Circle({
      center,
      radius: radiusCircle.radius,
      strokeWeight: 2,
      strokeColor: style.strokeColor,
      strokeOpacity: style.strokeOpacity,
      strokeStyle: "solid",
      fillColor: style.fillColor,
      fillOpacity: style.fillOpacity,
      map,
    });
    circleRef.current = circle;

    // 반경 라벨
    const isWalk = radiusCircle.mode === "walk";
    const labelColor = isWalk ? "#10B981" : "#3B82F6";
    const labelBg = isWalk ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.12)";
    const labelText = isWalk ? "🚶 도보 1km" : "🚗 차량 10km";

    const label = new kakao.maps.CustomOverlay({
      position: center,
      content: `<div style="
        padding:6px 14px;
        background:${labelBg};
        backdrop-filter:blur(8px);
        border:1.5px solid ${labelColor}40;
        border-radius:20px;
        font-size:12px;
        font-weight:700;
        color:${labelColor};
        white-space:nowrap;
        pointer-events:none;
        box-shadow:0 2px 12px ${labelColor}20;
      ">${labelText}</div>`,
      yAnchor: 2.5,
    });
    label.setMap(map);
    circleLabelRef.current = label;

    // 원이 보이도록 줌 레벨 조정
    const level = isWalk ? 5 : 8;
    map.setLevel(level);
    map.panTo(center);
  }, [radiusCircle]);

  // 장소 마커 업데이트
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao?.maps) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(place.lat, place.lng);
      const marker = new kakao.maps.Marker({ position, map });

      kakao.maps.event.addListener(marker, "click", () => {
        onSelectPlace(place);

        if (overlayRef.current) overlayRef.current.setMap(null);

        const overlay = new kakao.maps.CustomOverlay({
          position,
          content: `<div style="padding:6px 14px;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(255,107,107,.15);font-size:13px;font-weight:700;white-space:nowrap;border:1.5px solid rgba(255,107,107,.2);transform:translateY(-8px)">${place.name}</div>`,
          yAnchor: 1.5,
        });
        overlay.setMap(map);
        overlayRef.current = overlay;

        map.panTo(position);
      });

      markersRef.current.push(marker);
    });
  }, [places, onSelectPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlaceId) return;

    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      map.panTo(new kakao.maps.LatLng(place.lat, place.lng));
    }
  }, [selectedPlaceId, places]);

  return (
    <div className="absolute inset-0">
      <Script
        src={KAKAO_SDK_URL}
        strategy="afterInteractive"
        onLoad={initMap}
        onError={() => setMapError("카카오맵 SDK를 불러올 수 없습니다.")}
      />
      <div ref={containerRef} className="w-full h-full" />

      {mapError && !sdkLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--cream)]">
          <div className="text-center p-6 animate-bounce-in">
            <p className="text-sm text-[var(--coral)] mb-3 font-medium">{mapError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm text-[var(--mint)] hover:underline font-medium"
            >
              새로고침
            </button>
          </div>
        </div>
      )}

      {!sdkLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--cream)]">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 border-3 border-[var(--peach)] border-t-[var(--coral)] rounded-full animate-spin" />
            <p className="text-sm text-[var(--foreground)]/50">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default Map;
