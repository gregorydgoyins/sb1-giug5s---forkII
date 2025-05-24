import axios, { AxiosInstance, AxiosError } from 'axios';
import pRetry from 'p-retry';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { ErrorHandler } from '../../utils/errors';
import { NetworkError, ValidationError } from '../../utils/errors/ErrorTypes';
import type { ComicVineConfig, ComicVineResponse, ComicData, ApiError } from './types';
import { validateImageUrls, validateReviewScore } from './validators';

export class ComicVineClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private errorHandler: ErrorHandler;

  constructor(config: ComicVineConfig) {
    // Validate API key
    if (!config.apiKey) {
      throw new ValidationError('ComicVine API key is required');
    }

    this.client = axios.create({
      baseURL: config.baseUrl,
      params: {
        api_key: config.apiKey,
        format: 'json'
      },
      timeout: 10000, // 10 second timeout
      validateStatus: status => status < 500, // Only throw for server errors
      headers: {
        'User-Agent': 'Panel Profits/1.0 (Comic Analysis Platform)',
        'Accept': 'application/json'
      }
    });

    this.rateLimiter = RateLimiter.getInstance();
    this.errorHandler = ErrorHandler.getInstance();

    // Set up rate limiter
    this.rateLimiter.createLimiter('comicvine', 
      config.rateLimit.maxRequests,
      config.rateLimit.perMilliseconds
    );

    // Add request interceptor for debugging
    this.client.interceptors.request.use(request => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Request:', {
          url: request.url,
          method: request.method,
          params: request.params
        });
      }
      return request;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      this.handleRequestError.bind(this)
    );
  }

  private async handleRequestError(error: AxiosError): Promise<never> {
    const context = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    };

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      throw new NetworkError('Request timeout', context);
    }

    if (!navigator.onLine) {
      throw new NetworkError('No internet connection', context);
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new NetworkError('Invalid API key', context);
        case 403:
          throw new NetworkError('Access forbidden', context);
        case 404:
          throw new NetworkError('Resource not found', context);
        case 429:
          throw new NetworkError('Rate limit exceeded', context);
        default:
          throw new NetworkError(
            `API request failed: ${error.response.statusText}`,
            context
          );
      }
    }

    throw new NetworkError('Network error occurred', context);
  }

  public async fetchComicData(id: string): Promise<ComicData> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume('comicvine');

      // Check internet connection
      if (!navigator.onLine) {
        throw new NetworkError('No internet connection');
      }

      try {
        // Implement retry logic with exponential backoff
        const response = await pRetry(
          async () => {
            const response = await this.client.get<ComicVineResponse<ComicData>>(`/issue/${id}`);
            
            if (response.data.error !== 'OK') {
              throw new NetworkError(`API Error: ${response.data.error}`);
            }

            return response;
          },
          {
            retries: 3,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 5000,
            onFailedAttempt: error => {
              this.errorHandler.handleError(error, {
                context: 'ComicVineClient',
                operation: 'fetchComicData',
                attempt: error.attemptNumber,
                retriesLeft: error.retriesLeft
              });
            }
          }
        );

        const comic = response.data.results[0];

        // Validate response data
        if (!comic) {
          throw new ValidationError('Empty response from API');
        }

        // Validate image URLs
        if (!validateImageUrls(comic.image_alternates)) {
          throw new ValidationError('Invalid image URLs in response');
        }

        // Validate review score
        if (!validateReviewScore(comic.user_review_average)) {
          throw new ValidationError('Invalid review score');
        }

        return {
          ...comic,
          dateAdded: new Date(comic.dateAdded).toISOString(),
          dateLastUpdated: new Date(comic.dateLastUpdated).toISOString()
        };

      } catch (error) {
        const apiError: ApiError = {
          msg: error instanceof Error ? error.message : 'Unknown error occurred',
          error: error instanceof Error ? error.name : 'UnknownError',
          timestamp: new Date().toISOString()
        };

        // Log detailed error information in development
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error Details:', {
            error: apiError,
            stack: error instanceof Error ? error.stack : undefined,
            context: {
              comicId: id,
              timestamp: new Date().toISOString()
            }
          });
        }

        throw new NetworkError(apiError.msg, {
          error: apiError.error,
          timestamp: apiError.timestamp
        });
      }
    }, {
      context: 'ComicVineClient',
      operation: 'fetchComicData',
      comicId: id
    });
  }
}