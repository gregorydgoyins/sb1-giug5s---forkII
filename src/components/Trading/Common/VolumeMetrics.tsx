'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';
import type { VolumeMetrics as VolumeMetricsType } from '../types';

interface VolumeMetricsProps {
  data?: VolumeMetricsType;
}

export function VolumeMetrics({ data }: VolumeMetricsProps) {
  if (!data) {
    return (
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <p className="text-gray-400 text-center">No volume data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart2 className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Volume Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">24h Volume</p>
          <p className="text-lg font-semibold text-white">
            CC {data.daily.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">7d Volume</p>
          <p className="text-lg font-semibold text-white">
            CC {data.weekly.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">30d Volume</p>
          <p className="text-lg font-semibold text-white">
            CC {data.monthly.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Avg Trade Size</p>
          <p className="text-lg font-semibold text-white">
            CC {data.avgTradeSize.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}