import { useState, useEffect, useCallback } from 'react';

export function useData<T,>(fetchFn: () => Promise<T>, refreshInterval: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (e: any) {
      console.error("Fetch error:", e);
      setError(e.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, refreshInterval]);

  return { data, error, isLoading };
}
