import type { Option, OptionChain, Strike, Greeks } from '../types';

export class OptionsManager {
  private readonly EXPIRY_INTERVALS = [30, 60, 90, 180, 360]; // Days
  private readonly STRIKE_INCREMENTS = 0.05; // 5% increments
  private readonly MIN_STRIKES = 5;
  private readonly MAX_STRIKES = 11;
  private readonly IV_FLOOR = 0.15; // Minimum implied volatility
  
  public generateOptionChain(underlying: string, spot: number, historicalVol: number): OptionChain {
    const expirations = this.generateExpiryDates();
    const strikes = this.generateStrikes(spot);
    const chain: OptionChain = { puts: [], calls: [] };

    expirations.forEach(expiry => {
      strikes.forEach(strike => {
        const timeToExpiry = this.calculateTimeToExpiry(expiry);
        const impliedVol = this.calculateImpliedVolatility(historicalVol, timeToExpiry, strike, spot);
        
        const [call, put] = this.createOptionPair(
          underlying,
          strike,
          spot,
          impliedVol,
          timeToExpiry,
          expiry
        );

        chain.calls.push(call);
        chain.puts.push(put);
      });
    });

    return chain;
  }

  private generateExpiryDates(): Date[] {
    const now = new Date();
    return this.EXPIRY_INTERVALS.map(days => {
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + days);
      // Set to last Friday if not already
      while (expiry.getDay() !== 5) expiry.setDate(expiry.getDate() - 1);
      return expiry;
    });
  }

  private generateStrikes(spot: number): number[] {
    const strikes: number[] = [];
    const range = Math.min(this.MAX_STRIKES, Math.max(this.MIN_STRIKES, 
      Math.floor(spot / 50))); // More strikes for higher-priced assets
    
    for (let i = -Math.floor(range/2); i <= Math.floor(range/2); i++) {
      strikes.push(spot * (1 + i * this.STRIKE_INCREMENTS));
    }
    
    return strikes;
  }

  private calculateImpliedVolatility(
    historicalVol: number,
    timeToExpiry: number,
    strike: number,
    spot: number
  ): number {
    const moneyness = Math.abs(Math.log(strike/spot));
    const volSkew = Math.exp(-moneyness * 2) * 0.1; // Smile effect
    const termStructure = Math.log(timeToExpiry) * 0.05; // Term structure
    
    return Math.max(this.IV_FLOOR,
      historicalVol * (1 + volSkew + termStructure));
  }

  private calculateTimeToExpiry(expiry: Date): number {
    return (expiry.getTime() - new Date().getTime()) / 
      (1000 * 60 * 60 * 24 * 365); // In years
  }

  private createOptionPair(
    underlying: string,
    strike: number,
    spot: number,
    impliedVol: number,
    timeToExpiry: number,
    expiry: Date
  ): [Option, Option] {
    const baseId = `${underlying}-${expiry.toISOString()}-${strike}`;
    const greeks = this.calculateGreeks(spot, strike, impliedVol, timeToExpiry);
    
    const call: Option = {
      id: `${baseId}-C`,
      type: 'call',
      underlying,
      strike,
      expiry,
      impliedVol,
      premium: this.calculatePremium('call', spot, strike, impliedVol, timeToExpiry),
      greeks
    };

    const put: Option = {
      id: `${baseId}-P`,
      type: 'put',
      underlying,
      strike,
      expiry,
      impliedVol,
      premium: this.calculatePremium('put', spot, strike, impliedVol, timeToExpiry),
      greeks
    };

    return [call, put];
  }

  private calculateGreeks(
    spot: number,
    strike: number,
    impliedVol: number,
    timeToExpiry: number
  ): Greeks {
    // Simplified Black-Scholes Greeks
    const d1 = (Math.log(spot/strike) + (0.05 + impliedVol*impliedVol/2)*timeToExpiry) / 
      (impliedVol * Math.sqrt(timeToExpiry));
    const d2 = d1 - impliedVol * Math.sqrt(timeToExpiry);

    return {
      delta: this.normalCDF(d1),
      gamma: Math.exp(-d1*d1/2) / (spot * impliedVol * Math.sqrt(timeToExpiry * 2 * Math.PI)),
      theta: -(spot * impliedVol * Math.exp(-d1*d1/2)) / (2 * Math.sqrt(timeToExpiry * 2 * Math.PI)),
      vega: spot * Math.sqrt(timeToExpiry) * Math.exp(-d1*d1/2) / Math.sqrt(2 * Math.PI)
    };
  }

  private calculatePremium(
    type: 'call' | 'put',
    spot: number,
    strike: number,
    impliedVol: number,
    timeToExpiry: number
  ): number {
    const d1 = (Math.log(spot/strike) + (0.05 + impliedVol*impliedVol/2)*timeToExpiry) / 
      (impliedVol * Math.sqrt(timeToExpiry));
    const d2 = d1 - impliedVol * Math.sqrt(timeToExpiry);

    if (type === 'call') {
      return spot * this.normalCDF(d1) - strike * Math.exp(-0.05*timeToExpiry) * this.normalCDF(d2);
    } else {
      return strike * Math.exp(-0.05*timeToExpiry) * this.normalCDF(-d2) - spot * this.normalCDF(-d1);
    }
  }

  private normalCDF(x: number): number {
    return (1 + Math.erf(x/Math.sqrt(2))) / 2;
  }
}