```typescript
'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Film, Tv, TrendingUp, Calendar } from 'lucide-react';

const mockMediaData = {
  films: [
    { month: 'Jan', revenue: 125000000, viewers: 15000000 },
    { month: 'Feb', revenue: 180000000, viewers: 22000000 },
    { month: 'Mar', revenue: 150000000, viewers: 18000000 }
  ],
  streaming: [
    { month: 'Jan', subscribers: 8500000, engagement: 0.75 },
    { month: 'Feb', subscribers: 9200000, engagement: 0.82 },
    { month: 'Mar', subscribers: 9800000, engagement: 0.79 }
  ],
  licensing: [
    { month: 'Jan', revenue: 45000000, products: 120 },
    { month: 'Feb', revenue: 52000000, products: 145 },
    { month: 'Mar', revenue: 48000000, products: 135 }
  ]
};

export function MediaPerformance() {
  const [timeRange, setTimeRange] = useState('3M');
  const [platform, setPlatform] = useState('all');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Media Performance</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Platforms</option>
            <option value="films">Films</option>
            <option value="streaming">Streaming</option>
            <option value="licensing">Licensing</option>
          </select>

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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Office Performance */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Film className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Box Office</h3>
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5%</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMediaData.films}>
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
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streaming Performance */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Tv className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Streaming</h3>
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+8.2%</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMediaData.streaming}>
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
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="subscribers" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-xl font-bold text-white">$355M</p>
          <div className="flex items-center text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+15.2% vs prev. period</span>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Audience Growth</p>
          <p className="text-xl font-bold text-white">+2.1M</p>
          <div className="flex items-center text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+8.5% vs prev. period</span>
          </div>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Engagement Rate</p>
          <p className="text-xl font-bold text-white">78.6%</p>
          <div className="flex items-center text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+5.2% vs prev. period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```