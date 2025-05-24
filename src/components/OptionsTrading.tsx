'use client';

import React, { useState } from 'react';
import { Sparkles, Calendar, Info, AlertCircle } from 'lucide-react';
import type { Option, OptionChain } from '@/types';

const mockOptions: OptionChain = {
  underlying: 'Amazing Spider-Man #300',
  currentPrice: 2500,
  expiryDates: ['2024-06-21', '2024-09-20', '2024-12-20'],
  calls: [
    {
      strike: 2600,
      premium: 150,
      volume: 325,
      openInterest: 1200,
      impliedVolatility: 0.35,
      delta: 0.45,
      gamma: 0.15,
      theta: -0.25,
      vega: 0.30,
      expiry: '2024-06-21'
    },
    {
      strike: 2700,
      premium: 100,
      volume: 250,
      openInterest: 850,
      impliedVolatility: 0.38,
      delta: 0.35,
      gamma: 0.18,
      theta: -0.28,
      vega: 0.32,
      expiry: '2024-06-21'
    }
  ],
  puts: [
    {
      strike: 2400,
      premium: 120,
      volume: 275,
      openInterest: 950,
      impliedVolatility: 0.36,
      delta: -0.40,
      gamma: 0.16,
      theta: -0.26,
      vega: 0.31,
      expiry: '2024-06-21'
    },
    {
      strike: 2300,
      premium: 85,
      volume: 200,
      openInterest: 720,
      impliedVolatility: 0.39,
      delta: -0.30,
      gamma: 0.19,
      theta: -0.29,
      vega: 0.33,
      expiry: '2024-06-21'
    }
  ]
};

const mockCreatorOptions: OptionChain = {
  underlying: 'Todd McFarlane Creator Stock',
  currentPrice: 1800,
  expiryDates: ['2024-06-21', '2024-09-20', '2024-12-20'],
  calls: [
    {
      strike: 2000,
      premium: 95,
      volume: 150,
      openInterest: 450,
      impliedVolatility: 0.32,
      delta: 0.40,
      gamma: 0.14,
      theta: -0.22,
      vega: 0.28,
      expiry: '2024-06-21'
    }
  ],
  puts: [
    {
      strike: 1600,
      premium: 75,
      volume: 120,
      openInterest: 380,
      impliedVolatility: 0.34,
      delta: -0.35,
      gamma: 0.15,
      theta: -0.24,
      vega: 0.29,
      expiry: '2024-06-21'
    }
  ]
};

export function OptionsTrading() {
  const [selectedExpiry, setSelectedExpiry] = useState(mockOptions.expiryDates[0]);
  const [showGreeks, setShowGreeks] = useState(false);
  const [selectedType, setSelectedType] = useState<'comic' | 'creator'>('comic');

  const currentChain = selectedType === 'comic' ? mockOptions : mockCreatorOptions;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Options Trading</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
            onChange={(e) => setSelectedType(e.target.value as 'comic' | 'creator')}
            value={selectedType}
          >
            <option value="comic">Comic Options</option>
            <option value="creator">Creator Options</option>
          </select>
          <button 
            onClick={() => setShowGreeks(!showGreeks)}
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showGreeks && (
        <div className="mb-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="font-semibold text-white mb-2">Options Greeks Explained:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-white">Delta (Δ)</p>
              <p className="text-gray-300">Rate of change vs underlying price</p>
            </div>
            <div>
              <p className="font-medium text-white">Gamma (Γ)</p>
              <p className="text-gray-300">Rate of change in delta</p>
            </div>
            <div>
              <p className="font-medium text-white">Theta (Θ)</p>
              <p className="text-gray-300">Time decay effect</p>
            </div>
            <div>
              <p className="font-medium text-white">Vega (v)</p>
              <p className="text-gray-300">Sensitivity to volatility</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-white">{currentChain.underlying}</h3>
            <p className="text-gray-300">Current Price: CC {currentChain.currentPrice.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select 
                className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
              >
                {currentChain.expiryDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-400">Calls</h3>
          <div className="space-y-4">
            {currentChain.calls
              .filter(option => option.expiry === selectedExpiry)
              .map((option, idx) => (
              <div key={`call-${option.strike}-${idx}`} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white">Strike: CC {option.strike.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Premium: CC {option.premium.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    option.strike > currentChain.currentPrice 
                      ? 'bg-orange-900/50 text-orange-200 border border-orange-700/50'
                      : 'bg-green-900/50 text-green-200 border border-green-700/50'
                  }`}>
                    {option.strike > currentChain.currentPrice ? 'OTM' : 'ITM'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="font-medium text-white">{option.volume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Open Interest</p>
                    <p className="font-medium text-white">{option.openInterest.toLocaleString()}</p>
                  </div>
                </div>

                {showGreeks && (
                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <div>
                      <p className="text-gray-400">Δ</p>
                      <p className="font-medium text-white">{option.delta.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Γ</p>
                      <p className="font-medium text-white">{option.gamma.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Θ</p>
                      <p className="font-medium text-white">{option.theta.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">v</p>
                      <p className="font-medium text-white">{option.vega.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Buy Call
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Write Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Puts Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-400">Puts</h3>
          <div className="space-y-4">
            {currentChain.puts
              .filter(option => option.expiry === selectedExpiry)
              .map((option, idx) => (
              <div key={`put-${option.strike}-${idx}`} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white">Strike: CC {option.strike.toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Premium: CC {option.premium.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    option.strike < currentChain.currentPrice 
                      ? 'bg-orange-900/50 text-orange-200 border border-orange-700/50'
                      : 'bg-red-900/50 text-red-200 border border-red-700/50'
                  }`}>
                    {option.strike < currentChain.currentPrice ? 'OTM' : 'ITM'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="font-medium text-white">{option.volume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Open Interest</p>
                    <p className="font-medium text-white">{option.openInterest.toLocaleString()}</p>
                  </div>
                </div>

                {showGreeks && (
                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                    <div>
                      <p className="text-gray-400">Δ</p>
                      <p className="font-medium text-white">{option.delta.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Γ</p>
                      <p className="font-medium text-white">{option.gamma.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Θ</p>
                      <p className="font-medium text-white">{option.theta.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">v</p>
                      <p className="font-medium text-white">{option.vega.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Buy Put
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Write Put
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-900/50 rounded-lg p-4 border border-yellow-700/50">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <p className="text-sm text-yellow-200">
            Options trading involves significant risk. Make sure you understand the Greeks and potential outcomes before trading.
          </p>
        </div>
      </div>
    </div>
  );
}