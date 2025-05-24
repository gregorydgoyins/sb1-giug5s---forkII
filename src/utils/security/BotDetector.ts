import { RateLimiter } from './RateLimiter';
import { ErrorHandler } from '../errors/ErrorHandler';

export class BotDetector {
  private static instance: BotDetector;
  private rateLimiter: RateLimiter;
  private errorHandler: ErrorHandler;
  private suspiciousPatterns: Map<string, number>;

  private readonly PATTERN_THRESHOLD = 5;
  private readonly DETECTION_WINDOW = 60 * 1000; // 1 minute

  private constructor() {
    this.rateLimiter = RateLimiter.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.suspiciousPatterns = new Map();
    this.setupCleanup();
  }

  public static getInstance(): BotDetector {
    if (!BotDetector.instance) {
      BotDetector.instance = new BotDetector();
    }
    return BotDetector.instance;
  }

  private setupCleanup(): void {
    setInterval(() => {
      this.suspiciousPatterns.clear();
    }, this.DETECTION_WINDOW);
  }

  public async analyzeRequest(
    ip: string,
    userAgent: string,
    requestPattern: string
  ): Promise<boolean> {
    try {
      // Check rate limits
      const isRateLimited = await this.checkRateLimit(ip);
      if (isRateLimited) {
        return false;
      }

      // Check user agent
      if (!this.validateUserAgent(userAgent)) {
        this.recordSuspiciousPattern(ip);
        return false;
      }

      // Check request pattern
      if (this.isPatternSuspicious(requestPattern)) {
        this.recordSuspiciousPattern(ip);
        return false;
      }

      // Check behavioral patterns
      if (await this.checkBehavioralPatterns(ip)) {
        this.recordSuspiciousPattern(ip);
        return false;
      }

      return true;
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'BotDetector',
        ip,
        userAgent,
        requestPattern
      });
      return false;
    }
  }

  private async checkRateLimit(ip: string): Promise<boolean> {
    try {
      await this.rateLimiter.consume('bot-detection', 1, ip);
      return false;
    } catch {
      return true;
    }
  }

  private validateUserAgent(userAgent: string): boolean {
    if (!userAgent) return false;
    
    // Check for common bot signatures
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /headless/i,
      /scraper/i,
      /python/i,
      /curl/i,
      /wget/i
    ];

    return !botPatterns.some(pattern => pattern.test(userAgent));
  }

  private isPatternSuspicious(pattern: string): boolean {
    // Check for suspicious request patterns
    const suspiciousPatterns = [
      /rapid-fire/i,
      /sequential/i,
      /automated/i
    ];

    return suspiciousPatterns.some(p => p.test(pattern));
  }

  private async checkBehavioralPatterns(ip: string): Promise<boolean> {
    // Check for suspicious behavioral patterns
    const patternCount = this.suspiciousPatterns.get(ip) || 0;
    return patternCount >= this.PATTERN_THRESHOLD;
  }

  private recordSuspiciousPattern(ip: string): void {
    const count = (this.suspiciousPatterns.get(ip) || 0) + 1;
    this.suspiciousPatterns.set(ip, count);

    if (count >= this.PATTERN_THRESHOLD) {
      this.errorHandler.handleError(new Error('Bot activity detected'), {
        context: 'BotDetector',
        ip,
        patternCount: count
      });
    }
  }

  public isSuspicious(ip: string): boolean {
    return (this.suspiciousPatterns.get(ip) || 0) >= this.PATTERN_THRESHOLD;
  }

  public clearSuspiciousPatterns(): void {
    this.suspiciousPatterns.clear();
  }
}