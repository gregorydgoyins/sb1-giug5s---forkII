export interface MarketItem {
  id: string;
  name: string;
  value: number;
  change: number;
}

export interface MarketLevel {
  id: string;
  name: string;
  items: MarketItem[];
}

export interface MarketCategory {
  id: string;
  name: string;
  levels: MarketLevel[];
}