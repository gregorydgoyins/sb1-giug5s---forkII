import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart2, Filter } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const mockPositions = [
  {
    id: '1',
    name: 'Amazing Spider-Man #300',
    symbol: 'ASM300',
    type: 'comic',
    quantity: 2,
    avgPrice: 2400,
    currentPrice: 2500,
    value: 5000,
    pnl: 200,
    pnlPercentage: 4.17,
    dayChange: 125.50
  },
  {
    id: '2',
    name: 'Todd McFarlane',
    symbol: 'TMFS',
    type: 'creator',
    quantity: 50,
    avgPrice: 1800,
    currentPrice: 1850,
    value: 92500,
    pnl: 2500,
    pnlPercentage: 2.78,
    dayChange: 85.25
  }
];

const mockPerformance = [
  { date: '2024-01', value: 100000 },
  { date: '2024-02', value: 115000 },
  { date: '2024-03', value: 125000 }
];

export function Positions() {
  const { userBalance } = useMarketStore();
  const [filter, setFilter] = useState('all');

  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const dayChange = mockPositions.reduce((sum, pos) => sum + pos.dayChange, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Positions</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <Filter className="h-5 w-5" />
          </button>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Assets</option>
            <option value="comic">Comics</option>
            <option value="creator">Creators</option>
            <option value="option">Options</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Total Value</p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Available Balance</p>
          <p className="text-xl font-bold text-white">{formatCurrency(userBalance)}</p>
        </div>
        <div className={`p-4 rounded-lg border ${
          totalPnL >= 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-red-900/30 border-red-700/30'
        }`}>
          <p className="text-sm text-gray-400">Total P/L</p>
          <div className="flex items-center space-x-2">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            <p className={`text-xl font-bold ${
              totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(Math.abs(totalPnL))}
            </p>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${
          dayChange >= 0 
            ? 'bg-green-900/30 border-green-700/30' 
            : 'bg-red-900/30 border-red-700/30'
        }`}>
          <p className="text-sm text-gray-400">Day Change</p>
          <div className="flex items-center space-x-2">
            {dayChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
            <p className={`text-xl font-bold ${
              dayChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(Math.abs(dayChange))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Portfolio Performance</h3>
              <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
                <option>1M</option>
                <option>3M</option>
                <option>6M</option>
                <option>1Y</option>
                <option>ALL</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
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
                    dataKey="value"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Asset Allocation</h3>
          <div className="space-y-4">
            {['comic', 'creator', 'option'].map(type => {
              const typePositions = mockPositions.filter(p => p.type === type);
              const typeValue = typePositions.reduce((sum, p) => sum + p.value, 0);
              const percentage = (typeValue / totalValue) * 100;

              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{type}s</span>
                    <span className="text-white">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Open Positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 text-sm font-semibold text-gray-400">Asset</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">Quantity</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">Avg Price</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">Current</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">Value</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">P/L</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPositions
                .filter(pos => filter === 'all' || pos.type === filter)
                .map(position => (
                  <tr key={position.id} className="border-b border-slate-700/50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-white">{position.name}</p>
                        <p className="text-sm text-gray-400">{position.symbol}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 text-gray-300">{position.quantity}</td>
                    <td className="text-right py-3 text-gray-300">
                      {formatCurrency(position.avgPrice)}
                    </td>
                    <td className="text-right py-3 text-gray-300">
                      {formatCurrency(position.currentPrice)}
                    </td>
                    <td className="text-right py-3 text-gray-300">
                      {formatCurrency(position.value)}
                    </td>
                    <td className="text-right py-3">
                      <div className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                        <br />
                        <span className="text-sm">
                          ({position.pnl >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <div className="flex justify-end space-x-2">
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                          Buy
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}