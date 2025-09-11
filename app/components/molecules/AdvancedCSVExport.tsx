'use client';

import { useState } from 'react';
import { CryptoPrice } from '../../lib/types';

interface AdvancedCSVExportProps {
  cryptos: CryptoPrice[];
}

export function AdvancedCSVExport({ cryptos }: AdvancedCSVExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    symbol: true,
    korean_name: true,
    english_name: true,
    sector: true,
    current_price: true,
    change_rate: true,
    change_amount: true,
    high_price: true,
    low_price: true,
    volume: true,
    is_positive: true,
  });
  const [sortBy, setSortBy] = useState<keyof CryptoPrice>('change_rate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [topN, setTopN] = useState<number>(0); // 0 = 전체

  const fieldLabels = {
    symbol: '심볼',
    korean_name: '한글명',
    english_name: '영문명',
    sector: '섹터',
    current_price: '현재가',
    change_rate: '변동률(%)',
    change_amount: '변동금액',
    high_price: '고가',
    low_price: '저가',
    volume: '거래량',
    is_positive: '등락구분',
  };

  const handleFieldChange = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const exportCustomCSV = () => {
    let dataToExport = [...cryptos];

    // 정렬
    dataToExport.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // 상위 N개만 필터링
    if (topN > 0) {
      dataToExport = dataToExport.slice(0, topN);
    }

    // 선택된 필드만 포함
    const selectedFieldsArray = Object.entries(selectedFields)
      .filter(([_, selected]) => selected)
      .map(([field, _]) => field as keyof CryptoPrice);

    // CSV 헤더
    const headers = selectedFieldsArray.map(field => fieldLabels[field as keyof typeof fieldLabels]);

    // CSV 데이터 생성
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(crypto => 
        selectedFieldsArray.map(field => {
          const value = crypto[field];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          if (typeof value === 'number') {
            return value.toLocaleString('ko-KR');
          }
          if (typeof value === 'boolean') {
            return value ? '상승' : '하락';
          }
          return String(value);
        }).join(',')
      )
    ].join('\n');

    // 파일 다운로드
    const BOM = '\uFEFF';
    const csvData = BOM + csvContent;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `crypto_custom_${timestamp}.csv`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    setIsOpen(false);
    console.log(`커스텀 CSV 다운로드: ${filename} (${dataToExport.length}개 코인)`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        커스텀 내보내기
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsOpen(false)} />
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            커스텀 CSV 내보내기
          </h3>
          
          {/* 필드 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">포함할 필드:</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(fieldLabels).map(([field, label]) => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFields[field as keyof typeof selectedFields]}
                    onChange={() => handleFieldChange(field as keyof typeof selectedFields)}
                    className="mr-2"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 기준:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof CryptoPrice)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="change_rate">변동률</option>
                <option value="current_price">현재가</option>
                <option value="volume">거래량</option>
                <option value="symbol">심볼</option>
                <option value="korean_name">한글명</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">내림차순</option>
                <option value="asc">오름차순</option>
              </select>
            </div>
          </div>

          {/* 개수 제한 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 개수 (0 = 전체):
            </label>
            <input
              type="number"
              min="0"
              max={cryptos.length}
              value={topN}
              onChange={(e) => setTopN(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`전체 ${cryptos.length}개`}
            />
          </div>

          {/* 버튼들 */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              onClick={exportCustomCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
