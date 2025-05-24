import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketDashboard } from '../components/MarketDashboard';
import { TradingDesk } from '../components/TradingDesk';
import { Positions } from '../components/Positions';
import { NewsSection } from '../components/NewsSection';
import { TrendingStocks } from '../components/TrendingStocks';
import { CreatorBonds } from '../components/CreatorBonds';
import { PublisherBonds } from '../components/PublisherBonds';
import { OptionsTrading } from '../components/OptionsTrading';
import { MarketActivity } from '../components/MarketActivity';
import { MutualFunds } from '../components/MutualFunds';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="hero-card p-8 text-white rounded-xl mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Panel Profits</h1>
        <p className="text-lg text-white/80 mb-6">
          Your gateway to comic book investing and trading. Start building your portfolio today!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/trading')}
            className="btn btn-primary"
          >
            Start Trading
          </button>
          <button 
            onClick={() => navigate('/learn')}
            className="btn btn-secondary"
          >
            Learn More
          </button>
          <button 
            onClick={() => navigate('/portfolio')}
            className="btn btn-primary"
          >
            View Portfolio
          </button>
        </div>
      </div>

      <MarketDashboard />
      <TradingDesk />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreatorBonds />
            <PublisherBonds />
          </div>
          <OptionsTrading />
          <Positions />
          <MutualFunds />
          <MarketActivity />
          <TrendingStocks />
        </div>
        <div className="space-y-6">
          <NewsSection />
        </div>
      </div>
    </div>
  );
}