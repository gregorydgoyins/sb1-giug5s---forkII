'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface NewsSourceDropdownProps {
  activeSource: string | null;
  onSourceSelect: (source: string) => void;
}

const NEWS_SOURCES = [
  {
    id: 'financial',
    name: 'Financial News',
    url: '/news/financial',
    headlines: [
      { id: '1', title: 'Market Rally Continues', impact: 'high', url: '/news/financial/market-rally' },
      { id: '2', title: 'New Trading Records Set', impact: 'medium', url: '/news/financial/trading-records' }
    ]
  },
  {
    id: 'industry',
    name: 'Industry Updates',
    url: '/news/industry',
    headlines: [
      { id: '3', title: 'Publisher Merger Announced', impact: 'high', url: '/news/industry/publisher-merger' },
      { id: '4', title: 'Distribution Changes', impact: 'medium', url: '/news/industry/distribution' }
    ]
  },
  {
    id: 'market',
    name: 'Market Analysis',
    url: '/news/market',
    headlines: [
      { id: '5', title: 'Trading Volume Spikes', impact: 'medium', url: '/news/market/volume-spikes' },
      { id: '6', title: 'Price Trends Analysis', impact: 'low', url: '/news/market/price-trends' }
    ]
  }
];

export function NewsSourceDropdown({ activeSource, onSourceSelect }: NewsSourceDropdownProps) {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
        <span>Select Source</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {NEWS_SOURCES.map(source => (
          <div 
            key={source.id}
            className="p-4 hover:bg-slate-700/50 transition-colors"
          >
            <div className="mb-2">
              <button
                onClick={() => onSourceSelect(source.id)}
                className="w-full text-left"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white hover:text-indigo-400 underline decoration-2 underline-offset-2 transition-colors">
                    {source.name}
                  </h3>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </button>
            </div>
            
            <div className="space-y-2">
              {source.headlines.map(headline => (
                <Link 
                  key={headline.id}
                  href={headline.url}
                  className="flex items-start space-x-2 group"
                >
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${
                    headline.impact === 'high' ? 'bg-red-400' :
                    headline.impact === 'medium' ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`} />
                  <p className="text-sm text-gray-300 group-hover:text-indigo-400 transition-colors">
                    {headline.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}