```typescript
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export interface MarketData {
  symbol: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Indicator {
  id: string;
  name: string;
  type: 'overlay' | 'oscillator';
  parameters: Record<string, number | string>;
  color: string;
  visible: boolean;
}

export interface ChartConfig {
  timeFrame: TimeFrame;
  indicators: Indicator[];
  showVolume: boolean;
  theme: 'light' | 'dark';
  gridLines: boolean;
  crosshair: boolean;
}

export interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  alerts?: Alert[];
}

export interface Alert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  active: boolean;
  triggered?: Date;
}

export interface MarketScreener {
  id: string;
  name: string;
  criteria: ScreenerCriteria[];
  results: string[];
  lastRun?: Date;
}

export interface ScreenerCriteria {
  indicator: string;
  condition: 'above' | 'below' | 'crosses' | 'crossesAbove' | 'crossesBelow';
  value: number;
  timeFrame?: TimeFrame;
}
```