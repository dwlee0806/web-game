import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="text-8xl mb-4">💥</div>
      <h1 className="text-3xl font-black mb-2">파괴되었습니다!</h1>
      <p className="text-gray-400 mb-8">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 rounded-xl font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all"
      >
        🔥 다시 강화하러 가기
      </Link>
    </div>
  )
}
