import { ErrorHandler } from '../../utils/errors';
import type { ServiceMetrics, ServiceStatus } from './types';

export class ServiceMetricsCollector {
  private static instance: ServiceMetricsCollector;
  private errorHandler: ErrorHandler;
  private metrics: Map<string, ServiceMetrics>;
  private readonly METRICS_RETENTION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.metrics = new Map();
  }

  public static getInstance(): ServiceMetricsCollector {
    if (!ServiceMetricsCollector.instance) {
      ServiceMetricsCollector.instance = new ServiceMetricsCollector();
    }
    return ServiceMetricsCollector.instance;
  }

  public recordMetric(
    service: string,
    responseTime: number,
    success: boolean
  ): void {
    const current = this.metrics.get(service) || {
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      lastUpdated: new Date()
    };

    const newMetrics = {
      requestCount: current.requestCount + 1,
      errorCount: success ? current.errorCount : current.errorCount + 1,
      averageResponseTime: this.calculateNewAverage(
        current.averageResponseTime,
        responseTime,
        current.requestCount
      ),
      lastUpdated: new Date()
    };

    this.metrics.set(service, newMetrics);
  }

  private calculateNewAverage(
    currentAvg: number,
    newValue: number,
    count: number
  ): number {
    return (currentAvg * count + newValue) / (count + 1);
  }

  public getServiceMetrics(service: string): ServiceMetrics | undefined {
    return this.metrics.get(service);
  }

  public getServiceHealth(service: string): ServiceStatus {
    const metrics = this.metrics.get(service);
    if (!metrics) {
      return {
        name: service,
        status: 'down',
        lastCheck: new Date(),
        error: 'No metrics available'
      };
    }

    const errorRate = metrics.errorCount / metrics.requestCount;
    const status = this.determineStatus(errorRate, metrics.averageResponseTime);

    return {
      name: service,
      status,
      lastCheck: metrics.lastUpdated
    };
  }

  private determineStatus(
    errorRate: number,
    responseTime: number
  ): ServiceStatus['status'] {
    if (errorRate >= 0.5 || responseTime > 5000) return 'down';
    if (errorRate >= 0.1 || responseTime > 2000) return 'degraded';
    return 'healthy';
  }

  public cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.METRICS_RETENTION;
    for (const [service, metrics] of this.metrics.entries()) {
      if (metrics.lastUpdated.getTime() < cutoff) {
        this.metrics.delete(service);
      }
    }
  }
}