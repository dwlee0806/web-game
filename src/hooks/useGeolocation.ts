"use client";

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  readonly lat: number;
  readonly lng: number;
  readonly error: string | null;
  readonly loading: boolean;
}

const DEFAULT_POSITION = { lat: 37.5665, lng: 126.978 }; // 서울시청

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    ...DEFAULT_POSITION,
    error: null,
    loading: true,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "위치 정보를 지원하지 않는 브라우저입니다.",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        const message =
          err.code === 1
            ? "위치 권한을 허용해주세요."
            : "위치를 가져올 수 없습니다. 기본 위치(서울)를 사용합니다.";
        setState({
          ...DEFAULT_POSITION,
          error: message,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, retry: requestLocation };
}
