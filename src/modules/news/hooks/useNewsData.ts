import { useQuery } from '@tanstack/react-query';
import { NewsService } from '../services/NewsService';

const newsService = NewsService.getInstance();

export function useNewsData() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => newsService.getLatestNews(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
    refetchOnWindowFocus: false
  });
}