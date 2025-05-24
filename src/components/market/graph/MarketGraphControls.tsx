'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface MarketGraphControlsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const TIME_RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function MarketGraphControls({ timeRange, onTimeRangeChange }: MarketGraphControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Market Overview</h2>
      </div>
      <div className="flex items-center space-x-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}