import React from 'react';
import { Building2, TrendingUp, TrendingDown, Star } from 'lucide-react';

export function PublisherHighlight() {
  const publisherData = {
    name: "Marvel Comics",
    image: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=800&h=400&fit=crop",
    metrics: {
      marketCap: 4200000,
      change: 185000,
      percentageChange: 4.6,
      rating: 'Strong Buy',
      tradingVolume: 850000
    },
    highlights: {
      upcomingReleases: 12,
      activeCreators: 85,
      marketShare: 48
    },
    catalysts: [
      'Strong movie pipeline',
      'Digital sales growth',
      'International expansion'
    ]
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Publisher Spotlight</h2>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-200 border border-green-700/50`}>
          {publisherData.metrics.rating}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Image Section */}
        <div className="relative w-1/3">
          <img 
            src={publisherData.image} 
            alt={publisherData.name}
            className="w-full h-40 object-cover rounded-lg shadow-lg"
          />
          {/* Title moved below image */}
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <div className="inline-flex items-center space-x-1 bg-slate-900/90 px-3 py-1 rounded-full">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-white font-medium">{publisherData.name}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-2/3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Market Cap</p>
              <p className="text-sm font-bold text-white">
                CC {publisherData.metrics.marketCap.toLocaleString()}
              </p>
              <div className={`flex items-center space-x-1 ${
                publisherData.metrics.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {publisherData.metrics.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {publisherData.metrics.change >= 0 ? '+' : ''}
                  {publisherData.metrics.percentageChange}%
                </span>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Market Share</p>
              <p className="text-sm font-medium text-white">{publisherData.highlights.marketShare}%</p>
              <p className="text-xs text-gray-400">Industry Leader</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Active Creators</p>
              <p className="text-sm text-white">{publisherData.highlights.activeCreators}</p>
              <p className="text-xs text-gray-400">Top Talent</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
              <p className="text-xs text-gray-400">Upcoming Releases</p>
              <p className="text-sm text-white">{publisherData.highlights.upcomingReleases}</p>
              <p className="text-xs text-gray-400">Next 30 Days</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-white mb-1">Growth Catalysts</p>
            <ul className="grid grid-cols-1 gap-1">
              {publisherData.catalysts.map((catalyst, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center space-x-1">
                  <Star className="h-2.5 w-2.5 text-yellow-400 flex-shrink-0" />
                  <span className="line-clamp-1">{catalyst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}