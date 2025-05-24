'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, AlertCircle, ExternalLink, Shield } from 'lucide-react';
import { useNewsData } from '@/hooks/useNewsData';
import { LoadingState } from '@/app/loading-state';
import { SecurityLink } from '../links/SecurityLink';

const TRUSTED_SOURCES = [
  { id: 'bloomberg', name: 'Bloomberg', verified: true },
  { id: 'reuters', name: 'Reuters', verified: true },
  { id: 'wsj', name: 'Wall Street Journal', verified: true },
  { id: 'ft', name: 'Financial Times', verified: true }
];

export function NewsBar() {
  const { data: news, isLoading, error } = useNewsData();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 15 * 60 * 1000); // Update every 15 minutes

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border-b border-slate-700/50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border-b border-red-700/50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-red-200">
            <AlertCircle className="h-5 w-5" />
            <span>Unable to load news feed</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Newspaper className="h-5 w-5" />
                <span className="font-medium">Market News</span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {TRUSTED_SOURCES.map(source => (
                  <div key={source.id} className="flex items-center space-x-1">
                    {source.verified && (
                      <Shield className="h-4 w-4 text-green-400" />
                    )}
                    <span className="text-gray-300 text-sm">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <a 
                href="https://www.bloomberg.com/markets" 
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span className="text-sm">More News</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-2 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {news?.map((item: any) => (
                <div 
                  key={item.id}
                  className="inline-flex items-center space-x-4 px-4"
                >
                  <span className={`h-2 w-2 rounded-full ${
                    item.impact === 'positive' ? 'bg-green-400' :
                    item.impact === 'negative' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <span className="text-sm text-gray-300">
                    {item.relatedSecurity ? (
                      <SecurityLink
                        type={item.relatedSecurity.type}
                        symbol={item.relatedSecurity.symbol}
                        name={item.title}
                      />
                    ) : (
                      item.title
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}