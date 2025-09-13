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

  // 거래소 URL 생성 (모바일 앱 딥링크 포함)
  const getExchangeUrls = (exchange: 'bithumb' | 'binance' | 'upbit') => {
    switch (exchange) {
      case 'bithumb':
        return {
          web: `https://www.bithumb.com/trade/order/${selectedCoin.symbol}_KRW`,
          app: `bithumb://trade/${selectedCoin.symbol}_KRW`, // 빗썸 앱 딥링크
          fallback: `https://www.bithumb.com/trade/order/${selectedCoin.symbol}_KRW`
        };
      case 'binance':
        return {
          web: selectedCoin.binanceSymbol ? `https://www.binance.com/ko/trade/${selectedCoin.binanceSymbol}` : null,
          app: selectedCoin.binanceSymbol ? `binance://trade/${selectedCoin.binanceSymbol}` : null, // 바이낸스 앱 딥링크
          fallback: selectedCoin.binanceSymbol ? `https://www.binance.com/ko/trade/${selectedCoin.binanceSymbol}` : null
        };
      case 'upbit':
        return {
          web: selectedCoin.upbitSymbol ? `https://upbit.com/exchange?code=CRIX.UPBIT.${selectedCoin.upbitSymbol}` : null,
          app: selectedCoin.upbitSymbol ? `upbit://exchange?code=CRIX.UPBIT.${selectedCoin.upbitSymbol}` : null, // 업비트 앱 딥링크
          fallback: selectedCoin.upbitSymbol ? `https://upbit.com/exchange?code=CRIX.UPBIT.${selectedCoin.upbitSymbol}` : null
        };
      default:
        return { web: null, app: null, fallback: null };
    }
  };

  // 모바일/앱 링크 처리 함수
  const handleExchangeClick = (exchange: 'bithumb' | 'binance' | 'upbit', event: React.MouseEvent) => {
    event.preventDefault();
    
    const urls = getExchangeUrls(exchange);
    if (!urls.web) return;

    // 모바일 기기 감지
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile && urls.app) {
      // iOS와 Android에 따라 다른 딥링크 처리
      let appScheme = urls.app;
      
      // 실제 앱 스킴 (각 거래소별로 정확한 딥링크)
      if (exchange === 'bithumb') {
        appScheme = isIOS ? `bithumb://trade?symbol=${selectedCoin.symbol}` : `intent://trade?symbol=${selectedCoin.symbol}#Intent;scheme=bithumb;package=com.btckorea.bithumb;end`;
      } else if (exchange === 'binance') {
        appScheme = isIOS ? `binance://trade/${selectedCoin.binanceSymbol}` : `intent://trade/${selectedCoin.binanceSymbol}#Intent;scheme=binance;package=com.binance.dev;end`;
      } else if (exchange === 'upbit') {
        appScheme = isIOS ? `upbit://exchange?code=${selectedCoin.upbitSymbol}` : `intent://exchange?code=${selectedCoin.upbitSymbol}#Intent;scheme=upbit;package=com.dunamu.exchange;end`;
      }

      // 앱 실행 시도
      const startTime = Date.now();
      
      if (isIOS) {
        // iOS: 직접 딥링크 실행
        window.location.href = appScheme;
        
        // 1.5초 후 앱이 실행되지 않으면 웹사이트로 이동
        setTimeout(() => {
          if (Date.now() - startTime < 2000) {
            window.open(urls.fallback, '_blank', 'noopener,noreferrer');
          }
        }, 1500);
      } else if (isAndroid) {
        // Android: Intent 방식 또는 직접 링크
        try {
          window.location.href = appScheme;
          
          // 2초 후 앱이 실행되지 않으면 웹사이트로 이동
          setTimeout(() => {
            if (!document.hidden) {
              window.open(urls.fallback, '_blank', 'noopener,noreferrer');
            }
          }, 2000);
        } catch (error) {
          window.open(urls.fallback, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      // 데스크톱에서는 웹사이트로 이동
      window.open(urls.web, '_blank', 'noopener,noreferrer');
    }
  };

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
              <button
                onClick={(e) => handleExchangeClick('bithumb', e)}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50 hover:shadow-md transition-all group w-full text-left"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">빗썸</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bithumb</p>
                </div>
                <div className="text-orange-500 group-hover:translate-x-1 transition-transform">📱</div>
              </button>

              {/* 바이낸스 */}
              {selectedCoin.isOnBinance && (
                <button
                  onClick={(e) => handleExchangeClick('binance', e)}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-md transition-all group w-full text-left"
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
                  <div className="text-yellow-500 group-hover:translate-x-1 transition-transform">📱</div>
                </button>
              )}

              {/* 바이낸스 알파 (바이낸스에 없지만 알파인 경우) */}
              {selectedCoin.isBinanceAlpha && !selectedCoin.isOnBinance && (
                <button
                  onClick={() => window.open('https://www.binance.com/ko', '_blank', 'noopener,noreferrer')}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-md transition-all group w-full text-left"
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
                  <div className="text-purple-500 group-hover:translate-x-1 transition-transform">🌐</div>
                </button>
              )}

              {/* 업비트 */}
              {selectedCoin.isOnUpbit && (
                <button
                  onClick={(e) => handleExchangeClick('upbit', e)}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all group w-full text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <UpbitBadge size="sm" className="transform scale-75" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">업비트</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Upbit</p>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">📱</div>
                </button>
              )}
            </div>

            {/* 추가 정보 */}
            <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                📱 모바일에서는 거래소 앱으로, 💻 데스크톱에서는 웹사이트로 이동합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}