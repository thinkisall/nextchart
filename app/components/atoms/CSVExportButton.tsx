'use client';

import { CryptoPrice } from '../../lib/types';

interface CSVExportButtonProps {
  cryptos: CryptoPrice[];
  filename?: string;
}

export function CSVExportButton({ cryptos, filename = 'crypto-prices' }: CSVExportButtonProps) {
  const exportToCSV = () => {
    if (cryptos.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    // CSV 헤더
    const headers = [
      '심볼',
      '한글명',
      '영문명',
      '섹터',
      '현재가(원)',
      '변동률(%)',
      '변동금액(원)',
      '고가(원)',
      '저가(원)',
      '거래량',
      '등락구분'
    ];

    // CSV 데이터 생성
    const csvContent = [
      headers.join(','), // 헤더 행
      ...cryptos.map(crypto => [
        crypto.symbol,
        `"${crypto.korean_name}"`, // 한글명은 따옴표로 감싸기
        `"${crypto.english_name}"`,
        `"${crypto.sector || '기타'}"`,
        crypto.current_price.toLocaleString('ko-KR'),
        crypto.change_rate.toFixed(2),
        crypto.change_amount.toLocaleString('ko-KR'),
        crypto.high_price.toLocaleString('ko-KR'),
        crypto.low_price.toLocaleString('ko-KR'),
        crypto.volume.toLocaleString('ko-KR'),
        crypto.is_positive ? '상승' : '하락'
      ].join(','))
    ].join('\n');

    // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
    const BOM = '\uFEFF';
    const csvData = BOM + csvContent;

    // 파일 다운로드
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const downloadFilename = `${filename}_${timestamp}.csv`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 메모리 정리
    URL.revokeObjectURL(url);
    
    console.log(`CSV 파일 다운로드: ${downloadFilename} (${cryptos.length}개 코인)`);
  };

  return (
    <button
      onClick={exportToCSV}
      className="inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 touch-manipulation min-h-[44px]"
    >
      <svg 
        className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      <span className="hidden sm:inline">CSV 다운로드 ({cryptos.length}개)</span>
      <span className="sm:hidden">CSV ({cryptos.length})</span>
    </button>
  );
}