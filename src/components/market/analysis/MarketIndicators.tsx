```typescript
'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart2, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const mockMarketShare = [
  { name: 'Marvel', value: 45, color: '#ef4444' },
  { name: 'DC', value: 35, color: '#3b82f6' },
  { name: 'Image', value: 12, color: '#10b981' },
  { name: 'Others', value: 8, color: '#8b5cf6' }
];

const mockTrends = [
  { month: 'Jan', marketCap: 2800000, growth: 5.2 },
  { month: 'Feb', marketCap: 3200000, growth: 14.3 },
  { month: 'Mar', marketCap: 3500000, growth: 9.4 }
];

export function MarketIndicators() {
  const [timeRange, setTimeRange] = useState('3M');

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting market data...');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Indicators</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
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

          <button
            onClick={handleExport}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
            title="Export Data"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share Distribution */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Market Share</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockMarketShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} (${value}%)`}
                  labelLine={true}
                >
                  {mockMarketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [`${value}%`, 'Market Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-4">Growth Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [formatCurrency(value), 'Market Cap']}
                />
                <Line
                  type="monotone"
                  dataKey="marketCap"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="text-xl font-bold text-white">{formatCurrency(3500000)}</p>
          <div className="flex items-center text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+9.4% vs prev. month</span>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Trading Volume</p>
          <p className="text-xl font-bold text-white">{formatCurrency(850000)}</p>
          <div className="flex items-center text-red-400 mt-1">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span className="text-sm">-2.8% vs prev. month</span>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Active Traders</p>
          <p className="text-xl font-bold text-white">1,250</p>
          <div className="flex items-center text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+15.2% vs prev. month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```