import React from 'react';
import { Link } from 'react-router-dom';
import { MarketOverview } from './MarketOverview';
import { MarketMetrics } from './MarketMetrics';
import { TrendingStocks } from './TrendingStocks';
import { MarketActivity } from './MarketActivity';
import { MarketSentiment } from './MarketSentiment';
import { BarChart2, LineChart } from 'lucide-react';

export function Markets() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Markets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Link 
          to="/market-index"
          className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart2 className="h-8 w-8 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Market Index</h2>
          </div>
          <p className="text-gray-300 mb-4">Track the overall comic market performance with our comprehensive index spanning all comic book eras.</p>
          <div className="text-indigo-400 font-medium">View Market Index →</div>
        </Link>
        
        <Link 
          to="/price-trends"
          className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3 mb-4">
            <LineChart className="h-8 w-8 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Price Trends</h2>
          </div>
          <p className="text-gray-300 mb-4">Analyze price trends for key comic books across different eras, with historical data and event impact analysis.</p>
          <div className="text-indigo-400 font-medium">View Price Trends →</div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview />
          <MarketMetrics />
          <MarketSentiment />
          <TrendingStocks />
        </div>
        <div className="space-y-6">
          <MarketActivity />
        </div>
      </div>
    </div>
  );
}