'use client';

import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const MARKET_EVENTS = [
  {
    id: '1',
    title: 'Major Publisher Announcement',
    type: 'announcement',
    impact: 'high',
    time: '2m ago'
  },
  {
    id: '2',
    title: 'Trading Volume Alert',
    type: 'market',
    impact: 'medium',
    time: '5m ago'
  },
  {
    id: '3',
    title: 'Price Movement Detected',
    type: 'price',
    impact: 'high',
    time: '10m ago'
  }
];

export function MarketEventsList() {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
        <TrendingUp className="h-5 w-5" />
        <span>Market Events</span>
        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {MARKET_EVENTS.length}
        </span>
      </button>

      <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {MARKET_EVENTS.map(event => (
          <div 
            key={event.id}
            className="p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                event.impact === 'high' 
                  ? 'bg-red-900/50 text-red-400' 
                  : 'bg-yellow-900/50 text-yellow-400'
              }`}>
                {event.type === 'price' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{event.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{event.time}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    event.impact === 'high' 
                      ? 'bg-red-900/50 text-red-400 border border-red-700/50' 
                      : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
                  }`}>
                    {event.impact.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}