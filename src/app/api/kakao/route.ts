import { NextRequest, NextResponse } from "next/server";

const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY;
const KAKAO_API_BASE = "https://dapi.kakao.com/v2/local/search/category.json";

export async function GET(request: NextRequest) {
  if (!KAKAO_REST_KEY) {
    return NextResponse.json(
      { error: "카카오 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const categoryCode = searchParams.get("category");
  const x = searchParams.get("x"); // 경도 (lng)
  const y = searchParams.get("y"); // 위도 (lat)
  const radius = searchParams.get("radius") || "2000";
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "15";
  const sort = searchParams.get("sort") || "distance";

  if (!categoryCode || !x || !y) {
    return NextResponse.json(
      { error: "category, x, y 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const url = new URL(KAKAO_API_BASE);
  url.searchParams.set("category_group_code", categoryCode);
  url.searchParams.set("x", x);
  url.searchParams.set("y", y);
  url.searchParams.set("radius", radius);
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);
  url.searchParams.set("sort", sort);

  try {
    const response = await fetch(url.toString(), {
      headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "카카오 API 요청에 실패했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();

    const places = data.documents.map(
      (doc: {
        id: string;
        place_name: string;
        category_name: string;
        address_name: string;
        road_address_name: string;
        phone: string;
        y: string;
        x: string;
        distance: string;
        place_url: string;
      }) => ({
        id: doc.id,
        name: doc.place_name,
        category: doc.category_name,
        address: doc.address_name,
        roadAddress: doc.road_address_name,
        phone: doc.phone,
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
        distance: doc.distance,
        placeUrl: doc.place_url,
      })
    );

    return NextResponse.json({
      places,
      meta: {
        totalCount: data.meta.total_count,
        isEnd: data.meta.is_end,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
