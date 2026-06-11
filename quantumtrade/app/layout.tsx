export const metadata = {
  title: 'QuantumTrade Platform',
  description: 'Institutional-grade AI trading platform'
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
