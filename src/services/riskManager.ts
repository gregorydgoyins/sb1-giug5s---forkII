import type { Position, RiskMetrics, MarginRequirement } from '../types';

export class RiskManager {
  private readonly BASE_MARGIN = 0.2; // 20% base margin requirement
  private readonly MAX_LEVERAGE = 5; // 5x max leverage
  private readonly CIRCUIT_BREAKER_THRESHOLD = 0.1; // 10% price move

  public calculateMarginRequirement(position: Position): MarginRequirement {
    const baseRequirement = position.value * this.BASE_MARGIN;
    const volatilityAdjustment = this.calculateVolatilityAdjustment(position);
    const concentrationAdjustment = this.calculateConcentrationAdjustment(position);

    return {
      baseRequirement,
      volatilityAdjustment,
      concentrationAdjustment,
      totalRequirement: baseRequirement + volatilityAdjustment + concentrationAdjustment,
      maxLeverage: this.calculateMaxLeverage(position)
    };
  }

  private calculateVolatilityAdjustment(position: Position): number {
    const volatility = position.metrics.volatility;
    return position.value * volatility * 0.5; // 50% of volatility
  }

  private calculateConcentrationAdjustment(position: Position): number {
    const concentration = position.metrics.portfolioConcentration;
    return position.value * Math.max(0, concentration - 0.2) * 0.5;
  }

  private calculateMaxLeverage(position: Position): number {
    const baseMax = this.MAX_LEVERAGE;
    const volatilityAdjustment = 1 - position.metrics.volatility;
    const liquidityAdjustment = position.metrics.liquidity;

    return Math.min(
      baseMax,
      baseMax * volatilityAdjustment * liquidityAdjustment
    );
  }

  public checkCircuitBreaker(price: number, reference: number): boolean {
    const priceMove = Math.abs(price - reference) / reference;
    return priceMove >= this.CIRCUIT_BREAKER_THRESHOLD;
  }

  public calculatePositionRisk(position: Position): RiskMetrics {
    return {
      valueAtRisk: this.calculateVaR(position),
      stressLoss: this.calculateStressLoss(position),
      liquidationRisk: this.calculateLiquidationRisk(position),
      concentrationRisk: position.metrics.portfolioConcentration,
      leverageRisk: position.leverage / this.MAX_LEVERAGE
    };
  }

  private calculateVaR(position: Position): number {
    const confidence = 0.99; // 99% confidence level
    const volatility = position.metrics.volatility;
    const value = position.value;

    // Simple VaR calculation using normal distribution
    return value * volatility * 2.326 * Math.sqrt(1/252); // 1-day VaR
  }

  private calculateStressLoss(position: Position): number {
    // Stress scenario: 3 standard deviations move
    return position.value * position.metrics.volatility * 3;
  }

  private calculateLiquidationRisk(position: Position): number {
    const margin = position.margin;
    const requirement = this.calculateMarginRequirement(position);
    return Math.max(0, 1 - (margin / requirement.totalRequirement));
  }
}