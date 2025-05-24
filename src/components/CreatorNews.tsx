import React from 'react';
import { Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

interface CreatorNewsProps {
  symbol?: string;
}

const mockNews = [
  {
    id: '1',
    title: 'New Spawn Project Announced',
    impact: 'positive',
    timestamp: '2h ago',
    summary: 'Todd McFarlane reveals plans for groundbreaking new Spawn series'
  },
  {
    id: '2',
    title: 'Record-Breaking Art Sale',
    impact: 'positive',
    timestamp: '4h ago',
    summary: 'Original Spider-Man artwork sells for unprecedented amount'
  },
  {
    id: '3',
    title: 'Convention Appearance Schedule',
    impact: 'neutral',
    timestamp: '6h ago',
    summary: 'Upcoming appearances at major comic conventions announced'
  }
];

export function CreatorNews({ symbol }: CreatorNewsProps) {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Newspaper className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
      </div>
      <div className="space-y-4">
        {mockNews.map((item) => (
          <div key={item.id} className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.impact === 'positive' ? 'bg-green-900 text-green-200' :
                item.impact === 'negative' ? 'bg-red-900 text-red-200' :
                'bg-slate-700 text-gray-200'
              }`}>
                {item.impact}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.summary}</p>
            <p className="text-xs text-gray-500 mt-2">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}