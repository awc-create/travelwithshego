// src/hooks/useDonationStats.ts
'use client';

import { useEffect, useState } from 'react';

export type DonationStats = {
  raisedPence: number;
  goalPence: number;
  directCount: number;
  auctionDonationCount: number;
  totalDonationsCount: number;
  totalBidsCount: number;
  averageGiftPence: number;
};

type UseDonationStatsResult = {
  stats: DonationStats | null;
  loading: boolean;
  error: string | null;
};

export function useDonationStats(): UseDonationStatsResult {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        setLoading(true);
        const res = await fetch('/api/stats/donations', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = (await res.json()) as DonationStats;
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitial();

    // Optional: upgrade to WebSocket later via NEXT_PUBLIC_DONATION_WS_URL
    const wsUrl = process.env.NEXT_PUBLIC_DONATION_WS_URL;
    if (wsUrl) {
      let socket: WebSocket | null = null;

      try {
        socket = new WebSocket(wsUrl);

        socket.addEventListener('message', (event) => {
          try {
            const parsed = JSON.parse(event.data as string) as {
              type: string;
              payload?: DonationStats;
            };

            if (parsed.type === 'donation:stats' && parsed.payload) {
              setStats(parsed.payload);
            }
          } catch {
            // ignore malformed messages
          }
        });

        socket.addEventListener('error', () => {
          // ignore ws errors
        });
      } catch {
        // ignore ws init errors
      }

      return () => {
        cancelled = true;
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}
