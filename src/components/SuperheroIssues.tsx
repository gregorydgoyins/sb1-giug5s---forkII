import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export function SuperheroIssues() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const recentTrades = [
    {
      id: '1',
      title: 'Amazing Spider-Man #300',
      lastPrice: 2500,
      change: 125.50,
      percentageChange: 5.2,
      volume: 12,
      lastTraded: '4m ago'
    },
    {
      id: '2',
      title: 'Batman #457',
      lastPrice: 1800,
      change: -45.75,
      percentageChange: -2.5,
      volume: 8,
      lastTraded: '2m ago'
    },
    {
      id: '3',
      title: 'X-Men #141',
      lastPrice: 3200,
      change: 96.00,
      percentageChange: 3.1,
      volume: 15,
      lastTraded: '1m ago'
    },
    {
      id: '4',
      title: 'Spawn #1',
      lastPrice: 1200,
      change: -24.00,
      percentageChange: -2.0,
      volume: 10,
      lastTraded: '5m ago'
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Superhero Issues</h2>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">5m delay</span>
        </div>
      </div>

      <div className="space-y-4">
        {recentTrades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => setSelectedCard(selectedCard === trade.id ? null : trade.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === trade.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{trade.title}</h3>
                <p className="text-sm text-gray-400">Volume: {trade.volume} trades</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">CC {trade.lastPrice.toLocaleString()}</p>
                <div className="flex items-center justify-end space-x-1">
                  {trade.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ${trade.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.change > 0 ? '+' : ''}{trade.percentageChange}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-400">{trade.lastTraded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}