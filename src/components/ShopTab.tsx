'use client'

import { SHOP, type ShopItem } from '@/lib/gameLogic'

interface ShopTabProps {
  gold: number
  protectionScrolls: number
  blessingScrolls: number
  onBuy: (item: ShopItem, qty: number) => void
}

export default function ShopTab({
  gold,
  protectionScrolls,
  blessingScrolls,
  onBuy,
}: ShopTabProps) {
  const counts: Record<ShopItem, number> = {
    protection: protectionScrolls,
    blessing: blessingScrolls,
  }

  return (
    <div className="space-y-4 px-1">
      <p className="text-center text-gray-400 text-sm">
        주문서를 구매해서 강화에 사용하세요
      </p>

      {(Object.keys(SHOP) as ShopItem[]).map(key => {
        const item = SHOP[key]
        const owned = counts[key]
        const canBuy1 = gold >= item.price
        const canBuy10 = gold >= item.price * 10

        return (
          <div
            key={key}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-bold">{item.name}</span>
                </div>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold">
                  {item.price.toLocaleString()}G
                </div>
                <div className="text-xs text-gray-500">보유: {owned}개</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onBuy(key, 1)}
                disabled={!canBuy1}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                  canBuy1
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                1개 구매
              </button>
              <button
                onClick={() => onBuy(key, 10)}
                disabled={!canBuy10}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                  canBuy10
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                10개 구매 ({(item.price * 10).toLocaleString()}G)
              </button>
            </div>
          </div>
        )
      })}

      <div className="glass-card rounded-xl p-3">
        <p className="text-xs text-gray-500 text-center">
          💡 강화 탭에서 주문서 사용을 ON/OFF 할 수 있어요
        </p>
      </div>
    </div>
  )
}
