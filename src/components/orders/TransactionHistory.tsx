```tsx
import React from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

const mockTransactions = [
  {
    id: '1',
    asset: 'Amazing Spider-Man #300',
    type: 'buy',
    quantity: 2,
    price: 2500,
    total: 5000,
    timestamp: new Date('2024-03-15T10:30:00')
  },
  {
    id: '2',
    asset: 'Batman #457',
    type: 'sell',
    quantity: 1,
    price: 1800,
    total: 1800,
    timestamp: new Date('2024-03-14T15:45:00')
  }
];

export function TransactionHistory() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'buy' 
                    ? 'bg-green-900/50 border border-green-700/50' 
                    : 'bg-red-900/50 border border-red-700/50'
                }`}>
                  {transaction.type === 'buy' ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{transaction.asset}</h3>
                  <p className="text-sm text-gray-400">
                    {transaction.type.toUpperCase()} {transaction.quantity} @ CC {transaction.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">CC {transaction.total.toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  {transaction.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```