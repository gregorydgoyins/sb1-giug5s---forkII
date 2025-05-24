import { MyComicShopScraper } from './scrapers/MyComicShopScraper';
import { ErrorHandler } from '../../utils/errors';
import type { ScrapingJob, ScrapingResult } from './types';

export class ScrapingManager {
  private static instance: ScrapingManager;
  private scraper: MyComicShopScraper;
  private errorHandler: ErrorHandler;
  private jobs: Map<string, ScrapingJob>;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    this.scraper = new MyComicShopScraper();
    this.errorHandler = ErrorHandler.getInstance();
    this.jobs = new Map();
  }

  public static getInstance(): ScrapingManager {
    if (!ScrapingManager.instance) {
      ScrapingManager.instance = new ScrapingManager();
    }
    return ScrapingManager.instance;
  }

  public async queueScraping(url: string): Promise<string> {
    const jobId = crypto.randomUUID();
    
    this.jobs.set(jobId, {
      id: jobId,
      url,
      status: 'pending',
      attempts: 0
    });

    // Start processing asynchronously
    this.processJob(jobId);

    return jobId;
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.attempts++;
    job.lastAttempt = new Date().toISOString();

    try {
      const data = await this.scraper.scrapeComic(job.url);
      
      const result: ScrapingResult = {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };

      job.status = 'completed';
      job.result = result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (job.attempts < this.MAX_RETRIES) {
        // Retry after delay
        setTimeout(() => this.processJob(jobId), 5000 * job.attempts);
      } else {
        job.status = 'failed';
        job.error = errorMessage;
        job.result = {
          success: false,
          error: errorMessage,
          timestamp: new Date().toISOString()
        };
      }
    }

    this.jobs.set(jobId, job);
  }

  public getJobStatus(jobId: string): ScrapingJob | undefined {
    return this.jobs.get(jobId);
  }

  public async waitForCompletion(jobId: string): Promise<ScrapingResult> {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        const job = this.jobs.get(jobId);
        
        if (!job) {
          reject(new Error('Job not found'));
          return;
        }

        if (job.status === 'completed' && job.result) {
          resolve(job.result);
          return;
        }

        if (job.status === 'failed') {
          reject(new Error(job.error || 'Scraping failed'));
          return;
        }

        setTimeout(checkStatus, 1000);
      };

      checkStatus();
    });
  }
}