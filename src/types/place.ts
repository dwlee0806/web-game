export interface Place {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly address: string;
  readonly roadAddress: string;
  readonly phone: string;
  readonly lat: number;
  readonly lng: number;
  readonly distance: string;
  readonly placeUrl: string;
}

export type CategoryKey = "FD6" | "CE7" | "CT1" | "AT4";

export interface Category {
  readonly key: CategoryKey;
  readonly label: string;
  readonly icon: string;
  readonly kakaoCode: string;
}

export const CATEGORIES: readonly Category[] = [
  { key: "FD6", label: "맛집", icon: "utensils", kakaoCode: "FD6" },
  { key: "CE7", label: "카페", icon: "coffee", kakaoCode: "CE7" },
  { key: "CT1", label: "놀거리", icon: "gamepad", kakaoCode: "CT1" },
  { key: "AT4", label: "관광", icon: "landmark", kakaoCode: "AT4" },
] as const;
