```typescript
import { useQuery } from '@tanstack/react-query';
import { MarvelDataCollector } from '../services/marvel/MarvelDataCollector';

const collector = new MarvelDataCollector();

export function useMarvelCharacters() {
  return useQuery({
    queryKey: ['marvelCharacters'],
    queryFn: () => collector.collectCharacterData(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export function useMarvelCreators() {
  return useQuery({
    queryKey: ['marvelCreators'],
    queryFn: () => collector.collectCreatorData(),
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000
  });
}
```