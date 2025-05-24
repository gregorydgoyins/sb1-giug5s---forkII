import React from 'react';
import { User, TrendingUp, TrendingDown, Star } from 'lucide-react';

export function PlayerSpotlight() {
  const playerData = {
    name: "Sarah Chen",
    // Updated to a square, professional avatar image
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop",
    portfolio: {
      totalValue: 2850000,
      dayChange: 125000,
      percentageChange: 4.6,
      rating: 'Top Performer',
      trades: 28
    },
    highlights: {
      bestTrade: {
        asset: 'Amazing Spider-Man #300',
        return: 32
      },
      topHolding: {
        name: 'Marvel Entertainment Bond',
        allocation: 25
      },
      strategy: 'Growth & Value'
    },
    recentMoves: [
      'Increased Golden Age exposure',
      'New position in DC bonds',
      'Hedged with options'
    ]
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white font-display">Player Spotlight</h2>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-200 border border-indigo-700/50`}>
          {playerData.portfolio.rating}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Image Section - Updated for square aspect ratio and center focus */}
        <div className="relative w-1/3">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={playerData.image} 
              alt={playerData.name}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-2 left-2 bg-slate-900/90 px-2 py-0.5 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-white font-medium">{playerData.name}</span>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="w-2/3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Portfolio Value</p>
              <p className="text-sm font-bold text-white">
                CC {playerData.portfolio.totalValue.toLocaleString()}
              </p>
              <div className={`flex items-center space-x-1 ${
                playerData.portfolio.dayChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {playerData.portfolio.dayChange >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {playerData.portfolio.dayChange >= 0 ? '+' : ''}
                  {playerData.portfolio.percentageChange}%
                </span>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Best Trade</p>
              <p className="text-sm text-white">{playerData.highlights.bestTrade.asset}</p>
              <p className="text-xs text-green-400">+{playerData.highlights.bestTrade.return}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Top Holding</p>
              <p className="text-sm text-white">{playerData.highlights.topHolding.name}</p>
              <p className="text-xs text-gray-400">{playerData.highlights.topHolding.allocation}% allocation</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Trading Activity</p>
              <p className="text-sm text-white">{playerData.portfolio.trades} trades today</p>
              <p className="text-xs text-gray-400">{playerData.highlights.strategy}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-white mb-1">Recent Moves</p>
            <ul className="grid grid-cols-1 gap-1">
              {playerData.recentMoves.map((move, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center space-x-1">
                  <Star className="h-2.5 w-2.5 text-yellow-400 flex-shrink-0" />
                  <span className="line-clamp-1">{move}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}