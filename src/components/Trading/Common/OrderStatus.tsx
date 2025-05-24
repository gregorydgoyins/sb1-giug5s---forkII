'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '../types';

interface OrderStatusProps {
  orders: Order[];
}

export function OrderStatus({ orders }: OrderStatusProps) {
  if (!orders.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">No active orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id}
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                {order.status === 'pending' && <Clock className="h-5 w-5 text-yellow-400" />}
                {order.status === 'executed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                {order.status === 'failed' && <XCircle className="h-5 w-5 text-red-400" />}
                <h3 className="font-semibold text-white">
                  {order.side.toUpperCase()} {order.quantity} {order.asset}
                </h3>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {order.type === 'limit' ? `Limit: CC ${order.price}` : 'Market Order'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">CC {order.total.toLocaleString()}</p>
              <p className="text-sm text-gray-400">
                {order.timestamp?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}