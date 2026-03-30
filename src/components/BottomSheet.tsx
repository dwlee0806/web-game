"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

interface BottomSheetProps {
  readonly children: ReactNode;
  readonly minHeight?: number;
}

type SheetState = "collapsed" | "half" | "full";

const SHEET_HEIGHTS: Record<SheetState, string> = {
  collapsed: "h-[120px]",
  half: "h-[45vh]",
  full: "h-[85vh]",
};

export default function BottomSheet({
  children,
  minHeight = 120,
}: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const diff = e.changedTouches[0].clientY - startYRef.current;
      const threshold = 50;

      if (diff > threshold) {
        // 아래로 스와이프
        setSheetState((prev) =>
          prev === "full" ? "half" : prev === "half" ? "collapsed" : "collapsed"
        );
      } else if (diff < -threshold) {
        // 위로 스와이프
        setSheetState((prev) =>
          prev === "collapsed" ? "half" : prev === "half" ? "full" : "full"
        );
      }
    },
    []
  );

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 z-30
        bg-white rounded-t-2xl shadow-2xl border-t border-gray-100
        transition-all duration-300 ease-out
        ${SHEET_HEIGHTS[sheetState]}
        md:relative md:h-full md:rounded-none md:shadow-none md:border-r md:border-t-0
      `}
      style={{ minHeight }}
    >
      {/* 드래그 핸들 (모바일) */}
      <div
        className="flex justify-center pt-2 pb-1 cursor-grab md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* 콘텐츠 */}
      <div className="overflow-y-auto h-[calc(100%-16px)] md:h-full px-3 pb-4">
        {children}
      </div>
    </div>
  );
}
