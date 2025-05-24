import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OrderBookProps {
  symbol: string;
}

interface OrderLevel {
  price: number;
  quantity: number;
  total: number;
}

export function OrderBook({ symbol }: OrderBookProps) {
  // Mock order book data
  const generateOrderBook = (basePrice: number): { asks: OrderLevel[], bids: OrderLevel[] } => {
    const asks: OrderLevel[] = [];
    const bids: OrderLevel[] = [];
    
    // Generate 10 ask levels (sell orders)
    for (let i = 1; i <= 10; i++) {
      const price = basePrice * (1 + (i * 0.005));
      const quantity = Math.floor(Math.random() * 50) + 10;
      asks.push({
        price,
        quantity,
        total: price * quantity
      });
    }
    
    // Generate 10 bid levels (buy orders)
    for (let i = 1; i <= 10; i++) {
      const price = basePrice * (1 - (i * 0.005));
      const quantity = Math.floor(Math.random() * 50) + 10;
      bids.push({
        price,
        quantity,
        total: price * quantity
      });
    }
    
    // Sort asks ascending, bids descending
    asks.sort((a, b) => a.price - b.price);
    bids.sort((a, b) => b.price - a.price);
    
    return { asks, bids };
  };
  
  // Get base price for the symbol
  const getBasePrice = () => {
    const prices = {
      'ASM300': 2500,
      'BAT457': 1800,
      'TMFS': 1850,
      'DCCP': 3500,
      'MRVL': 4200
    };
    return prices[symbol] || 2000;
  };
  
  const { asks, bids } = generateOrderBook(getBasePrice());
  const spread = asks[0].price - bids[0].price;
  const spreadPercentage = (spread / asks[0].price) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asks (Sell Orders) */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingDown className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Sell Orders (Asks)</h3>
          </div>
          <div className="bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-600/50">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/50">
                {asks.map((level, index) => (
                  <tr key={index} className="hover:bg-slate-700/30">
                    <td className="px-4 py-2 text-sm text-red-400">{level.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-right">{level.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-right">{level.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bids (Buy Orders) */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Buy Orders (Bids)</h3>
          </div>
          <div className="bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-600/50">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/50">
                {bids.map((level, index) => (
                  <tr key={index} className="hover:bg-slate-700/30">
                    <td className="px-4 py-2 text-sm text-green-400">{level.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-right">{level.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 text-right">{level.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Spread</p>
            <p className="text-lg font-semibold text-white">CC {spread.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({spreadPercentage.toFixed(2)}%)</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Volume</p>
            <p className="text-lg font-semibold text-white">CC {(Math.random() * 1000000 + 500000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Trade</p>
            <p className="text-lg font-semibold text-white">CC {getBasePrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}