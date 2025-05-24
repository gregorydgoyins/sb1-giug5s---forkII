```typescript
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { MarketDataService } from '../market/MarketDataService';
import { BrokerService } from './BrokerService';
import { SubscriptionService } from './SubscriptionService';
import { EasterEggService } from './EasterEggService';
import type { Portfolio, Broker, SubscriptionTier, EasterEgg } from './types';

export class PortfolioManagementService {
  private static instance: PortfolioManagementService;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private marketData: MarketDataService;
  private brokerService: BrokerService;
  private subscriptionService: SubscriptionService;
  private easterEggService: EasterEggService;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.marketData = MarketDataService.getInstance();
    this.brokerService = BrokerService.getInstance();
    this.subscriptionService = SubscriptionService.getInstance();
    this.easterEggService = EasterEggService.getInstance();
  }

  public static getInstance(): PortfolioManagementService {
    if (!PortfolioManagementService.instance) {
      PortfolioManagementService.instance = new PortfolioManagementService();
    }
    return PortfolioManagementService.instance;
  }

  public async createPortfolio(userId: string, tier: SubscriptionTier): Promise<Portfolio> {
    return this.errorHandler.withErrorHandling(async () => {
      // Validate subscription
      const subscription = await this.subscriptionService.validateSubscription(userId, tier);
      if (!subscription.isActive) {
        throw new Error('Active subscription required');
      }

      // Create portfolio with tier-specific limits
      const portfolio: Portfolio = {
        id: crypto.randomUUID(),
        userId,
        tier,
        balance: 2000000, // Starting balance: 2M CC
        positions: [],
        brokers: await this.brokerService.assignBrokers(tier),
        created: new Date(),
        lastUpdated: new Date()
      };

      // Store in database
      await this.db.query(
        `INSERT INTO portfolios (
          id, user_id, tier, balance, brokers, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          portfolio.id,
          portfolio.userId,
          portfolio.tier,
          portfolio.balance,
          JSON.stringify(portfolio.brokers),
          portfolio.created,
          portfolio.lastUpdated
        ]
      );

      return portfolio;
    }, {
      context: 'PortfolioManagementService',
      operation: 'createPortfolio',
      userId,
      tier
    });
  }

  public async executeTrade(
    portfolioId: string,
    brokerId: string,
    order: any
  ): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get portfolio and validate trade limits
      const portfolio = await this.getPortfolio(portfolioId);
      await this.validateTradeRestrictions(portfolio, order);

      // Get broker and calculate success probability
      const broker = await this.brokerService.getBroker(brokerId);
      const willSucceed = this.calculateTradeSuccess(broker, order);

      if (willSucceed) {
        // Execute trade
        await this.processTrade(portfolio, order, broker);
      } else {
        throw new Error('Trade execution failed - broker error');
      }
    }, {
      context: 'PortfolioManagementService',
      operation: 'executeTrade',
      portfolioId,
      brokerId
    });
  }

  private async validateTradeRestrictions(portfolio: Portfolio, order: any): Promise<void> {
    const restrictions = this.subscriptionService.getTierRestrictions(portfolio.tier);

    // Check asset class limits
    if (!this.isWithinAssetLimits(portfolio, order, restrictions)) {
      throw new Error('Trade exceeds asset class limits for subscription tier');
    }

    // Check trading volume
    if (!this.isWithinVolumeLimit(portfolio, order, restrictions)) {
      throw new Error('Trade exceeds volume limits for subscription tier');
    }

    // Check portfolio value limits
    if (!this.isWithinValueLimit(portfolio, order, restrictions)) {
      throw new Error('Trade exceeds portfolio value limits for subscription tier');
    }
  }

  private calculateTradeSuccess(broker: Broker, order: any): boolean {
    // Base success rate from broker skill
    let successProbability = broker.accuracy;

    // Apply "Act of God" modifier (1% chance)
    if (Math.random() < 0.01) {
      successProbability = Math.random(); // Random outcome
    }

    return Math.random() < successProbability;
  }

  private async processTrade(portfolio: Portfolio, order: any, broker: Broker): Promise<void> {
    await this.db.transaction(async (trx) => {
      // Calculate fees
      const fees = this.calculateTradingFees(order.value, broker);

      // Update portfolio balance
      await trx.query(
        `UPDATE portfolios 
         SET balance = balance - $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [order.value + fees, portfolio.id]
      );

      // Record trade
      await trx.query(
        `INSERT INTO trades (
          portfolio_id, broker_id, symbol, type, quantity,
          price, fees, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [
          portfolio.id,
          broker.id,
          order.symbol,
          order.type,
          order.quantity,
          order.price,
          fees
        ]
      );
    });
  }

  private calculateTradingFees(value: number, broker: Broker): number {
    return value * (broker.feeRate / 100);
  }

  private isWithinAssetLimits(portfolio: Portfolio, order: any, restrictions: any): boolean {
    // Implement asset class limit validation
    return true;
  }

  private isWithinVolumeLimit(portfolio: Portfolio, order: any, restrictions: any): boolean {
    // Implement trading volume limit validation
    return true;
  }

  private isWithinValueLimit(portfolio: Portfolio, order: any, restrictions: any): boolean {
    // Implement portfolio value limit validation
    return true;
  }

  public async getPortfolio(portfolioId: string): Promise<Portfolio> {
    const result = await this.db.query(
      `SELECT * FROM portfolios WHERE id = $1`,
      [portfolioId]
    );

    if (!result.rows[0]) {
      throw new Error(`Portfolio not found: ${portfolioId}`);
    }

    return result.rows[0];
  }

  public async checkEasterEggs(portfolioId: string): Promise<EasterEgg[]> {
    return this.easterEggService.checkEligibility(portfolioId);
  }
}
```