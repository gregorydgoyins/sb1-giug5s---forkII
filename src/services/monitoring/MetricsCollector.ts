import { DatabaseService } from '../database/DatabaseService';
import { ErrorHandler } from '../../utils/errors';
import type { PerformanceMetrics } from './types';

export class MetricsCollector {
  private db: DatabaseService;
  private errorHandler: ErrorHandler;

  constructor() {
    this.db = DatabaseService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async store(metrics: PerformanceMetrics): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      await this.db.query(
        `INSERT INTO performance_metrics (
          timestamp,
          response_time,
          cpu_usage,
          memory_usage,
          disk_usage,
          error_rate,
          active_users,
          requests_per_minute
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          metrics.timestamp,
          metrics.responseTime,
          JSON.stringify(metrics.resourceUsage.cpu),
          JSON.stringify(metrics.resourceUsage.memory),
          JSON.stringify(metrics.resourceUsage.disk),
          metrics.errorRate,
          metrics.activeUsers,
          metrics.requestsPerMinute
        ]
      );
    }, {
      context: 'MetricsCollector',
      operation: 'store'
    });
  }

  public async retrieve(timeRange?: { start: Date; end: Date }): Promise<PerformanceMetrics[]> {
    return this.errorHandler.withErrorHandling(async () => {
      let query = `SELECT * FROM performance_metrics`;
      const params: any[] = [];

      if (timeRange) {
        query += ` WHERE timestamp BETWEEN $1 AND $2`;
        params.push(timeRange.start, timeRange.end);
      }

      query += ` ORDER BY timestamp DESC`;

      const result = await this.db.query(query, params);
      return result.rows.map(row => ({
        timestamp: row.timestamp,
        responseTime: row.response_time,
        resourceUsage: {
          cpu: JSON.parse(row.cpu_usage),
          memory: JSON.parse(row.memory_usage),
          disk: JSON.parse(row.disk_usage)
        },
        errorRate: row.error_rate,
        activeUsers: row.active_users,
        requestsPerMinute: row.requests_per_minute
      }));
    }, {
      context: 'MetricsCollector',
      operation: 'retrieve'
    });
  }
}