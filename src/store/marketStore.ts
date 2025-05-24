import { create } from 'zustand';
import type { MarketState } from '../types';

const INITIAL_DISTRIBUTION = {
  golden: 0.30,  // 30% - Blue chip stability
  silver: 0.25,  // 25% - Established value
  bronze: 0.20,  // 20% - Growing maturity
  copper: 0.15,  // 15% - Recent history
  modern: 0.10   // 10% - Current market
};

export const useMarketStore = create<MarketState>((set) => ({
  marketIndex: 3200000, // 3.2M initial market index
  volatility: 0.35,     // 35% volatility
  distribution: INITIAL_DISTRIBUTION,
  userBalance: 2000000, // Starting balance (2M CC)
  setMarketIndex: (index) => set({ marketIndex: index }),
  setVolatility: (volatility) => set({ volatility }),
  setDistribution: (distribution) => set({ distribution }),
  setUserBalance: (balance) => set({ userBalance: balance })
}));