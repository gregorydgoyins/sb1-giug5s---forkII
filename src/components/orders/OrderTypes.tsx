```typescript
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OrderTypesProps {
  selectedType: 'market' | 'limit';
  onTypeChange: (type: 'market' | 'limit') => void;
  side: 'buy' | 'sell';
  onSideChange: (side: 'buy' | 'sell') => void;
}

export function OrderTypes({ 
  selectedType, 
  onTypeChange, 
  side, 
  onSideChange 
}: OrderTypesProps) {
  return (
    <div className="space-y-4">
      {/* Order Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onTypeChange('market')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              selectedType === 'market'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            Market Order
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('limit')}
            className={`p-4 rounded-lg font-medium transition-colors ${
              selectedType === 'limit'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            Limit Order
          </button>
        </div>
      </div>

      {/* Buy/Sell Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Position
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSideChange('buy')}
            className={`p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-green-600/20'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Buy/Long</span>
          </button>
          <button
            type="button"
            onClick={() => onSideChange('sell')}
            className={`p-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-red-600/20'
            }`}
          >
            <TrendingDown className="h-5 w-5" />
            <span>Sell/Short</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```