```typescript
'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

interface MarketDepthProps {
  symbol: string;
}

export function MarketDepth({ symbol }: MarketDepthProps) {
  const { data: marketData, isLoading } = useMarketData();

  if (isLoading || !symbol) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Depth</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">
            {!symbol ? 'Select a symbol to view market depth' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Depth</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Symbol</p>
          <p className="text-lg font-bold text-white">{symbol}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Bid Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Bids</h3>
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={`bid-${i}`} className="flex justify-between">
                <span className="text-green-400">2500.00</span>
                <span className="text-gray-300">100</span>
                <span className="text-gray-400">250,000</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ask Side */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Asks</h3>
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={`ask-${i}`} className="flex justify-between">
                <span className="text-red-400">2510.00</span>
                <span className="text-gray-300">100</span>
                <span className="text-gray-400">251,000</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Bid Volume</p>
            <p className="text-lg font-bold text-white">1,250,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Ask Volume</p>
            <p className="text-lg font-bold text-white">1,255,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```