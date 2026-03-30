import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "어디갈까? 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
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

        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">개인정보처리방침</h1>
        <p className="text-sm text-[var(--foreground)]/40 mb-8">최종 수정일: 2026년 3월 30일</p>

        <div className="space-y-8 text-[15px] text-[var(--foreground)]/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">1. 수집하는 개인정보</h2>
            <p>
              어디갈까?(이하 &quot;서비스&quot;)는 서비스 제공을 위해 다음과 같은 정보를 수집합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>위치 정보</strong>: 사용자의 현재 위치(위도, 경도)를 브라우저 Geolocation API를 통해 수집합니다. 이 정보는 주변 장소 추천 목적으로만 사용되며, 서버에 저장되지 않습니다.</li>
              <li><strong>기기 정보</strong>: 서비스 품질 개선을 위해 브라우저 유형, 운영체제 등 기본적인 기기 정보가 자동으로 수집될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">2. 개인정보 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>현재 위치 기반 주변 장소(맛집, 카페, 놀거리, 관광지) 추천</li>
              <li>서비스 이용 통계 및 품질 개선</li>
              <li>광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">3. 제3자 서비스 및 광고</h2>
            <p>본 서비스는 다음 제3자 서비스를 이용합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Google AdSense</strong>: 광고 제공을 위해 Google은 쿠키를 사용하여 사용자의 관심사에 기반한 광고를 표시할 수 있습니다.
                사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--coral)] underline">Google 광고 설정</a>에서 맞춤 광고를 비활성화할 수 있습니다.
              </li>
              <li>
                <strong>카카오맵 API</strong>: 지도 표시 및 장소 검색을 위해 카카오의 지도/로컬 API를 사용합니다.
                카카오의 개인정보처리방침은 <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--coral)] underline">여기</a>에서 확인할 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">4. 쿠키 사용</h2>
            <p>
              본 서비스 및 제3자 광고 서비스(Google AdSense)는 쿠키를 사용합니다. 쿠키는 사용자의 브라우저에 저장되는 작은 텍스트 파일로, 광고 맞춤화 및 서비스 개선에 활용됩니다. 사용자는 브라우저 설정을 통해 쿠키를 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">5. 개인정보 보유 및 파기</h2>
            <p>
              본 서비스는 위치 정보를 서버에 저장하지 않으며, 브라우저 세션이 종료되면 모든 위치 데이터가 자동 삭제됩니다. 쿠키 관련 데이터는 브라우저 설정에서 직접 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">6. 이용자의 권리</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>위치 정보 수집 거부: 브라우저에서 위치 권한을 거부할 수 있습니다.</li>
              <li>쿠키 거부: 브라우저 설정에서 쿠키를 차단할 수 있습니다.</li>
              <li>맞춤 광고 비활성화: Google 광고 설정에서 변경 가능합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">7. 문의</h2>
            <p>
              개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.
            </p>
            <p className="mt-2 font-medium">이메일: dwlee0806@gmail.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
