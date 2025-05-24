'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useTradingContext } from '../context/TradingContext';

export function AssetSelector() {
  const { currentAsset, setCurrentAsset } = useTradingContext();

  const mockAssets = [
    { symbol: 'ASM300', name: 'Amazing Spider-Man #300' },
    { symbol: 'BAT457', name: 'Batman #457' },
    { symbol: 'TMFS', name: 'Todd McFarlane Stock' }
  ];

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search assets..."
          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-1">
        {mockAssets.map(asset => (
          <button
            key={asset.symbol}
            onClick={() => setCurrentAsset(asset.symbol)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentAsset === asset.symbol
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{asset.name}</span>
              <span className="text-sm text-gray-400">{asset.symbol}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}