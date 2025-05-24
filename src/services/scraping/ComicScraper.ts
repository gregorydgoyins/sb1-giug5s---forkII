import { WebScraper } from './WebScraper';
import { SELECTORS } from './config';
import { ErrorHandler } from '../../utils/errors';
import type { ComicData, ScrapeResult } from './types';

export class ComicScraper {
  private scraper: WebScraper;
  private errorHandler: ErrorHandler;

  constructor() {
    this.scraper = new WebScraper();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async scrapeComicDetails(url: string): Promise<ScrapeResult> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.scraper.scrape(url, SELECTORS.comicDetails);
      
      if (!result.success || !result.data) {
        return result;
      }

      // Transform raw data into structured comic data
      const comicData: ComicData = {
        title: result.data.content.title || '',
        price: this.parsePrice(result.data.content.price),
        description: result.data.content.description || '',
        creators: Array.isArray(result.data.content.creators) 
          ? result.data.content.creators 
          : [],
        images: Array.isArray(result.data.content.images) 
          ? result.data.content.images 
          : [],
        lastUpdated: new Date().toISOString(),
        source: url
      };

      return {
        success: true,
        data: {
          ...result.data,
          content: JSON.stringify(comicData)
        }
      };
    }, {
      context: 'ComicScraper',
      operation: 'scrapeComicDetails',
      url
    });
  }

  private parsePrice(priceString: string | null): number {
    if (!priceString) return 0;
    const match = priceString.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }

  public async waitForCompletion(): Promise<void> {
    await this.scraper.waitForAll();
  }

  public cleanup(): void {
    this.scraper.clearQueue();
  }
}