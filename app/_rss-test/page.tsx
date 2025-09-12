'use client';

import { useState } from 'react';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

interface RSSData {
  content: string;
  items: RSSItem[];
}

export default function RSSTestPage() {
  const [rssData, setRssData] = useState<RSSData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchRSS = async () => {
    setIsLoading(true);
    setError('');
    setRssData(null);
    
    try {
      const response = await fetch('/rss');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // XML 유효성 검증
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        
        if (parseError) {
          throw new Error('XML 구문 분석 오류: ' + parseError.textContent);
        }
        
        // RSS 아이템 파싱
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || ''
        }));
        
        setRssData({ content, items });
      } catch (xmlError) {
        setError('XML 파싱 오류: ' + (xmlError as Error).message);
      }
      
    } catch (fetchError) {
      setError('RSS 가져오기 실패: ' + (fetchError as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            RSS Feed 테스트
          </h1>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={fetchRSS}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로딩 중...' : 'RSS Feed 가져오기'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {rssData && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    파싱된 RSS 아이템들 ({rssData.items.length}개)
                  </h2>
                  <div className="space-y-4">
                    {rssData.items.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>{item.pubDate}</span>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                              링크
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    원본 RSS XML
                  </h2>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-xs text-gray-800 dark:text-gray-200 max-h-96">
                    {rssData.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
