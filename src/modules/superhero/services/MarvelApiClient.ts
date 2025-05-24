```typescript
import { ErrorHandler } from '@/utils/errors';
import { RateLimiter } from '@/utils/security/RateLimiter';
import { createHash } from 'crypto';

export class MarvelApiClient {
  private static instance: MarvelApiClient;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private readonly API_KEY = '10a77d15e994b3e1e5f9a0c7a4bb7424';
  private readonly BASE_URL = 'https://gateway.marvel.com/v1/public';

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.rateLimiter.createLimiter('marvel-api', 3000, 24 * 60 * 60 * 1000); // 3000 requests per day
  }

  public static getInstance(): MarvelApiClient {
    if (!MarvelApiClient.instance) {
      MarvelApiClient.instance = new MarvelApiClient();
    }
    return MarvelApiClient.instance;
  }

  private generateAuthParams(): Record<string, string> {
    const ts = Date.now().toString();
    const hash = createHash('md5')
      .update(ts + process.env.MARVEL_PRIVATE_KEY + this.API_KEY)
      .digest('hex');

    return {
      ts,
      apikey: this.API_KEY,
      hash
    };
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.rateLimiter.consume('marvel-api');

      const authParams = this.generateAuthParams();
      const queryParams = new URLSearchParams({
        ...authParams,
        ...params
      });

      const response = await fetch(`${this.BASE_URL}${endpoint}?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.results;
    }, {
      context: 'MarvelApiClient',
      endpoint,
      params
    });
  }

  public async searchCharacters(params: {
    nameStartsWith?: string;
    comics?: string;
    series?: string;
    events?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    return this.makeRequest('/characters', params);
  }

  public async getCharacter(id: string): Promise<any> {
    return this.makeRequest(`/characters/${id}`);
  }

  public async getComics(characterId: string): Promise<any[]> {
    return this.makeRequest(`/characters/${characterId}/comics`);
  }

  public async getEvents(characterId: string): Promise<any[]> {
    return this.makeRequest(`/characters/${characterId}/events`);
  }
}
```