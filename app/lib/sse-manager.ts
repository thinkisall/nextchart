import { getAllTickers } from './bithumb-api';

// SSE ?�결 관리자
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
    
    // ?�결???�어�?컨트롤러?�을 추적
    const failedConnections: ReadableStreamDefaultController[] = [];

    this.connections.forEach(controller => {
      try {
        controller.enqueue(encodedData);
      } catch (error) {
        // ?�결???�어�?컨트롤러 기록
        failedConnections.push(controller);
      }
    });

    // ?�패???�결???�리
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
        // ?��? ?�힌 ?�결 무시
      }
    });
    
    this.cleanupIntervals.forEach(interval => {
      clearInterval(interval);
    });
    
    this.connections.clear();
    this.cleanupIntervals.clear();
  }
}

// ?�역 SSE ?�결 관리자
const sseManager = new SSEConnectionManager();

// ?�역 ?�이???�칭 (모든 ?�결?�서 공유)
let globalFetchInterval: NodeJS.Timeout | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 900; // 0.9�?쿨다??(1초보???�간 빠르�?

const startGlobalFetching = () => {
  if (globalFetchInterval) return;const fetchAndBroadcast = async () => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return;
    
    try {// 바이?�스 ?�보가 ?�함??getAllTickers ?�수 ?�용
      const cryptoData = await getAllTickers();
      
      lastFetchTime = now;
      
      // SSE ?�식?�로 ?�이??브로?�캐?�트
      const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
      sseManager.broadcast(sseData);
      
    } catch (error) {
      // Error handling - removed console.error for production
      const errorData = `data: ${JSON.stringify({ 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })}\n\n`;
      sseManager.broadcast(errorData);
    }
  };

  // 즉시 �??�이???�송
  fetchAndBroadcast();
  
  // 1초마???�이???�데?�트
  globalFetchInterval = setInterval(fetchAndBroadcast, 1000);
};

const stopGlobalFetching = () => {
  if (globalFetchInterval) {
    clearInterval(globalFetchInterval);
    globalFetchInterval = null;
  }
};

export { sseManager, startGlobalFetching, stopGlobalFetching };
