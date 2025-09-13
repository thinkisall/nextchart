import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(componentName: string, deps: any[] = []) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${componentName} - Render #${renderCountRef.current}, Time since last: ${timeSinceLastRender}ms`);
      
      // 너무 자주 렌더링되는 경우 경고
      if (timeSinceLastRender < 100 && renderCountRef.current > 1) {
        console.warn(`⚠️ ${componentName} - Frequent re-renders detected! (${timeSinceLastRender}ms)`);
      }
    }
    
    lastRenderTimeRef.current = now;
  }, deps);

  return {
    renderCount: renderCountRef.current,
    lastRenderTime: lastRenderTimeRef.current
  };
}

export function useUpdateTracker(value: any, valueName: string) {
  const prevValueRef = useRef(value);
  
  useEffect(() => {
    if (prevValueRef.current !== value && process.env.NODE_ENV === 'development') {
      console.log(`📊 ${valueName} updated:`, {
        from: prevValueRef.current,
        to: value,
        timestamp: new Date().toISOString()
      });
    }
    prevValueRef.current = value;
  }, [value, valueName]);
}
