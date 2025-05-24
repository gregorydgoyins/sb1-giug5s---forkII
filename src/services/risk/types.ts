export interface RiskMetrics {
  var: number;                // Value at Risk
  cvar: number;              // Conditional Value at Risk
  volatility: number;        // Historical volatility
  beta: number;              // Market beta
  sharpe: number;            // Sharpe ratio
  sortino: number;           // Sortino ratio
  maxDrawdown: number;       // Maximum drawdown
  currentDrawdown: number;   // Current drawdown
  leverage: number;          // Current leverage
  concentration: number;     // Position concentration
}

export interface StressTestResult {
  scenario: string;
  potentialLoss: number;
  impactedPositions: string[];
  riskFactors: Record<string, number>;
  recommendations: string[];
}

export interface RiskAlert {
  id: string;
  type: 'position' | 'portfolio' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  message: string;
}

export interface RiskReport {
  timestamp: Date;
  metrics: RiskMetrics;
  alerts: RiskAlert[];
  stressTests: StressTestResult[];
  recommendations: string[];
}

export interface PositionRisk {
  symbol: string;
  var: number;
  beta: number;
  contribution: number;
  correlation: number;
  liquidity: number;
}

export interface MarketRisk {
  volatility: number;
  sentiment: number;
  liquidity: number;
  correlation: number;
}