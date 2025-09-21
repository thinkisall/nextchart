import { useState, useEffect, useCallback } from 'react';

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
    tension?: number;
  }>;
}

export interface UseChartDataOptions {
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export function useChartData(
  initialData: ChartData,
  options: UseChartDataOptions = {}
) {
  const { refreshInterval = 30000, autoRefresh = false } = options;
  
  const [data, setData] = useState<ChartData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 프로젝트에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 샘플 데이터 생성 (실제로는 API에서 받아온 데이터)
      const newData = {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(() => 
            Math.floor(Math.random() * 50000) + 10000
          )
        }))
      };
      
      setData(newData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refreshData,
    setData
  };
}