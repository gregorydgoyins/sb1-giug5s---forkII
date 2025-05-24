import { load } from 'cheerio';
import axios, { AxiosError } from 'axios';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { z } from 'zod';
import { ErrorHandler } from '../../utils/errors';
import { logInfo, logError } from '../../utils/errors';
import type { ScraperConfig, ScrapedData, ScrapeResult, Selector } from './types';

const urlSchema = z.string().url();

export class WebScraper {
  private config: ScraperConfig;
  private queue: PQueue;
  private errorHandler: ErrorHandler;

  constructor(config: Partial<ScraperConfig> = {}) {
    this.config = {
      timeout: 10000,
      retries: 3,
      concurrency: 2,
      userAgent: 'Panel Profits/1.0 (Comic Market Analysis Platform)',
      ...config
    };

    this.queue = new PQueue({ concurrency: this.config.concurrency });
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async scrape(url: string, selectors: Selector[]): Promise<ScrapeResult> {
    try {
      // Validate URL
      const validationResult = urlSchema.safeParse(url);
      if (!validationResult.success) {
        throw new Error('Invalid URL format');
      }

      // Queue the scraping task
      const result = await this.queue.add(() => 
        pRetry(
          () => this.performScrape(url, selectors),
          {
            retries: this.config.retries,
            onFailedAttempt: error => {
              logError(`Scraping attempt failed for ${url}`, error);
            }
          }
        )
      );

      return {
        success: true,
        data: result
      };

    } catch (error) {
      return this.handleError(url, error);
    }
  }

  private async performScrape(url: string, selectors: Selector[]): Promise<ScrapedData> {
    const response = await axios.get(url, {
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent
      }
    });

    const $ = load(response.data);
    const data: Record<string, unknown> = {};

    selectors.forEach(selector => {
      if (selector.multiple) {
        data[selector.name] = this.extractMultiple($, selector);
      } else {
        data[selector.name] = this.extractSingle($, selector);
      }
    });

    logInfo(`Successfully scraped ${url}`, {
      selectors: selectors.length,
      dataPoints: Object.keys(data).length
    });

    return {
      url,
      title: $('title').text().trim(),
      content: JSON.stringify(data),
      metadata: {
        lastModified: response.headers['last-modified'],
        contentType: response.headers['content-type'],
        length: response.data.length
      },
      timestamp: new Date().toISOString()
    };
  }

  private extractSingle($: cheerio.CheerioAPI, selector: Selector): string | null {
    const element = $(selector.query);
    
    if (!element.length) return null;

    switch (selector.type) {
      case 'text':
        return element.text().trim();
      case 'html':
        return element.html()?.trim() || null;
      case 'attr':
        return element.attr(selector.attribute || '') || null;
      default:
        return null;
    }
  }

  private extractMultiple($: cheerio.CheerioAPI, selector: Selector): string[] {
    const elements = $(selector.query);
    const results: string[] = [];

    elements.each((_, element) => {
      const $element = $(element);
      let value: string | null = null;

      switch (selector.type) {
        case 'text':
          value = $element.text().trim();
          break;
        case 'html':
          value = $element.html()?.trim() || null;
          break;
        case 'attr':
          value = $element.attr(selector.attribute || '') || null;
          break;
      }

      if (value) results.push(value);
    });

    return results;
  }

  private handleError(url: string, error: unknown): ScrapeResult {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = error instanceof AxiosError ? error.code || 'UNKNOWN_ERROR' : 'SCRAPER_ERROR';

    this.errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
      context: 'WebScraper',
      url,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error: {
        url,
        error: errorMessage,
        code: errorCode,
        timestamp: new Date().toISOString()
      }
    };
  }

  public clearQueue(): void {
    this.queue.clear();
  }

  public async waitForAll(): Promise<void> {
    await this.queue.onIdle();
  }
}