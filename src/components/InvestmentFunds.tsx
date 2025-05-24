import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

export function InvestmentFunds() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const funds = [
    {
      id: '1',
      name: 'Villain Collection Fund',
      symbol: 'VILL',
      nav: 2200000,
      change: 4.8,
      focus: 'Antagonist Issues',
      risk: 'High'
    },
    {
      id: '2',
      name: 'Creator Focus Fund',
      symbol: 'CRTF',
      nav: 2800000,
      change: -2.1,
      focus: 'Top Creators',
      risk: 'Medium'
    },
    {
      id: '3',
      name: 'Publisher Index Fund',
      symbol: 'PUBX',
      nav: 3500000,
      change: 3.2,
      focus: 'Major Publishers',
      risk: 'Low'
    }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Investment Funds</h2>
        </div>
      </div>

      <div className="space-y-4">
        {funds.map((fund) => (
          <div
            key={fund.id}
            onClick={() => setSelectedCard(selectedCard === fund.id ? null : fund.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === fund.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{fund.name}</h3>
                <p className="text-sm text-gray-400">{fund.symbol}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                fund.risk === 'High' ? 'bg-red-900/50 text-red-200 border border-red-700/50' :
                fund.risk === 'Medium' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50' :
                'bg-green-900/50 text-green-200 border border-green-700/50'
              }`}>
                {fund.risk} Risk
              </span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm font-semibold text-white">
                CC {fund.nav.toLocaleString()}
              </p>
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
          </div>
        ))}
      </div>
    </div>
  );
}