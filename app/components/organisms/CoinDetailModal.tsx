import React from 'react';
import { CryptoPrice } from '../../lib/types';
import { getCoinDescription } from '../../lib/crypto/descriptions';
import { BINANCE_COIN_NETWORKS } from '../../lib/crypto/networks';
import { NetworkBadge } from '../atoms/NetworkBadge';
import { SectorBadge } from '../atoms/SectorBadge';
import { BinanceBadge } from '../atoms/BinanceBadge';
import { AlphaIcon } from '../atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../atoms/UpbitBadge';
import { UPusdtBadge } from '../atoms/UPusdtBadge';
import { hasUpbitUsdtPair } from '../../lib/exchanges';
import { CRYPTO_SECTORS } from '../../lib/crypto/sectors';

// shadcn/ui imports
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

interface CoinDetailModalProps {
  coin: CryptoPrice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CoinDetailModal({ coin, isOpen, onClose }: CoinDetailModalProps) {
  if (!coin) return null;

  const description = getCoinDescription(coin.symbol);
  const networks = BINANCE_COIN_NETWORKS[coin.symbol.toUpperCase() as keyof typeof BINANCE_COIN_NETWORKS] || [];
  const isPositive = coin.is_positive;

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {coin.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {coin.korean_name}
              </DialogTitle>
              <DialogDescription className="text-lg font-semibold text-muted-foreground">
                {coin.symbol.toUpperCase()}
              </DialogDescription>
            </div>
          </div>
          
          {/* 거래소 배지들 */}
          <div className="flex items-center gap-2 flex-wrap">
            {coin.isBinanceAlpha && <AlphaIcon />}
            {coin.isOnBinance && <BinanceBadge size="md" />}
            {coin.isOnUpbit && <UpbitBadge size="md" />}
            {hasUpbitUsdtPair(coin.symbol) && <UPusdtBadge size="md" />}
            <SectorBadge 
              sector={coin.sector || CRYPTO_SECTORS[coin.symbol] || '기타'} 
              size="md" 
            />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 가격 정보 */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">현재 가격 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">현재가</p>
                <p className="text-2xl font-bold">
                  {formatPrice(coin.current_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24시간 변동률</p>
                <Badge 
                  variant={isPositive ? "default" : "destructive"}
                  className={`text-lg font-bold px-3 py-1 ${
                    isPositive 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <span className="mr-1">
                    {isPositive ? '▲' : '▼'}
                  </span>
                  <span>
                    {isPositive ? '+' : ''}{coin.change_rate?.toFixed(2) || '0.00'}%
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* 네트워크 정보 */}
          {networks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">지원 블록체인 네트워크</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <NetworkBadge symbol={coin.symbol} size="md" showAll={true} />
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">상세 네트워크 목록:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {networks.map((network, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        {network}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* 프로젝트 설명 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">프로젝트 소개</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
              <p className="text-sm leading-relaxed text-foreground">
                {description}
              </p>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">거래소 지원</p>
              <div className="flex flex-col gap-1">
                {coin.isOnBinance && (
                  <span className="text-muted-foreground">✓ 바이낸스</span>
                )}
                {coin.isOnUpbit && (
                  <span className="text-muted-foreground">✓ 업비트</span>
                )}
                {hasUpbitUsdtPair(coin.symbol) && (
                  <span className="text-muted-foreground">✓ 업비트 USDT</span>
                )}
                {coin.isBinanceAlpha && (
                  <span className="text-muted-foreground">✓ 바이낸스 알파</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">카테고리</p>
              <p className="text-muted-foreground">
                {coin.sector || CRYPTO_SECTORS[coin.symbol] || '기타'}
              </p>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              ⚠️ 이 정보는 참고용으로만 제공되며, 투자 조언이 아닙니다. 
              투자 전 충분한 조사를 통해 신중한 결정을 내리시기 바랍니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}