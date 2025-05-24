import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';

interface OrderEntryProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function OrderEntry({ symbol, onSymbolChange }: OrderEntryProps) {
  const { userBalance, setUserBalance } = useMarketStore();
  const [quantity, setQuantity] = useState<string>('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [side, setSide] = useState<'buy' | 'sell' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get current price for the selected symbol
  const getCurrentPrice = () => {
    // In a real app, this would fetch from an API or state
    const prices = {
      'ASM300': 2500,
      'BAT457': 1800,
      'TMFS': 1850,
      'DCCP': 3500,
      'MRVL': 4200
    };
    return prices[symbol] || 2000;
  };

  const currentPrice = getCurrentPrice();
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
    setError(null);
    setSuccess(null);
    
    if (!isValidOrder()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process order
      if (side === 'buy') {
        setUserBalance(userBalance - totalWithFees);
        setSuccess(`Successfully purchased ${quantity} shares of ${symbol} for CC ${total.toLocaleString()}`);
      } else {
        setUserBalance(userBalance + totalWithFees);
        setSuccess(`Successfully sold ${quantity} shares of ${symbol} for CC ${total.toLocaleString()}`);
      }
      
      // Reset form
      setQuantity('');
      setLimitPrice('');
      setSide(null);
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Symbol
        </label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
          placeholder="Enter symbol"
        />
      </div>

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
            min="0.01"
            step="0.01"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
            placeholder="Enter limit price"
          />
        </div>
      )}

      {quantity && side && (
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">CC {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Trading Fee (0.1%)</span>
            <span className="text-white">CC {fees.toLocaleString()}</span>
          </div>
          <div className="border-t border-slate-600/50 pt-2 flex justify-between font-bold">
            <span className="text-gray-400">Total</span>
            <span className="text-white">CC {totalWithFees.toLocaleString()}</span>
          </div>
        </div>
      )}

      {side === 'buy' && totalWithFees > userBalance && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-200">
            Insufficient funds. Available balance: CC {userBalance.toLocaleString()}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 p-4 rounded-lg border border-green-700/50">
          <p className="text-sm text-green-200">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValidOrder()}
        className={`w-full p-4 rounded-lg font-medium transition-colors ${
          !isValidOrder()
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
              : 'Select Action'}
      </button>
    </form>
  );
}