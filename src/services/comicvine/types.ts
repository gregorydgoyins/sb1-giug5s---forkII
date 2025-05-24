```typescript
export interface ComicVineConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: {
    maxRequests: number;
    perMilliseconds: number;
  };
}

export interface ComicVineResponse<T> {
  error: string;
  limit: number;
  offset: number;
  numberOfPageResults: number;
  numberOfTotalResults: number;
  statusCode: number;
  results: T[];
}

export interface ComicData {
  id: number;
  title: string;
  issueNumber: string;
  description: string;
  dateAdded: string;
  dateLastUpdated: string;
  image_alternates: string[];
  user_review_average: number;
  coverDate: string;
  resourceURI: string;
}

export interface ApiError {
  msg: string;
  error: string;
  timestamp: string;
}
```