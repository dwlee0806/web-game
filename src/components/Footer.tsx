import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--cream)] border-t border-[var(--peach)]/20 py-6 px-5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--foreground)]/40">
          &copy; 2026 어디갈까? All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--coral)] transition-colors">
            서비스 소개
          </Link>
          <Link href="/privacy" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--coral)] transition-colors">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="text-xs text-[var(--foreground)]/50 hover:text-[var(--coral)] transition-colors">
            이용약관
          </Link>
        </nav>
      </div>
    </footer>
  );
}
