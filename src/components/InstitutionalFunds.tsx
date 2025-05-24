import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function InstitutionalFunds() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const funds = [
    {
      id: '1',
      name: 'Blue Chip Comic Index Fund',
      symbol: 'BCIF',
      nav: 5000000,
      change: 3.2,
      holdings: ['Action Comics', 'Detective Comics', 'Amazing Fantasy'],
      rating: 'AAA',
      description: 'Tracks the performance of the most valuable and historically significant comic books. Focus on Golden and Silver Age keys with proven long-term appreciation.',
      composition: {
        golden: 45,
        silver: 35,
        bronze: 15,
        modern: 5
      },
      metrics: {
        yearReturn: 12.5,
        volatility: 'Low',
        sharpeRatio: 1.8,
        beta: 0.65,
        minimumInvestment: 500000
      }
    },
    {
      id: '2',
      name: 'Publisher Growth Fund',
      symbol: 'PGRF',
      nav: 3500000,
      change: 4.8,
      holdings: ['Marvel', 'DC', 'Image'],
      rating: 'AA+',
      description: 'Strategic investment in major comic book publishers and their intellectual property portfolios. Capitalizes on media adaptations and franchise expansions.',
      composition: {
        marvel: 40,
        dc: 35,
        image: 15,
        independent: 10
      },
      metrics: {
        yearReturn: 15.8,
        volatility: 'Medium',
        sharpeRatio: 1.4,
        beta: 0.95,
        minimumInvestment: 250000
      }
    },
    {
      id: '3',
      name: 'Creator Excellence Portfolio',
      symbol: 'CEXF',
      nav: 2800000,
      change: 5.5,
      holdings: ['Top Artists', 'Writers', 'Creative Teams'],
      rating: 'AA',
      description: 'Focused on top-tier comic creators with proven track records. Includes established veterans and rising stars with significant market influence.',
      composition: {
        artists: 40,
        writers: 35,
        teams: 25
      },
      metrics: {
        yearReturn: 18.2,
        volatility: 'Medium-High',
        sharpeRatio: 1.2,
        beta: 1.15,
        minimumInvestment: 350000
      }
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Institutional Funds</h2>
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
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
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

            <div className="grid grid-cols-2 gap-6 mb-4">
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
                <p className="text-sm text-gray-400">Key Metrics</p>
                <div className="space-y-1">
                  <p className="text-sm text-white">1Y Return: {fund.metrics.yearReturn}%</p>
                  <p className="text-sm text-white">Volatility: {fund.metrics.volatility}</p>
                  <p className="text-sm text-white">Sharpe: {fund.metrics.sharpeRatio}</p>
                  <p className="text-sm text-white">Beta: {fund.metrics.beta}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-600/50 pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">Portfolio Composition</p>
                <p className="text-sm text-indigo-400">
                  Min Investment: CC {fund.metrics.minimumInvestment.toLocaleString()}
                </p>
              </div>
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