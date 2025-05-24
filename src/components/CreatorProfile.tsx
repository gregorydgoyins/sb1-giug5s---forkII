import React from 'react';
import { TrendingUp, TrendingDown, Award, BookOpen } from 'lucide-react';

interface CreatorProfileProps {
  symbol?: string;
}

const mockCreator = {
  name: 'Todd McFarlane',
  symbol: 'TMFS',
  role: 'Artist/Writer',
  image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=300&fit=crop',
  bio: `Todd McFarlane is one of the most influential comic book artists of the modern era. As the creator of Spawn and founder of Image Comics, he revolutionized comic book art in the 1990s with his dynamic style and innovative storytelling. His work on Spider-Man redefined the character's visual aesthetic, and his entrepreneurial ventures, including McFarlane Toys, have set industry standards.`,
  currentPrice: 2500.00,
  priceChange: 125.50,
  percentageChange: 5.2,
  yield: 4.8,
  rating: 'Strong Buy',
  notableWorks: [
    'Amazing Spider-Man',
    'Spawn',
    'Venom'
  ],
  awards: [
    'Eisner Award - Best Artist',
    'Harvey Award - Best Artist',
    'Emmy Award - Outstanding Animation'
  ]
};

export function CreatorProfile({ symbol }: CreatorProfileProps) {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img 
            src={mockCreator.image} 
            alt={mockCreator.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{mockCreator.name}</h1>
              <p className="text-gray-400">{mockCreator.symbol} • {mockCreator.role}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">CC {mockCreator.currentPrice.toLocaleString()}</p>
              <div className="flex items-center justify-end space-x-2">
                {mockCreator.priceChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <span className={`${
                  mockCreator.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {mockCreator.priceChange > 0 ? '+' : ''}{mockCreator.percentageChange}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{mockCreator.bio}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Yield</p>
              <p className="text-xl font-bold text-white">{mockCreator.yield}%</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Rating</p>
              <p className="text-xl font-bold text-green-400">{mockCreator.rating}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Notable Works</h3>
              </div>
              <ul className="space-y-1">
                {mockCreator.notableWorks.map((work) => (
                  <li key={work} className="text-gray-300">{work}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Awards</h3>
              </div>
              <ul className="space-y-1">
                {mockCreator.awards.map((award) => (
                  <li key={award} className="text-gray-300">{award}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors">
          Buy Stock
        </button>
        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors">
          Sell Stock
        </button>
      </div>
    </div>
  );
}