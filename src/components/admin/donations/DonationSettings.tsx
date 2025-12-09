// src/components/admin/donations/DonationSettings.tsx
'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import styles from './DonationSettings.module.scss';
import { DonationTable } from './DonationTable';
import { DonationDrawer } from './DonationDrawer';

export type DonationStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
export type DonationType = 'DIRECT' | 'AUCTION';
export type DonationFrequency = 'ONCE' | 'MONTHLY';

export type DonationRow = {
  id: string;
  createdAt: string;
  amountCents: number;
  currency: string;
  status: DonationStatus | string;
  type: DonationType | string;
  frequency: DonationFrequency | string;
  email: string;
  name: string | null;
  stripeCheckoutSessionId: string | null;
  stripeCustomerId: string | null;
  auctionItemTitle: string | null;
  auctionItemSlug: string | null;
};

type DonationStats = {
  totalCount: number;
  succeededCount: number;
  failedCount: number;
  pendingCount: number;
  refundedCount: number;
  totalSucceededAmountCents: number;
};

type DonationApiResponse = {
  items: DonationRow[];
  stats: DonationStats;
};

type StatusFilter = 'all' | DonationStatus;
type TypeFilter = 'all' | DonationType;
type DateRangePreset = 'all' | '7d' | '30d' | '90d' | 'custom';

function formatMoneyUSD(cents: number | null | undefined): string {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DonationSettings() {
  const [items, setItems] = useState<DonationRow[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(200);

  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState(''); // USD
  const [maxAmount, setMaxAmount] = useState(''); // USD

  // drawer
  const [selectedDonation, setSelectedDonation] = useState<DonationRow | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (search.trim()) params.set('search', search.trim());
      if (limit) params.set('limit', String(limit));
      if (dateFrom) params.set('from', dateFrom);
      if (dateTo) params.set('to', dateTo);

      if (minAmount.trim()) {
        const val = Number.parseFloat(minAmount.replace(/,/g, ''));
        if (Number.isFinite(val) && val >= 0) {
          params.set('minCents', String(Math.round(val * 100)));
        }
      }

      if (maxAmount.trim()) {
        const val = Number.parseFloat(maxAmount.replace(/,/g, ''));
        if (Number.isFinite(val) && val >= 0) {
          params.set('maxCents', String(Math.round(val * 100)));
        }
      }

      const res = await fetch(`/api/admin/donations?${params.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to load donations.');
      }

      const json = (await res.json()) as DonationApiResponse;
      setItems(json.items);
      setStats(json.stats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const succeededTotalLocal = useMemo(
    () => items.filter((d) => d.status === 'SUCCEEDED').reduce((sum, d) => sum + d.amountCents, 0),
    [items]
  );

  function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as StatusFilter);
  }

  function handleTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    setTypeFilter(e.target.value as TypeFilter);
  }

  function handleLimitChange(e: ChangeEvent<HTMLSelectElement>) {
    const val = Number(e.target.value);
    if (!Number.isFinite(val) || val <= 0) return;
    setLimit(val);
  }

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handlePresetChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as DateRangePreset;
    setDatePreset(value);

    if (value === 'all') {
      setDateFrom('');
      setDateTo('');
      return;
    }

    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    if (value === '7d') {
      start.setDate(start.getDate() - 7);
    } else if (value === '30d') {
      start.setDate(start.getDate() - 30);
    } else if (value === '90d') {
      start.setDate(start.getDate() - 90);
    } else if (value === 'custom') {
      // do not change from/to
      return;
    }

    setDateFrom(formatDateInput(start));
    setDateTo(formatDateInput(end));
  }

  function handleFromChange(e: ChangeEvent<HTMLInputElement>) {
    setDateFrom(e.target.value);
    setDatePreset('custom');
  }

  function handleToChange(e: ChangeEvent<HTMLInputElement>) {
    setDateTo(e.target.value);
    setDatePreset('custom');
  }

  function handleMinAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setMinAmount(e.target.value);
  }

  function handleMaxAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setMaxAmount(e.target.value);
  }

  async function handleApplyFilters() {
    await load();
  }

  function handleExportCsv() {
    if (!items.length) {
      setError('No donations to export for this filter.');
      return;
    }

    const header = [
      'id',
      'createdAt',
      'amountUSD',
      'currency',
      'status',
      'type',
      'frequency',
      'email',
      'name',
      'auctionItemTitle',
      'auctionItemSlug',
      'stripeCheckoutSessionId',
      'stripeCustomerId',
    ].join(',');

    const rows = items.map((d) => {
      const cols = [
        d.id,
        d.createdAt,
        (d.amountCents / 100).toFixed(2),
        d.currency,
        d.status,
        d.type,
        d.frequency,
        d.email,
        d.name ?? '',
        d.auctionItemTitle ?? '',
        d.auctionItemSlug ?? '',
        d.stripeCheckoutSessionId ?? '',
        d.stripeCustomerId ?? '',
      ];

      const escapeCsv = (value: string): string => {
        if (value.includes('"') || value.includes(',') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return cols.map((c) => escapeCsv(String(c))).join(',');
    });

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const totalCount = stats?.totalCount ?? items.length;
  const succeededCount = stats?.succeededCount ?? 0;
  const pendingCount = stats?.pendingCount ?? 0;
  const failedCount = stats?.failedCount ?? 0;
  const refundedCount = stats?.refundedCount ?? 0;

  function openDrawer(d: DonationRow) {
    setSelectedDonation(d);
  }

  function closeDrawer() {
    setSelectedDonation(null);
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h2>Donations</h2>
          <p>View all card and auction donations. Amounts are stored and shown in USD.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => handleExportCsv()}
            disabled={!items.length}
          >
            Export CSV
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => void load()}>
            Refresh
          </button>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>
            Status
            <select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="SUCCEEDED">Succeeded</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </label>

          <label>
            Type
            <select value={typeFilter} onChange={handleTypeChange}>
              <option value="all">All</option>
              <option value="DIRECT">Direct</option>
              <option value="AUCTION">Auction</option>
            </select>
          </label>

          <label>
            Limit
            <select value={limit} onChange={handleLimitChange}>
              <option value={100}>Latest 100</option>
              <option value={200}>Latest 200</option>
              <option value={500}>Latest 500</option>
              <option value={1000}>Latest 1000</option>
            </select>
          </label>

          <label>
            Date range
            <select value={datePreset} onChange={handlePresetChange}>
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label>
            From
            <input type="date" value={dateFrom} onChange={handleFromChange} />
          </label>

          <label>
            To
            <input type="date" value={dateTo} onChange={handleToChange} />
          </label>

          <label>
            Min amount ($)
            <input
              type="number"
              min={0}
              step={0.01}
              value={minAmount}
              onChange={handleMinAmountChange}
            />
          </label>

          <label>
            Max amount ($)
            <input
              type="number"
              min={0}
              step={0.01}
              value={maxAmount}
              onChange={handleMaxAmountChange}
            />
          </label>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.searchLabel}>
            Search
            <input
              type="text"
              placeholder="Email, name, Stripe session, auction item…"
              value={search}
              onChange={handleSearchInput}
            />
          </label>

          <button
            type="button"
            className={styles.applyButton}
            onClick={() => void handleApplyFilters()}
          >
            Apply filters
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total donations</span>
          <span className={styles.statValue}>{totalCount.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Succeeded</span>
          <span className={styles.statValue}>{succeededCount.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending</span>
          <span className={styles.statValue}>{pendingCount.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Failed</span>
          <span className={styles.statValue}>{failedCount.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Refunded</span>
          <span className={styles.statValue}>{refundedCount.toLocaleString()}</span>
        </div>
        <div className={styles.statCardWide}>
          <span className={styles.statLabel}>Succeeded total (all time)</span>
          <span className={styles.statValue}>
            {formatMoneyUSD(stats?.totalSucceededAmountCents ?? 0)}
          </span>
          <span className={styles.statSub}>
            This page only: <strong>{formatMoneyUSD(succeededTotalLocal)}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <p className={styles.muted}>Loading donations…</p>
        ) : !items.length ? (
          <p className={styles.muted}>No donations found for this filter.</p>
        ) : (
          <DonationTable items={items} onRowClick={openDrawer} />
        )}
      </div>

      {/* Drawer */}
      <DonationDrawer donation={selectedDonation} onClose={closeDrawer} />
    </section>
  );
}
