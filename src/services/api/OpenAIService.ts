import { API_KEYS } from '../../utils/env';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { APIResponse } from './types';

export class OpenAIService {
  private static instance: OpenAIService;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.rateLimiter.createLimiter('openai', 60, 60000); // 60 requests per minute
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async generateCompletion(prompt: string): Promise<APIResponse<string>> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.rateLimiter.consume('openai');

      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.OPENAI}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data: data.choices[0].message.content,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    }, {
      context: 'OpenAIService',
      operation: 'generateCompletion'
    });
  }

  public async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}