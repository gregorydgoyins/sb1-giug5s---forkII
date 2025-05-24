'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNewsData } from '@/hooks/useNewsData';
import { TrendingUp, TrendingDown, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { SecurityLink } from '../links/SecurityLink';

export function MarketNewsBar() {
  const { data: news, isLoading } = useNewsData();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [speed, setSpeed] = useState(1);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.style.animationDuration = `${30 / speed}s`;
    }
  }, [speed]);

  if (isLoading || !news?.length) {
    return null;
  }

  const getImpactStyles = (impact: string) => {
    const styles = {
      positive: {
        dot: 'bg-[#00C853]',
        text: 'text-[#00C853]',
        bg: 'bg-green-900/20'
      },
      negative: {
        dot: 'bg-[#D50000]',
        text: 'text-[#D50000]',
        bg: 'bg-red-900/20'
      },
      neutral: {
        dot: 'bg-[#FFD600]',
        text: 'text-[#FFD600]',
        bg: 'bg-yellow-900/20'
      }
    };
    return styles[impact as keyof typeof styles] || styles.neutral;
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div 
      className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50"
      role="complementary"
      aria-label="Market News Ticker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 flex items-center justify-between">
          <div className="flex-1 overflow-hidden relative">
            <div 
              ref={tickerRef}
              className={`flex whitespace-nowrap ${!isPaused ? 'animate-marquee' : ''}`}
              style={{ animationDuration: `${30 / speed}s` }}
            >
              {news.map((item) => (
                <div 
                  key={item.id}
                  className={`inline-flex items-center space-x-4 px-4 py-1 mx-2 rounded-lg ${
                    getImpactStyles(item.impact).bg
                  }`}
                  role="article"
                >
                  <span 
                    className={`h-2 w-2 rounded-full ${getImpactStyles(item.impact).dot}`}
                    aria-hidden="true"
                  />
                  <div className="flex items-center space-x-2">
                    {item.relatedSecurity ? (
                      <SecurityLink
                        type={item.relatedSecurity.type}
                        symbol={item.relatedSecurity.symbol}
                        name={item.title}
                        className={`text-[16px] font-medium text-white hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
                      />
                    ) : (
                      <span className="text-[16px] font-medium text-white">
                        {item.title}
                      </span>
                    )}
                    {item.impact === 'positive' ? (
                      <TrendingUp className={`h-4 w-4 ${getImpactStyles(item.impact).text}`} />
                    ) : item.impact === 'negative' ? (
                      <TrendingDown className={`h-4 w-4 ${getImpactStyles(item.impact).text}`} />
                    ) : null}
                    <span className="text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4 border-l border-slate-700/50 pl-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSpeed(speed === 1 ? 0.5 : speed === 0.5 ? 2 : 1)}
                className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Current speed: ${speed}x. Click to change.`}
              >
                {speed}x
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isPaused ? 'Resume news ticker' : 'Pause news ticker'}
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isMuted ? 'Enable sound' : 'Disable sound'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}