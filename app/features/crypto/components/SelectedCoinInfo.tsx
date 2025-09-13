import { CryptoPrice } from '../../../lib/types';
import { BinanceBadge } from '../../../components/atoms/BinanceBadge';
import { AlphaIcon } from '../../../components/atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../../../components/atoms/UpbitBadge';
import { ClientOnly } from '../../../hooks/useIsClient';

interface SelectedCoinInfoProps {
  selectedCoin: CryptoPrice | null;
  onClose: () => void;
}

/**
 * 선택된 코인의 거래소 정보를 표시하는 컴포넌트
 */
export function SelectedCoinInfo({ selectedCoin, onClose }: SelectedCoinInfoProps) {
  if (!selectedCoin) return null;

  // 디버깅: 선택된 코인의 거래소 정보 로그
  console.log('🔍 Selected coin:', {
    symbol: selectedCoin.symbol,
    korean_name: selectedCoin.korean_name,
    isOnBinance: selectedCoin.isOnBinance,
    isBinanceAlpha: selectedCoin.isBinanceAlpha,
    isOnUpbit: selectedCoin.isOnUpbit,
    binanceSymbol: selectedCoin.binanceSymbol,
    upbitSymbol: selectedCoin.upbitSymbol
  });

  // 빗썸은 모든 코인이 지원됨 (데이터 출처이므로)
  const bithumbUrl = `https://www.bithumb.com/trade/order/${selectedCoin.symbol}_KRW`;
  const binanceUrl = selectedCoin.binanceSymbol ? `https://www.binance.com/ko/trade/${selectedCoin.binanceSymbol}` : null;
  const upbitUrl = selectedCoin.upbitSymbol ? `https://upbit.com/exchange?code=CRIX.UPBIT.${selectedCoin.upbitSymbol}` : null;

  return (
    <ClientOnly>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 animate-slide-up">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {selectedCoin.korean_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCoin.symbol} • ₩{selectedCoin.current_price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-lg">×</span>
            </button>
          </div>

          {/* 거래소 링크들 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이 코인을 거래할 수 있는 거래소:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 빗썸 (항상 표시) */}
              <a
                href={bithumbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">빗썸</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bithumb</p>
                </div>
                <div className="text-orange-500 group-hover:translate-x-1 transition-transform">→</div>
              </a>

              {/* 바이낸스 */}
              {selectedCoin.isOnBinance && binanceUrl && (
                <a
                  href={binanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <BinanceBadge size="sm" className="transform scale-75" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">바이낸스</p>
                      {selectedCoin.isBinanceAlpha && <AlphaIcon />}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Binance</p>
                  </div>
                  <div className="text-yellow-500 group-hover:translate-x-1 transition-transform">→</div>
                </a>
              )}

              {/* 바이낸스 알파 (바이낸스에 없지만 알파인 경우) */}
              {selectedCoin.isBinanceAlpha && !selectedCoin.isOnBinance && (
                <a
                  href="https://www.binance.com/ko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <AlphaIcon />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">바이낸스 알파</p>
                      <AlphaIcon />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Binance Alpha Project</p>
                  </div>
                  <div className="text-purple-500 group-hover:translate-x-1 transition-transform">→</div>
                </a>
              )}

              {/* 업비트 */}
              {selectedCoin.isOnUpbit && upbitUrl && (
                <a
                  href={upbitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <UpbitBadge size="sm" className="transform scale-75" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">업비트</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Upbit</p>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">→</div>
                </a>
              )}
            </div>

            {/* 추가 정보 */}
            <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                거래소를 클릭하면 새 탭에서 해당 거래소의 {selectedCoin.korean_name} 거래 페이지로 이동합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}