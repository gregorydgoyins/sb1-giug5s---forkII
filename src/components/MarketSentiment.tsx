import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const mockSentiment = {
  stocks: [
    {
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300',
      rating: 'Strong Buy',
      price: 2500,
      change: 5.2,
      reason: 'High volume, positive news momentum, strong technical indicators'
    },
    {
      symbol: 'TMFS',
      name: 'Todd McFarlane',
      rating: 'Buy',
      price: 1800,
      change: 3.1,
      reason: 'New project announcements, increasing market interest'
    },
    {
      symbol: 'BAT457',
      name: 'Batman #457',
      rating: 'Hold',
      price: 1200,
      change: -1.2,
      reason: 'Market consolidation, awaiting catalysts'
    }
  ],
  bonds: [
    {
      symbol: 'MRVLB',
      name: 'Marvel Entertainment Bond',
      rating: 'Strong Buy',
      yield: 4.8,
      creditRating: 'AAA',
      reason: 'Strong fundamentals, attractive yield'
    },
    {
      symbol: 'DCCB',
      name: 'DC Comics Bond',
      rating: 'Buy',
      yield: 5.2,
      creditRating: 'AAA',
      reason: 'Stable credit metrics, favorable market conditions'
    }
  ],
  options: [
    {
      symbol: 'ASM300C2600',
      name: 'ASM #300 2600 Call',
      rating: 'Strong Buy',
      impliedVol: 35,
      delta: 0.65,
      reason: 'Favorable Greeks, underlying momentum'
    },
    {
      symbol: 'TMFSP1800',
      name: 'TMF 1800 Put',
      rating: 'Hold',
      impliedVol: 28,
      delta: -0.45,
      reason: 'High time decay, neutral market outlook'
    }
  ]
};

export function MarketSentiment() {
  return (
    <div className="space-y-6">
      {/* Stocks Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Stock Ratings</h2>
        <div className="space-y-4">
          {mockSentiment.stocks.map((stock) => (
            <div key={stock.symbol} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{stock.name}</h3>
                  <p className="text-sm text-gray-400">{stock.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  stock.rating === 'Strong Buy' ? 'bg-green-900 text-green-200' :
                  stock.rating === 'Buy' ? 'bg-emerald-900 text-emerald-200' :
                  stock.rating === 'Hold' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-red-900 text-red-200'
                }`}>
                  {stock.rating}
                </span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-white">CC {stock.price.toLocaleString()}</span>
                <span className={`flex items-center ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-300">{stock.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bonds Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Bond Ratings</h2>
        <div className="space-y-4">
          {mockSentiment.bonds.map((bond) => (
            <div key={bond.symbol} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{bond.name}</h3>
                  <p className="text-sm text-gray-400">{bond.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bond.rating === 'Strong Buy' ? 'bg-green-900 text-green-200' :
                  bond.rating === 'Buy' ? 'bg-emerald-900 text-emerald-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {bond.rating}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-sm text-gray-400">Yield</p>
                  <p className="text-white">{bond.yield}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Credit Rating</p>
                  <p className="text-white">{bond.creditRating}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-300">{bond.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Options Ratings</h2>
        <div className="space-y-4">
          {mockSentiment.options.map((option) => (
            <div key={option.symbol} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{option.name}</h3>
                  <p className="text-sm text-gray-400">{option.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  option.rating === 'Strong Buy' ? 'bg-green-900 text-green-200' :
                  option.rating === 'Buy' ? 'bg-emerald-900 text-emerald-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {option.rating}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-sm text-gray-400">Implied Volatility</p>
                  <p className="text-white">{option.impliedVol}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Delta</p>
                  <p className="text-white">{option.delta}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-300">{option.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}