import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface CreatorStockChartProps {
  symbol?: string;
}

const mockData = [
  { date: '2024-01', price: 2200 },
  { date: '2024-02', price: 2350 },
  { date: '2024-03', price: 2500 }
];

const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function CreatorStockChart({ symbol }: CreatorStockChartProps) {
  const [selectedRange, setSelectedRange] = useState('1M');
  const priceChange = mockData[mockData.length - 1].price - mockData[0].price;
  const percentageChange = (priceChange / mockData[0].price) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Price History</h2>
        </div>
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-3xl font-bold text-white">
              CC {mockData[mockData.length - 1].price.toLocaleString()}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {priceChange > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
              <span className={`${
                priceChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange > 0 ? '+' : ''}
                {percentageChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
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
              formatter={(value: number) => [`CC ${value.toLocaleString()}`, 'Price']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#94a3b8' }}
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
    </div>
  );
}