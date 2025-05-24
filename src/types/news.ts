```typescript
export type NewsCategory = 'market' | 'media' | 'creator' | 'publisher' | 'general';

export interface NewsSource {
  name: string;
  url: string;
  reliability: number;
  categories: NewsCategory[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  category: NewsCategory;
  timestamp: Date;
  impact: number;
  tags: string[];
}
```