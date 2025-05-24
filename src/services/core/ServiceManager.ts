import { ServiceConfig, ServiceConfigType, DEFAULT_CONFIG } from './config';
import { ErrorHandler } from '../../utils/errors';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { BotDetector } from '../../utils/security/BotDetector';

export class ServiceManager {
  private static instance: ServiceManager;
  private config: ServiceConfigType;
  private errorHandler: ErrorHandler;
  private rateLimiter: RateLimiter;
  private botDetector: BotDetector;
  private services: Map<string, any>;
  private healthChecks: Map<string, () => Promise<boolean>>;

  private constructor(config?: Partial<ServiceConfigType>) {
    this.config = ServiceConfig.parse({ ...DEFAULT_CONFIG, ...config });
    this.errorHandler = ErrorHandler.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.botDetector = BotDetector.getInstance();
    this.services = new Map();
    this.healthChecks = new Map();
  }

  public static getInstance(config?: Partial<ServiceConfigType>): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager(config);
    }
    return ServiceManager.instance;
  }

  public registerService(
    name: string, 
    service: any, 
    healthCheck?: () => Promise<boolean>
  ): void {
    this.services.set(name, service);
    if (healthCheck) {
      this.healthChecks.set(name, healthCheck);
    }
  }

  public getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }
    return service as T;
  }

  public async checkHealth(): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
  }> {
    const results: Record<string, boolean> = {};
    
    for (const [name, check] of this.healthChecks) {
      try {
        results[name] = await check();
      } catch (error) {
        this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
          context: 'ServiceManager',
          operation: 'healthCheck',
          service: name
        });
        results[name] = false;
      }
    }

    return {
      healthy: Object.values(results).every(Boolean),
      services: results
    };
  }

  public async backup(): Promise<void> {
    if (!this.config.backup.enabled) return;

    // Implement backup logic for each service
    for (const [name, service] of this.services) {
      if (typeof service.backup === 'function') {
        try {
          await service.backup();
        } catch (error) {
          this.errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
            context: 'ServiceManager',
            operation: 'backup',
            service: name
          });
        }
      }
    }
  }

  public getConfig(): ServiceConfigType {
    return this.config;
  }

  public updateConfig(config: Partial<ServiceConfigType>): void {
    this.config = ServiceConfig.parse({ ...this.config, ...config });
  }
}