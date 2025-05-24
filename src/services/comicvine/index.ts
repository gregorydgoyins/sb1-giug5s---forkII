```typescript
export * from './ComicVineClient';
export * from './types';
export * from './validators';

export const DEFAULT_CONFIG: ComicVineConfig = {
  apiKey: import.meta.env.VITE_COMICVINE_API_KEY || '',
  baseUrl: 'https://comicvine.gamespot.com/api',
  rateLimit: {
    maxRequests: 200,
    perMilliseconds: 3600000 // 1 hour
  }
};
```