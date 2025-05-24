import { MarvelApiClient } from './MarvelApiClient';
import type { MarvelCharacter, MarvelComic, MarvelSeries, MarvelEvent } from './types';

export class MarvelDataManager {
  private client: MarvelApiClient;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  constructor(client: MarvelApiClient) {
    this.client = client;
  }

  private getCacheKey(type: string, id: string | number): string {
    return `${type}-${id}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public async getCharacterProfile(id: number): Promise<{
    character: MarvelCharacter;
    recentComics: MarvelComic[];
    series: MarvelSeries[];
    events: MarvelEvent[];
  }> {
    const cacheKey = this.getCacheKey('character-profile', id);
    const cached = this.getFromCache<ReturnType<typeof this.getCharacterProfile>>(cacheKey);
    if (cached) return cached;

    const [character, comicsResponse, seriesResponse, eventsResponse] = await Promise.all([
      this.client.getCharacter(id),
      this.client.getCharacterComics(id, { limit: 10, orderBy: '-focDate' }),
      this.client.getCharacterSeries(id, { limit: 10, orderBy: '-startYear' }),
      this.client.getCharacterEvents(id, { limit: 10, orderBy: '-startDate' })
    ]);

    const profile = {
      character,
      recentComics: comicsResponse.data.results,
      series: seriesResponse.data.results,
      events: eventsResponse.data.results
    };

    this.setCache(cacheKey, profile);
    return profile;
  }

  public async searchCharacters(query: string): Promise<MarvelCharacter[]> {
    const cacheKey = this.getCacheKey('character-search', query);
    const cached = this.getFromCache<MarvelCharacter[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.searchCharacters({
      nameStartsWith: query,
      limit: 20
    });

    this.setCache(cacheKey, response.data.results);
    return response.data.results;
  }

  public async getCharacterComics(
    characterId: number,
    params: {
      limit?: number;
      startYear?: number;
      format?: string;
    } = {}
  ): Promise<MarvelComic[]> {
    const cacheKey = this.getCacheKey(
      `character-comics-${JSON.stringify(params)}`,
      characterId
    );
    const cached = this.getFromCache<MarvelComic[]>(cacheKey);
    if (cached) return cached;

    const response = await this.client.getCharacterComics(characterId, {
      limit: params.limit || 20,
      startYear: params.startYear,
      format: params.format,
      orderBy: '-focDate'
    });

    this.setCache(cacheKey, response.data.results);
    return response.data.results;
  }

  public async getCharacterTimeline(characterId: number): Promise<{
    comics: MarvelComic[];
    events: MarvelEvent[];
  }> {
    const cacheKey = this.getCacheKey('character-timeline', characterId);
    const cached = this.getFromCache<ReturnType<typeof this.getCharacterTimeline>>(cacheKey);
    if (cached) return cached;

    const [comicsResponse, eventsResponse] = await Promise.all([
      this.client.getCharacterComics(characterId, { 
        limit: 100,
        orderBy: 'focDate'
      }),
      this.client.getCharacterEvents(characterId, {
        limit: 100,
        orderBy: 'startDate'
      })
    ]);

    const timeline = {
      comics: comicsResponse.data.results,
      events: eventsResponse.data.results
    };

    this.setCache(cacheKey, timeline);
    return timeline;
  }
}