import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { CreatorBiography } from '../biography/types';

export class IsbndbClient {
  private static instance: IsbndbClient;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private readonly API_KEY = '57315_ed95014cfba5df379b56a019ba3c752c';
  private readonly BASE_URL = 'https://api2.isbndb.com';

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.rateLimiter.createLimiter('isbndb', 2, 1000); // 2 requests per second
  }

  public static getInstance(): IsbndbClient {
    if (!IsbndbClient.instance) {
      IsbndbClient.instance = new IsbndbClient();
    }
    return IsbndbClient.instance;
  }

  public async getCreatorBiography(name: string): Promise<CreatorBiography | null> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.rateLimiter.consume('isbndb');

      const response = await fetch(`${this.BASE_URL}/authors/${encodeURIComponent(name)}`, {
        headers: {
          'Authorization': this.API_KEY
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        name: data.name,
        biography: data.bio || '',
        birthDate: data.born,
        deathDate: data.died,
        nationality: data.nationality,
        notableWorks: data.books || [],
        awards: data.awards || [],
        links: data.links || [],
        lastUpdated: new Date()
      };
    }, {
      context: 'IsbndbClient',
      operation: 'getCreatorBiography',
      creatorName: name
    });
  }

  public async searchBooks(query: string): Promise<any[]> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.rateLimiter.consume('isbndb');

      const response = await fetch(`${this.BASE_URL}/books/${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': this.API_KEY
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.books || [];
    }, {
      context: 'IsbndbClient',
      operation: 'searchBooks',
      query
    });
  }
}