import { CryptoMarket } from './features/crypto/CryptoMarket';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ClientOnly } from './hooks/useIsClient';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Professional header with subtle pattern */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-800 dark:via-blue-800 dark:to-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent opacity-40"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  실시간 암호화폐 시세
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-2">전문 암호화폐 트레이딩 대시보드</p>
              <p className="text-sm text-blue-200/80">빗썸 API 기반 실시간 시장 데이터</p>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative z-10">
          <ClientOnly fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200">시세 데이터 로딩 중...</span>
                </div>
              </div>
            </div>
          }>
            <CryptoMarket />
          </ClientOnly>
        </div>
      </div>
    </ErrorBoundary>
  );
}
