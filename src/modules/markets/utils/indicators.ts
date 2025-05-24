```typescript
import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { MarketData, Indicator } from '../types';
import { ErrorHandler } from '../../../utils/errors';

interface IndicatorResult {
  timestamp: number;
  value: number;
}

export function calculateIndicator(
  indicator: Indicator, 
  data: MarketData[]
): IndicatorResult[] {
  const errorHandler = ErrorHandler.getInstance();

  try {
    const prices = data.map(d => d.close);
    const timestamps = data.map(d => d.timestamp);

    switch (indicator.name) {
      case 'SMA':
        return calculateSMA(prices, timestamps, indicator.parameters.period as number);
      case 'RSI':
        return calculateRSI(prices, timestamps, indicator.parameters.period as number);
      case 'MACD':
        return calculateMACD(prices, timestamps, indicator.parameters);
      case 'Bollinger Bands':
        return calculateBollingerBands(prices, timestamps, indicator.parameters);
      default:
        throw new Error(`Unknown indicator: ${indicator.name}`);
    }
  } catch (error) {
    errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), {
      context: 'indicators',
      indicator: indicator.name,
      parameters: indicator.parameters
    });
    return [];
  }
}

function calculateSMA(
  prices: number[], 
  timestamps: number[], 
  period: number
): IndicatorResult[] {
  const sma = new SMA({ period, values: prices });
  const results = sma.getResult();

  return results.map((value, index) => ({
    timestamp: timestamps[index + period - 1],
    value
  }));
}

function calculateRSI(
  prices: number[], 
  timestamps: number[], 
  period: number
): IndicatorResult[] {
  const rsi = new RSI({ period, values: prices });
  const results = rsi.getResult();

  return results.map((value, index) => ({
    timestamp: timestamps[index + period],
    value
  }));
}

function calculateMACD(
  prices: number[],
  timestamps: number[],
  parameters: Record<string, number>
): IndicatorResult[] {
  const macd = new MACD({
    values: prices,
    fastPeriod: parameters.fastPeriod as number,
    slowPeriod: parameters.slowPeriod as number,
    signalPeriod: parameters.signalPeriod as number,
    SimpleMAOscillator: true,
    SimpleMASignal: true
  });

  const results = macd.getResult();

  return results.map((result, index) => ({
    timestamp: timestamps[index + parameters.slowPeriod as number],
    value: result.MACD
  }));
}

function calculateBollingerBands(
  prices: number[],
  timestamps: number[],
  parameters: Record<string, number>
): IndicatorResult[] {
  const bb = new BollingerBands({
    period: parameters.period as number,
    stdDev: parameters.stdDev as number,
    values: prices
  });

  const results = bb.getResult();

  return results.map((result, index) => ({
    timestamp: timestamps[index + parameters.period as number],
    value: result.middle // Return middle band
  }));
}
```