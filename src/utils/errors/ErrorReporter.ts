import { ErrorLogger } from './ErrorLogger';
import type { ErrorReport, ErrorStats } from './types';

export class ErrorReporter {
  private static instance: ErrorReporter;
  private logger: ErrorLogger;
  private errors: Error[];
  private readonly MAX_ERRORS = 1000;

  private constructor() {
    this.logger = ErrorLogger.getInstance();
    this.errors = [];
  }

  public static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  public addError(error: Error, context?: Record<string, unknown>): void {
    this.errors.push(error);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }

    this.logger.error(error, context);
  }

  public generateReport(): ErrorReport {
    const stats = this.calculateErrorStats();
    const topErrors = this.getTopErrors();
    const recentErrors = this.getRecentErrors();

    return {
      timestamp: new Date(),
      totalErrors: this.errors.length,
      stats,
      topErrors,
      recentErrors,
      recommendations: this.generateRecommendations(stats)
    };
  }

  private calculateErrorStats(): ErrorStats {
    const stats: ErrorStats = {
      byType: {},
      byTime: {
        lastHour: 0,
        lastDay: 0,
        lastWeek: 0
      },
      severity: {
        info: 0,
        warning: 0,
        error: 0,
        fatal: 0
      }
    };

    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    const week = 7 * day;

    this.errors.forEach(error => {
      // Count by type
      stats.byType[error.name] = (stats.byType[error.name] || 0) + 1;

      // Count by time
      const timestamp = error.timestamp?.getTime() || now;
      if (now - timestamp <= hour) stats.byTime.lastHour++;
      if (now - timestamp <= day) stats.byTime.lastDay++;
      if (now - timestamp <= week) stats.byTime.lastWeek++;

      // Count by severity
      const level = error.level || 'error';
      stats.severity[level]++;
    });

    return stats;
  }

  private getTopErrors(): Array<{ name: string; count: number; example: string }> {
    const errorCounts = new Map<string, { count: number; example: string }>();

    this.errors.forEach(error => {
      const current = errorCounts.get(error.name) || { count: 0, example: error.message };
      errorCounts.set(error.name, {
        count: current.count + 1,
        example: current.example
      });
    });

    return Array.from(errorCounts.entries())
      .map(([name, { count, example }]) => ({ name, count, example }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getRecentErrors(): Error[] {
    return this.errors
      .slice(-10)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  private generateRecommendations(stats: ErrorStats): string[] {
    const recommendations: string[] = [];

    // Check error frequency
    if (stats.byTime.lastHour > 100) {
      recommendations.push('High error rate detected in the last hour - investigate potential system issues');
    }

    // Check error severity
    if (stats.severity.fatal > 0) {
      recommendations.push('Critical errors detected - immediate attention required');
    }

    // Check error patterns
    Object.entries(stats.byType).forEach(([type, count]) => {
      if (count > 50) {
        recommendations.push(`High frequency of ${type} errors - review error handling for this type`);
      }
    });

    return recommendations;
  }

  public clearErrors(): void {
    this.errors = [];
  }
}