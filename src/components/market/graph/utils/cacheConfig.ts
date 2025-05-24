export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // Data becomes stale after 5 minutes
  cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  maxAge: 24 * 60 * 60 * 1000, // Maximum age of 24 hours
  revalidateOnFocus: false,
  revalidateOnReconnect: true
};

export const getQueryKey = (timeRange: string) => ['marketData', timeRange];