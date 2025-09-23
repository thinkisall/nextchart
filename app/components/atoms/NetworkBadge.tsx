import React from 'react';
import { Badge } from '../../../components/ui/badge';
import { NETWORK_STYLES, normalizeNetworkName, getCoinMainNetwork, BINANCE_COIN_NETWORKS } from '../../lib/crypto/networks';

interface NetworkBadgeProps {
  symbol?: string;
  exchange?: string;
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean; // 모든 네트워크 표시 여부
}

export function NetworkBadge({ symbol, exchange, size = 'sm', showAll = false }: NetworkBadgeProps) {
  // exchange가 있으면 exchange 기반, 없으면 symbol 기반
  if (exchange) {
    // exchange 기반 배지 표시
    const exchangeStyles = {
      'upbit': { label: '업비트', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      'upbit_usdt': { label: 'UP-USDT', className: 'bg-purple-100 text-purple-700 border-purple-200' },
      'bithumb': { label: '빗썸', className: 'bg-orange-100 text-orange-700 border-orange-200' },
      'binance': { label: '바이낸스', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      'binance_alpha': { label: 'BN-Alpha', className: 'bg-green-100 text-green-700 border-green-200' },
    };

    const style = exchangeStyles[exchange as keyof typeof exchangeStyles];
    if (!style) return null;

    return (
      <Badge className={`text-xs px-1 py-0 ${style.className}`}>
        {style.label}
      </Badge>
    );
  }

  // symbol 기반 (기존 로직)
  if (!symbol) return null;
  
  const networks = BINANCE_COIN_NETWORKS[symbol.toUpperCase() as keyof typeof BINANCE_COIN_NETWORKS];
  
  if (!networks || networks.length === 0) {
    return null;
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5 h-5';
      case 'md':
        return 'text-sm px-2 py-1 h-6';
      case 'lg':
        return 'text-base px-3 py-1.5 h-8';
      default:
        return 'text-xs px-1.5 py-0.5 h-5';
    }
  };

  if (showAll && networks.length > 1) {
    // 모든 네트워크 표시
    return (
      <div className="flex flex-wrap gap-1">
        {networks.slice(0, 3).map((network, index) => {
          const normalizedNetwork = normalizeNetworkName(network);
          const style = NETWORK_STYLES[normalizedNetwork as keyof typeof NETWORK_STYLES] || NETWORK_STYLES['기타'];
          
          return (
            <Badge
              key={index}
              className={`
                ${style.color} ${style.text} border-0
                ${getSizeClasses(size)}
                font-medium transition-all duration-200 hover:scale-105
              `}
              title={network}
            >
              {style.shortName}
            </Badge>
          );
        })}
        {networks.length > 3 && (
          <Badge
            className={`
              bg-gray-400 text-white border-0
              ${getSizeClasses(size)}
              font-medium
            `}
            title={`+${networks.length - 3}개 네트워크`}
          >
            +{networks.length - 3}
          </Badge>
        )}
      </div>
    );
  }

  // 주요 네트워크만 표시
  const mainNetwork = getCoinMainNetwork(symbol);
  const style = NETWORK_STYLES[mainNetwork as keyof typeof NETWORK_STYLES] || NETWORK_STYLES['기타'];
  
  return (
    <Badge
      className={`
        ${style.color} ${style.text} border-0
        ${getSizeClasses(size)}
        font-medium transition-all duration-200 hover:scale-105
      `}
      title={`${networks.length}개 네트워크: ${networks.join(', ')}`}
    >
      {style.shortName}
      {networks.length > 1 && (
        <span className="ml-1 opacity-75">+{networks.length - 1}</span>
      )}
    </Badge>
  );
}

// 네트워크 상세 정보를 보여주는 툴팁 컴포넌트
export function NetworkTooltip({ symbol }: { symbol: string }) {
  const networks = BINANCE_COIN_NETWORKS[symbol.toUpperCase() as keyof typeof BINANCE_COIN_NETWORKS];
  
  if (!networks || networks.length === 0) {
    return null;
  }

  return (
    <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border max-w-xs">
      <h4 className="font-semibold mb-2 text-sm">{symbol} 지원 네트워크</h4>
      <div className="space-y-1">
        {networks.map((network, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            • {network}
          </div>
        ))}
      </div>
    </div>
  );
}