'use client';

import { useState, useEffect } from 'react';
import { fetcher } from '@/utils/api/fetcher';

interface UseFetchOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  dependencies?: any[];
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchData() {
      if (!options.enabled) return;
      
      setIsLoading(true);
      setError(null);

      const response = await fetcher<T>(url, {
        signal: abortController.signal
      });

      setIsLoading(false);

      if (response.error) {
        setError(response.error);
        options.onError?.(response.error);
      } else if (response.data) {
        setData(response.data);
        options.onSuccess?.(response.data);
      }
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, options.enabled, ...(options.dependencies || [])]);

  return { data, error, isLoading };
}