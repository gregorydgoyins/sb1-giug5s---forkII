import React, { useState } from 'react';
import { DollarSign, BarChart2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { OrderEntry } from './OrderEntry';
import { OrderBook } from './OrderBook';

interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

const mockPositions: Position[] = [
  {
    symbol: 'ASM300',
    quantity: 100,
    entryPrice: 2400,
    currentPrice: 2500,
    pnl: 10000,
    pnlPercentage: 4.17
  },
  {
    symbol: 'TMFS',
    quantity: 50,
    entryPrice: 1800,
    currentPrice: 1850,
    pnl: 2500,
    pnlPercentage: 2.78
  }
];

export function TradingDesk() {
  const { userBalance } = useMarketStore();
  const [selectedSymbol, setSelectedSymbol] = useState('ASM300');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Entry Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Order Entry</h2>
          </div>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
            CC {userBalance.toLocaleString()}
          </div>
        </div>

        <OrderEntry 
          symbol={selectedSymbol}
          onSymbolChange={setSelectedSymbol}
        />
      </div>

      {/* Positions & P&L Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Positions & P&L</h2>
          </div>
        </div>

        <div className="space-y-4">
          {mockPositions.map((position) => (
            <div key={position.symbol} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{position.symbol}</h3>
                  <p className="text-sm text-gray-400">{position.quantity} shares</p>
                </div>
                <div className={`flex items-center ${
                  position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.pnl >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{position.pnl >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Entry Price</p>
                  <p className="text-white">CC {position.entryPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Price</p>
                  <p className="text-white">CC {position.currentPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Market Value</p>
                  <p className="text-white">CC {(position.quantity * position.currentPrice).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Unrealized P&L</p>
                  <p className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {position.pnl >= 0 ? '+' : ''}CC {position.pnl.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                  onClick={() => setSelectedSymbol(position.symbol)}
                >
                  Add to Position
                </button>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
                  onClick={() => setSelectedSymbol(position.symbol)}
                >
                  Close Position
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Book */}
      <div className="card lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Order Book: {selectedSymbol}</h2>
          </div>
        </div>

        <OrderBook symbol={selectedSymbol} />
      </div>
    </div>
  );
}