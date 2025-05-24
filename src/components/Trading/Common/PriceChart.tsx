'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  if (!data.length) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg border border-slate-600/50 flex items-center justify-center">
        <p className="text-gray-400">No price data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 bg-slate-700/50 rounded-lg border border-slate-600/50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#94a3b8"
            tickFormatter={(timestamp) => {
              return new Date(timestamp).toLocaleTimeString();
            }}
          />
          <YAxis 
            stroke="#94a3b8"
            tickFormatter={(value) => `CC ${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: '#e2e8f0' }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`CC ${value.toLocaleString()}`, 'Price']}
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#818cf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#818cf8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}