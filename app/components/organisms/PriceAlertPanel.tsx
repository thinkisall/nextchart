import { useState } from 'react';
import { CryptoPrice } from '../../lib/types';
import { Button } from '../atoms/Button';
import { usePriceAlerts } from '../../hooks/usePriceAlerts';

interface PriceAlertPanelProps {
  cryptos: CryptoPrice[];
}

export function PriceAlertPanel({ cryptos }: PriceAlertPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');

  const {
    alerts,
    notificationPermission,
    requestNotificationPermission,
    addAlert,
    removeAlert,
    toggleAlert
  } = usePriceAlerts();

  const handleAddAlert = () => {
    if (!selectedCrypto || !targetPrice) return;

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;

    addAlert(selectedCrypto, alertType, price);
    setTargetPrice('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const getCryptoName = (symbol: string) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    return crypto ? crypto.korean_name : symbol;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
      >
        <span>🔔 가격 알림 설정</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {/* 알림 권한 요청 */}
          {notificationPermission !== 'granted' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">
                브라우저 알림을 받으려면 권한을 허용해주세요.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={requestNotificationPermission}
              >
                알림 권한 요청
              </Button>
            </div>
          )}

          {/* 새 알림 추가 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">코인 선택</option>
              {cryptos.slice(0, 20).map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.korean_name} ({crypto.symbol})
                </option>
              ))}
            </select>

            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as 'above' | 'below')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="above">이상 시</option>
              <option value="below">이하 시</option>
            </select>

            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="목표가격"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button
              onClick={handleAddAlert}
              disabled={!selectedCrypto || !targetPrice}
              size="sm"
              variant="primary"
            >
              알림 추가
            </Button>
          </div>

          {/* 현재 알림 목록 */}
          {alerts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">설정된 알림 ({alerts.length}개)</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      alert.isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {getCryptoName(alert.symbol)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {alert.type === 'above' ? '≥' : '≤'} {formatPrice(alert.price)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          alert.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {alert.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {alert.isActive ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
