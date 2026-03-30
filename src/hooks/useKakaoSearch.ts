"use client";

import { useState, useCallback } from "react";
import type { Place, CategoryKey } from "@/types/place";

interface SearchState {
  readonly places: readonly Place[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
}

export function useKakaoSearch() {
  const [state, setState] = useState<SearchState>({
    places: [],
    loading: false,
    error: null,
    hasMore: false,
  });
  const [page, setPage] = useState(1);
  const [lastQuery, setLastQuery] = useState<{
    category: CategoryKey;
    lat: number;
    lng: number;
  } | null>(null);

  const search = useCallback(
    async (category: CategoryKey, lat: number, lng: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      setPage(1);
      setLastQuery({ category, lat, lng });

      try {
        const params = new URLSearchParams({
          category,
          x: lng.toString(),
          y: lat.toString(),
          page: "1",
        });

        const res = await fetch(`/api/kakao?${params}`);
        if (!res.ok) throw new Error("검색에 실패했습니다.");

        const data = await res.json();
        setState({
          places: data.places,
          loading: false,
          error: null,
          hasMore: !data.meta.isEnd,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "알 수 없는 오류",
        }));
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (!lastQuery || state.loading || !state.hasMore) return;

    const nextPage = page + 1;
    setState((prev) => ({ ...prev, loading: true }));
    setPage(nextPage);

    try {
      const params = new URLSearchParams({
        category: lastQuery.category,
        x: lastQuery.lng.toString(),
        y: lastQuery.lat.toString(),
        page: nextPage.toString(),
      });

      const res = await fetch(`/api/kakao?${params}`);
      if (!res.ok) throw new Error("추가 로딩에 실패했습니다.");

      const data = await res.json();
      setState((prev) => ({
        places: [...prev.places, ...data.places],
        loading: false,
        error: null,
        hasMore: !data.meta.isEnd,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      }));
    }
  }, [lastQuery, page, state.loading, state.hasMore]);

  return { ...state, search, loadMore };
}
