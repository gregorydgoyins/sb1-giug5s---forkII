'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (!transactions.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id}
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                transaction.side === 'buy' 
                  ? 'bg-green-900/50 border border-green-700/50' 
                  : 'bg-red-900/50 border border-red-700/50'
              }`}>
                {transaction.side === 'buy' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {transaction.side.toUpperCase()} {transaction.quantity} @ CC {transaction.price.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-400">
                  {transaction.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">CC {transaction.total.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}