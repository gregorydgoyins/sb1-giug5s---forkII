'use client';

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { RateLimitError } from '../errors/ErrorTypes';
import { ErrorHandler } from '../errors/ErrorHandler';

export class RateLimiter {
  private static instance: RateLimiter;
  private limiters: Map<string, RateLimiterMemory>;
  private errorHandler: ErrorHandler;

  private readonly DEFAULT_POINTS = 100;
  private readonly DEFAULT_DURATION = 60; // 1 minute

  private constructor() {
    this.limiters = new Map();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public createLimiter(
    name: string,
    points: number = this.DEFAULT_POINTS,
    duration: number = this.DEFAULT_DURATION
  ): void {
    if (!this.limiters.has(name)) {
      this.limiters.set(name, new RateLimiterMemory({
        points,
        duration: duration / 1000 // Convert ms to seconds
      }));
    }
  }

  public async consume(
    name: string,
    points: number = 1,
    key: string = 'default'
  ): Promise<void> {
    try {
      const limiter = this.limiters.get(name);
      if (!limiter) {
        this.createLimiter(name);
      }

      await this.limiters.get(name)!.consume(key, points);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        const rateLimitError = new RateLimitError('Rate limit exceeded', {
          limiter: name,
          key,
          points
        });
        this.errorHandler.handleError(rateLimitError);
        throw rateLimitError;
      }
      throw error;
    }
  }

  public async get(name: string, key: string = 'default'): Promise<{
    remainingPoints: number;
    msBeforeNext: number;
  }> {
    const limiter = this.limiters.get(name);
    if (!limiter) {
      this.createLimiter(name);
    }

    const res = await this.limiters.get(name)!.get(key);
    return {
      remainingPoints: res.remainingPoints,
      msBeforeNext: res.msBeforeNext
    };
  }

  public async reset(name: string, key: string = 'default'): Promise<void> {
    const limiter = this.limiters.get(name);
    if (limiter) {
      await limiter.delete(key);
    }
  }
}