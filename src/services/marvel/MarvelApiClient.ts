import axios, { AxiosInstance } from 'axios';
import rateLimit from 'axios-rate-limit';
import { MD5 } from 'crypto-js';
import type { 
  MarvelApiConfig, 
  MarvelApiResponse, 
  MarvelCharacter,
  MarvelComic,
  MarvelSeries,
  MarvelEvent
} from './types';

export class MarvelApiClient {
  private client: AxiosInstance;
  private config: MarvelApiConfig;

  constructor(config: MarvelApiConfig) {
    this.config = config;
    
    this.client = rateLimit(axios.create({
      baseURL: config.baseUrl
    }), {
      maxRequests: config.rateLimit.maxRequests,
      perMilliseconds: config.rateLimit.perMilliseconds
    });
  }

  private generateAuthParams(): Record<string, string> {
    const ts = new Date().getTime().toString();
    const hash = MD5(ts + this.config.privateKey + this.config.publicKey).toString();
    
    return {
      ts,
      apikey: this.config.publicKey,
      hash
    };
  }

  private async makeRequest<T>(
    endpoint: string, 
    params: Record<string, any> = {}
  ): Promise<MarvelApiResponse<T>> {
    try {
      const response = await this.client.get<MarvelApiResponse<T>>(endpoint, {
        params: {
          ...this.generateAuthParams(),
          ...params
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Marvel API request failed: ${error.message}`);
    }
  }

  public async getCharacter(id: number): Promise<MarvelCharacter> {
    const response = await this.makeRequest<MarvelCharacter>(`/characters/${id}`);
    return response.data.results[0];
  }

  public async searchCharacters(params: {
    name?: string;
    nameStartsWith?: string;
    modifiedSince?: Date;
    comics?: number[];
    series?: number[];
    events?: number[];
    limit?: number;
    offset?: number;
  }): Promise<MarvelApiResponse<MarvelCharacter>> {
    return this.makeRequest<MarvelCharacter>('/characters', params);
  }

  public async getCharacterComics(
    characterId: number,
    params: {
      format?: string;
      formatType?: string;
      noVariants?: boolean;
      dateDescriptor?: string;
      dateRange?: [Date, Date];
      title?: string;
      titleStartsWith?: string;
      startYear?: number;
      issueNumber?: number;
      diamondCode?: string;
      digitalId?: number;
      upc?: string;
      isbn?: string;
      ean?: string;
      issn?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<MarvelApiResponse<MarvelComic>> {
    return this.makeRequest<MarvelComic>(
      `/characters/${characterId}/comics`,
      params
    );
  }

  public async getCharacterSeries(
    characterId: number,
    params: {
      title?: string;
      titleStartsWith?: string;
      startYear?: number;
      modifiedSince?: Date;
      comics?: number[];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<MarvelApiResponse<MarvelSeries>> {
    return this.makeRequest<MarvelSeries>(
      `/characters/${characterId}/series`,
      params
    );
  }

  public async getCharacterEvents(
    characterId: number,
    params: {
      name?: string;
      nameStartsWith?: string;
      modifiedSince?: Date;
      creators?: number[];
      characters?: number[];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<MarvelApiResponse<MarvelEvent>> {
    return this.makeRequest<MarvelEvent>(
      `/characters/${characterId}/events`,
      params
    );
  }

  public async getComic(id: number): Promise<MarvelComic> {
    const response = await this.makeRequest<MarvelComic>(`/comics/${id}`);
    return response.data.results[0];
  }

  public async searchComics(params: {
    format?: string;
    formatType?: string;
    noVariants?: boolean;
    dateDescriptor?: string;
    dateRange?: [Date, Date];
    title?: string;
    titleStartsWith?: string;
    startYear?: number;
    issueNumber?: number;
    diamondCode?: string;
    digitalId?: number;
    upc?: string;
    isbn?: string;
    ean?: string;
    issn?: string;
    limit?: number;
    offset?: number;
  }): Promise<MarvelApiResponse<MarvelComic>> {
    return this.makeRequest<MarvelComic>('/comics', params);
  }
}