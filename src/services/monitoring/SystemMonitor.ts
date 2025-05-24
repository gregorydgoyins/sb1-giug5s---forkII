import { PerformanceMonitor } from './PerformanceMonitor';
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { RateLimiter } from '../../utils/security/RateLimiter';
import type { PerformanceMetrics, Alert } from './types';

export class SystemMonitor {
  private static instance: SystemMonitor;
  private performanceMonitor: PerformanceMonitor;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private rateLimiter: RateLimiter;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private readonly MONITORING_INTERVAL = 60000; // 1 minute
  private readonly ALERT_THRESHOLDS = {
    responseTime: 1000, // 1 second
    errorRate: 0.05,    // 5%
    cpuUsage: 80,       // 80%
    memoryUsage: 85,    // 85%
    apiLatency: 2000    // 2 seconds
  };

  private constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.startMonitoring();
  }

  public static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        const metrics = await this.performanceMonitor.getMetrics();
        await this.analyzeMetrics(metrics);
        await this.storeMetrics(metrics);
      } catch (error) {
        this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
          context: 'SystemMonitor',
          operation: 'monitoring'
        });
      }
    }, this.MONITORING_INTERVAL);
  }

  private async analyzeMetrics(metrics: PerformanceMetrics[]): Promise<void> {
    const latestMetrics = metrics[0];
    if (!latestMetrics) return;

    const alerts: Alert[] = [];

    // Check response time
    if (latestMetrics.responseTime > this.ALERT_THRESHOLDS.responseTime) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'response_time',
        severity: 'high',
        message: `High response time detected: ${latestMetrics.responseTime}ms`,
        metrics: latestMetrics,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Check error rate
    if (latestMetrics.errorRate > this.ALERT_THRESHOLDS.errorRate) {
      alerts.push({
        id: crypto.randomUUID(),
        type: 'error_rate',
        severity: 'critical',
        message: `High error rate detected: ${(latestMetrics.errorRate * 100).toFixed(2)}%`,
        metrics: latestMetrics,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Store alerts
    await this.storeAlerts(alerts);
  }

  private async storeMetrics(metrics: PerformanceMetrics[]): Promise<void> {
    await this.db.transaction(async (trx) => {
      for (const metric of metrics) {
        await trx.query(
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
            metric.timestamp,
            metric.responseTime,
            JSON.stringify(metric.resourceUsage.cpu),
            JSON.stringify(metric.resourceUsage.memory),
            JSON.stringify(metric.resourceUsage.disk),
            metric.errorRate,
            metric.activeUsers,
            metric.requestsPerMinute
          ]
        );
      }
    });
  }

  private async storeAlerts(alerts: Alert[]): Promise<void> {
    await this.db.transaction(async (trx) => {
      for (const alert of alerts) {
        await trx.query(
          `INSERT INTO alerts (
            id,
            type,
            severity,
            message,
            timestamp,
            acknowledged
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            alert.id,
            alert.type,
            alert.severity,
            alert.message,
            alert.timestamp,
            alert.acknowledged
          ]
        );
      }
    });
  }

  public async generateReport(timeRange: { start: Date; end: Date }): Promise<void> {
    const metrics = await this.performanceMonitor.getMetrics(timeRange);
    const alerts = await this.getAlerts(timeRange);
    const recommendations = this.generateRecommendations(metrics, alerts);

    await this.db.query(
      `INSERT INTO reports (
        id,
        time_range_start,
        time_range_end,
        metrics,
        alerts,
        recommendations,
        generated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        crypto.randomUUID(),
        timeRange.start,
        timeRange.end,
        JSON.stringify(metrics),
        JSON.stringify(alerts),
        JSON.stringify(recommendations),
        new Date()
      ]
    );
  }

  private async getAlerts(timeRange: { start: Date; end: Date }): Promise<Alert[]> {
    const result = await this.db.query(
      `SELECT * FROM alerts 
       WHERE timestamp BETWEEN $1 AND $2 
       ORDER BY timestamp DESC`,
      [timeRange.start, timeRange.end]
    );
    return result.rows;
  }

  private generateRecommendations(metrics: PerformanceMetrics[], alerts: Alert[]): string[] {
    const recommendations: string[] = [];

    // Analyze response times
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
    if (avgResponseTime > this.ALERT_THRESHOLDS.responseTime) {
      recommendations.push('Consider implementing caching to improve response times');
    }

    // Analyze error rates
    const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
    if (avgErrorRate > this.ALERT_THRESHOLDS.errorRate) {
      recommendations.push('Review error logs and implement better error handling');
    }

    // Resource usage recommendations
    const highCpuUsage = metrics.some(m => 
      (m.resourceUsage.cpu.user + m.resourceUsage.cpu.system) > this.ALERT_THRESHOLDS.cpuUsage
    );
    if (highCpuUsage) {
      recommendations.push('Optimize CPU-intensive operations and consider scaling resources');
    }

    return recommendations;
  }

  public async cleanup(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}