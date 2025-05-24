'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { LoadingState } from '@/app/loading-state';

export function RealTimeMarket() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { data: marketData, error, isLoading } = useMarketData();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (error) {
    return (
      <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50">
        <p className="text-red-200">Failed to load market data</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Market Overview</h2>
        <span className="text-gray-400">{currentTime}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Current Price</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(marketData?.price || 0)}
          </p>
        </div>

        {/* Change */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">24h Change</p>
          <div className="flex items-center space-x-2">
            {marketData?.priceChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            <p className={`text-xl font-bold ${
              marketData?.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(marketData?.percentageChange || 0)}
            </p>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">24h Volume</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(marketData?.volume || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}