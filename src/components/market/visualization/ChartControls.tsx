'use client';

import React from 'react';
import { Calendar, Download, Settings } from 'lucide-react';

interface ChartControlsProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function ChartControls({ timeframe, onTimeframeChange }: ChartControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Market Overview</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
            title="Export Data"
          >
            <Download className="h-5 w-5" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
            title="Chart Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}