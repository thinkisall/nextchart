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
        <span className="ml-3 text-gray-600 dark:text-gray-300">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 dark:text-red-400 mb-2">⚠️ 오류가 발생했습니다</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{error}</div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">📊 데이터가 없습니다</div>
        <div className="text-sm text-gray-600 dark:text-gray-500">잠시 후 다시 확인해주세요</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                암호화폐
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                현재가
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                변동률
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                거래량
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                즐겨찾기
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cryptos.map((crypto) => (
              <CryptoRow
                key={crypto.symbol}
                crypto={crypto}
                onClick={() => onCryptoClick?.(crypto)}
                onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                isFavorite={isFavorite?.(crypto.symbol) || false}
                variant="desktop"
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 리스트 */}
      <div className="md:hidden space-y-2 p-2">
        {cryptos.map((crypto) => (
          <CryptoRow
            key={crypto.symbol}
            crypto={crypto}
            onClick={() => onCryptoClick?.(crypto)}
            onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
            isFavorite={isFavorite?.(crypto.symbol) || false}
            variant="mobile"
          />
        ))}
      </div>
    </div>
  );
}