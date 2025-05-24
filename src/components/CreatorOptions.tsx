import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { CreatorOption } from '../types';

const mockOptions: CreatorOption[] = [
  {
    id: '1',
    creatorName: 'Todd McFarlane',
    symbol: 'TMFS24',
    strikePrice: 3000.00,
    currentPrice: 150.00,
    expiryDate: '2024-12-31',
    type: 'call',
    underlying: 'Next Batman Project',
    volume: 25000
  },
  {
    id: '2',
    creatorName: 'Donny Cates',
    symbol: 'DCTS24',
    strikePrice: 2500.00,
    currentPrice: 200.00,
    expiryDate: '2024-12-31',
    type: 'call',
    underlying: 'Marvel Exclusive Contract',
    volume: 15000
  },
  {
    id: '3',
    creatorName: 'DC Comics',
    symbol: 'DCCS24',
    strikePrice: 5000.00,
    currentPrice: 175.00,
    expiryDate: '2024-12-31',
    type: 'put',
    underlying: 'Summer Event Performance',
    volume: 35000
  }
];

export function CreatorOptions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Creator Options</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>All Types</option>
          <option>Calls</option>
          <option>Puts</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockOptions.map((option) => (
          <div key={option.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-white">{option.creatorName}</h3>
                <p className="text-sm text-gray-300">{option.symbol}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                option.type === 'call' 
                  ? 'bg-green-900/50 text-green-200 border border-green-700/50' 
                  : 'bg-red-900/50 text-red-200 border border-red-700/50'
              }`}>
                {option.type.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-300 mt-2">{option.underlying}</p>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-400">Strike Price</p>
                <p className="font-semibold text-white">CC {option.strikePrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="font-semibold text-white">CC {option.currentPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Volume</p>
                <p className="font-semibold text-white">{option.volume.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">Expires: {option.expiryDate}</span>
              {option.type === 'call' ? (
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>Long Position</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>Short Position</span>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                Buy {option.type === 'call' ? 'Call' : 'Put'}
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                Write {option.type === 'call' ? 'Call' : 'Put'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}