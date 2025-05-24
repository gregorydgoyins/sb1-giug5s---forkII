import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Info } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';

interface TradingInterfaceProps {
  symbol: string;
  name: string;
  currentPrice: number;
  type: 'stock' | 'bond' | 'option';
  position?: {
    quantity: number;
    averagePrice: number;
  };
  marginRequired?: number;
  maxLeverage?: number;
}

export function TradingInterface({
  symbol,
  name,
  currentPrice,
  type,
  position,
  marginRequired = 0.5,
  maxLeverage = 2
}: TradingInterfaceProps) {
  const { userBalance } = useMarketStore();
  const [quantity, setQuantity] = useState<string>('');
  const [action, setAction] = useState<'buy' | 'sell' | null>(null);
  const [showMarginWarning, setShowMarginWarning] = useState(false);

  const parsedQuantity = parseInt(quantity) || 0;
  const totalValue = parsedQuantity * currentPrice;
  const commission = totalValue * 0.001; // 0.1% commission
  const totalCost = totalValue + commission;

  const maxBuyQuantity = Math.floor((userBalance * maxLeverage) / currentPrice);
  const maxSellQuantity = position?.quantity || 0;

  const validateOrder = () => {
    if (action === 'buy') {
      if (totalCost > userBalance * maxLeverage) {
        return 'Insufficient funds or exceeds leverage limit';
      }
      if (totalCost / userBalance > marginRequired) {
        setShowMarginWarning(true);
      }
    } else if (action === 'sell') {
      if (parsedQuantity > (position?.quantity || 0)) {
        return 'Insufficient holdings';
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateOrder();
    if (error) {
      alert(error);
      return;
    }
    // TODO: Implement order execution
    console.log('Executing order:', {
      symbol,
      action,
      quantity: parsedQuantity,
      price: currentPrice,
      total: totalCost
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-gray-400">{symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">CC {currentPrice.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Current Price</p>
        </div>
      </div>

      {position && (
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Current Position</p>
              <p className="text-lg font-bold text-white">{position.quantity.toLocaleString()} shares</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Price</p>
              <p className="text-lg font-bold text-white">CC {position.averagePrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAction('buy')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              action === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-green-600/20'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setAction('sell')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              action === 'sell'
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
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={action === 'buy' ? maxBuyQuantity : maxSellQuantity}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white"
              placeholder="Enter quantity"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <span className="text-sm text-gray-400">
                Max: {action === 'buy' ? maxBuyQuantity : maxSellQuantity}
              </span>
            </div>
          </div>
        </div>

        {action && quantity && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">CC {totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Commission (0.1%)</span>
                <span className="text-white">CC {commission.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-600/50 pt-2 flex justify-between font-bold">
                <span className="text-gray-400">Total</span>
                <span className="text-white">CC {totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {showMarginWarning && (
          <div className="bg-yellow-900/50 p-4 rounded-lg border border-yellow-700/50 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-200 font-medium">Margin Trading Warning</p>
              <p className="text-sm text-yellow-200/80">
                This order requires margin. You may be subject to a margin call if the price moves against your position.
              </p>
            </div>
          </div>
        )}

        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 flex items-start space-x-2">
          <Info className="h-5 w-5 text-gray-400 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-medium">Trading Information</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Commission: 0.1% per trade</li>
              <li>Maximum leverage: {maxLeverage}x</li>
              <li>Margin requirement: {marginRequired * 100}%</li>
              <li>Settlement: T+2 for stocks, T+1 for options</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={!action || !quantity || parsedQuantity <= 0}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            !action || !quantity || parsedQuantity <= 0
              ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
              : action === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {action === 'buy' ? 'Place Buy Order' : action === 'sell' ? 'Place Sell Order' : 'Select Action'}
        </button>
      </form>
    </div>
  );
}