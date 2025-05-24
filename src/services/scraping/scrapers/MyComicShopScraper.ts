import { load } from 'cheerio';
import axios from 'axios';
import { ErrorHandler } from '../../../utils/errors';
import { RateLimiter } from '../../../utils/security/RateLimiter';
import { BotDetector } from '../../../utils/security/BotDetector';
import type { ComicListing } from '../types';

export class MyComicShopScraper {
  private readonly BASE_URL = 'https://www.mycomicshop.com';
  private readonly REQUEST_DELAY = 2000; // 2 seconds between requests
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private botDetector: BotDetector;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.botDetector = BotDetector.getInstance();

    // Initialize rate limiter
    this.rateLimiter.createLimiter('mycomicshop', 30, 60); // 30 requests per minute
  }

  public async scrapeComic(url: string): Promise<ComicListing> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume('mycomicshop');

      // Validate URL
      if (!url.startsWith(this.BASE_URL)) {
        throw new Error('Invalid URL domain');
      }

      // Fetch page content
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Panel Profits/1.0 (Comic Market Analysis Platform)',
          'Accept': 'text/html'
        },
        timeout: 10000
      });

      const $ = load(response.data);
      
      return {
        title_full: this.extractTitle($),
        issue_number: this.extractIssueNumber($),
        current_price: this.extractCurrentPrice($),
        grade_prices: this.extractGradePrices($),
        creator_credits: this.extractCreatorCredits($),
        description: this.extractDescription($),
        publication_info: this.extractPublicationInfo($),
        last_updated: new Date().toISOString()
      };
    }, {
      context: 'MyComicShopScraper',
      url,
      timestamp: new Date().toISOString()
    });
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    return $('.comic-title').text().trim();
  }

  private extractIssueNumber($: cheerio.CheerioAPI): number {
    const issueText = $('.issue-number').text();
    const match = issueText.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private extractCurrentPrice($: cheerio.CheerioAPI): number {
    const priceText = $('.current-price').text();
    return this.parsePrice(priceText);
  }

  private extractGradePrices($: cheerio.CheerioAPI): Record<string, number> {
    const prices: Record<string, number> = {};
    
    $('.grade-prices tr').each((_, row) => {
      const $row = $(row);
      const grade = $row.find('.grade').text().trim();
      const price = this.parsePrice($row.find('.price').text());
      
      if (grade && !isNaN(price)) {
        prices[grade] = price;
      }
    });

    return prices;
  }

  private extractCreatorCredits($: cheerio.CheerioAPI): Array<{role: string; name: string}> {
    const credits: Array<{role: string; name: string}> = [];
    
    $('.creator-credits li').each((_, element) => {
      const $element = $(element);
      const role = $element.find('.role').text().trim();
      const name = $element.find('.name').text().trim();
      
      if (role && name) {
        credits.push({ role, name });
      }
    });

    return credits;
  }

  private extractDescription($: cheerio.CheerioAPI): string {
    return $('.comic-description').text().trim();
  }

  private extractPublicationInfo($: cheerio.CheerioAPI): {
    publisher: string;
    date: string;
    print_run?: number;
  } {
    return {
      publisher: $('.publisher').text().trim(),
      date: $('.publication-date').text().trim(),
      print_run: this.extractPrintRun($)
    };
  }

  private extractPrintRun($: cheerio.CheerioAPI): number | undefined {
    const printRunText = $('.print-run').text();
    const match = printRunText.match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
  }

  private parsePrice(priceText: string): number {
    const match = priceText.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }
}