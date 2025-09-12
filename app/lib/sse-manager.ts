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
const FETCH_COOLDOWN = 900; // 0.9초 쿨다운 (1초보다 약간 빠르게)

const startGlobalFetching = () => {
  if (globalFetchInterval) return;

  console.log('Starting global SSE fetching...');

  const fetchAndBroadcast = async () => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return;
    
    try {
      console.log('Fetching data from Bithumb API...');
      // 바이낸스 정보가 포함된 getAllTickers 함수 사용
      const cryptoData = await getAllTickers();
      
      lastFetchTime = now;
      
      // SSE 형식으로 데이터 브로드캐스트
      const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
      sseManager.broadcast(sseData);
      console.log(`SSE data broadcasted to ${sseManager.getConnectionCount()} connections`);
      
    } catch (error) {
      console.error('Global SSE fetch error:', error);
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
  
  // 1초마다 데이터 업데이트
  globalFetchInterval = setInterval(fetchAndBroadcast, 1000);
};

const stopGlobalFetching = () => {
  if (globalFetchInterval) {
    clearInterval(globalFetchInterval);
    globalFetchInterval = null;
  }
};

export { sseManager, startGlobalFetching, stopGlobalFetching };
