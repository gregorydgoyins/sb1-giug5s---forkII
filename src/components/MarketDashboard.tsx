import React from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart2, AlertCircle } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';
import { useMarketStore } from '../store/marketStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockEvents = [
  {
    title: "Marvel Announces New Spider-Man Series",
    impact: "positive",
    timestamp: "2h ago"
  },
  {
    title: "DC Comics Reports Record Sales",
    impact: "positive",
    timestamp: "4h ago"
  },
  {
    title: "Major Creator Signs Exclusive Contract",
    impact: "neutral",
    timestamp: "6h ago"
  }
];

export function MarketDashboard() {
  const { data: marketData } = useMarketData();
  const { marketIndex, volatility } = useMarketStore();

  const marketSentiment = marketIndex > (marketData?.historicalData[0]?.value || 0)
    ? { status: 'bullish', color: 'text-green-400' }
    : { status: 'bearish', color: 'text-red-400' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
      {/* Market Overview (60%) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Market Conditions</h2>
            </div>
            <div className={`flex items-center space-x-2 ${marketSentiment.color}`}>
              {marketSentiment.status === 'bullish' ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="font-medium capitalize">{marketSentiment.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Index Value</p>
              <p className="text-xl font-bold text-white">CC {marketIndex.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">24h Volume</p>
              <p className="text-xl font-bold text-white">CC 12.5M</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Volatility</p>
              <p className="text-xl font-bold text-white">
                {volatility < 0.4 ? 'Low' : volatility < 0.7 ? 'Medium' : 'High'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Market Moving Events</h3>
            {mockEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  event.impact === 'positive' ? 'bg-green-900/50 border border-green-700/50' :
                  event.impact === 'negative' ? 'bg-red-900/50 border border-red-700/50' :
                  'bg-slate-700/50 border border-slate-600/50'
                }`}>
                  <AlertCircle className={`h-5 w-5 ${
                    event.impact === 'positive' ? 'text-green-400' :
                    event.impact === 'negative' ? 'text-red-400' :
                    'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{event.title}</p>
                  <p className="text-sm text-gray-400">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Metrics (40%) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Market Metrics</h2>
            </div>
          </div>

          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData?.historicalData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short' });
                  }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`CC ${value.toLocaleString()}`, 'Index Value']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#818cf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="text-lg font-bold text-white mb-2">Top Performers</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amazing Spider-Man #300</span>
                  <span className="text-green-400">+5.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Batman #457</span>
                  <span className="text-green-400">+3.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">X-Men #141</span>
                  <span className="text-green-400">+2.9%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <h3 className="text-lg font-bold text-white mb-2">Market Laggards</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Spawn #1</span>
                  <span className="text-red-400">-2.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Detective Comics #27</span>
                  <span className="text-red-400">-1.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Fantastic Four #48</span>
                  <span className="text-red-400">-1.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}