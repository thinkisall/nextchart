// 새로운 모듈화된 섹터 구조와 호환되는 섹터 데이터 훅
'use client';

import { useState, useEffect, useMemo } from 'react';
import { CryptoPrice } from '../lib/types';
import { useCryptoPrices } from './useCryptoPrices';
import { useServerSentEvents } from './useServerSentEvents';
import { SectorNavigationUtils } from '../features/sector-analysis/utils/SectorNavigationUtils';
import { SectorAnalysisService } from '../features/sector-analysis/services/SectorAnalysisService';

export function useModernSectorData(sectorName: string) {
  const [isClient, setIsClient] = useState(false);
  
  // REST API 훅
  const { prices, loading: isLoading, error, refetch } = useCryptoPrices();
  
  // SSE 훅
  const { 
    data: sseData, 
    isConnected: sseConnected, 
    reconnect: sseReconnect 
  } = useServerSentEvents();
  
  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 우선순위: SSE > REST API
  const displayData = sseData.length > 0 ? sseData : prices;
  
  // 새로운 모듈화된 구조로 섹터별 필터링
  const filteredCryptos = useMemo(() => {
    if (displayData.length === 0) return [];
    
    console.log('🔍 Filtering for sector:', sectorName, 'with', displayData.length, 'total items');
    
    // 모든 섹터 그룹 가져오기
    const sectorGroups = SectorAnalysisService.getAllSectorGroups();
    
    // sectorName이 어떤 그룹인지 찾기
    let targetSectors: { [key: string]: string } = {};
    
    // 1. displayName으로 직접 매칭
    for (const [groupKey, group] of Object.entries(sectorGroups)) {
      if (group.displayName === sectorName) {
        targetSectors = group.sectors;
        break;
      }
    }
    
    // 2. 기존 섹터명 매핑으로 찾기
    if (Object.keys(targetSectors).length === 0) {
      const sectorMappings = {
        'L1': 'L1 블록체인',
        'L2': 'L2 & 확장성', 
        'DeFi': 'DeFi 프로토콜',
        'AI': 'AI & 에이전트',
        '밈코인': '밈코인',
        'GameFi': 'GameFi & NFT',
        '스테이킹': '스테이킹 & 스테이블코인',
        '인프라': '인프라 & DePIN',
        '한국 프로젝트': '한국 프로젝트 & 결제',
        'DAO': '소셜 & DAO',
        'RWA': 'RWA & 코스모스',
        '기타': '기타'
      };
      
      const mappedDisplayName = sectorMappings[sectorName as keyof typeof sectorMappings];
      if (mappedDisplayName) {
        for (const [groupKey, group] of Object.entries(sectorGroups)) {
          if (group.displayName === mappedDisplayName) {
            targetSectors = group.sectors;
            break;
          }
        }
      }
    }
    
    // 3. 여전히 없으면 기존 방식으로 폴백 + "기타" 특별 처리
    if (Object.keys(targetSectors).length === 0) {
      // "기타" 섹터의 경우 특별 처리
      if (sectorName === '기타') {
        console.log('🔍 Processing "기타" sector...');
        
        // 모든 섹터에 정의된 토큰들 수집
        const allDefinedTokens = new Set<string>();
        for (const [groupKey, group] of Object.entries(sectorGroups)) {
          Object.keys(group.sectors).forEach(symbol => {
            allDefinedTokens.add(symbol);
          });
        }
        
        // 정의되지 않은 토큰들을 "기타"로 분류
        const undefinedTokens = displayData.filter(crypto => {
          // 1. 섹터 매핑에 없고
          const notInSectorMapping = !allDefinedTokens.has(crypto.symbol);
          // 2. crypto.sector가 없거나 "기타"인 경우
          const hasNoSector = !crypto.sector || crypto.sector === '기타' || crypto.sector.includes('기타');
          
          return notInSectorMapping || hasNoSector;
        });
        
        console.log('📊 Undefined tokens for "기타":', undefinedTokens.length, 'out of', displayData.length);
        console.log('🔍 Sample undefined tokens:', undefinedTokens.slice(0, 5).map(t => t.symbol));
        
        return undefinedTokens;
      }
      
      // 기존 CRYPTO_SECTORS에서 해당 섹터명을 포함하는 토큰들 찾기
      return displayData.filter(crypto => {
        return crypto.sector === sectorName || 
               (crypto.sector && crypto.sector.includes(sectorName));
      });
    }
    
    // 4. 새로운 섹터 구조로 필터링
    const result = displayData.filter(crypto => {
      return crypto.symbol in targetSectors;
    });
    
    console.log('✅ Filtered result:', result.length, 'items for sector:', sectorName);
    if (result.length < 5) {
      console.log('🔍 Sample filtered items:', result.map(r => r.symbol));
    }
    
    return result;
    
  }, [displayData, sectorName]);
  
  // 섹터 정보 가져오기
  const sectorInfo = useMemo(() => {
    const sectorGroups = SectorAnalysisService.getAllSectorGroups();
    
    // displayName으로 직접 매칭
    for (const [groupKey, group] of Object.entries(sectorGroups)) {
      if (group.displayName === sectorName) {
        return { groupKey, ...group };
      }
    }
    
    // 기존 섹터명 매핑으로 찾기
    const sectorMappings = {
      'L1': 'L1 블록체인',
      'L2': 'L2 & 확장성',
      'DeFi': 'DeFi 프로토콜', 
      'AI': 'AI & 에이전트',
      '밈코인': '밈코인',
      'GameFi': 'GameFi & NFT',
      '스테이킹': '스테이킹 & 스테이블코인',
      '인프라': '인프라 & DePIN',
      '한국 프로젝트': '한국 프로젝트 & 결제',
      'DAO': '소셜 & DAO',
      'RWA': 'RWA & 코스모스',
      '기타': '기타'
    };
    
    const mappedDisplayName = sectorMappings[sectorName as keyof typeof sectorMappings];
    if (mappedDisplayName) {
      for (const [groupKey, group] of Object.entries(sectorGroups)) {
        if (group.displayName === mappedDisplayName) {
          return { groupKey, ...group };
        }
      }
    }
    
    return null;
  }, [sectorName]);
  
  const refresh = () => {
    refetch();
    sseReconnect();
  };
  
  return {
    filteredCryptos,
    isLoading,
    error,
    sseConnected,
    totalDataCount: displayData.length,
    dataSource: sseData.length > 0 ? 'SSE' : 'REST',
    refresh,
    sectorInfo, // 추가: 섹터 정보
    hasData: filteredCryptos.length > 0 // 추가: 데이터 존재 여부
  };
}
