import { scrapingConfig } from './config';
import { logError, logInfo } from './utils/logger';
import { ComicVineApi } from './api/comicVineApi';
import { PageScraper } from './scrapers/pageScraper';
import { TrendAnalyzer } from './analyzers/trendAnalyzer';
import type { ComicTrend, ScrapedComic } from './types';

export class ContentAggregator {
  private comicVineApi: ComicVineApi;
  private pageScraper: PageScraper;
  private trendAnalyzer: TrendAnalyzer;
  private updateInterval: NodeJS.Timeout | null = null;
  private latestContent: ComicTrend[] = [];

  constructor() {
    this.comicVineApi = new ComicVineApi(scrapingConfig.sources[0].url);
    this.pageScraper = new PageScraper();
    this.trendAnalyzer = new TrendAnalyzer();
  }

  public async startAggregation(): Promise<void> {
    try {
      await this.updateContent();
      this.updateInterval = setInterval(
        () => this.updateContent(),
        scrapingConfig.interval
      );
      logInfo('Content aggregation started');
    } catch (error) {
      logError('Failed to start aggregation:', error);
    }
  }

  public stopAggregation(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      logInfo('Content aggregation stopped');
    }
  }

  private async updateContent(): Promise<void> {
    try {
      const apiData = await this.comicVineApi.fetchComics();
      const pageData = await Promise.all(
        scrapingConfig.sources
          .filter(source => source.type === 'page')
          .map(source => this.pageScraper.scrapePage(source.url))
      );

      const allData: ScrapedComic[] = [...apiData, ...pageData.flat()];
      this.latestContent = this.trendAnalyzer.analyzeTrends(allData);

      logInfo('Content updated successfully', {
        itemCount: this.latestContent.length,
        timestamp: new Date()
      });
    } catch (error) {
      logError('Content update failed:', error);
    }
  }

  public async getTrendingContent(): Promise<ComicTrend[]> {
    if (this.latestContent.length === 0) {
      await this.updateContent();
    }
    return this.latestContent;
  }
}