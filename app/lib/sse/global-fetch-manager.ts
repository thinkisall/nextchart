import { SSEConnectionManager } from './connection-manager';
import { BithumbApiService } from '../services/bithumb-api';

/**
 * 글로벌 데이터 페칭 관리자
 * SSE 연결을 통한 실시간 데이터 배포
 */
export class GlobalFetchManager {
  private static instance: GlobalFetchManager | null = null;
  private fetchInterval: NodeJS.Timeout | null = null;
  private lastFetchTime = 0;
  private readonly FETCH_COOLDOWN = 900; // 1초 쿨다운
  private readonly UPDATE_INTERVAL = 1000; // 1초마다 업데이트
  
  private constructor(private sseManager: SSEConnectionManager) {}

  static getInstance(sseManager: SSEConnectionManager): GlobalFetchManager {
    if (!this.instance) {
      this.instance = new GlobalFetchManager(sseManager);
    }
    return this.instance;
  }

  /**
   * 전역 데이터 페칭 시작
   */
  startFetching(): void {
    if (this.fetchInterval) return;

    const fetchAndBroadcast = async (): Promise<void> => {
      const now = Date.now();
      if (now - this.lastFetchTime < this.FETCH_COOLDOWN) return;

      try {
        // 빗썸 API에서 데이터 가져오기
        const cryptoData = await BithumbApiService.fetchProcessedData();
        this.lastFetchTime = now;

        // SSE 형식으로 데이터 브로드캐스트
        const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
        this.sseManager.broadcast(sseData);
      } catch (error) {
        console.error("❌ Global fetch error:", error);
        
        // 에러 브로드캐스트
        const errorData = `data: ${JSON.stringify({
          error: "Failed to fetch data",
          details: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        })}\n\n`;
        this.sseManager.broadcast(errorData);
      }
    };

    // 즉시 첫 데이터 전송
    fetchAndBroadcast();

    // 주기적으로 데이터 업데이트
    this.fetchInterval = setInterval(fetchAndBroadcast, this.UPDATE_INTERVAL);
  }

  /**
   * 전역 데이터 페칭 중지
   */
  stopFetching(): void {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
      this.fetchInterval = null;
    }
  }

  /**
   * 현재 페칭 상태 확인
   */
  isFetching(): boolean {
    return this.fetchInterval !== null;
  }

  /**
   * 인스턴스 정리
   */
  static cleanup(): void {
    if (this.instance) {
      this.instance.stopFetching();
      this.instance = null;
    }
  }
}
