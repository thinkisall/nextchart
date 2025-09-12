'use client';

import { useState } from 'react';

export default function RSSTestPage() {
  const [rssContent, setRssContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchRSS = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/rss');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      setRssContent(content);
      
      // XML ? íš¨??ê²€??      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        
        if (parseError) {
          throw new Error('XML êµ¬ë¬¸ ë¶„ì„ ?¤ë¥˜: ' + parseError.textContent);
        }} catch (xmlError) {
        setError('XML ?Œì‹± ?¤ë¥˜: ' + (xmlError as Error).message);
      }
      
    } catch (fetchError) {
      setError('RSS ê°€?¸ì˜¤ê¸??¤íŒ¨: ' + (fetchError as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            RSS Feed ?ŒìŠ¤??          </h1>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={fetchRSS}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'ë¡œë”© ì¤?..' : 'RSS ê°€?¸ì˜¤ê¸?}
              </button>
              
              <a
                href="/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                RSS ????—???´ê¸°
              </a>
              
              <a
                href="https://validator.w3.org/feed/check.cgi?url=https%3A//www.damoabom.com/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                W3C RSS ê²€ì¦?              </a>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-800 dark:text-red-400 font-semibold">?¤ë¥˜:</h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
              </div>
            )}
            
            {rssContent && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="text-green-800 dark:text-green-400 font-semibold">
                    ??RSS ?±ê³µ?ìœ¼ë¡??ì„±??                  </h3>
                  <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                    RSS ?¼ë“œê°€ ? íš¨??XML ?•ì‹?¼ë¡œ ?ì„±?˜ì—ˆ?µë‹ˆ??
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    RSS XML ë¯¸ë¦¬ë³´ê¸°:
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                    <code>{rssContent}</code>
                  </pre>
                </div>
              </div>
            )}
            
            {!rssContent && !error && !isLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-blue-800 dark:text-blue-400 font-semibold">RSS ?ŒìŠ¤???„êµ¬</h3>
                <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                  ?„ì˜ ë²„íŠ¼???´ë¦­?˜ì—¬ RSS ?¼ë“œë¥??ŒìŠ¤?¸í•˜ê±°ë‚˜ ê²€ì¦í•˜?¸ìš”.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}