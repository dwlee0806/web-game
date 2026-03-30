import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "이용약관",
  description: "어디갈까? 서비스의 이용약관입니다.",
};

export default function TermsPage() {
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

        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">이용약관</h1>
        <p className="text-sm text-[var(--foreground)]/40 mb-8">최종 수정일: 2026년 3월 30일</p>

        <div className="space-y-8 text-[15px] text-[var(--foreground)]/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 어디갈까?(이하 &quot;서비스&quot;)가 제공하는 위치 기반 장소 추천 서비스의 이용 조건 및 절차, 서비스 제공자와 이용자의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제2조 (서비스 내용)</h2>
            <p>서비스는 다음과 같은 기능을 제공합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>사용자의 현재 위치 또는 선택 위치를 기반으로 한 주변 맛집, 카페, 놀거리, 관광지 추천</li>
              <li>카테고리별 장소 검색 및 상세 정보 제공</li>
              <li>도보권/차량권 기준 핫플레이스 추천</li>
              <li>카카오맵 연동을 통한 지도 기반 장소 탐색</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제3조 (서비스 이용)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스는 별도의 회원가입 없이 무료로 이용할 수 있습니다.</li>
              <li>서비스 이용을 위해 브라우저에서 위치 정보 접근을 허용해야 합니다.</li>
              <li>서비스에는 Google AdSense를 통한 광고가 포함될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제4조 (면책조항)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스에서 제공하는 장소 정보는 카카오 로컬 API를 통해 제공되며, 정보의 정확성을 보장하지 않습니다.</li>
              <li>영업시간 변경, 폐업 등 실시간 변동사항이 반영되지 않을 수 있습니다.</li>
              <li>서비스 이용 중 발생하는 이동, 식사 등에 대한 책임은 이용자에게 있습니다.</li>
              <li>천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제5조 (지적재산권)</h2>
            <p>
              서비스의 디자인, 코드, 로고 등 모든 지적재산권은 서비스 운영자에게 귀속됩니다.
              지도 데이터 및 장소 정보에 대한 권리는 카카오에 귀속됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제6조 (약관 변경)</h2>
            <p>
              본 약관은 관련 법령 변경이나 서비스 정책 변경에 따라 수정될 수 있으며, 변경된 약관은 서비스 내에 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">제7조 (문의)</h2>
            <p>
              서비스 이용 관련 문의사항이 있으시면 아래로 연락해 주세요.
            </p>
            <p className="mt-2 font-medium">이메일: dwlee0806@gmail.com</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
