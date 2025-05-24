```typescript
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import type { Position, Order } from '@/types';

interface PositionManagerProps {
  positions: Position[];
  onPositionClose: (order: Order) => Promise<void>;
}

export function PositionManager({ positions, onPositionClose }: PositionManagerProps) {
  const handleClosePosition = async (position: Position) => {
    const order: Order = {
      symbol: position.symbol,
      type: 'market',
      side: 'sell',
      quantity: position.quantity,
      timeInForce: 'day'
    };

    await onPositionClose(order);
  };

  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Positions</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Value</p>
          <p className="text-lg font-bold text-white">
            CC {totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {positions.map((position) => (
          <div 
            key={position.symbol}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-white">{position.symbol}</h3>
                <p className="text-sm text-gray-400">
                  {position.quantity.toLocaleString()} shares @ CC {position.averagePrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  CC {position.marketValue.toLocaleString()}
                </p>
                <div className={`flex items-center justify-end space-x-1 ${
                  position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.unrealizedPnL >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {position.unrealizedPnL >= 0 ? '+' : ''}
                    CC {position.unrealizedPnL.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleClosePosition(position)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Close Position
              </button>
            </div>
          </div>
        ))}

        {positions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400">No open positions</p>
          </div>
        )}
      </div>

      {positions.length > 0 && (
        <div className="mt-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total P/L</span>
            <div className={`flex items-center space-x-1 ${
              totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-bold">
                {totalPnL >= 0 ? '+' : ''}CC {totalPnL.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```