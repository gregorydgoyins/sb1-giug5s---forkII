import { ErrorHandler, ErrorMonitor } from '../../utils/errors';
import { ServiceRegistry } from './ServiceRegistry';
import type { ServiceStatus, ServiceMetrics } from './types';

export class ServiceMonitor {
  private static instance: ServiceMonitor;
  private errorHandler: ErrorHandler;
  private errorMonitor: ErrorMonitor;
  private registry: ServiceRegistry;
  private metrics: Map<string, ServiceMetrics>;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.errorMonitor = ErrorMonitor.getInstance();
    this.registry = ServiceRegistry.getInstance();
    this.metrics = new Map();
    this.startMonitoring();
  }

  public static getInstance(): ServiceMonitor {
    if (!ServiceMonitor.instance) {
      ServiceMonitor.instance = new ServiceMonitor();
    }
    return ServiceMonitor.instance;
  }

  private startMonitoring(): void {
    setInterval(() => this.checkServices(), this.CHECK_INTERVAL);
  }

  private async checkServices(): Promise<void> {
    try {
      const health = await this.registry.checkHealth();
      this.updateMetrics(health.services);
    } catch (error) {
      this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
        context: 'ServiceMonitor',
        operation: 'checkServices'
      });
    }
  }

  private updateMetrics(serviceStatus: Record<string, boolean>): void {
    for (const [service, healthy] of Object.entries(serviceStatus)) {
      const current = this.metrics.get(service) || {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 0,
        lastUpdated: new Date()
      };

      this.metrics.set(service, {
        ...current,
        errorCount: healthy ? current.errorCount : current.errorCount + 1,
        lastUpdated: new Date()
      });
    }
  }

  public getServiceStatus(service: string): ServiceStatus {
    const metrics = this.metrics.get(service);
    if (!metrics) {
      return {
        name: service,
        status: 'down',
        lastCheck: new Date(),
        error: 'Service not found'
      };
    }

    const errorRate = metrics.errorCount / Math.max(1, metrics.requestCount);
    let status: ServiceStatus['status'];

    if (errorRate >= 0.5) {
      status = 'down';
    } else if (errorRate >= 0.1) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      name: service,
      status,
      lastCheck: metrics.lastUpdated
    };
  }

  public getAllServiceStatus(): ServiceStatus[] {
    return Array.from(this.metrics.keys()).map(service => 
      this.getServiceStatus(service)
    );
  }

  public getServiceMetrics(service: string): ServiceMetrics | undefined {
    return this.metrics.get(service);
  }
}