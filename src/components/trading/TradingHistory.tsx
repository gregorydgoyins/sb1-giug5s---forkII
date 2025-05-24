import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TradingHistoryProps {
  symbol: string;
}

const mockTrades = [
  {
    id: '1',
    symbol: 'ASM300',
    type: 'buy',
    quantity: 2,
    price: 2500,
    total: 5000,
    timestamp: new Date('2024-03-15T10:30:00')
  },
  {
    id: '2',
    symbol: 'ASM300',
    type: 'sell',
    quantity: 1,
    price: 2600,
    total: 2600,
    timestamp: new Date('2024-03-14T15:45:00')
  }
];

export function TradingHistory({ symbol }: TradingHistoryProps) {
  const filteredTrades = mockTrades.filter(trade => trade.symbol === symbol);

  return (
    <div className="space-y-4">
      {filteredTrades.map((trade) => (
        <div 
          key={trade.id}
          className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                trade.type === 'buy' 
                  ? 'bg-green-900/50 border border-green-700/50' 
                  : 'bg-red-900/50 border border-red-700/50'
              }`}>
                {trade.type === 'buy' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {trade.type.toUpperCase()} {trade.quantity} @ CC {trade.price.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-400">
                  {trade.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">CC {trade.total.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
      ))}

      {filteredTrades.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No trading history available</p>
        </div>
      )}
    </div>
  );
}