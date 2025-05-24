import React from 'react';
import { Shield, TrendingUp, TrendingDown, Star } from 'lucide-react';

export function SuperheroSpotlight() {
  const spotlightData = {
    name: "Spider-Man",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop",
    origin: {
      issue: "Amazing Fantasy #15",
      date: "August 1962",
      publisher: "Marvel Comics",
      firstAppearanceValue: 3200000
    },
    synopsis: "Peter Parker, a brilliant but shy high school student, gained superhuman abilities after being bitten by a radioactive spider during a science exhibition. Initially using his powers for personal gain, he learned that 'with great power comes great responsibility' following the death of his Uncle Ben, whom he could have prevented being killed.",
    marketMetrics: {
      currentValue: 3500000,
      change: 125000,
      percentageChange: 3.7,
      rating: 'Strong Buy',
      rationale: [
        'Upcoming movie release',
        'Strong collector demand',
        'Limited high-grade copies'
      ]
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Character Spotlight</h2>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          spotlightData.marketMetrics.rating === 'Strong Buy' 
            ? 'bg-green-900/50 text-green-200 border border-green-700/50'
            : 'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50'
        }`}>
          {spotlightData.marketMetrics.rating}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Image Section */}
        <div className="relative w-1/3">
          <img 
            src={spotlightData.image} 
            alt={spotlightData.name}
            className="w-full h-40 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-2 left-2 bg-slate-900/90 px-2 py-0.5 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-white font-medium">{spotlightData.name}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-2/3 space-y-2">
          <div>
            <p className="text-xs text-gray-300 line-clamp-2">{spotlightData.synopsis}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">First Appearance</p>
              <p className="text-sm font-medium text-white">{spotlightData.origin.issue}</p>
              <p className="text-xs text-gray-400">{spotlightData.origin.date}</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Current Value</p>
              <p className="text-sm font-bold text-white">
                CC {spotlightData.marketMetrics.currentValue.toLocaleString()}
              </p>
              <div className={`flex items-center space-x-1 ${
                spotlightData.marketMetrics.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {spotlightData.marketMetrics.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {spotlightData.marketMetrics.change >= 0 ? '+' : ''}
                  {spotlightData.marketMetrics.percentageChange}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-white mb-1">Investment Thesis</p>
            <ul className="grid grid-cols-1 gap-1">
              {spotlightData.marketMetrics.rationale.map((point, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center space-x-1">
                  <Star className="h-2.5 w-2.5 text-yellow-400 flex-shrink-0" />
                  <span className="line-clamp-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}