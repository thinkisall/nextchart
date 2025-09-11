import { CryptoMarket } from './features/crypto/CryptoMarket';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ClientOnly } from './hooks/useIsClient';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ClientOnly fallback={
            <div className="text-center py-20">
              <div className="text-xl text-gray-600">로딩 중...</div>
            </div>
          }>
            <CryptoMarket />
          </ClientOnly>
        </div>
      </div>
    </ErrorBoundary>
  );
}
