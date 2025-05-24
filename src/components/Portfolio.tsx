import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function Portfolio() {
  const mockPortfolio = {
    totalValue: 2450000,
    dailyChange: 125000,
    holdings: [
      {
        id: '1',
        name: 'Batman #800',
        symbol: 'BAT800',
        type: 'comic',
        shares: 100,
        avgPrice: 1200,
        currentPrice: 1250,
        profit: 5000
      },
      {
        id: '2',
        name: 'Stan Lee',
        symbol: 'SLES',
        type: 'creator',
        shares: 50,
        avgPrice: 2500,
        currentPrice: 2600,
        profit: 5000
      }
    ]
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Your Portfolio</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-indigo-400" />
            <p className="text-sm text-indigo-200">Total Value</p>
          </div>
          <p className="text-xl font-bold text-white">CC {mockPortfolio.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <p className="text-sm text-green-200">Daily Change</p>
          </div>
          <p className="text-xl font-bold text-green-400">+CC {mockPortfolio.dailyChange.toLocaleString()}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <p className="text-sm text-indigo-200">Holdings</p>
          </div>
          <p className="text-xl font-bold text-white">{mockPortfolio.holdings.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Asset</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Shares</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Avg Price</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Current</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">P/L</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPortfolio.holdings.map((holding) => (
              <tr key={holding.id} className="border-b border-slate-700/50">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-white">{holding.name}</p>
                    <p className="text-gray-400">{holding.symbol}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-300">{holding.shares}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-300">CC {holding.avgPrice}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-300">CC {holding.currentPrice}</td>
                <td className="px-4 py-3 text-sm text-right text-green-400">
                  +CC {holding.profit}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end space-x-2">
                    <Link 
                      to={`/trading/${holding.symbol}`}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Trade
                    </Link>
                    <Link 
                      to={`/analytics/${holding.symbol}`}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Analysis
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}