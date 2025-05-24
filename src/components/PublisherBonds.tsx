import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function PublisherBonds() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const recentTrades = [
    {
      id: '1',
      name: 'Marvel Entertainment',
      symbol: 'MRVLB',
      lastPrice: 3500,
      change: 175.00,
      percentageChange: 5.2,
      volume: 45,
      yield: 4.8,
      rating: 'AAA',
      lastTraded: '2m ago'
    },
    {
      id: '2',
      name: 'DC Comics',
      symbol: 'DCCB',
      lastPrice: 3200,
      change: -96.00,
      percentageChange: -2.9,
      volume: 38,
      yield: 5.2,
      rating: 'AAA',
      lastTraded: '1m ago'
    },
    {
      id: '3',
      name: 'Image Comics',
      symbol: 'IMGC',
      lastPrice: 1800,
      change: 54.00,
      percentageChange: 3.1,
      volume: 25,
      yield: 6.5,
      rating: 'AA',
      lastTraded: '4m ago'
    },
    {
      id: '4',
      name: 'Dark Horse',
      symbol: 'DKHB',
      lastPrice: 1500,
      change: -30.00,
      percentageChange: -2.0,
      volume: 20,
      yield: 5.8,
      rating: 'AA',
      lastTraded: '5m ago'
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Publisher Bonds</h2>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">5m delay</span>
        </div>
      </div>

      <div className="space-y-4">
        {recentTrades.map((bond) => (
          <div
            key={bond.id}
            onClick={() => setSelectedCard(selectedCard === bond.id ? null : bond.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === bond.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{bond.name}</h3>
                <p className="text-sm text-gray-400">{bond.symbol} • {bond.volume} trades</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">CC {bond.lastPrice.toLocaleString()}</p>
                <div className="flex items-center justify-end space-x-1">
                  {bond.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ${bond.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {bond.change > 0 ? '+' : ''}{bond.percentageChange}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex space-x-4">
                <span className="text-sm text-gray-400">Yield: <span className="text-green-400">{bond.yield}%</span></span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  bond.rating === 'AAA' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                  'bg-blue-900/50 text-blue-200 border border-blue-700/50'
                }`}>
                  {bond.rating}
                </span>
              </div>
              <span className="text-xs text-gray-400">{bond.lastTraded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}