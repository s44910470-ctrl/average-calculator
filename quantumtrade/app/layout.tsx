export const metadata = {
  title: 'QuantumTrade Platform',
  description: 'Institutional-grade AI trading platform'
};

import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
