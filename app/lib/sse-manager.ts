import { getAllTickers } from './bithumb-api';

// SSE 연결 관리자
class SSEConnectionManager {
  private connections = new Set<ReadableStreamDefaultController>();
  private cleanupIntervals = new Map<ReadableStreamDefaultController, NodeJS.Timeout>();

  addConnection(controller: ReadableStreamDefaultController) {
    this.connections.add(controller);
  }

  removeConnection(controller: ReadableStreamDefaultController) {
    this.connections.delete(controller);
    const interval = this.cleanupIntervals.get(controller);
    if (interval) {
      clearInterval(interval);
      this.cleanupIntervals.delete(controller);
    }
  }

  addCleanupInterval(controller: ReadableStreamDefaultController, interval: NodeJS.Timeout) {
    this.cleanupIntervals.set(controller, interval);
  }

  broadcast(data: string) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    // 연결이 끊어진 컨트롤러들을 추적
    const failedConnections: ReadableStreamDefaultController[] = [];

    this.connections.forEach(controller => {
      try {
        controller.enqueue(encodedData);
      } catch (error) {
        // 연결이 끊어진 컨트롤러 기록
        failedConnections.push(controller);
      }
    });

    // 실패한 연결들 정리
    failedConnections.forEach(controller => {
      this.removeConnection(controller);
    });
  }

  getConnectionCount() {
    return this.connections.size;
  }

  cleanup() {
    this.connections.forEach(controller => {
      try {
        controller.close();
      } catch (error) {
        // 이미 닫힌 연결 무시
      }
    });
    
    this.cleanupIntervals.forEach(interval => {
      clearInterval(interval);
    });
    
    this.connections.clear();
    this.cleanupIntervals.clear();
  }
}

// 전역 SSE 연결 관리자
const sseManager = new SSEConnectionManager();

// 전역 데이터 페칭 (모든 연결에서 공유)
let globalFetchInterval: NodeJS.Timeout | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 2900; // 3초 쿨다운으로 증가 (API 안정성 확보)

const startGlobalFetching = () => {
  if (globalFetchInterval) return;

  const fetchAndBroadcast = async () => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return;
    
    try {
      console.log('🚀 Fetching crypto data at:', new Date().toLocaleTimeString());
      
      // 바이낸스 정보가 포함된 getAllTickers 함수 사용
      const cryptoData = await getAllTickers();
      
      lastFetchTime = now;
      
      console.log('📡 Broadcasting data, count:', cryptoData.length, 'connections:', sseManager.getConnectionCount());
      
      // SSE 형식으로 데이터 브로드캐스트
      const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
      sseManager.broadcast(sseData);
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      // Error handling - removed console.error for production
      const errorData = `data: ${JSON.stringify({ 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })}\n\n`;
      sseManager.broadcast(errorData);
    }
  };

  // 즉시 첫 데이터 전송
  fetchAndBroadcast();
  
  // 3초마다 데이터 업데이트 (더 안정적인 주기)
  globalFetchInterval = setInterval(fetchAndBroadcast, 3000);
};

const stopGlobalFetching = () => {
  if (globalFetchInterval) {
    clearInterval(globalFetchInterval);
    globalFetchInterval = null;
  }
};

export { sseManager, startGlobalFetching, stopGlobalFetching };
