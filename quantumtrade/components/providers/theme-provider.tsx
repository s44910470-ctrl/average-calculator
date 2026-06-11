'use client';

import { ReactNode, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}
