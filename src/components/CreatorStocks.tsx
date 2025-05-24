import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function CreatorStocks() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const recentTrades = [
    {
      id: '1',
      name: 'Todd McFarlane',
      symbol: 'TMFS',
      lastPrice: 2500,
      change: 125.00,
      percentageChange: 5.2,
      volume: 25,
      lastTraded: '3m ago',
      nextProject: 'Spawn #350'
    },
    {
      id: '2',
      name: 'Jim Lee',
      symbol: 'JLES',
      lastPrice: 2200,
      change: 66.00,
      percentageChange: 3.1,
      volume: 18,
      lastTraded: '1m ago',
      nextProject: 'Batman Special'
    },
    {
      id: '3',
      name: 'Donny Cates',
      symbol: 'DCTS',
      lastPrice: 1800,
      change: -54.00,
      percentageChange: -2.9,
      volume: 15,
      lastTraded: '4m ago',
      nextProject: 'Marvel Exclusive'
    },
    {
      id: '4',
      name: 'Stanley Artgerm Lau',
      symbol: 'ARTS',
      lastPrice: 1500,
      change: 45.00,
      percentageChange: 3.1,
      volume: 20,
      lastTraded: '2m ago',
      nextProject: 'DC Variants'
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Creator Stocks</h2>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">5m delay</span>
        </div>
      </div>

      <div className="space-y-4">
        {recentTrades.map((creator) => (
          <div
            key={creator.id}
            onClick={() => setSelectedCard(selectedCard === creator.id ? null : creator.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === creator.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{creator.name}</h3>
                <p className="text-sm text-gray-400">{creator.symbol} • {creator.volume} trades</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">CC {creator.lastPrice.toLocaleString()}</p>
                <div className="flex items-center justify-end space-x-1">
                  {creator.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ${creator.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {creator.change > 0 ? '+' : ''}{creator.percentageChange}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="bg-indigo-900/50 px-2 py-1 rounded text-xs text-indigo-200">
                Next: {creator.nextProject}
              </div>
              <span className="text-xs text-gray-400">{creator.lastTraded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}