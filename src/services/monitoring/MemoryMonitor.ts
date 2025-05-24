import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import type { MemoryStats } from './types';

export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private readonly MEMORY_THRESHOLD = 0.8; // 80% threshold
  private readonly CHECK_INTERVAL = 60000; // Check every minute
  private monitorInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.startMonitoring();
  }

  public static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  private startMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }

    this.monitorInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, this.CHECK_INTERVAL);
  }

  private async checkMemoryUsage(): Promise<void> {
    try {
      const stats = this.getMemoryStats();
      await this.storeMemoryStats(stats);

      if (stats.usagePercentage > this.MEMORY_THRESHOLD) {
        await this.handleHighMemoryUsage(stats);
      }
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'MemoryMonitor',
        operation: 'checkMemoryUsage'
      });
    }
  }

  private getMemoryStats(): MemoryStats {
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed;
    const heapTotal = memoryUsage.heapTotal;
    const usagePercentage = heapUsed / heapTotal;

    return {
      timestamp: new Date(),
      heapUsed,
      heapTotal,
      usagePercentage,
      rss: memoryUsage.rss,
      external: memoryUsage.external
    };
  }

  private async storeMemoryStats(stats: MemoryStats): Promise<void> {
    await this.db.query(
      `INSERT INTO memory_stats (
        timestamp, heap_used, heap_total, usage_percentage, rss, external
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        stats.timestamp,
        stats.heapUsed,
        stats.heapTotal,
        stats.usagePercentage,
        stats.rss,
        stats.external
      ]
    );
  }

  private async handleHighMemoryUsage(stats: MemoryStats): Promise<void> {
    console.warn(`High memory usage detected: ${(stats.usagePercentage * 100).toFixed(2)}%`);

    // Clear caches
    global.gc?.();

    // Log memory pressure event
    await this.db.query(
      `INSERT INTO memory_alerts (
        timestamp, usage_percentage, heap_used, heap_total, action_taken
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        new Date(),
        stats.usagePercentage,
        stats.heapUsed,
        stats.heapTotal,
        'Cache cleared and garbage collection forced'
      ]
    );
  }

  public async getMemoryReport(timeRange?: { start: Date; end: Date }): Promise<MemoryStats[]> {
    let query = `SELECT * FROM memory_stats`;
    const params: any[] = [];

    if (timeRange) {
      query += ` WHERE timestamp BETWEEN $1 AND $2`;
      params.push(timeRange.start, timeRange.end);
    }

    query += ` ORDER BY timestamp DESC`;
    const result = await this.db.query(query, params);
    return result.rows;
  }

  public cleanup(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}