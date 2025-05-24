```typescript
'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Position } from '@/types';

interface RiskMetricsProps {
  positions: Position[];
}

export function RiskMetrics({ positions }: RiskMetricsProps) {
  const calculatePortfolioRisk = () => {
    if (!positions.length) return 0;
    
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const weightedRisk = positions.reduce((sum, pos) => {
      const weight = pos.marketValue / totalValue;
      return sum + (weight * pos.metrics.volatility);
    }, 0);

    return weightedRisk;
  };

  const calculateLargestPosition = () => {
    if (!positions.length) return 0;
    
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const largestPosition = Math.max(...positions.map(p => p.marketValue));
    return largestPosition / totalValue;
  };

  const portfolioRisk = calculatePortfolioRisk();
  const largestPositionSize = calculateLargestPosition();

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Risk Metrics</h2>
      </div>

      <div className="space-y-6">
        {/* Portfolio Risk */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Portfolio Risk</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold text-white">
              {(portfolioRisk * 100).toFixed(1)}%
            </p>
            <div className={`flex items-center ${
              portfolioRisk > 0.3 ? 'text-red-400' : 'text-green-400'
            }`}>
              {portfolioRisk > 0.3 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>Risk Level</span>
            </div>
          </div>
        </div>

        {/* Position Concentration */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Largest Position</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold text-white">
              {(largestPositionSize * 100).toFixed(1)}%
            </p>
            <div className={`flex items-center ${
              largestPositionSize > 0.25 ? 'text-red-400' : 'text-green-400'
            }`}>
              {largestPositionSize > 0.25 ? (
                <AlertTriangle className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>Concentration</span>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        {(portfolioRisk > 0.3 || largestPositionSize > 0.25) && (
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-200">Risk Alert</p>
                <ul className="mt-1 space-y-1 text-sm text-red-300">
                  {portfolioRisk > 0.3 && (
                    <li>High portfolio risk level detected</li>
                  )}
                  {largestPositionSize > 0.25 && (
                    <li>Position concentration exceeds recommended limits</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```