'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Order, MarketData, Transaction } from '../types';

interface TradingContextType {
  currentAsset: string | null;
  setCurrentAsset: (asset: string | null) => void;
  marketData: MarketData | null;
  activeOrders: Order[];
  transactions: Transaction[];
  submitOrder: (order: Order) => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [currentAsset, setCurrentAsset] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const submitOrder = async (order: Order) => {
    // Implement order submission logic
  };

  return (
    <TradingContext.Provider value={{
      currentAsset,
      setCurrentAsset,
      marketData,
      activeOrders,
      transactions,
      submitOrder
    }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
}