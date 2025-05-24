```typescript
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface OrderLimitsProps {
  maxOrderSize: number;
  availableBalance: number;
  currentPrice: number;
  quantity: number;
}

export function OrderLimits({
  maxOrderSize,
  availableBalance,
  currentPrice,
  quantity
}: OrderLimitsProps) {
  const orderValue = quantity * currentPrice;
  const isOverLimit = quantity > maxOrderSize;
  const isInsufficientFunds = orderValue > availableBalance;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Max Order Size</p>
          <p className="text-lg font-bold text-white">{maxOrderSize.toLocaleString()}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Available Balance</p>
          <p className="text-lg font-bold text-white">CC {availableBalance.toLocaleString()}</p>
        </div>
      </div>

      {(isOverLimit || isInsufficientFunds) && (
        <div className={`p-4 rounded-lg border flex items-start space-x-2 ${
          isOverLimit 
            ? 'bg-yellow-900/50 border-yellow-700/50' 
            : 'bg-red-900/50 border-red-700/50'
        }`}>
          <AlertCircle className={`h-5 w-5 mt-0.5 ${
            isOverLimit ? 'text-yellow-400' : 'text-red-400'
          }`} />
          <div>
            <p className={`font-medium ${
              isOverLimit ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {isOverLimit ? 'Order Size Limit Exceeded' : 'Insufficient Funds'}
            </p>
            <p className={isOverLimit ? 'text-yellow-200' : 'text-red-200'}>
              {isOverLimit 
                ? `Maximum order size is ${maxOrderSize.toLocaleString()} units`
                : `Order value exceeds available balance by CC ${(orderValue - availableBalance).toLocaleString()}`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```