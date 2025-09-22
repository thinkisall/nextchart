import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCryptoData, useFavorites } from '../../hooks/useCryptoData';
import './CryptoRanking.css';

// 개별 암호화폐 아이템 컴포넌트
const CryptoItem = ({ crypto, rank, onToggleFavorite, isFavorite }) => {
  const isPositive = crypto.price_change_percentage_24h > 0;
  
  return (
    <div className="crypto-item">
      <div className="crypto-rank">
        <span className="rank-number">{rank}</span>
      </div>
      
      <div className="crypto-info">
        <div className="crypto-icon">
          <img 
            src={crypto.image} 
            alt={crypto.name}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/32x32/FF6B6B/FFFFFF?text=${crypto.name[0]}`;
            }}
          />
        </div>
        <div className="crypto-details">
          <div className="crypto-name">{crypto.name}</div>
          <div className="crypto-symbol">{crypto.symbol.toUpperCase()}</div>
        </div>
      </div>
      
      <div className="crypto-price">
        <div className="current-price">
          ₩{crypto.current_price?.toLocaleString() || '0'}
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
        </div>
      </div>
      
      <div className="crypto-actions">
        <button 
          className={`star-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(crypto.id)}
          title={isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
};

// 로딩 컴포넌트
const LoadingItem = () => (
  <div className="crypto-item loading">
    <div className="loading-skeleton rank-skeleton"></div>
    <div className="loading-skeleton icon-skeleton"></div>
    <div className="loading-skeleton name-skeleton"></div>
    <div className="loading-skeleton price-skeleton"></div>
  </div>
);

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const showPages = 10; // 한번에 보여줄 페이지 수
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // 끝에서 시작 페이지 조정
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="page-btn"
      >
        처음
      </button>
      
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-btn"
      >
        이전
      </button>
      
      <div className="page-numbers">
        {getVisiblePages().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`page-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        다음
      </button>
      
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        끝
      </button>
    </div>
  );
};

// 메인 암호화폐 랭킹 컴포넌트
const CryptoRanking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [showAll, setShowAll] = useState(false);
  const { data, loading, error, refresh } = useCryptoData();
  const { toggleFavorite, isFavorite } = useFavorites();

  // 페이지네이션 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 표시할 데이터 결정
  const displayData = showAll ? data : data.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 스크롤을 헤더 아래로
    document.querySelector('.crypto-ranking')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // 전체 보기 토글
  const handleShowAll = () => {
    setShowAll(!showAll);
    setCurrentPage(1);
  };

  // 데이터가 변경될 때 페이지 리셋
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="crypto-ranking">
      {/* 헤더 */}
      <div className="ranking-header">
        <div className="header-left">
          <h2>변동률 순위</h2>
          <span className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </span>
          {!showAll && totalPages > 0 && (
            <span className="page-info">
              페이지 {currentPage} / {totalPages}
            </span>
          )}
        </div>
        
        <div className="header-controls">
          <span className="item-count">
            {showAll 
              ? `전체 ${data.length}개` 
              : `${Math.min(itemsPerPage, displayData.length)} / ${data.length}개`
            }
          </span>
          
          <button 
            onClick={handleShowAll}
            className={`toggle-btn ${showAll ? 'active' : ''}`}
          >
            {showAll ? '페이지별 보기' : '전체 보기'}
          </button>
          
          <button 
            onClick={refresh}
            className="refresh-btn"
            disabled={loading}
            title="새로고침"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={refresh}>다시 시도</button>
        </div>
      )}

      {/* 페이지네이션 (상단) */}
      {!showAll && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 암호화폐 리스트 */}
      <div className="crypto-list">
        {loading && displayData.length === 0 ? (
          // 초기 로딩
          Array.from({ length: 10 }, (_, i) => (
            <LoadingItem key={`loading-${i}`} />
          ))
        ) : displayData.length > 0 ? (
          // 데이터 표시
          displayData.map((crypto, index) => {
            const actualRank = showAll 
              ? index + 1 
              : startIndex + index + 1;
            
            return (
              <CryptoItem 
                key={crypto.id || `crypto-${index}`} 
                crypto={crypto} 
                rank={actualRank}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(crypto.id)}
              />
            );
          })
        ) : (
          // 데이터 없음
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <div className="no-data-message">데이터가 없습니다</div>
            <button onClick={refresh} className="retry-btn">
              다시 시도
            </button>
          </div>
        )}
      </div>

      {/* 페이지네이션 (하단) */}
      {!showAll && totalPages > 1 && (
        <div className="pagination-bottom">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 하단 정보 */}
      <div className="footer-info">
        <div className="footer-left">
          <span>총 {data.length}개 코인</span>
          {!showAll && (
            <span>• 페이지당 {itemsPerPage}개</span>
          )}
        </div>
        <div className="footer-right">
          <span>실시간 업데이트</span>
          <span>• 마지막 업데이트: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CryptoRanking;