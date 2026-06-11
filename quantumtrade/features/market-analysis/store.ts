import { create } from 'zustand';

type MarketState = {
  selectedSymbol: string;
  timeframe: string;
  setSelectedSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: string) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  selectedSymbol: 'XAUUSD',
  timeframe: '5m',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setTimeframe: (timeframe) => set({ timeframe })
}));
