'use client';

import React from 'react';
import { useTradingContext } from '../context/TradingContext';
import { TransactionHistory } from '../Common/TransactionHistory';
import { OrderStatus } from '../Common/OrderStatus';

export function ExecutionPanel() {
  const { activeOrders, transactions } = useTradingContext();

  return (
    <div className="card">
      <h2 className="section-header trading-header">Order Execution</h2>
      <div className="space-y-6">
        <OrderStatus orders={activeOrders} />
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}