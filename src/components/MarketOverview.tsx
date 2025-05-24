import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { Link } from 'react-router-dom';

export function MarketOverview() {
  const { marketIndex, volatility, distribution } = useMarketStore();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const marketSentiment = marketIndex > 3000000 
    ? { status: 'bullish', color: 'text-green-400' }
    : { status: 'bearish', color: 'text-red-400' };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      {/* Header remains the same */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Conditions</h2>
        </div>
        <div className={`flex items-center space-x-2 ${marketSentiment.color}`}>
          {marketSentiment.status === 'bullish' ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          <span className="font-medium capitalize">{marketSentiment.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Market Index Card */}
        <div 
          onClick={() => setSelectedCard(selectedCard === 'index' ? null : 'index')}
          className={`group relative bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:-translate-y-1 cursor-pointer
            hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] 
            ${selectedCard === 'index' ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
        >
          <div className="relative">
            <p className="text-sm text-gray-400">Index Value</p>
            <p className="text-xl font-bold text-white">CC {marketIndex.toLocaleString()}</p>
            <Link 
              to="/market-index" 
              className="absolute inset-0 z-10"
              aria-label="View market index details"
            ></Link>
          </div>
        </div>

        {/* 24h Volume Card */}
        <div 
          onClick={() => setSelectedCard(selectedCard === 'volume' ? null : 'volume')}
          className={`group relative bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:-translate-y-1 cursor-pointer
            hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
            ${selectedCard === 'volume' ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
        >
          <div className="relative">
            <p className="text-sm text-gray-400">24h Volume</p>
            <p className="text-xl font-bold text-white">CC 12.5M</p>
          </div>
        </div>

        {/* Volatility Card */}
        <div 
          onClick={() => setSelectedCard(selectedCard === 'volatility' ? null : 'volatility')}
          className={`group relative bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:-translate-y-1 cursor-pointer
            hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
            ${selectedCard === 'volatility' ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
        >
          <div className="relative">
            <p className="text-sm text-gray-400">Volatility</p>
            <p className="text-xl font-bold text-white">
              {volatility < 0.4 ? 'Low' : volatility < 0.7 ? 'Medium' : 'High'}
            </p>
          </div>
        </div>
      </div>

      {/* Market Movers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div 
          onClick={() => setSelectedCard(selectedCard === 'gainers' ? null : 'gainers')}
          className={`group relative bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:-translate-y-1 cursor-pointer
            hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
            ${selectedCard === 'gainers' ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
        >
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Top Gainers</h3>
            <div className="space-y-2">
              {[
                { name: 'Amazing Spider-Man #300', change: '+5.2%' },
                { name: 'Batman #457', change: '+3.8%' },
                { name: 'X-Men #141', change: '+2.9%' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-green-400">{item.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Losers */}
        <div 
          onClick={() => setSelectedCard(selectedCard === 'losers' ? null : 'losers')}
          className={`group relative bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 transition-all hover:-translate-y-1 cursor-pointer
            hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
            ${selectedCard === 'losers' ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
        >
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Market Laggards</h3>
            <div className="space-y-2">
              {[
                { name: 'Spawn #1', change: '-2.1%' },
                { name: 'Detective Comics #27', change: '-1.8%' },
                { name: 'Fantastic Four #48', change: '-1.5%' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-red-400">{item.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* View Full Market Index button */}
      <div className="mt-6 text-center">
        <Link 
          to="/market-index"
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <BarChart2 className="h-5 w-5" />
          <span>View Full Market Index</span>
        </Link>
      </div>
    </div>
  );
}