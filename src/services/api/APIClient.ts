import axios, { AxiosInstance, AxiosError } from 'axios';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { APIConfigEntry, APIResponse, APIError } from './types';

export class APIClient {
  private client: AxiosInstance;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private config: APIConfigEntry;

  constructor(
    config: APIConfigEntry,
    apiKey: string,
    service: string
  ) {
    this.config = config;
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();

    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Set up rate limiter
    this.rateLimiter.createLimiter(service, 100, 60000); // 100 requests per minute

    // Add request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        await this.rateLimiter.consume(service);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      this.handleRequestError.bind(this)
    );
  }

  private async handleRequestError(error: AxiosError): Promise<never> {
    const apiError: APIError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      details: error.response?.data
    };

    this.errorHandler.handleError(error, {
      context: 'APIClient',
      error: apiError
    });

    throw error;
  }

  public async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.client.get(endpoint, { params });
      return {
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: error instanceof AxiosError ? error.response?.status || 500 : 500,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async post<T>(
    endpoint: string,
    data: unknown,
    params?: Record<string, unknown>
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.client.post(endpoint, data, { params });
      return {
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: error instanceof AxiosError ? error.response?.status || 500 : 500,
        timestamp: new Date().toISOString()
      };
    }
  }

  public getEndpoint(name: string): string {
    const endpoint = this.config.endpoints[name];
    if (!endpoint) {
      throw new Error(`Unknown endpoint: ${name}`);
    }
    return endpoint;
  }
}