'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PriceDisplayProps {
  price: number;
  change: number;
}

export function PriceDisplay({ price, change }: PriceDisplayProps) {
  const percentageChange = (change / (price - change)) * 100;

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">Current Price</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(price)}</p>
        </div>
        <div className={`flex items-center space-x-1 ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          <span className="font-medium">
            {change >= 0 ? '+' : ''}{formatCurrency(change)} ({percentageChange.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}