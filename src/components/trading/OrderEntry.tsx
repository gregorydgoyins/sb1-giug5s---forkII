```typescript
'use client';

import React, { useState } from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { useMarketStore } from '@/store/marketStore';
import type { Order } from '@/types';

interface OrderEntryProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
  onSubmit: (order: Order) => Promise<void>;
}

export function OrderEntry({ selectedSymbol, onSymbolChange, onSubmit }: OrderEntryProps) {
  const { userBalance } = useMarketStore();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell' | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!side || !quantity || !selectedSymbol) return;

    setIsSubmitting(true);
    try {
      const order: Order = {
        symbol: selectedSymbol,
        type: orderType,
        side,
        quantity: Number(quantity),
        price: orderType === 'limit' ? Number(price) : undefined,
        timeInForce: 'day'
      };

      await onSubmit(order);
      
      // Reset form
      setQuantity('');
      setPrice('');
      setSide(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Order Entry</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Available Balance</p>
          <p className="text-lg font-bold text-white">
            CC {userBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Symbol Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Symbol
          </label>
          <input
            type="text"
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            placeholder="Enter symbol"
            required
          />
        </div>

        {/* Order Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setOrderType('market')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              orderType === 'market'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => setOrderType('limit')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              orderType === 'limit'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Buy/Sell Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-green-600/20'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-red-600/20'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            step="1"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Limit Price Input */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              placeholder="Enter limit price"
              required
            />
          </div>
        )}

        {/* Warning Messages */}
        {side === 'buy' && Number(quantity) * (Number(price) || 0) > userBalance && (
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <p className="text-sm text-red-200">
              Insufficient funds for this order.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!side || !quantity || isSubmitting}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            !side || !quantity || isSubmitting
              ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
              : side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isSubmitting 
            ? 'Processing...' 
            : side === 'buy' 
              ? 'Place Buy Order' 
              : side === 'sell' 
                ? 'Place Sell Order' 
                : 'Select Order Type'}
        </button>
      </form>
    </div>
  );
}
```