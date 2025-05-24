import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { CreatorLink } from './CreatorLink';

interface RelatedCreatorsProps {
  symbol?: string;
}

const mockRelated = [
  {
    id: '1',
    name: 'Greg Capullo',
    symbol: 'GCPS',
    role: 'Artist',
    price: 1800.00,
    change: 45.50,
    percentageChange: 2.6
  },
  {
    id: '2',
    name: 'Erik Larsen',
    symbol: 'ELRS',
    role: 'Artist/Writer',
    price: 1500.00,
    change: -25.75,
    percentageChange: -1.7
  },
  {
    id: '3',
    name: 'Jim Lee',
    symbol: 'JLES',
    role: 'Artist',
    price: 2200.00,
    change: 65.25,
    percentageChange: 3.1
  }
];

export function RelatedCreators({ symbol }: RelatedCreatorsProps) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Related Creators</h2>
      </div>

      <div className="space-y-4">
        {mockRelated.map((creator) => (
          <div key={creator.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <CreatorLink symbol={creator.symbol} className="font-semibold text-white hover:text-indigo-400">
                  {creator.name}
                </CreatorLink>
                <p className="text-sm text-gray-400">{creator.symbol} • {creator.role}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">CC {creator.price.toLocaleString()}</p>
                <div className="flex items-center justify-end space-x-1">
                  {creator.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ${
                    creator.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {creator.change > 0 ? '+' : ''}{creator.percentageChange}%
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/creator/${creator.symbol}`)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}