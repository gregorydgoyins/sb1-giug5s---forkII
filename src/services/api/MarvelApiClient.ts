import md5 from 'md5';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { MarvelCharacter, MarvelCreator } from './types';

export class MarvelApiClient {
  private static instance: MarvelApiClient;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private readonly baseUrl = 'https://gateway.marvel.com/v1/public';
  private readonly publicKey = 'b13bf02cdd452c74e00544a0f8ed1165';
  private readonly privateKey = process.env.MARVEL_PRIVATE_KEY || '';

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.rateLimiter.createLimiter('marvel', 3000, 24 * 60 * 60 * 1000); // 3000 requests per day
  }

  public static getInstance(): MarvelApiClient {
    if (!MarvelApiClient.instance) {
      MarvelApiClient.instance = new MarvelApiClient();
    }
    return MarvelApiClient.instance;
  }

  private generateAuthParams(): Record<string, string> {
    const ts = Date.now().toString();
    const hash = md5(ts + this.privateKey + this.publicKey);
    return {
      ts,
      apikey: this.publicKey,
      hash
    };
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.rateLimiter.consume('marvel');

      const authParams = this.generateAuthParams();
      const queryParams = new URLSearchParams({
        ...authParams,
        ...params
      });

      const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);
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

  public async getCreator(id: string): Promise<MarvelCreator> {
    return this.makeRequest<MarvelCreator>(`/creators/${id}`);
  }

  public async searchCreators(query: string): Promise<MarvelCreator[]> {
    return this.makeRequest<MarvelCreator[]>('/creators', {
      nameStartsWith: query,
      limit: '20'
    });
  }

  public async getCharacter(id: string): Promise<MarvelCharacter> {
    return this.makeRequest<MarvelCharacter>(`/characters/${id}`);
  }

  public async searchCharacters(query: string): Promise<MarvelCharacter[]> {
    return this.makeRequest<MarvelCharacter[]>('/characters', {
      nameStartsWith: query,
      limit: '20'
    });
  }
}