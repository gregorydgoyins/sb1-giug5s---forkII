'use client';

import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export function PortfolioSection() {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Wallet className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Total Value</p>
          <p className="text-xl font-bold text-white">CC 2,450,000</p>
        </div>
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
          <p className="text-sm text-gray-400">Daily P/L</p>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-green-400 mr-1" />
            <p className="text-xl font-bold text-green-400">+CC 125,000</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Positions</h3>
        <div className="space-y-2">
          {/* Sample position */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">Amazing Spider-Man #300</h4>
                <p className="text-sm text-gray-400">100 shares @ CC 2,400</p>
              </div>
              <div className="text-right">
                <p className="text-white">CC 250,000</p>
                <div className="flex items-center justify-end text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+4.17%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}