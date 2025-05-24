```typescript
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useMarketStore } from '@/store/marketStore';

export function MarketMetrics() {
  const { marketIndex, volatility } = useMarketStore();

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-bold text-white">Market Metrics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Market Index</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-white">{formatCurrency(marketIndex)}</p>
            <div className="flex items-center text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">30-Day Volume</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-white">{formatCurrency(125000000)}</p>
            <div className="flex items-center text-red-400">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>-2.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Market Volatility</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-bold text-white">{(volatility * 100).toFixed(1)}%</p>
            <BarChart2 className="h-5 w-5 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Age Distribution</h3>
        <div className="space-y-2">
          {[
            { age: 'Golden Age', value: 0.30 },
            { age: 'Silver Age', value: 0.25 },
            { age: 'Bronze Age', value: 0.20 },
            { age: 'Copper Age', value: 0.15 },
            { age: 'Modern Age', value: 0.10 }
          ].map(({ age, value }) => (
            <div key={age} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{age}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
                <span className="text-sm text-white w-12 text-right">
                  {(value * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```