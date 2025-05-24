import { QueryClient } from '@tanstack/react-query';
import type { SystemStatus, MaintenanceTask, ErrorLog } from '../types';

export class MaintenanceBot {
  private queryClient: QueryClient;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds
  private readonly ERROR_THRESHOLD = 5;
  private readonly CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes
  
  private errorCount: Map<string, number> = new Map();
  private maintenanceTasks: MaintenanceTask[] = [];
  private systemStatus: SystemStatus = {
    isHealthy: true,
    lastCheck: new Date(),
    activeIssues: [],
    performanceMetrics: {
      responseTime: 0,
      errorRate: 0,
      cacheHitRate: 0,
      queryLatency: 0
    }
  };

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.startMonitoring();
  }

  private startMonitoring(): void {
    setInterval(() => this.performHealthCheck(), this.CHECK_INTERVAL);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Check system components
      const [
        queryClientStatus,
        cacheStatus,
        routerStatus,
        storeStatus
      ] = await Promise.all([
        this.checkQueryClient(),
        this.checkCache(),
        this.checkRouter(),
        this.checkStore()
      ]);

      // Update system status
      this.updateSystemStatus({
        queryClient: queryClientStatus,
        cache: cacheStatus,
        router: routerStatus,
        store: storeStatus
      });

      // Perform maintenance if needed
      if (this.needsMaintenance()) {
        await this.performMaintenance();
      }

    } catch (error) {
      this.handleMaintenanceError(error);
    }
  }

  private async checkQueryClient(): Promise<boolean> {
    try {
      // Check if QueryClient is functioning
      const isMounted = this.queryClient.isMutating();
      const hasQueries = this.queryClient.getQueryCache().getAll().length > 0;
      
      // Reset query cache if issues detected
      if (!hasQueries) {
        this.queryClient.resetQueries();
      }

      return isMounted && hasQueries;
    } catch (error) {
      this.logError('queryClient', error);
      return false;
    }
  }

  private async checkCache(): Promise<boolean> {
    try {
      // Check cache health
      const queries = this.queryClient.getQueryCache().getAll();
      const staleQueries = queries.filter(q => q.isStale());
      
      // Clear stale queries
      if (staleQueries.length > 0) {
        staleQueries.forEach(query => query.reset());
      }

      return staleQueries.length < queries.length * 0.5; // Less than 50% stale
    } catch (error) {
      this.logError('cache', error);
      return false;
    }
  }

  private async checkRouter(): Promise<boolean> {
    try {
      // Check if router is working
      const hasRoutes = document.querySelector('[data-rr-ui-router]') !== null;
      return hasRoutes;
    } catch (error) {
      this.logError('router', error);
      return false;
    }
  }

  private async checkStore(): Promise<boolean> {
    try {
      // Check if store is accessible
      const storeElement = document.querySelector('[data-zustand-store]');
      return storeElement !== null;
    } catch (error) {
      this.logError('store', error);
      return false;
    }
  }

  private updateSystemStatus(componentStatus: Record<string, boolean>): void {
    const isHealthy = Object.values(componentStatus).every(status => status);
    
    this.systemStatus = {
      ...this.systemStatus,
      isHealthy,
      lastCheck: new Date(),
      activeIssues: Object.entries(componentStatus)
        .filter(([_, status]) => !status)
        .map(([component]) => component)
    };
  }

  private needsMaintenance(): boolean {
    return (
      !this.systemStatus.isHealthy ||
      this.errorCount.size > this.ERROR_THRESHOLD ||
      this.getCacheAge() > this.CACHE_LIFETIME
    );
  }

  private async performMaintenance(): Promise<void> {
    const tasks: MaintenanceTask[] = [
      {
        id: crypto.randomUUID(),
        type: 'cache',
        action: 'clear',
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'queries',
        action: 'reset',
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'store',
        action: 'refresh',
        timestamp: new Date()
      }
    ];

    for (const task of tasks) {
      try {
        await this.executeMaintenanceTask(task);
        this.maintenanceTasks.push(task);
      } catch (error) {
        this.logError(`maintenance-${task.type}`, error);
      }
    }
  }

  private async executeMaintenanceTask(task: MaintenanceTask): Promise<void> {
    switch (task.type) {
      case 'cache':
        this.queryClient.clear();
        break;
      case 'queries':
        await this.queryClient.resetQueries();
        break;
      case 'store':
        window.location.reload();
        break;
      default:
        throw new Error(`Unknown maintenance task type: ${task.type}`);
    }
  }

  private logError(component: string, error: unknown): void {
    const count = (this.errorCount.get(component) || 0) + 1;
    this.errorCount.set(component, count);

    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      component,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
      count
    };

    console.error('Maintenance Bot Error:', errorLog);
  }

  private getCacheAge(): number {
    const oldestQuery = this.queryClient.getQueryCache().getAll()
      .reduce((oldest, current) => {
        const currentState = current.state;
        if (!oldest || (currentState.dataUpdatedAt < oldest.dataUpdatedAt)) {
          return currentState;
        }
        return oldest;
      }, null);

    return oldestQuery ? Date.now() - oldestQuery.dataUpdatedAt : 0;
  }

  private handleMaintenanceError(error: unknown): void {
    this.logError('maintenance', error);
    
    // Force reload if maintenance fails
    if (this.errorCount.get('maintenance') > this.ERROR_THRESHOLD) {
      window.location.reload();
    }
  }

  // Public methods for external monitoring
  public getSystemStatus(): SystemStatus {
    return this.systemStatus;
  }

  public getMaintenanceLogs(): MaintenanceTask[] {
    return this.maintenanceTasks;
  }

  public getErrorLogs(): Map<string, number> {
    return this.errorCount;
  }

  public async forceMaintenance(): Promise<void> {
    await this.performMaintenance();
  }
}