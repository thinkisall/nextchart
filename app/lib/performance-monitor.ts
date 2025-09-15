/**
 * 성능 모니터링 유틸리티
 * - 렌더링 성능 측정
 * - 메모리 사용량 추적
 * - FPS 모니터링
 * - 모바일 성능 최적화 검증
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private renderTimes: number[] = [];
  private memoryUsages: number[] = [];
  private frameCount = 0;
  private lastTime = performance.now();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 컴포넌트 렌더링 시간 측정
   */
  measureRenderTime<T>(componentName: string, renderFn: () => T): T {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    this.renderTimes.push(renderTime);
    
    // 개발 모드에서만 로그
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 ${componentName} 렌더링 시간:`, `${renderTime.toFixed(2)}ms`);
      
      // 성능 경고 (5ms 이상 걸리면 경고)
      if (renderTime > 5) {
        console.warn(`⚠️ ${componentName} 렌더링이 느림:`, `${renderTime.toFixed(2)}ms`);
      }
    }
    
    return result;
  }

  /**
   * 메모리 사용량 측정
   */
  measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
      
      this.memoryUsages.push(usage.used);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('💾 메모리 사용량:', {
          used: `${(usage.used / 1024 / 1024).toFixed(2)} MB`,
          total: `${(usage.total / 1024 / 1024).toFixed(2)} MB`,
          usage: `${((usage.used / usage.total) * 100).toFixed(1)}%`
        });
      }
    }
  }

  /**
   * FPS 측정
   */
  measureFPS(): void {
    this.frameCount++;
    const now = performance.now();
    
    if (now >= this.lastTime + 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 FPS:', fps);
        
        // 성능 경고 (30fps 이하면 경고)
        if (fps < 30) {
          console.warn('⚠️ FPS 저하 감지:', fps);
        }
      }
    }
    
    requestAnimationFrame(() => this.measureFPS());
  }

  /**
   * 스크롤 성능 측정
   */
  measureScrollPerformance(element: HTMLElement): () => void {
    let lastScrollTime = performance.now();
    let scrollCount = 0;
    
    const handleScroll = () => {
      const now = performance.now();
      const scrollDelta = now - lastScrollTime;
      scrollCount++;
      
      if (scrollDelta > 16.67) { // 60fps 기준
        console.warn('⚠️ 스크롤 성능 저하:', `${scrollDelta.toFixed(2)}ms`);
      }
      
      lastScrollTime = now;
    };
    
    element.addEventListener('scroll', handleScroll, { passive: true });
    
    // cleanup 함수 반환
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }

  /**
   * 성능 통계 리포트
   */
  getPerformanceReport(): {
    avgRenderTime: number;
    maxRenderTime: number;
    memoryTrend: 'stable' | 'increasing' | 'decreasing';
    recommendations: string[];
  } {
    const avgRenderTime = this.renderTimes.length > 0 
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length 
      : 0;
    
    const maxRenderTime = this.renderTimes.length > 0 
      ? Math.max(...this.renderTimes) 
      : 0;
    
    // 메모리 트렌드 분석
    let memoryTrend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    if (this.memoryUsages.length > 5) {
      const recent = this.memoryUsages.slice(-5);
      const firstHalf = recent.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
      const secondHalf = recent.slice(-2).reduce((a, b) => a + b, 0) / 2;
      
      if (secondHalf > firstHalf * 1.1) {
        memoryTrend = 'increasing';
      } else if (secondHalf < firstHalf * 0.9) {
        memoryTrend = 'decreasing';
      }
    }
    
    // 성능 개선 권장사항
    const recommendations: string[] = [];
    
    if (avgRenderTime > 3) {
      recommendations.push('컴포넌트 렌더링 최적화 필요 (React.memo, useMemo 활용)');
    }
    
    if (maxRenderTime > 10) {
      recommendations.push('무거운 렌더링 로직 발견 - 가상 스크롤링 적용 권장');
    }
    
    if (memoryTrend === 'increasing') {
      recommendations.push('메모리 누수 가능성 - 이벤트 리스너 정리 및 ref 해제 확인');
    }
    
    return {
      avgRenderTime,
      maxRenderTime,
      memoryTrend,
      recommendations
    };
  }

  /**
   * 모바일 디바이스 성능 검사
   */
  static isMobilePerformanceOptimized(): boolean {
    // 터치 디바이스 여부
    const isTouchDevice = 'ontouchstart' in window;
    
    // 모바일 환경 여부
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    // GPU 가속 지원 여부
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    return isTouchDevice && isMobile && hasWebGL;
  }

  /**
   * 성능 최적화 권장사항 생성
   */
  static getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // 디바이스 성능 체크
    if (!PerformanceMonitor.isMobilePerformanceOptimized()) {
      recommendations.push('모바일 최적화 필요: Virtual Scrolling 및 GPU 가속 활용');
    }
    
    // 메모리 체크
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
      
      if (usagePercent > 70) {
        recommendations.push('메모리 사용량 높음: 컴포넌트 최적화 및 정리 로직 강화');
      }
    }
    
    // 네트워크 속도 체크
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        recommendations.push('느린 네트워크 환경: 데이터 로딩 최적화 및 캐싱 강화');
      }
    }
    
    return recommendations;
  }
}

// React Hook으로 사용하기 위한 헬퍼
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureRenderTime: monitor.measureRenderTime.bind(monitor),
    measureMemoryUsage: monitor.measureMemoryUsage.bind(monitor),
    measureScrollPerformance: monitor.measureScrollPerformance.bind(monitor),
    getPerformanceReport: monitor.getPerformanceReport.bind(monitor),
  };
}
