// SSE ?�결 ?�태 관�??�틸리티
export const SSE_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2
} as const;

export class SSEConnectionManager {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isIntentionallyClosed = false;

  constructor(
    private url: string,
    private onMessage: (data: any) => void,
    private onStatusChange: (connected: boolean, error?: string) => void
  ) {}

  connect() {
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return; // ?��? ?�결?�어 ?�음
    }

    this.isIntentionallyClosed = false;
    
    try {
      this.eventSource = new EventSource(this.url);
      
      this.eventSource.onopen = () => {this.reconnectAttempts = 0;
        this.onStatusChange(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('SSE message parsing error:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.onStatusChange(false, 'Connection error');
        
        // ?�도?�으�??�힌 것이 ?�니�??�연�??�도 ?�수가 ?�아?�다�?        if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.onStatusChange(false, 'Failed to create connection');
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // 지수백오프    
    
    setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this.connect();
      }
    }, delay);
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    this.reconnectAttempts = 0;
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.onStatusChange(false);
  }

  getState() {
    if (!this.eventSource) return SSE_STATES.CLOSED;
    return this.eventSource.readyState;
  }

  isConnected() {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}
