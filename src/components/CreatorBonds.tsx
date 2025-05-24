import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCreatorStocks = [
  {
    id: '1',
    name: 'Todd McFarlane',
    symbol: 'TMFS',
    role: 'Artist/Writer',
    price: 2500.00,
    change: 125.00,
    nextProject: 'Spawn #350',
    rating: 'Strong Buy',
    marketCap: 125000000
  },
  {
    id: '2',
    name: 'Donny Cates',
    symbol: 'DCTS',
    role: 'Writer',
    price: 1800.00,
    change: 85.00,
    nextProject: 'Marvel Exclusive',
    rating: 'Buy',
    marketCap: 90000000
  },
  {
    id: '3',
    name: 'Stanley Lau',
    symbol: 'ARTS',
    role: 'Cover Artist',
    price: 1500.00,
    change: -25.00,
    nextProject: 'DC Variants',
    rating: 'Hold',
    marketCap: 75000000
  }
];

export function CreatorBonds() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Creator Stocks</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>All Roles</option>
          <option>Writers</option>
          <option>Artists</option>
          <option>Cover Artists</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockCreatorStocks.map((stock) => (
          <div 
            key={stock.id} 
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-white">{stock.name}</h3>
                <p className="text-sm text-gray-300">{stock.symbol} • {stock.role}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                stock.rating === 'Strong Buy' ? 'bg-green-900 text-green-200' :
                stock.rating === 'Buy' ? 'bg-emerald-900 text-emerald-200' :
                'bg-yellow-900 text-yellow-200'
              }`}>
                {stock.rating}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-semibold text-white">CC {stock.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="font-semibold text-white">CC {(stock.marketCap / 1000000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Change</p>
                <div className="flex items-center space-x-1">
                  {stock.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <p className={`font-semibold ${
                    stock.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.change > 0 ? '+' : ''}{stock.change}
                  </p>
                </div>
              </div>
            </div>

            {stock.nextProject && (
              <div className="mt-4 bg-indigo-900/50 rounded-lg p-2">
                <p className="text-sm text-indigo-200">Next Project: {stock.nextProject}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Link
                to={`/creator/${stock.symbol}`}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}