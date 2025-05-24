import { ErrorHandler } from '../errors/ErrorHandler';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: RequestCache;
}

interface FetchResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

const DEFAULT_OPTIONS: FetchOptions = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  cache: 'default'
};

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const errorHandler = ErrorHandler.getInstance();
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 0;

  while (attempt < (mergedOptions.retries || 1)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), mergedOptions.timeout);

      const response = await fetch(url, {
        ...mergedOptions,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null, status: response.status };

    } catch (error) {
      attempt++;
      
      errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'fetcher',
        url,
        attempt,
        maxRetries: mergedOptions.retries
      });

      if (attempt === mergedOptions.retries) {
        return {
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          status: 500
        };
      }

      await new Promise(resolve => 
        setTimeout(resolve, mergedOptions.retryDelay! * attempt)
      );
    }
  }

  return {
    data: null,
    error: new Error('Maximum retries exceeded'),
    status: 500
  };
}