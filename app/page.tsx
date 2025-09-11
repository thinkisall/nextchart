import { CryptoMarket } from './features/crypto/CryptoMarket';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ClientOnly } from './hooks/useIsClient';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <ClientOnly fallback={
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-xl text-gray-600 dark:text-gray-300">로딩 중...</span>
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
