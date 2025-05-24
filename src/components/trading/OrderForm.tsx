import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import type { Order } from '../../types';

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (order: Order) => void;
}

export function OrderForm({ symbol, currentPrice, onSubmit }: OrderFormProps) {
  const { userBalance } = useMarketStore();
  const [quantity, setQuantity] = useState<string>('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [side, setSide] = useState<'buy' | 'sell' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = Number(quantity) * (orderType === 'market' ? currentPrice : Number(limitPrice));
  const fees = total * 0.001; // 0.1% trading fee
  const totalWithFees = total + fees;

  const isValidOrder = () => {
    if (!quantity || !side || isSubmitting) return false;
    if (orderType === 'limit' && !limitPrice) return false;
    if (side === 'buy' && totalWithFees > userBalance) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidOrder()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        symbol,
        type: orderType,
        side,
        quantity: Number(quantity),
        price: orderType === 'limit' ? Number(limitPrice) : currentPrice,
        total: totalWithFees
      });

      // Reset form on success
      setQuantity('');
      setLimitPrice('');
      setSide(null);
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setSide('buy')}
          disabled={isSubmitting}
          className={`p-4 rounded-lg font-medium transition-colors ${
            side === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:bg-green-600/20'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide('sell')}
          disabled={isSubmitting}
          className={`p-4 rounded-lg font-medium transition-colors ${
            side === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:bg-red-600/20'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderType('market')}
              disabled={isSubmitting}
              className={`p-2 rounded-lg font-medium transition-colors ${
                orderType === 'market'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType('limit')}
              disabled={isSubmitting}
              className={`p-2 rounded-lg font-medium transition-colors ${
                orderType === 'limit'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            min="0"
            step="1"
            disabled={isSubmitting}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white disabled:opacity-50"
            placeholder="Enter quantity"
          />
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              min="0"
              step="0.01"
              disabled={isSubmitting}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white disabled:opacity-50"
              placeholder="Enter limit price"
            />
          </div>
        )}

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">CC {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Trading Fee (0.1%)</span>
            <span className="text-white">CC {fees.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-600/50">
            <span className="text-gray-400">Total</span>
            <span className="text-white">CC {totalWithFees.toLocaleString()}</span>
          </div>
        </div>

        {side === 'buy' && totalWithFees > userBalance && (
          <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <p className="text-sm text-red-200">
              Insufficient funds. Available balance: CC {userBalance.toLocaleString()}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValidOrder()}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            !isValidOrder() || isSubmitting
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
      </div>
    </form>
  );
}