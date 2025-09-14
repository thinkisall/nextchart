/**
 * SSE (Server-Sent Events) 연결 관리자
 * 실시간 데이터 스트리밍을 위한 연결 관리
 */

export class SSEConnectionManager {
  private connections = new Set<ReadableStreamDefaultController>();
  private cleanupIntervals = new Map<ReadableStreamDefaultController, NodeJS.Timeout>();

  /**
   * 새로운 연결 추가
   */
  addConnection(controller: ReadableStreamDefaultController): void {
    this.connections.add(controller);
  }

  /**
   * 연결 제거 및 정리
   */
  removeConnection(controller: ReadableStreamDefaultController): void {
    this.connections.delete(controller);
    const interval = this.cleanupIntervals.get(controller);
    if (interval) {
      clearInterval(interval);
      this.cleanupIntervals.delete(controller);
    }
  }

  /**
   * 연결에 대한 정리 인터벌 추가
   */
  addCleanupInterval(
    controller: ReadableStreamDefaultController,
    interval: NodeJS.Timeout
  ): void {
    this.cleanupIntervals.set(controller, interval);
  }

  /**
   * 모든 활성 연결에 데이터 브로드캐스트
   */
  broadcast(data: string): void {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    // 연결이 끊어진 컨트롤러들을 추적
    const failedConnections: ReadableStreamDefaultController[] = [];

    this.connections.forEach((controller) => {
      try {
        controller.enqueue(encodedData);
      } catch (error) {
        // 연결이 끊어진 컨트롤러 기록
        failedConnections.push(controller);
      }
    });

    // 실패한 연결들 정리
    failedConnections.forEach((controller) => {
      this.removeConnection(controller);
    });
  }

  /**
   * 현재 활성 연결 수 반환
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * 모든 연결 정리
   */
  cleanup(): void {
    this.connections.forEach((controller) => {
      try {
        controller.close();
      } catch (error) {
        // 이미 닫힌 연결 무시
      }
    });

    this.cleanupIntervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.connections.clear();
    this.cleanupIntervals.clear();
  }
}
