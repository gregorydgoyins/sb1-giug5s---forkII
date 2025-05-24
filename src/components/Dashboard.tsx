import React from 'react';
import { Link } from 'react-router-dom';
import { MarketOverview } from './MarketOverview';
import { Portfolio } from './Portfolio';
import { NewsSection } from './NewsSection';
import { TrendingStocks } from './TrendingStocks';
import { CreatorBonds } from './CreatorBonds';
import { PublisherBonds } from './PublisherBonds';
import { OptionsTrading } from './OptionsTrading';
import { MarketChart } from './MarketChart';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="hero-card p-8 text-white rounded-xl mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Panel Profits</h1>
        <p className="text-lg text-white/80 mb-6">
          Your gateway to comic book investing and trading. Start building your portfolio today!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/trading"
            className="btn btn-primary"
          >
            Start Trading
          </Link>
          <Link 
            to="/learn"
            className="btn btn-secondary"
          >
            Learn More
          </Link>
          <Link 
            to="/portfolio"
            className="btn btn-primary"
          >
            View Portfolio
          </Link>
        </div>
      </div>

      <MarketOverview />
      
      {/* Market Chart spanning full width */}
      <MarketChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreatorBonds />
            <PublisherBonds />
          </div>
          <OptionsTrading />
          <Portfolio />
          <TrendingStocks />
        </div>
        <div className="space-y-6">
          <NewsSection />
        </div>
      </div>
    </div>
  );
}