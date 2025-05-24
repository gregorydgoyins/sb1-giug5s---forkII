import React, { useState } from 'react';
import { FundCard } from './FundCard';
import { FolderKanban } from 'lucide-react';
import type { Fund } from '../../types';

const mockFunds: Fund[] = [
  {
    id: 'CRTF',
    name: 'Creator Fund',
    symbol: 'CRTF',
    type: 'creator',
    nav: 2500000,
    holdings: [
      { asset: 'Todd McFarlane', weight: 0.15, marketPrice: 2500, quantity: 100 },
      { asset: 'Jim Lee', weight: 0.12, marketPrice: 1800, quantity: 150 },
      { asset: 'Stanley Artgerm Lau', weight: 0.10, marketPrice: 3200, quantity: 75 }
    ],
    metrics: {
      volatility: 0.15,
      liquidity: 0.85,
      concentration: 0.15,
      riskRating: 2,
      ageDistribution: {
        golden: 0.20,
        silver: 0.30,
        bronze: 0.25,
        copper: 0.15,
        modern: 0.10
      },
      gradeDistribution: {
        '9.8': 0.10,
        '9.6': 0.20,
        '9.4': 0.30,
        '9.2': 0.25,
        '9.0': 0.15
      },
      sharpeRatio: 1.2,
      historicalReturns: {
        oneYear: 15.5,
        threeYear: 45.2,
        fiveYear: 75.8
      }
    },
    minInvestment: 10000,
    managementFee: 0.015
  },
  {
    id: 'PUBF',
    name: 'Publisher Fund',
    symbol: 'PUBF',
    type: 'publisher',
    nav: 5000000,
    holdings: [
      { asset: 'Marvel Entertainment', weight: 0.35, marketPrice: 45000, quantity: 25 },
      { asset: 'DC Comics', weight: 0.30, marketPrice: 42000, quantity: 30 },
      { asset: 'Image Comics', weight: 0.20, marketPrice: 38000, quantity: 20 }
    ],
    metrics: {
      volatility: 0.12,
      liquidity: 0.90,
      concentration: 0.20,
      riskRating: 1,
      ageDistribution: {
        golden: 0.30,
        silver: 0.25,
        bronze: 0.20,
        copper: 0.15,
        modern: 0.10
      },
      gradeDistribution: {
        '9.8': 0.15,
        '9.6': 0.25,
        '9.4': 0.30,
        '9.2': 0.20,
        '9.0': 0.10
      },
      sharpeRatio: 1.5,
      historicalReturns: {
        oneYear: 12.8,
        threeYear: 38.5,
        fiveYear: 65.2
      }
    },
    minInvestment: 25000,
    managementFee: 0.012
  }
];

export function FundCatalog() {
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleFundSelect = (fundId: string) => {
    // Implement fund selection logic
    console.log('Selected fund:', fundId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FolderKanban className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Investment Funds</h2>
        </div>
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
        >
          <option value="all">All Funds</option>
          <option value="creator">Creator Funds</option>
          <option value="publisher">Publisher Funds</option>
          <option value="option">Option Funds</option>
          <option value="superhero">Superhero Funds</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFunds
          .filter(fund => selectedType === 'all' || fund.type === selectedType)
          .map(fund => (
            <FundCard
              key={fund.id}
              fund={fund}
              onSelect={handleFundSelect}
            />
          ))}
      </div>
    </div>
  );
}