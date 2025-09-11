import { CryptoPrice } from '../../lib/types';
import { PriceChange } from '../atoms/PriceChange';
import { SECTOR_COLORS } from '../../lib/crypto';

interface CryptoRowProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: boolean;
}

export function CryptoRow({ crypto, onClick, onToggleFavorite, isFavorite = false }: CryptoRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: price < 1000 ? 2 : 0,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toFixed(2);
  };

  return (
    <tr 
      className="hover:bg-gray-50 border-b border-gray-100"
    >
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(crypto.symbol);
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-1"
            onClick={onClick}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="font-medium text-gray-900">
                  {crypto.korean_name}
                </div>
                {crypto.sector && (
                  <span className={`px-2 py-1 text-xs rounded-full ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 text-gray-600'}`}>
                    {crypto.sector}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="text-lg font-semibold text-gray-900">
          {formatPrice(crypto.current_price)}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
        />
      </td>
      <td className="px-4 py-3 text-right text-sm text-gray-600">
        {formatVolume(crypto.volume)}
      </td>
    </tr>
  );
}
