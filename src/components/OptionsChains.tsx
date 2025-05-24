import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export function OptionsChains() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const options = [
    {
      id: '1',
      symbol: 'ASM300C',
      type: 'CALL',
      strike: 2600,
      premium: 150,
      change: 12.5,
      volume: 325,
      expiry: '2024-06'
    },
    {
      id: '2',
      symbol: 'TMFSP',
      type: 'PUT',
      strike: 2200,
      premium: 85,
      change: -7.2,
      volume: 250,
      expiry: '2024-06'
    },
    {
      id: '3',
      symbol: 'MRVLC',
      type: 'CALL',
      strike: 3800,
      premium: 220,
      change: 15.8,
      volume: 180,
      expiry: '2024-09'
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Options Chains</h2>
        </div>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedCard(selectedCard === option.id ? null : option.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === option.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{option.symbol}</h3>
                <p className="text-sm text-gray-400">Strike: CC {option.strike}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                option.type === 'CALL' 
                  ? 'bg-green-900/50 text-green-200 border border-green-700/50' 
                  : 'bg-red-900/50 text-red-200 border border-red-700/50'
              }`}>
                {option.type}
              </span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white">
                  Premium: CC {option.premium}
                </p>
                <p className="text-xs text-gray-400">
                  Vol: {option.volume} • Exp: {option.expiry}
                </p>
              </div>
              <div className={`flex items-center space-x-1 ${
                option.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {option.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{option.change >= 0 ? '+' : ''}{option.change}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}