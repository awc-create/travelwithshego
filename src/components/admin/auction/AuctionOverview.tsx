// src/components/admin/auction/AuctionOverview.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './AuctionOverview.module.scss';

type OverviewItem = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  closed: boolean;
  pricePence: number;
  endsAt: string | null;
  highestBidPence: number | null;
  bidCount: number;
  lastBidAt: string | null;
};

type BidRow = {
  id: string;
  amountPence: number;
  email: string;
  name: string | null;
  isWinner: boolean;
  createdAt: string;
};

type BidsPayload = {
  itemId: string;
  itemTitle: string;
  closed: boolean;
  endsAt: string | null;
  bids: BidRow[];
};

type AuctionOverviewProps = {
  /** Optional callback to jump to the Auction Items tab in admin */
  goToItemsTab?: () => void;
};

function formatMoney(pence: number | null): string {
  if (pence == null) return '—';
  return `£${(pence / 100).toFixed(2)}`;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function computeStatus(item: OverviewItem): 'active' | 'closed' | 'ended' {
  if (!item.active) return 'closed';
  if (item.closed) return 'closed';
  if (!item.endsAt) return 'active';
  const now = Date.now();
  const end = new Date(item.endsAt).getTime();
  if (Number.isNaN(end)) return 'active';
  return end < now ? 'ended' : 'active';
}

export default function AuctionOverview({ goToItemsTab }: AuctionOverviewProps) {
  const [items, setItems] = useState<OverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [bidsPayload, setBidsPayload] = useState<BidsPayload | null>(null);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);

  // ─────────────────────────────────
  // Load overview list
  // ─────────────────────────────────
  async function loadOverview() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/admin/auction/overview', {
        cache: 'no-store',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to load auction overview.');
      }

      const data = (await res.json()) as OverviewItem[];
      setItems(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  // ─────────────────────────────────
  // Load bids for one item
  // ─────────────────────────────────
  async function loadBids(itemId: string) {
    try {
      setBidsLoading(true);
      setBidsError(null);
      setBidsPayload(null);

      const res = await fetch(`/api/admin/auction/bids?itemId=${itemId}`, {
        cache: 'no-store',
      });

      const raw = (await res.json().catch(() => null)) as unknown;

      const maybeError = raw as { error?: string } | null;

      if (!res.ok || !raw || (maybeError && maybeError.error)) {
        const message = (maybeError && maybeError.error) || 'Failed to load bids.';
        throw new Error(message);
      }

      setBidsPayload(raw as BidsPayload);
    } catch (err) {
      setBidsError((err as Error).message);
    } finally {
      setBidsLoading(false);
    }
  }

  function handleViewBids(itemId: string) {
    setSelectedItemId(itemId);
    void loadBids(itemId);
  }

  async function handleDeleteItem(id: string) {
    if (!window.confirm('Delete this auction item?')) return;
    try {
      const res = await fetch('/api/admin/auction', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete item.');
      await loadOverview();
      if (selectedItemId === id) {
        setSelectedItemId(null);
        setBidsPayload(null);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h2>Auction Overview</h2>
          <p>
            High-level view of all auction items, bids, and status. Use this to see performance and
            quickly jump into editing.
          </p>
        </div>

        <div className={styles.headerActions}>
          {goToItemsTab && (
            <button type="button" className={styles.primaryButton} onClick={goToItemsTab}>
              Manage items
            </button>
          )}
          <Link href="/auction" className={styles.secondaryButton}>
            View auction page
          </Link>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        {/* LEFT: table of items */}
        <div className={styles.tablePane}>
          {loading ? (
            <p className={styles.muted}>Loading auction items…</p>
          ) : items.length === 0 ? (
            <p className={styles.muted}>
              No auction items found. Use <strong>Manage items</strong> to add your first one.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Suggested</th>
                  <th>Highest bid</th>
                  <th>Bids</th>
                  <th>Ends</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = computeStatus(item);
                  const isSelected = item.id === selectedItemId;
                  return (
                    <tr key={item.id} className={isSelected ? styles.rowSelected : undefined}>
                      <td>
                        <div className={styles.itemTitleCell}>
                          <span className={styles.itemTitle}>{item.title}</span>
                        </div>
                      </td>
                      <td>
                        <code className={styles.slug}>{item.slug}</code>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            status === 'active'
                              ? styles.statusActive
                              : status === 'ended'
                                ? styles.statusEnded
                                : styles.statusClosed
                          }`}
                        >
                          {status === 'active' ? 'Active' : status === 'ended' ? 'Ended' : 'Closed'}
                        </span>
                      </td>
                      <td>{formatMoney(item.pricePence)}</td>
                      <td>{formatMoney(item.highestBidPence)}</td>
                      <td>{item.bidCount || 0}</td>
                      <td>{formatDateTime(item.endsAt)}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            type="button"
                            className={styles.smallButton}
                            onClick={() => handleViewBids(item.id)}
                          >
                            View bids
                          </button>
                          <Link href={`/auction/${item.slug}`} className={styles.smallButtonGhost}>
                            View page
                          </Link>
                          <button
                            type="button"
                            className={styles.smallButtonDanger}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT: bids panel */}
        <aside className={styles.bidsPane}>
          <h3 className={styles.bidsTitle}>Bids</h3>

          {!selectedItemId && (
            <p className={styles.muted}>
              Select an item and click <strong>View bids</strong> to see all bidders.
            </p>
          )}

          {selectedItemId && bidsLoading && <p className={styles.muted}>Loading bids…</p>}

          {bidsError && <p className={styles.error}>{bidsError}</p>}

          {bidsPayload && !bidsLoading && (
            <div className={styles.bidsCard}>
              <div className={styles.bidsHeader}>
                <p className={styles.bidsItemTitle}>{bidsPayload.itemTitle}</p>
                <p className={styles.bidsMeta}>
                  {bidsPayload.bids.length} bid
                  {bidsPayload.bids.length === 1 ? '' : 's'} · Ends:{' '}
                  {formatDateTime(bidsPayload.endsAt)}
                </p>
              </div>

              {bidsPayload.bids.length === 0 ? (
                <p className={styles.muted}>No bids yet for this item.</p>
              ) : (
                <ul className={styles.bidsList}>
                  {bidsPayload.bids.map((bid) => (
                    <li key={bid.id} className={styles.bidRow}>
                      <div className={styles.bidMain}>
                        <span className={styles.bidAmount}>{formatMoney(bid.amountPence)}</span>
                        {bid.isWinner && <span className={styles.winnerTag}>Winner</span>}
                      </div>
                      <div className={styles.bidMetaRow}>
                        <span className={styles.bidName}>{bid.name || 'Anonymous'}</span>
                        <span className={styles.bidEmail}>{bid.email}</span>
                      </div>
                      <span className={styles.bidTime}>{formatDateTime(bid.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
