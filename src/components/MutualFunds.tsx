import React, { useState } from 'react';
import { FolderKanban, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function MutualFunds() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const funds = [
    {
      id: '1',
      name: 'Superhero Universe Fund',
      symbol: 'HERO',
      nav: 2500000,
      change: 5.2,
      holdings: ['Marvel', 'DC', 'Image'],
      rating: 'A+',
      description: 'A diversified fund tracking major superhero properties across all publishers. Includes key first appearances, major storylines, and significant character developments.',
      composition: {
        marvel: 40,
        dc: 35,
        image: 15,
        other: 10
      },
      metrics: {
        yearReturn: 15.5,
        volatility: 'Medium',
        sharpeRatio: 1.2,
        beta: 0.85
      }
    },
    {
      id: '2',
      name: 'Golden Age Classics',
      symbol: 'GOLD',
      nav: 5000000,
      change: -1.8,
      holdings: ['Action Comics', 'Detective Comics'],
      rating: 'A',
      description: 'Focused on premium Golden Age comics from 1938-1956. Includes key first appearances, origin stories, and historically significant issues.',
      composition: {
        action: 30,
        detective: 25,
        marvel: 25,
        other: 20
      },
      metrics: {
        yearReturn: 12.8,
        volatility: 'Low',
        sharpeRatio: 1.5,
        beta: 0.65
      }
    },
    {
      id: '3',
      name: 'Modern Age Index',
      symbol: 'MODX',
      nav: 1500000,
      change: 3.5,
      holdings: ['Image', 'Boom', 'Valiant'],
      rating: 'B+',
      description: 'Tracks modern comic performance with focus on emerging publishers and new series. Higher growth potential with increased volatility.',
      composition: {
        image: 35,
        boom: 25,
        valiant: 20,
        other: 20
      },
      metrics: {
        yearReturn: 18.5,
        volatility: 'High',
        sharpeRatio: 0.95,
        beta: 1.25
      }
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FolderKanban className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Mutual Funds</h2>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Info className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {funds.map((fund) => (
          <div
            key={fund.id}
            onClick={() => setSelectedCard(selectedCard === fund.id ? null : fund.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === fund.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{fund.name}</h3>
                <p className="text-sm text-gray-400">{fund.symbol}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-200 border border-indigo-700/50`}>
                {fund.rating}
              </span>
            </div>
            
            <p className="text-sm text-gray-300 mb-4">{fund.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">Net Asset Value</p>
                <p className="text-lg font-bold text-white">CC {fund.nav.toLocaleString()}</p>
                <div className={`flex items-center space-x-1 ${
                  fund.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {fund.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{fund.change >= 0 ? '+' : ''}{fund.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Performance Metrics</p>
                <div className="space-y-1">
                  <p className="text-sm text-white">1Y Return: {fund.metrics.yearReturn}%</p>
                  <p className="text-sm text-white">Volatility: {fund.metrics.volatility}</p>
                  <p className="text-sm text-white">Sharpe: {fund.metrics.sharpeRatio}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-600/50 pt-4">
              <p className="text-sm font-medium text-white mb-2">Fund Composition</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(fund.composition).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 capitalize">{key}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-sm text-white">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}