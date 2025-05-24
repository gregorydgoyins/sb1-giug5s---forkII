'use client';

import React, { useState } from 'react';
import { useTradingContext } from '../context/TradingContext';
import { OrderForm } from '../Common/OrderForm';
import { PriceDisplay } from '../Common/PriceDisplay';
import { AssetSelector } from '../Common/AssetSelector';
import type { Order } from '../types';

export function OrderEntry() {
  const { submitOrder, currentAsset, marketData } = useTradingContext();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  const handleSubmit = async (order: Order) => {
    try {
      await submitOrder(order);
      // Handle success
    } catch (error) {
      // Handle error
      console.error('Order submission failed:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="section-header trading-header">Order Entry</h2>
      <div className="space-y-6">
        <AssetSelector />
        {currentAsset && (
          <>
            <PriceDisplay 
              price={marketData?.currentPrice || 0}
              change={marketData?.priceChange || 0}
            />
            <OrderForm
              type={orderType}
              onTypeChange={setOrderType}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
}