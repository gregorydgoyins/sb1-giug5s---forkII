import { MarketDataService } from './MarketDataService';
import { MarketDataAggregator } from './MarketDataAggregator';
import { ScrapingManager } from '../scraping/ScrapingManager';
import { NewsAggregator } from '../news/NewsAggregator';
import { ErrorHandler } from '../../utils/errors';
import type { ComicData, MarketTrend, SearchParams } from './types';

export class MarketDataIntegrator {
  private static instance: MarketDataIntegrator;
  private marketDataService: MarketDataService;
  private marketDataAggregator: MarketDataAggregator;
  private scrapingManager: ScrapingManager;
  private newsAggregator: NewsAggregator;
  private errorHandler: ErrorHandler;

  private readonly DATA_SOURCES = [
    {
      name: 'GoCollect',
      priority: 1,
      enabled: true
    },
    {
      name: 'Key Collector',
      priority: 2,
      enabled: true
    },
    {
      name: 'Heritage Auctions',
      priority: 3,
      enabled: true
    }
  ];

  private constructor() {
    this.marketDataService = MarketDataService.getInstance();
    this.marketDataAggregator = new MarketDataAggregator();
    this.scrapingManager = ScrapingManager.getInstance();
    this.newsAggregator = NewsAggregator.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): MarketDataIntegrator {
    if (!MarketDataIntegrator.instance) {
      MarketDataIntegrator.instance = new MarketDataIntegrator();
    }
    return MarketDataIntegrator.instance;
  }

  public async getTrendingComics(): Promise<MarketTrend[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const trends: MarketTrend[] = [];
      
      for (const source of this.DATA_SOURCES) {
        if (!source.enabled) continue;
        
        try {
          const sourceTrends = await this.fetchTrendsFromSource(source.name);
          trends.push(...sourceTrends);
        } catch (error) {
          console.info(`Failed to fetch trends from ${source.name}, continuing with other sources`);
        }
      }

      return this.deduplicateAndSortTrends(trends);
    }, {
      context: 'MarketDataIntegrator',
      operation: 'getTrendingComics'
    });
  }

  public async searchComics(params: SearchParams): Promise<ComicData[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const results = await Promise.allSettled(
        this.DATA_SOURCES
          .filter(source => source.enabled)
          .map(source => this.searchComicsFromSource(source.name, params))
      );

      const validResults = results
        .filter((result): result is PromiseFulfilledResult<ComicData[]> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .flat();

      return this.deduplicateAndMergeComics(validResults);
    }, {
      context: 'MarketDataIntegrator',
      operation: 'searchComics',
      params
    });
  }

  public async getComicData(id: string): Promise<ComicData> {
    return this.errorHandler.withErrorHandling(async () => {
      const results = await Promise.allSettled(
        this.DATA_SOURCES
          .filter(source => source.enabled)
          .map(source => this.fetchComicFromSource(source.name, id))
      );

      const validResults = results
        .filter((result): result is PromiseFulfilledResult<ComicData> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      if (validResults.length === 0) {
        throw new Error(`No valid data found for comic ${id}`);
      }

      return this.mergeComicData(validResults);
    }, {
      context: 'MarketDataIntegrator',
      operation: 'getComicData',
      comicId: id
    });
  }

  private async fetchTrendsFromSource(source: string): Promise<MarketTrend[]> {
    switch (source) {
      case 'GoCollect':
        return this.marketDataService.getTrendingComics();
      case 'Key Collector':
        return this.marketDataAggregator.getTrendingComics();
      case 'Heritage Auctions':
        return [];
      default:
        return [];
    }
  }

  private async searchComicsFromSource(source: string, params: SearchParams): Promise<ComicData[]> {
    switch (source) {
      case 'GoCollect':
        return this.marketDataService.searchComics(params);
      case 'Key Collector':
        return [];
      case 'Heritage Auctions':
        return [];
      default:
        return [];
    }
  }

  private async fetchComicFromSource(source: string, id: string): Promise<ComicData> {
    switch (source) {
      case 'GoCollect':
        return this.marketDataService.getComicDetails(id);
      default:
        throw new Error(`Source ${source} not implemented`);
    }
  }

  private deduplicateAndSortTrends(trends: MarketTrend[]): MarketTrend[] {
    const uniqueTrends = new Map<string, MarketTrend>();
    
    trends.forEach(trend => {
      if (!uniqueTrends.has(trend.symbol) || 
          trend.timestamp > uniqueTrends.get(trend.symbol)!.timestamp) {
        uniqueTrends.set(trend.symbol, trend);
      }
    });

    return Array.from(uniqueTrends.values())
      .sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange));
  }

  private deduplicateAndMergeComics(comics: ComicData[]): ComicData[] {
    const merged = new Map<string, ComicData>();

    comics.forEach(comic => {
      if (merged.has(comic.id)) {
        merged.set(comic.id, this.mergeComicData([
          merged.get(comic.id)!,
          comic
        ]));
      } else {
        merged.set(comic.id, comic);
      }
    });

    return Array.from(merged.values());
  }

  private mergeComicData(comics: ComicData[]): ComicData {
    // Take the most recent data
    return comics.reduce((latest, current) => {
      return current.lastUpdated > latest.lastUpdated ? current : latest;
    });
  }
}