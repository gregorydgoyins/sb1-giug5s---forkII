```typescript
import { ErrorHandler } from '@/utils/errors';
import { MarvelApiClient } from './MarvelApiClient';
import type { SuperheroCharacter, CharacterSearchParams } from '../types';

export class CharacterService {
  private static instance: CharacterService;
  private errorHandler: ErrorHandler;
  private marvelClient: MarvelApiClient;
  private cache: Map<string, { data: SuperheroCharacter; timestamp: number }>;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.marvelClient = MarvelApiClient.getInstance();
    this.cache = new Map();
  }

  public static getInstance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService();
    }
    return CharacterService.instance;
  }

  public async searchCharacters(params: CharacterSearchParams): Promise<SuperheroCharacter[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const marvelCharacters = await this.marvelClient.searchCharacters({
        nameStartsWith: params.name,
        limit: params.limit,
        offset: params.offset
      });

      return marvelCharacters.map(char => this.transformMarvelCharacter(char));
    }, {
      context: 'CharacterService',
      operation: 'searchCharacters',
      params
    });
  }

  public async getCharacter(id: string): Promise<SuperheroCharacter> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check cache
      const cached = this.cache.get(id);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // Fetch from Marvel API
      const [character, comics, events] = await Promise.all([
        this.marvelClient.getCharacter(id),
        this.marvelClient.getComics(id),
        this.marvelClient.getEvents(id)
      ]);

      const transformedCharacter = this.transformMarvelCharacter(character, {
        comics,
        events
      });

      // Update cache
      this.cache.set(id, {
        data: transformedCharacter,
        timestamp: Date.now()
      });

      return transformedCharacter;
    }, {
      context: 'CharacterService',
      operation: 'getCharacter',
      characterId: id
    });
  }

  private transformMarvelCharacter(
    marvelChar: any,
    extraData?: { comics?: any[]; events?: any[] }
  ): SuperheroCharacter {
    return {
      id: marvelChar.id.toString(),
      name: marvelChar.name,
      alias: this.extractAlias(marvelChar.description),
      type: this.determineCharacterType(marvelChar),
      status: 'active',
      firstAppearance: {
        issue: extraData?.comics?.[0]?.title || 'Unknown',
        date: extraData?.comics?.[0]?.dates?.[0]?.date || 'Unknown',
        publisher: 'Marvel Comics'
      },
      origin: {
        narrative: marvelChar.description || '',
        powers: this.extractPowers(marvelChar.description),
        motivation: ''
      },
      relationships: {
        teams: [],
        allies: [],
        enemies: [],
        mentors: []
      },
      storyArcs: extraData?.events?.map((event: any) => ({
        title: event.title,
        description: event.description,
        significance: this.calculateEventSignificance(event)
      })) || [],
      images: {
        portrait: `${marvelChar.thumbnail.path}.${marvelChar.thumbnail.extension}`,
        action: []
      },
      marketData: {
        price: this.calculateBasePrice(marvelChar),
        change: 0,
        volume: 0,
        marketCap: 0
      }
    };
  }

  private extractAlias(description: string): string {
    // Implement alias extraction logic
    return '';
  }

  private determineCharacterType(character: any): CharacterType {
    // Implement character type determination logic
    return 'superhero';
  }

  private extractPowers(description: string): string[] {
    // Implement power extraction logic
    return [];
  }

  private calculateEventSignificance(event: any): number {
    // Implement significance calculation logic
    return 0;
  }

  private calculateBasePrice(character: any): number {
    // Implement price calculation logic
    return 1000;
  }
}
```