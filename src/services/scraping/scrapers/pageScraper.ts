import { load, CheerioAPI } from 'cheerio';
import axios from 'axios';
import { logError } from '../utils/logger';
import { checkRateLimit } from '../utils/rateLimiter';
import type { ScrapedComic } from '../types';
import { ErrorHandler } from '../../../utils/errors';

const errorHandler = ErrorHandler.getInstance();

export class PageScraper {
  public async scrapePage(url: string): Promise<ScrapedComic[]> {
    return errorHandler.withErrorHandling(async () => {
      if (!await checkRateLimit('page-scraper')) {
        return [];
      }

      const response = await axios.get(url);
      const $ = load(response.data);
      return this.extractComicData($);
    }, {
      url,
      method: 'GET',
      timestamp: new Date().toISOString()
    });
  }

  private extractComicData($: CheerioAPI): ScrapedComic[] {
    const comics: ScrapedComic[] = [];

    $('.comic-item, .comic-listing, .comic-entry').each((_, element) => {
      const $element = $(element);
      
      const comic: ScrapedComic = {
        id: $element.attr('data-id') || crypto.randomUUID(),
        title: $element.find('.title, .comic-title').text().trim(),
        publisher: $element.find('.publisher, .comic-publisher').text().trim(),
        price: this.extractPrice($element.find('.price, .comic-price').text()),
        lastUpdated: new Date()
      };

      if (comic.title && comic.publisher) {
        comics.push(comic);
      }
    });

    return comics;
  }

  private extractPrice(priceText: string): number {
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    return isNaN(price) ? 0 : price;
  }
}