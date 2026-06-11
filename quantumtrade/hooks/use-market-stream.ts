'use client';

import { useEffect, useState } from 'react';
import { realtimeClient } from '@/lib/websocket';
import { env } from '@/lib/env';

export function useMarketStream(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    realtimeClient.connect(env.WS_URL);

    const channel = `market:${symbol}`;

    realtimeClient.subscribe(channel, (payload) => {
      const data = payload as { price?: number };
      if (typeof data.price === 'number') {
        setPrice(data.price);
      }
    });

    return () => {
      realtimeClient.disconnect();
    };
  }, [symbol]);

  return { price };
}
