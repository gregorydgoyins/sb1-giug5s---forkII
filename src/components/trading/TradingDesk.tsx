```typescript
'use client';

import React, { useState } from 'react';
import { OrderEntry } from './OrderEntry';
import { PositionManager } from './PositionManager';
import { OrderBook } from './OrderBook';
import { MarketDepth } from './MarketDepth';
import { TradingHistory } from './TradingHistory';
import { RiskMetrics } from './RiskMetrics';
import { useMarketStore } from '@/store/marketStore';
import { TradingService } from '@/services/trading/TradingService';
import type { Order, Position } from '@/types';

export function TradingDesk() {
  const { userBalance } = useMarketStore();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [positions, setPositions] = useState<Position[]>([]);
  const tradingService = TradingService.getInstance();

  const handleOrderSubmit = async (order: Order) => {
    try {
      await tradingService.placeOrder(order);
      // Refresh positions after order execution
      const updatedPositions = await tradingService.getPositions();
      setPositions(updatedPositions);
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Order Entry & Positions */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <OrderEntry 
          selectedSymbol={selectedSymbol}
          onSymbolChange={setSelectedSymbol}
          onSubmit={handleOrderSubmit}
        />
        <PositionManager 
          positions={positions}
          onPositionClose={handleOrderSubmit}
        />
      </div>

      {/* Center Column - Market Data */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <OrderBook symbol={selectedSymbol} />
        <MarketDepth symbol={selectedSymbol} />
      </div>

      {/* Right Column - History & Risk */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <RiskMetrics positions={positions} />
        <TradingHistory symbol={selectedSymbol} />
      </div>
    </div>
  );
}
```