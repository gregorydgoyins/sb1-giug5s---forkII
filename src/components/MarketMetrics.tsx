import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';

const mockMetrics = {
  volume24h: 12500000,
  transactions24h: 1250,
  activeTraders: 850,
  averagePrice: 2800,
  priceChange24h: 5.2,
  volumeChange24h: 12.5,
  topPerformers: [
    { symbol: 'ASM300', change: 8.5 },
    { symbol: 'BAT457', change: 6.2 },
    { symbol: 'XMN141', change: 5.8 }
  ],
  historicalVolume: [
    { date: '2024-01', volume: 10000000 },
    { date: '2024-02', volume: 11500000 },
    { date: '2024-03', volume: 12500000 }
  ]
};

export function MarketMetrics() {
  const { marketIndex, volatility } = useMarketStore();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Metrics</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>24h</option>
          <option>7d</option>
          <option>30d</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">24h Volume</p>
              <p className="text-xl font-bold text-white">
                CC {mockMetrics.volume24h.toLocaleString()}
              </p>
            </div>
            <div className={`flex items-center ${
              mockMetrics.volumeChange24h > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockMetrics.volumeChange24h > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="ml-1">
                {mockMetrics.volumeChange24h > 0 ? '+' : ''}
                {mockMetrics.volumeChange24h}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Traders</p>
              <p className="text-xl font-bold text-white">
                {mockMetrics.activeTraders.toLocaleString()}
              </p>
            </div>
            <BarChart2 className="h-5 w-5 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Price</p>
              <p className="text-xl font-bold text-white">
                CC {mockMetrics.averagePrice.toLocaleString()}
              </p>
            </div>
            <div className={`flex items-center ${
              mockMetrics.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockMetrics.priceChange24h > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="ml-1">
                {mockMetrics.priceChange24h > 0 ? '+' : ''}
                {mockMetrics.priceChange24h}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockMetrics.historicalVolume}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              stroke="#94a3b8"
            />
            <Tooltip 
              formatter={(value: number) => [`CC ${value.toLocaleString()}`, 'Volume']}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#818cf8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#818cf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
        <div className="space-y-3">
          {mockMetrics.topPerformers.map((performer, index) => (
            <div key={performer.symbol} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">#{index + 1}</span>
                <span className="text-white">{performer.symbol}</span>
              </div>
              <div className="flex items-center text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{performer.change}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}