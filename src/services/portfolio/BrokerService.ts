```typescript
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import type { Broker, BrokerPersonality, SubscriptionTier } from './types';

export class BrokerService {
  private static instance: BrokerService;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;

  private readonly BROKER_PERSONALITIES: BrokerPersonality[] = [
    {
      style: 'conservative',
      riskTolerance: 0.3,
      communicationStyle: ['formal', 'cautious', 'analytical'],
      catchphrases: [
        "Let's analyze the fundamentals",
        "Steady gains are sustainable gains",
        "Risk management is paramount"
      ]
    },
    {
      style: 'moderate',
      riskTolerance: 0.6,
      communicationStyle: ['balanced', 'professional', 'confident'],
      catchphrases: [
        "The trend is our friend",
        "Let's seize this opportunity",
        "Markets are looking favorable"
      ]
    },
    {
      style: 'aggressive',
      riskTolerance: 0.9,
      communicationStyle: ['bold', 'energetic', 'direct'],
      catchphrases: [
        "Time to go all in!",
        "This is a game-changing opportunity",
        "The upside potential is massive"
      ]
    }
  ];

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): BrokerService {
    if (!BrokerService.instance) {
      BrokerService.instance = new BrokerService();
    }
    return BrokerService.instance;
  }

  public async assignBrokers(tier: SubscriptionTier): Promise<Broker[]> {
    return this.errorHandler.withErrorHandling(async () => {
      const count = tier === 'elite' ? 6 : 2;
      const brokers: Broker[] = [];

      for (let i = 0; i < count; i++) {
        brokers.push(await this.generateBroker(tier));
      }

      return brokers;
    }, {
      context: 'BrokerService',
      operation: 'assignBrokers',
      tier
    });
  }

  private async generateBroker(tier: SubscriptionTier): Promise<Broker> {
    const personality = this.BROKER_PERSONALITIES[
      Math.floor(Math.random() * this.BROKER_PERSONALITIES.length)
    ];

    const baseAccuracy = tier === 'elite' ? 0.85 : 0.70;
    const accuracyVariance = 0.10;
    const accuracy = Math.min(0.95, 
      baseAccuracy + (Math.random() * 2 - 1) * accuracyVariance
    );

    return {
      id: crypto.randomUUID(),
      name: await this.generateBrokerName(),
      personality,
      accuracy,
      feeRate: this.calculateFeeRate(tier, accuracy),
      specialties: this.assignSpecialties(),
      historicalPerformance: {
        successRate: accuracy,
        totalTrades: 0,
        profitLoss: 0
      }
    };
  }

  private async generateBrokerName(): Promise<string> {
    const firstNames = [
      'Alexander', 'Benjamin', 'Charles', 'David', 'Edward',
      'Victoria', 'Elizabeth', 'Catherine', 'Diana', 'Margaret'
    ];
    const lastNames = [
      'Sterling', 'Morgan', 'Goldman', 'Wells', 'Chase',
      'Rothschild', 'Vanderbilt', 'Carnegie', 'Astor', 'Mellon'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  private calculateFeeRate(tier: SubscriptionTier, accuracy: number): number {
    // Base fee rate: 10-30%
    const baseFee = tier === 'elite' ? 15 : 20;
    const accuracyPremium = (accuracy - 0.7) * 100; // Premium for high accuracy
    return Math.min(30, Math.max(10, baseFee + accuracyPremium));
  }

  private assignSpecialties(): string[] {
    const allSpecialties = [
      'Golden Age Comics',
      'Silver Age Comics',
      'Bronze Age Comics',
      'Modern Age Comics',
      'Marvel Universe',
      'DC Universe',
      'Independent Publishers',
      'Creator Stocks',
      'Publisher Bonds',
      'Options Trading'
    ];

    const specialtyCount = 2 + Math.floor(Math.random() * 3); // 2-4 specialties
    const specialties: string[] = [];

    while (specialties.length < specialtyCount) {
      const specialty = allSpecialties[Math.floor(Math.random() * allSpecialties.length)];
      if (!specialties.includes(specialty)) {
        specialties.push(specialty);
      }
    }

    return specialties;
  }

  public async getBroker(brokerId: string): Promise<Broker> {
    const result = await this.db.query(
      `SELECT * FROM brokers WHERE id = $1`,
      [brokerId]
    );

    if (!result.rows[0]) {
      throw new Error(`Broker not found: ${brokerId}`);
    }

    return result.rows[0];
  }

  public async updateBrokerPerformance(
    brokerId: string,
    tradeResult: { success: boolean; profitLoss: number }
  ): Promise<void> {
    await this.db.query(
      `UPDATE brokers 
       SET 
         total_trades = total_trades + 1,
         successful_trades = successful_trades + $1,
         total_profit_loss = total_profit_loss + $2,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [tradeResult.success ? 1 : 0, tradeResult.profitLoss, brokerId]
    );
  }
}
```