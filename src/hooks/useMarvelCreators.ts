```typescript
import { useQuery } from '@tanstack/react-query';
import { MarvelDataCollector } from '../services/marvel/MarvelDataCollector';

const marvelCollector = new MarvelDataCollector({
  apiKey: 'b13bf02cdd452c74e00544a0f8ed1165',
  privateKey: process.env.MARVEL_PRIVATE_KEY || '',
  baseUrl: 'https://gateway.marvel.com/v1/public'
});

export function useMarvelCreators(params: {
  firstName?: string;
  lastName?: string;
  nameStartsWith?: string;
  modifiedSince?: Date;
  limit?: number;
  offset?: number;
  orderBy?: 'firstName' | 'lastName' | 'modified';
}) {
  return useQuery({
    queryKey: ['marvelCreators', params],
    queryFn: () => marvelCollector.fetchMarvelCreatorsData(params),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}
```