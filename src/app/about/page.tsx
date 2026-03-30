import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "어디갈까?는 현재 위치 기반으로 주변 맛집, 카페, 놀거리, 관광지를 추천하는 무료 서비스입니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--coral)] hover:text-[var(--coral-light)] font-medium mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          홈으로
        </Link>

        <h1 className="text-3xl font-bold gradient-text mb-6">어디갈까?</h1>
        <p className="text-lg text-[var(--foreground)]/70 mb-10 leading-relaxed">
          주말에 뭐 하지? 오늘 어디 가지?<br />
          매번 같은 고민을 해결해 드립니다.
        </p>

        <div className="space-y-10 text-[15px] text-[var(--foreground)]/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">이런 서비스예요</h2>
            <p>
              <strong>어디갈까?</strong>는 현재 위치를 기반으로 주변의 맛집, 카페, 놀거리, 관광지를 한눈에 보여주는 무료 서비스입니다. 복잡한 검색이나 회원가입 없이, 카테고리 한 번 클릭이면 근처의 좋은 장소들을 바로 찾아볼 수 있어요.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">주요 기능</h2>
            <div className="grid gap-4">
              <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--peach)]/20">
                <p className="font-bold text-[var(--foreground)] mb-1">📍 위치 기반 추천</p>
                <p className="text-sm text-[var(--foreground)]/60">
                  GPS로 현재 위치를 파악하여 가까운 장소부터 추천합니다. 맛집, 카페, 놀거리, 관광지 4가지 카테고리로 한국 전역 어디서든 사용할 수 있습니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--peach)]/20">
                <p className="font-bold text-[var(--foreground)] mb-1">🗺️ 지도 클릭 탐색</p>
                <p className="text-sm text-[var(--foreground)]/60">
                  지도 위의 아무 곳이나 클릭하면 그 위치 주변의 장소를 탐색할 수 있습니다. 여행 계획을 세울 때 목적지 주변을 미리 살펴보기에 좋습니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--peach)]/20">
                <p className="font-bold text-[var(--foreground)] mb-1">🚶🚗 도보/차량 핫플</p>
                <p className="text-sm text-[var(--foreground)]/60">
                  걸어갈 수 있는 거리(1km)와 차로 갈 수 있는 거리(10km) 내 인기 장소를 구분해서 추천합니다. 도보권 TOP 5, 차량권 TOP 10으로 핫플만 쏙쏙 골라드려요.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--peach)]/20">
                <p className="font-bold text-[var(--foreground)] mb-1">📱 모바일 최적화</p>
                <p className="text-sm text-[var(--foreground)]/60">
                  스마트폰에서 가장 편하게 쓸 수 있도록 설계했습니다. 하단 시트를 위아래로 스와이프해서 지도와 목록을 자유롭게 전환할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">이렇게 사용하세요</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>카테고리 선택</strong> — 상단의 맛집, 카페, 놀거리, 관광 중 원하는 카테고리를 탭하세요. 현재 위치 주변의 장소가 바로 표시됩니다.
              </li>
              <li>
                <strong>지도 클릭</strong> — 다른 위치의 장소를 찾고 싶다면 지도 위를 클릭하세요. 빨간 핀이 꽂히고 도보/차량 선택 팝업이 나타납니다.
              </li>
              <li>
                <strong>장소 확인</strong> — 목록에서 장소를 탭하면 주소, 전화번호, 거리 등 상세 정보를 볼 수 있습니다. &quot;카카오맵에서 보기&quot;를 누르면 카카오맵에서 길찾기도 가능합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">데이터 출처</h2>
            <p>
              장소 정보는 <a href="https://developers.kakao.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--coral)] underline">카카오 로컬 API</a>를 통해 제공됩니다. 카카오맵에 등록된 실제 업체 정보를 기반으로 하며, 영업시간이나 메뉴 등 세부 정보는 실제와 다를 수 있으니 방문 전 확인을 권장합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">문의</h2>
            <p>
              서비스 관련 피드백이나 문의사항은 아래 이메일로 보내주세요.
            </p>
            <p className="mt-2 font-medium">이메일: dwlee0806@gmail.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
