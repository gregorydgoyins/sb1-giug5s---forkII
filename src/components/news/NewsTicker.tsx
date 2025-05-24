'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Pause, Play } from 'lucide-react';
import { useNewsData } from '@/hooks/useNewsData';
import { SecurityLink } from '../links/SecurityLink';

export function NewsTicker() {
  const { data: news, isLoading } = useNewsData();
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPaused && news?.length) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 5000); // Change news every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, news?.length]);

  if (isLoading || !news?.length) {
    return null;
  }

  const currentNews = news[currentIndex];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 flex items-center justify-between">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-4">
              <span className={`h-2 w-2 rounded-full ${
                currentNews.impact === 'positive' ? 'bg-green-400' :
                currentNews.impact === 'negative' ? 'bg-red-400' :
                'bg-yellow-400'
              }`} />
              
              <div className="flex items-center space-x-2">
                {currentNews.relatedSecurity ? (
                  <SecurityLink
                    type={currentNews.relatedSecurity.type}
                    symbol={currentNews.relatedSecurity.symbol}
                    name={currentNews.title}
                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors"
                  />
                ) : (
                  <span className="text-sm text-gray-300">{currentNews.title}</span>
                )}
                {currentNews.impact === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : currentNews.impact === 'negative' ? (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label={isPaused ? 'Resume news ticker' : 'Pause news ticker'}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {news.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}