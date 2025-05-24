```typescript
import { createHash } from 'crypto';
import type { MarvelCreator, MarvelApiConfig, MarvelApiResponse, MarvelApiError } from './types';

export class MarvelDataCollector {
  private config: MarvelApiConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private requestCount: number = 0;
  private lastReset: Date = new Date();
  private readonly DAILY_LIMIT = 3000;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: MarvelApiConfig) {
    this.config = {
      baseUrl: 'https://gateway.marvel.com/v1/public',
      enableCache: true,
      cacheDuration: this.CACHE_DURATION,
      ...config
    };
  }

  public async fetchMarvelCreatorsData(params: {
    firstName?: string;
    lastName?: string;
    nameStartsWith?: string;
    modifiedSince?: Date;
    limit?: number;
    offset?: number;
    orderBy?: 'firstName' | 'lastName' | 'modified';
  }): Promise<{
    creator: MarvelCreator;
    stats: {
      totalResults: number;
      returnedResults: number;
      remainingDailyRequests: number;
      cacheStatus: string;
    };
  }> {
    try {
      // Check rate limits
      if (!this.checkRateLimit()) {
        throw new Error('Daily API limit reached');
      }

      // Generate cache key
      const cacheKey = this.generateCacheKey('creators', params);

      // Check cache if enabled
      if (this.config.enableCache) {
        const cachedData = this.getFromCache(cacheKey);
        if (cachedData) {
          return {
            ...cachedData,
            stats: {
              ...cachedData.stats,
              cacheStatus: 'hit'
            }
          };
        }
      }

      // Prepare request parameters
      const timestamp = Date.now().toString();
      const hash = this.generateHash(timestamp);
      const queryParams = new URLSearchParams({
        apikey: this.config.apiKey,
        ts: timestamp,
        hash,
        ...this.cleanParams(params)
      });

      // Make API request
      const response = await this.makeRequest('/creators', queryParams);
      
      // Transform response data
      const transformedData = this.transformCreatorData(response.data.results[0]);
      
      // Cache results if enabled
      if (this.config.enableCache) {
        this.saveToCache(cacheKey, transformedData);
      }

      return {
        ...transformedData,
        stats: {
          totalResults: response.data.total,
          returnedResults: response.data.count,
          remainingDailyRequests: this.DAILY_LIMIT - this.requestCount,
          cacheStatus: 'miss'
        }
      };

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private generateHash(timestamp: string): string {
    return createHash('md5')
      .update(timestamp + this.config.privateKey + this.config.apiKey)
      .digest('hex');
  }

  private async makeRequest(endpoint: string, params: URLSearchParams): Promise<MarvelApiResponse> {
    const url = `${this.config.baseUrl}${endpoint}?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Marvel API error: ${response.statusText}`);
    }

    this.requestCount++;
    return response.json();
  }

  private checkRateLimit(): boolean {
    const now = new Date();
    if (now.getDate() !== this.lastReset.getDate()) {
      this.requestCount = 0;
      this.lastReset = now;
    }
    return this.requestCount < this.DAILY_LIMIT;
  }

  private generateCacheKey(endpoint: string, params: object): string {
    return `${endpoint}-${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > (this.config.cacheDuration || this.CACHE_DURATION);
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private saveToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private cleanParams(params: object): object {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          acc[key] = value.toISOString();
        } else {
          acc[key] = value.toString();
        }
      }
      return acc;
    }, {} as Record<string, string>);
  }

  private transformCreatorData(rawData: any): { creator: MarvelCreator } {
    // Transform raw API data into our MarvelCreator type
    return {
      creator: {
        personalInfo: {
          id: rawData.id,
          fullName: rawData.fullName,
          professionalTitle: this.deriveProfessionalTitle(rawData),
          biography: rawData.description || '',
          careerTimeline: this.buildCareerTimeline(rawData),
          lastModified: new Date(rawData.modified)
        },
        media: {
          profileImage: `${rawData.thumbnail.path}.${rawData.thumbnail.extension}`,
          thumbnails: [],
          gallery: []
        },
        works: {
          comics: rawData.comics.items.map(this.transformComicWork),
          series: rawData.series.items.map(this.transformSeriesWork),
          characters: {
            heroes: [],
            villains: []
          }
        },
        contributions: {
          storylines: [],
          universeExpansions: [],
          innovations: []
        },
        metadata: {
          resourceURI: rawData.resourceURI,
          apiEndpoints: [],
          lastUpdated: new Date(rawData.modified),
          dataVersion: '1.0'
        }
      }
    };
  }

  private deriveProfessionalTitle(rawData: any): string {
    const roles = new Set(rawData.comics.items.map((comic: any) => comic.role));
    return Array.from(roles).join(', ');
  }

  private buildCareerTimeline(rawData: any): Array<{year: number; milestone: string}> {
    // Extract timeline from available data
    return [];
  }

  private transformComicWork(comic: any): {title: string; year: number; role: string} {
    return {
      title: comic.name,
      year: parseInt(comic.name.match(/\((\d{4})\)/)?.[1] || '0'),
      role: comic.role || 'Unknown'
    };
  }

  private transformSeriesWork(series: any): {name: string; startYear: number; endYear: number} {
    return {
      name: series.name,
      startYear: series.startYear || 0,
      endYear: series.endYear || 0
    };
  }

  private handleError(error: any): never {
    const apiError: MarvelApiError = {
      code: error.status || 500,
      message: error.message || 'Unknown error occurred',
      timestamp: new Date()
    };

    console.error('Marvel API Error:', apiError);
    throw apiError;
  }
}
```