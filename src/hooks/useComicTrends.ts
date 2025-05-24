```typescript
import { useQuery } from '@tanstack/react-query';
import { TrendingComicsManager } from '../services/scraping/TrendingComicsManager';

const trendingManager = new TrendingComicsManager();

export function useComicTrends() {
  return useQuery({
    queryKey: ['comicTrends'],
    queryFn: () => trendingManager.getTrendingComics(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 60 * 1000 // Consider data stale after 1 minute
  });
}

export function useComicSearch(query: string) {
  return useQuery({
    queryKey: ['comicSearch', query],
    queryFn: () => trendingManager.searchComics(query),
    enabled: query.length > 0
  });
}
```