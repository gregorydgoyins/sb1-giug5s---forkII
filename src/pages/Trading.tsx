import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TradingInterface } from '../components/TradingInterface';
import { MarketSentiment } from '../components/MarketSentiment';
import { MarketActivity } from '../components/MarketActivity';
import { Sparkles, Users, Building2 } from 'lucide-react';

export function Trading() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold text-white mb-6">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate('/trading/options')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Options Trading</h2>
              </div>
              <p className="text-gray-300">
                Trade comic book and creator options with advanced Greeks analysis
              </p>
            </div>

            <div 
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate('/trading/creator-bonds')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Creator Stocks</h2>
              </div>
              <p className="text-gray-300">
                Invest in stocks backed by top comic creators and artists
              </p>
            </div>

            <div 
              className="card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate('/trading/publisher-bonds')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-6 w-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Publisher Bonds</h2>
              </div>
              <p className="text-gray-300">
                Trade bonds from major comic book publishers
              </p>
            </div>
          </div>

          <MarketSentiment />
          
          <TradingInterface 
            symbol="ASM300"
            name="Amazing Spider-Man #300"
            currentPrice={2500}
            type="stock"
            position={{
              quantity: 100,
              averagePrice: 2400
            }}
          />
        </div>

        <div className="space-y-6">
          <MarketActivity />
        </div>
      </div>
    </div>
  );
}