import React from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import type { CreatorBond } from '../types';

const mockBonds: CreatorBond[] = [
  {
    id: '1',
    name: 'Todd McFarlane',
    symbol: 'TMFB',
    role: 'artist',
    price: 2500.00,
    change: 125.00,
    nextProject: 'Spawn #350',
    rating: 'AAA',
    yield: 5.2,
    maturity: '2024-12-31'
  },
  {
    id: '2',
    name: 'Image Comics',
    symbol: 'IMGB',
    role: 'publisher',
    price: 1800.00,
    change: -50.00,
    rating: 'AA',
    yield: 4.8,
    maturity: '2024-12-31'
  },
  {
    id: '3',
    name: 'Jim Lee',
    symbol: 'JLEB',
    role: 'cover',
    price: 3000.00,
    change: 200.00,
    nextProject: 'Batman Special Cover',
    rating: 'AAA',
    yield: 6.1,
    maturity: '2024-12-31'
  }
];

export function TalentBonds() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Creator Bonds</h2>
        </div>
        <select className="text-sm border rounded-lg px-3 py-2">
          <option>All Types</option>
          <option>Writers</option>
          <option>Artists</option>
          <option>Cover Artists</option>
          <option>Publishers</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockBonds.map((bond) => (
          <div key={bond.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{bond.name}</h3>
                <p className="text-sm text-gray-500">{bond.symbol} • {bond.role.toUpperCase()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                bond.rating === 'AAA' ? 'bg-green-100 text-green-800' :
                bond.rating === 'AA' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {bond.rating}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">CC {bond.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Yield</p>
                <p className="font-semibold">{bond.yield}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Change</p>
                <div className="flex items-center space-x-1">
                  {bond.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <p className={`font-semibold ${
                    bond.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {bond.change > 0 ? '+' : ''}{bond.change}
                  </p>
                </div>
              </div>
            </div>

            {bond.nextProject && (
              <div className="mt-4 bg-indigo-50 rounded-lg p-2">
                <p className="text-sm text-indigo-600">Next Project: {bond.nextProject}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}