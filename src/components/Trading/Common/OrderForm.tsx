'use client';

import React, { useState, useEffect } from 'react';
import type { Order } from '../types';

interface OrderFormProps {
  type: 'market' | 'limit';
  onTypeChange: (type: 'market' | 'limit') => void;
  onSubmit: (order: Order) => Promise<void>;
}

export function OrderForm({ type, onTypeChange, onSubmit }: OrderFormProps) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState<'buy' | 'sell' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!side || !quantity) return;

    const order: Order = {
      type,
      side,
      asset: 'ASM300', // Replace with actual asset
      quantity: Number(quantity),
      price: type === 'limit' ? Number(price) : undefined,
      total: Number(quantity) * (type === 'limit' ? Number(price) : 0),
      timestamp: new Date()
    };

    await onSubmit(order);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onTypeChange('market')}
            className={`p-2 rounded-lg font-medium transition-colors ${
              type === 'market'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('limit')}
            className={`p-2 rounded-lg font-medium transition-colors ${
              type === 'limit'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300'
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
          placeholder="Enter quantity"
        />
      </div>

      {type === 'limit' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Limit Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            placeholder="Enter limit price"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!side || !quantity}
        className={`w-full p-4 rounded-lg font-medium transition-colors ${
          !side || !quantity
            ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
            : side === 'buy'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {side === 'buy' ? 'Place Buy Order' : side === 'sell' ? 'Place Sell Order' : 'Select Order Type'}
      </button>
    </form>
  );
}