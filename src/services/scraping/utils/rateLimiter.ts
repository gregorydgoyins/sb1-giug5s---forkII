import { RateLimiterMemory } from 'rate-limiter-flexible';
import { scrapingConfig } from '../config';

export const rateLimiter = new RateLimiterMemory({
  points: scrapingConfig.rateLimit.points,
  duration: scrapingConfig.rateLimit.duration
});

export const checkRateLimit = async (key: string): Promise<boolean> => {
  try {
    await rateLimiter.consume(key, 1);
    return true;
  } catch {
    return false;
  }
};