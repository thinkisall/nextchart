import { CryptoPrice } from '../../lib/types';
import { CryptoRow } from '../molecules/CryptoRow';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface CryptoTableProps {
  cryptos: CryptoPrice[];
  loading: boolean;
  error?: string | null;
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
}

export function CryptoTable({ cryptos, loading, error, onCryptoClick, onToggleFavorite, isFavorite }: CryptoTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">❌ 오류가 발생했습니다</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              암호화폐
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              현재가
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              변동률 ⬇️ (기본정렬)
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              거래량(24H)
            </th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => (
            <CryptoRow
              key={crypto.symbol}
              crypto={crypto}
              onClick={() => onCryptoClick?.(crypto)}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite?.(crypto.symbol)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
