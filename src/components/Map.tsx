"use client";

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import Script from "next/script";
import type { Place } from "@/types/place";

interface MapProps {
  readonly lat: number;
  readonly lng: number;
  readonly places: readonly Place[];
  readonly selectedPlaceId: string | null;
  readonly onSelectPlace: (place: Place) => void;
}

export interface MapHandle {
  panTo: (lat: number, lng: number) => void;
}

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`;

const Map = forwardRef<MapHandle, MapProps>(function Map(
  { lat, lng, places, selectedPlaceId, onSelectPlace },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  useImperativeHandle(ref, () => ({
    panTo: (newLat: number, newLng: number) => {
      if (mapRef.current) {
        mapRef.current.panTo(new kakao.maps.LatLng(newLat, newLng));
      }
    },
  }));

  const initMap = useCallback(() => {
    if (!containerRef.current || !window.kakao?.maps) return;

    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(containerRef.current!, {
        center,
        level: 4,
      });
      mapRef.current = map;

      // 현재 위치 마커
      new kakao.maps.Marker({
        position: center,
        map,
        image: new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35)
        ),
      });
    });
  }, [lat, lng]);

  // 장소 마커 업데이트
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao?.maps) return;

    // 기존 마커 제거
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
          content: `<div style="padding:6px 12px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:13px;font-weight:600;white-space:nowrap;transform:translateY(-8px)">${place.name}</div>`,
          yAnchor: 1.5,
        });
        overlay.setMap(map);
        overlayRef.current = overlay;

        map.panTo(position);
      });

      markersRef.current.push(marker);
    });
  }, [places, onSelectPlace]);

  // 선택된 장소가 외부에서 바뀔 때 지도 이동
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlaceId) return;

    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      map.panTo(new kakao.maps.LatLng(place.lat, place.lng));
    }
  }, [selectedPlaceId, places]);

  return (
    <>
      <Script
        src={KAKAO_SDK_URL}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
});

export default Map;
