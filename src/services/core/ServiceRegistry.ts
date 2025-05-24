import { ServiceManager } from './ServiceManager';
import { MarketDataService } from '../market/MarketDataService';
import { TradingService } from '../trading/TradingService';
import { RiskAnalysisService } from '../risk/RiskAnalysisService';
import { MarketMakingService } from '../market/maker/MarketMakingService';
import { PortfolioManager } from '../portfolio/PortfolioManager';
import { ErrorHandler } from '../../utils/errors';

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private serviceManager: ServiceManager;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.serviceManager = ServiceManager.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.registerServices();
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private registerServices(): void {
    // Register core services
    this.registerMarketDataService();
    this.registerTradingService();
    this.registerRiskService();
    this.registerMarketMakingService();
    this.registerPortfolioService();
  }

  private registerMarketDataService(): void {
    const marketDataService = MarketDataService.getInstance();
    this.serviceManager.registerService(
      'marketData',
      marketDataService,
      async () => {
        const status = await marketDataService.getSourceStatus();
        return status.every(s => s.healthy);
      }
    );
  }

  private registerTradingService(): void {
    const tradingService = TradingService.getInstance();
    this.serviceManager.registerService(
      'trading',
      tradingService,
      async () => {
        // Implement health check
        return true;
      }
    );
  }

  private registerRiskService(): void {
    const riskService = RiskAnalysisService.getInstance();
    this.serviceManager.registerService(
      'risk',
      riskService,
      async () => {
        const report = riskService.getLatestReport();
        return report !== null;
      }
    );
  }

  private registerMarketMakingService(): void {
    const marketMakingService = MarketMakingService.getInstance();
    this.serviceManager.registerService(
      'marketMaking',
      marketMakingService,
      async () => {
        const metrics = marketMakingService.getMetrics();
        return metrics.inventory.totalValue > 0;
      }
    );
  }

  private registerPortfolioService(): void {
    const portfolioManager = PortfolioManager.getInstance();
    this.serviceManager.registerService(
      'portfolio',
      portfolioManager,
      async () => {
        const snapshot = portfolioManager.getPortfolioSnapshot();
        return snapshot !== null;
      }
    );
  }

  public getService<T>(name: string): T {
    return this.serviceManager.getService<T>(name);
  }

  public async checkHealth(): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
  }> {
    return this.serviceManager.checkHealth();
  }
}