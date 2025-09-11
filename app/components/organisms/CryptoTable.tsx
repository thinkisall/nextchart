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
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-xl border border-white/20 dark:border-gray-700/30">
            <LoadingSpinner size="lg" />
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">시세 데이터 로딩</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">실시간 가격 조회 중...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl px-8 py-6 border border-red-200 dark:border-red-800/30 shadow-xl">
            <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2 flex items-center justify-center space-x-2">
              <span>⚠️</span>
              <span>시세 데이터 오류</span>
            </div>
            <div className="text-sm text-red-600/80 dark:text-red-400/80">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl px-8 py-6 border border-gray-200 dark:border-gray-700/30 shadow-xl">
            <div className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2 flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>시세 데이터 없음</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">잠시 후 다시 시도해주세요</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* Professional Trading Table Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-600/30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">실시간 시세</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">실시간 암호화폐 가격</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 dark:text-slate-400">실시간 데이터</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                {cryptos.length} 종목
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Professional Table */}
      <div className="hidden md:block">
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">종목</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">가격</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">24시간 변동</span>
                    <span className="text-xs text-slate-400">↓</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">거래량</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">관심</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/20 dark:divide-slate-700/20">
              {cryptos.map((crypto, index) => (
                <CryptoRow
                  key={crypto.symbol}
                  crypto={crypto}
                  onClick={() => onCryptoClick?.(crypto)}
                  onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                  isFavorite={isFavorite?.(crypto.symbol) || false}
                  variant="desktop"
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden bg-transparent p-4 space-y-3">
        {cryptos.map((crypto, index) => (
          <CryptoRow
            key={crypto.symbol}
            crypto={crypto}
            onClick={() => onCryptoClick?.(crypto)}
            onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
            isFavorite={isFavorite?.(crypto.symbol) || false}
            variant="mobile"
            index={index}
          />
        ))}
      </div>

      {/* Professional Footer */}
      <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-600/30">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              총 {cryptos.length}개 종목 표시 • 24시간 성과 기준 정렬
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
              <span>1초마다 업데이트</span>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>실시간</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}