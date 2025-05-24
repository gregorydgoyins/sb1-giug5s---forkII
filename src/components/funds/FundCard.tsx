import React from 'react';
import { LineChart, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Fund } from '../../types';

interface FundCardProps {
  fund: Fund;
  onSelect: (fundId: string) => void;
}

export function FundCard({ fund, onSelect }: FundCardProps) {
  const getRiskColor = (risk: number) => {
    if (risk <= 2) return 'bg-green-900/50 text-green-200 border-green-700/50';
    if (risk <= 3) return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
    if (risk <= 4) return 'bg-orange-900/50 text-orange-200 border-orange-700/50';
    return 'bg-red-900/50 text-red-200 border-red-700/50';
  };

  return (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 hover:bg-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{fund.name}</h3>
          <p className="text-sm text-gray-400">{fund.symbol}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(fund.metrics.riskRating)}`}>
          Risk: {fund.metrics.riskRating}/5
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">NAV</p>
          <p className="text-lg font-bold text-white">{formatCurrency(fund.nav)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">YTD Return</p>
          <div className="flex items-center">
            {fund.metrics.historicalReturns.oneYear >= 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-lg font-bold text-green-400">
                  +{fund.metrics.historicalReturns.oneYear}%
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-lg font-bold text-red-400">
                  {fund.metrics.historicalReturns.oneYear}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-white">Fund Composition</h4>
          <button className="text-indigo-400 hover:text-indigo-300">
            <Info className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(fund.metrics.ageDistribution).map(([age, weight]) => (
            <div key={age} className="flex justify-between items-center">
              <span className="text-sm text-gray-400 capitalize">{age}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
                <span className="text-sm text-white">{(weight * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Min Investment</p>
          <p className="font-medium text-white">{formatCurrency(fund.minInvestment)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Management Fee</p>
          <p className="font-medium text-white">{(fund.managementFee * 100).toFixed(2)}%</p>
        </div>
      </div>

      <button
        onClick={() => onSelect(fund.id)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        View Details
      </button>
    </div>
  );
}