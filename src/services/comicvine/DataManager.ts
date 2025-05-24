import { ComicVineClient } from './ComicVineClient';
import type { Character, Creator, Volume, Issue } from './types';

export class DataManager {
  private client: ComicVineClient;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(client: ComicVineClient) {
    this.client = client;
  }

  private getCacheKey(type: string, id: number | string): string {
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

  public async getCharacterDetails(id: number): Promise<Character> {
    const cacheKey = this.getCacheKey('character', id);
    const cached = this.getFromCache<Character>(cacheKey);
    if (cached) return cached;

    const character = await this.client.getCharacter(id);
    this.setCache(cacheKey, character);
    return character;
  }

  public async getCreatorDetails(id: number): Promise<Creator> {
    const cacheKey = this.getCacheKey('creator', id);
    const cached = this.getFromCache<Creator>(cacheKey);
    if (cached) return cached;

    const creator = await this.client.getCreator(id);
    this.setCache(cacheKey, creator);
    return creator;
  }

  public async getVolumeDetails(id: number): Promise<Volume> {
    const cacheKey = this.getCacheKey('volume', id);
    const cached = this.getFromCache<Volume>(cacheKey);
    if (cached) return cached;

    const volume = await this.client.getVolume(id);
    this.setCache(cacheKey, volume);
    return volume;
  }

  public async getIssueDetails(id: number): Promise<Issue> {
    const cacheKey = this.getCacheKey('issue', id);
    const cached = this.getFromCache<Issue>(cacheKey);
    if (cached) return cached;

    const issue = await this.client.getIssue(id);
    this.setCache(cacheKey, issue);
    return issue;
  }

  public async searchComics(query: string): Promise<{
    characters: Character[];
    creators: Creator[];
    volumes: Volume[];
    issues: Issue[];
  }> {
    const [characters, creators, volumes, issues] = await Promise.all([
      this.client.searchCharacters(query),
      this.client.searchCreators(query),
      this.client.searchVolumes(query),
      this.client.searchIssues({ title: query })
    ]);

    return {
      characters,
      creators,
      volumes,
      issues
    };
  }

  public async getCharacterTimeline(characterId: number): Promise<{
    firstAppearance: Issue | null;
    significantIssues: Issue[];
  }> {
    const character = await this.getCharacterDetails(characterId);
    const relatedIssues = await this.client.getRelatedIssues(characterId);

    return {
      firstAppearance: character.firstAppearance ? 
        await this.getIssueDetails(character.firstAppearance.issue.id) : 
        null,
      significantIssues: relatedIssues
    };
  }
}