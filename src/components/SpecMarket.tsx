import React, { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import type { SpecListing } from '../types';

const mockListings: SpecListing[] = [
  {
    id: '1',
    title: 'Spider-Man: Beyond the Spider-Verse',
    type: 'movie',
    releaseDate: new Date('2025-03-15'),
    basePrice: 150,
    currentPrice: 175.50,
    volatility: 0.65,
    hypeScore: 85,
    tradingVolume: 25000,
    riskLevel: 'high',
    leverageAvailable: 2,
    creators: [
      { name: 'Phil Lord', role: 'Writer', hypeScore: 90 },
      { name: 'Chris Miller', role: 'Director', hypeScore: 88 }
    ]
  },
  {
    id: '2',
    title: 'Batman: Dark Dynasty #1 (Artgerm Variant)',
    type: 'variant',
    releaseDate: new Date('2024-08-20'),
    basePrice: 45,
    currentPrice: 65.75,
    volatility: 0.45,
    hypeScore: 72,
    tradingVolume: 15000,
    riskLevel: 'moderate',
    leverageAvailable: 3,
    creators: [
      { name: 'Stanley Lau', role: 'Cover Artist', hypeScore: 95 }
    ]
  }
];

export function SpecMarket() {
  const [selectedType, setSelectedType] = useState<string>('all');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-bold font-display">Spec Market</h2>
        </div>
        <select 
          className="text-sm border rounded-lg px-3 py-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Listings</option>
          <option value="movie">Movies</option>
          <option value="tvShow">TV Shows</option>
          <option value="event">Events</option>
          <option value="variant">Variants</option>
        </select>
      </div>

      <div className="space-y-6">
        {mockListings
          .filter(listing => selectedType === 'all' || listing.type === selectedType)
          .map((listing) => (
          <div key={listing.id} className="glass-card p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.type.toUpperCase()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  listing.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  listing.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  listing.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {listing.riskLevel.toUpperCase()}
                </span>
                {listing.leverageAvailable > 1 && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    {listing.leverageAvailable}x
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="font-semibold">CC {listing.currentPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hype Score</p>
                <p className="font-semibold">{listing.hypeScore}/100</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-semibold">{listing.tradingVolume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Release</p>
                <p className="font-semibold">{listing.releaseDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Key Creators</p>
              <div className="flex flex-wrap gap-2">
                {listing.creators.map((creator) => (
                  <div 
                    key={creator.name}
                    className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                  >
                    {creator.name} ({creator.hypeScore})
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 rounded-lg transition-colors">
                Long Position
              </button>
              <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition-colors">
                Short Position
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}