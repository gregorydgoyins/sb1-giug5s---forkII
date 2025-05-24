'use client';

import React from 'react';
import type { OrderBook as OrderBookType } from '../types';

interface OrderBookProps {
  data?: OrderBookType;
}

export function OrderBook({ data }: OrderBookProps) {
  if (!data) {
    return (
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <p className="text-gray-400 text-center">No order book data available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
      <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
      <div className="space-y-4">
        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          {data.asks.map((level, index) => (
            <div key={`ask-${index}`} className="flex justify-between text-sm">
              <span className="text-red-400">{level.price.toFixed(2)}</span>
              <span className="text-gray-300">{level.quantity}</span>
              <span className="text-gray-400">{level.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="border-t border-b border-slate-600/50 py-2 text-center text-sm text-gray-400">
          Spread: {((data.asks[0]?.price || 0) - (data.bids[0]?.price || 0)).toFixed(2)}
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {data.bids.map((level, index) => (
            <div key={`bid-${index}`} className="flex justify-between text-sm">
              <span className="text-green-400">{level.price.toFixed(2)}</span>
              <span className="text-gray-300">{level.quantity}</span>
              <span className="text-gray-400">{level.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}