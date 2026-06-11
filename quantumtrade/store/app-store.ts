import { create } from 'zustand';

type Theme = 'dark' | 'light';

type AppState = {
  theme: Theme;
  sidebarOpen: boolean;
  selectedAsset: string;
  toggleTheme: () => void;
  setSidebarOpen: (value: boolean) => void;
  setSelectedAsset: (asset: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  selectedAsset: 'XAUUSD',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark'
    })),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset })
}));
