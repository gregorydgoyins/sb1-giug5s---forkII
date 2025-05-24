```tsx
import React from 'react';
import { Receipt } from 'lucide-react';
import type { Order } from '../../types';

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Receipt className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Order Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Asset</p>
            <p className="text-white font-medium">{order.asset}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Quantity</p>
            <p className="text-white font-medium">{order.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Price per Unit</p>
            <p className="text-white font-medium">CC {order.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-white font-medium">CC {order.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">CC {order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400">Fees (0.1%)</span>
            <span className="text-white">CC {(order.total * 0.001).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-2 text-lg font-bold">
            <span className="text-gray-400">Final Total</span>
            <span className="text-white">CC {(order.total * 1.001).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```