import { ErrorLogger } from './ErrorLogger';
import type { ErrorLevel, ErrorLog } from './types';

export class ErrorMonitor {
  private static instance: ErrorMonitor;
  private logger: ErrorLogger;
  private errorCounts: Map<string, number>;
  private readonly ERROR_THRESHOLD = 5;
  private readonly MONITORING_INTERVAL = 60000; // 1 minute

  private constructor() {
    this.logger = ErrorLogger.getInstance();
    this.errorCounts = new Map();
    this.startMonitoring();
  }

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private startMonitoring(): void {
    setInterval(() => this.checkErrorThresholds(), this.MONITORING_INTERVAL);
  }

  public trackError(error: Error, context?: Record<string, unknown>): void {
    const errorKey = this.getErrorKey(error, context);
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);

    const errorLog: ErrorLog = {
      level: this.determineErrorLevel(count),
      message: error.message,
      code: error.name,
      stack: error.stack,
      context: {
        ...context,
        errorCount: count,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    this.logger.log(errorLog.level, error, errorLog.context);
  }

  private getErrorKey(error: Error, context?: Record<string, unknown>): string {
    return `${error.name}:${error.message}:${context?.context || ''}`;
  }

  private determineErrorLevel(count: number): ErrorLevel {
    if (count >= this.ERROR_THRESHOLD * 2) return 'fatal';
    if (count >= this.ERROR_THRESHOLD) return 'error';
    if (count >= this.ERROR_THRESHOLD / 2) return 'warning';
    return 'info';
  }

  private checkErrorThresholds(): void {
    for (const [key, count] of this.errorCounts.entries()) {
      if (count >= this.ERROR_THRESHOLD) {
        this.handleErrorThresholdExceeded(key, count);
      }
    }

    // Reset counts periodically
    this.errorCounts.clear();
  }

  private handleErrorThresholdExceeded(key: string, count: number): void {
    this.logger.error(`Error threshold exceeded for ${key}`, {
      errorKey: key,
      count,
      threshold: this.ERROR_THRESHOLD
    });

    // Implement additional alert mechanisms here
    // For example, sending notifications or triggering circuit breakers
  }

  public getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }
}