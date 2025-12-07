// src/components/admin/auction/AuctionSettings.tsx
'use client';

import { useEffect, useState, DragEvent, ChangeEvent, FormEvent } from 'react';
import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import styles from './AuctionSettings.module.scss';

type AuctionItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePence: number;
  sortOrder: number;
  active: boolean;
  endsAt: string | null;
};

type FormState = Omit<AuctionItem, 'id'>;

const EMPTY_FORM: FormState = {
  slug: '',
  title: '',
  description: '',
  imageUrl: '',
  pricePence: 0,
  sortOrder: 0,
  active: true,
  endsAt: null,
};

const CSV_HEADERS = [
  'slug',
  'title',
  'description',
  'imageUrl',
  'priceGBP',
  'sortOrder',
  'active',
  'endsAtISO',
] as const;

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

type EndsLabelStatus = 'past' | 'today' | 'future';

type EndsLabelInfo = {
  text: string;
  status: EndsLabelStatus;
};

/**
 * Default: 7 days from now, 20:00 local time, formatted for datetime-local.
 */
function getDefaultEndsAtLocalInput(): string {
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  defaultEnd.setHours(20, 0, 0, 0);

  const y = defaultEnd.getFullYear();
  const m = String(defaultEnd.getMonth() + 1).padStart(2, '0');
  const d = String(defaultEnd.getDate()).padStart(2, '0');
  const hh = String(defaultEnd.getHours()).padStart(2, '0');
  const mm = String(defaultEnd.getMinutes()).padStart(2, '0');

  return `${y}-${m}-${d}T${hh}:${mm}`;
}

/**
 * Convert an ISO string into a simple label:
 * - "Ended" (past)
 * - "Ends today" (same calendar day, future)
 * - "Ends in X days" (future date)
 */
function getEndsLabelInfo(endsAt: string | null): EndsLabelInfo | null {
  if (!endsAt) return null;

  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();

  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = endDay.getTime() - todayDay.getTime();
  const dayMs = 1000 * 60 * 60 * 24;
  const diffDays = Math.round(diffMs / dayMs);

  if (diffDays < 0) {
    return { text: 'Ended', status: 'past' };
  }

  if (diffDays === 0) {
    return { text: 'Ends today', status: 'today' };
  }

  return {
    text: `Ends in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
    status: 'future',
  };
}

export default function AuctionSettings() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY_FORM,
    endsAt: getDefaultEndsAtLocalInput(),
  }));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  // drag-reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  // bulk select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // image modal
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const [imageModalTitle, setImageModalTitle] = useState<string>('');

  async function load() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/auction', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load auction items');
      const data = (await res.json()) as AuctionItem[];
      setItems(
        data.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // ─────────────────────────────
  //   FORM HELPERS
  // ─────────────────────────────

  function validateSlug(value: string, currentId: string | null): void {
    const trimmed = value.trim();
    if (!trimmed) {
      setSlugError('Slug is required.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      setSlugError('Use only lowercase letters, numbers and dashes.');
      return;
    }
    const exists = items.some((item) => item.slug === trimmed && item.id !== currentId);
    if (exists) {
      setSlugError('This slug is already used by another item.');
    } else {
      setSlugError(null);
    }
  }

  function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase().trim();
    setForm((f) => ({ ...f, slug: value }));
    validateSlug(value, editingId);
  }

  const setField =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      let value: unknown = raw;

      if (key === 'pricePence') {
        value = Math.round(parseFloat(raw || '0') * 100);
      } else if (key === 'sortOrder') {
        value = parseInt(raw || '0', 10) || 0;
      } else if (key === 'endsAt') {
        value = raw ? raw : null;
      }

      setForm((f) => ({
        ...f,
        [key]:
          key === 'pricePence' || key === 'sortOrder'
            ? (value as number)
            : (value as string | null),
      }));
    };

  function toggleActive(e: ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;
    setForm((f) => ({ ...f, active: checked }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      endsAt: getDefaultEndsAtLocalInput(),
    });
    setSlugError(null);
  }

  // ─────────────────────────────
  //   SAVE / DELETE
  // ─────────────────────────────

  async function saveItem() {
    setSaving(true);
    setError(null);

    try {
      const trimmedSlug = form.slug.trim().toLowerCase();
      validateSlug(trimmedSlug, editingId);
      if (slugError || !trimmedSlug) {
        setSaving(false);
        return;
      }

      const body = {
        id: editingId,
        ...form,
        slug: trimmedSlug,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      };

      const res = await fetch('/api/admin/auction', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to save item');
      }

      resetForm();
      await load();
      alert('Auction item saved.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!window.confirm('Delete this item?')) return;

    try {
      const res = await fetch('/api/admin/auction', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete item');

      if (editingId === id) {
        resetForm();
      }

      setSelectedIds((prev) => prev.filter((x) => x !== id));
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function startEdit(item: AuctionItem) {
    setEditingId(item.id);
    setForm({
      slug: item.slug,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl ?? '',
      pricePence: item.pricePence,
      sortOrder: item.sortOrder,
      active: item.active,
      endsAt: item.endsAt
        ? new Date(item.endsAt).toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
        : null,
    });
    setSlugError(null);
  }

  // ─────────────────────────────
  //   EXPORT / IMPORT CSV
  // ─────────────────────────────

  function handleExport() {
    if (!items.length) {
      alert('No items to export.');
      return;
    }

    const header = CSV_HEADERS.join(',');
    const rows = items.map((item) => {
      const cols = [
        item.slug,
        item.title,
        item.description ?? '',
        item.imageUrl ?? '',
        (item.pricePence / 100).toFixed(2),
        String(item.sortOrder),
        item.active ? 'true' : 'false',
        item.endsAt ?? '',
      ];
      return cols.map((c) => escapeCsv(c)).join(',');
    });

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'auction-items.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleSampleDownload() {
    const sample = [
      CSV_HEADERS.join(','),
      'limited-art-print,Limited Baraawe Art Print,"A special signed print",https://example.com/print.jpg,50.00,0,true,2025-12-31T23:59:00.000Z',
    ].join('\n');

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'auction-items-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function simpleSplitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];

      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }

    result.push(current);
    return result;
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (!lines.length) {
        throw new Error('CSV file is empty.');
      }

      const headerLine = lines[0];
      const headers = simpleSplitCsvLine(headerLine).map((h) => h.trim());

      const getIndex = (name: string) => headers.indexOf(name);
      const idx = {
        slug: getIndex('slug'),
        title: getIndex('title'),
        description: getIndex('description'),
        imageUrl: getIndex('imageUrl'),
        priceGBP: getIndex('priceGBP'),
        sortOrder: getIndex('sortOrder'),
        active: getIndex('active'),
        endsAtISO: getIndex('endsAtISO'),
      };

      if (idx.slug === -1 || idx.title === -1 || idx.priceGBP === -1) {
        throw new Error('CSV must contain slug,title,priceGBP in the header row.');
      }

      const createPromises: Promise<Response>[] = [];

      for (let i = 1; i < lines.length; i += 1) {
        const row = simpleSplitCsvLine(lines[i]);
        if (!row.length || row.every((c) => !c.trim())) continue;

        const slug = row[idx.slug]?.trim().toLowerCase();
        const title = row[idx.title]?.trim();
        const description = idx.description >= 0 ? (row[idx.description] ?? '') : '';
        const imageUrl = idx.imageUrl >= 0 ? (row[idx.imageUrl] ?? '') : '';
        const priceGBP = idx.priceGBP >= 0 ? (row[idx.priceGBP] ?? '0') : '0';
        const sortOrderRaw = idx.sortOrder >= 0 ? (row[idx.sortOrder] ?? '0') : '0';
        const activeRaw = idx.active >= 0 ? (row[idx.active] ?? 'true') : 'true';
        const endsAtISO = idx.endsAtISO >= 0 ? row[idx.endsAtISO]?.trim() || null : null;

        if (!slug || !title) continue;

        const body = {
          slug,
          title,
          description,
          imageUrl: imageUrl || null,
          pricePence: Math.round(parseFloat(priceGBP || '0') * 100),
          sortOrder: parseInt(sortOrderRaw || '0', 10) || 0,
          active: activeRaw.toLowerCase() !== 'false',
          endsAt: endsAtISO,
        };

        createPromises.push(
          fetch('/api/admin/auction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        );
      }

      await Promise.all(createPromises);
      await load();
      alert('Import finished. Check the list below.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  // ─────────────────────────────
  //   DRAG REORDER
  // ─────────────────────────────

  function reorder<T>(list: T[], from: number, to: number): T[] {
    const copy = [...list];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
    setDraggingId(items[index]?.id ?? null);
  }

  function handleDragOver(e: DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setItems((prev) => reorder(prev, dragIndex, index));
    setDragIndex(index);
  }

  async function handleDragEnd() {
    if (dragIndex === null) {
      setDraggingId(null);
      return;
    }

    setReordering(true);
    try {
      const updated = items.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));
      setItems(updated);

      await Promise.all(
        updated.map((item) =>
          fetch('/api/admin/auction', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          })
        )
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDragIndex(null);
      setDraggingId(null);
      setReordering(false);
    }
  }

  // ─────────────────────────────
  //   BULK SELECTION / ACTIONS
  // ─────────────────────────────

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  }

  async function bulkDelete() {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} items?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch('/api/admin/auction', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          })
        )
      );
      setSelectedIds([]);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function bulkSetActive(active: boolean) {
    if (!selectedIds.length) return;

    try {
      await Promise.all(
        items
          .filter((item) => selectedIds.includes(item.id))
          .map((item) =>
            fetch('/api/admin/auction', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                active,
              }),
            })
          )
      );
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  // ─────────────────────────────
  //   IMAGE MODAL
  // ─────────────────────────────

  function openImageModal(url: string, title: string) {
    setImageModalUrl(url);
    setImageModalTitle(title);
  }

  function closeImageModal() {
    setImageModalUrl(null);
    setImageModalTitle('');
  }

  // ─────────────────────────────
  //   RENDER
  // ─────────────────────────────

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void saveItem();
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Auction Items</h2>
        <p>
          Manage the items shown on the public auction page. You can re-order, bulk edit, and
          import/export.
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* Tools: export / import / sample */}
      <div className={styles.tools}>
        <button
          type="button"
          className={styles.btn}
          onClick={handleExport}
          disabled={loading || !items.length}
        >
          Export CSV
        </button>

        <label className={styles.importLabel}>
          <span>{importing ? 'Importing…' : 'Import CSV'}</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleImportFile}
            disabled={importing}
          />
        </label>

        <button type="button" className={styles.btn} onClick={handleSampleDownload}>
          Download sample CSV
        </button>
      </div>

      <p className={styles.toolsHelp}>
        Expected header columns: <code>{CSV_HEADERS.join(', ')}</code>. Amounts are in GBP (e.g.{' '}
        <code>50.00</code>). Export, tweak in a spreadsheet, then import.
      </p>

      {/* Bulk bar */}
      <div className={styles.bulkBar}>
        <label className={styles.bulkSelect}>
          <input
            type="checkbox"
            checked={selectedIds.length === items.length && items.length > 0}
            onChange={toggleSelectAll}
          />
          <span>Select all</span>
        </label>

        <span className={styles.bulkInfo}>
          {selectedIds.length ? `${selectedIds.length} selected` : 'No items selected'}
          {reordering && ' · Saving new order…'}
        </span>

        <div className={styles.bulkActions}>
          <button
            type="button"
            className={styles.bulkActionBtn}
            disabled={!selectedIds.length}
            onClick={() => void bulkSetActive(true)}
          >
            Set active
          </button>
          <button
            type="button"
            className={styles.bulkActionBtn}
            disabled={!selectedIds.length}
            onClick={() => void bulkSetActive(false)}
          >
            Set hidden
          </button>
          <button
            type="button"
            className={styles.bulkDeleteBtn}
            disabled={!selectedIds.length}
            onClick={() => void bulkDelete()}
          >
            Delete selected
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT: Form */}
        <div className={styles.formPane}>
          <h3 className={styles.subTitle}>
            {editingId ? 'Edit Auction Item' : 'New Auction Item'}
          </h3>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={`${styles.slugField} ${slugError ? styles.slugFieldError : ''}`}>
              Slug
              <input
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="limited-art-print"
                required
              />
              <span className={styles.help}>
                Used in the URL: <code>/auction/&lt;slug&gt;</code>
              </span>
              {slugError && <span className={styles.fieldError}>{slugError}</span>}
            </label>

            <label>
              Title
              <input
                value={form.title}
                onChange={setField('title')}
                placeholder="Limited Baraawe Art Print"
                required
              />
            </label>

            <label className={styles.full}>
              Description
              <textarea
                rows={4}
                value={form.description}
                onChange={setField('description')}
                placeholder="A short description of the item for donors."
              />
            </label>

            {/* Image row: text input + UploadThing + preview */}
            <label className={styles.full}>
              Image
              <div className={styles.imageControls}>
                <input
                  value={form.imageUrl ?? ''}
                  onChange={setField('imageUrl')}
                  placeholder="Paste image URL or upload below"
                />
                <UploadButton<OurFileRouter, 'mediaUploader'>
                  endpoint="mediaUploader"
                  onClientUploadComplete={(res) => {
                    if (!res?.[0]) return;
                    const url = res[0].url;
                    setForm((f) => ({ ...f, imageUrl: url }));
                  }}
                  onUploadError={(err) => {
                    alert(err.message);
                  }}
                />
              </div>
              {form.imageUrl && (
                <div className={styles.imagePreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageUrl}
                    alt={form.title || 'Auction item image'}
                    onClick={() => openImageModal(form.imageUrl ?? '', form.title || '')}
                  />
                  <span className={styles.imageHint}>Click to enlarge</span>
                </div>
              )}
            </label>

            <label>
              Suggested amount (£)
              <input
                type="number"
                min={0}
                step={0.5}
                value={form.pricePence ? form.pricePence / 100 : 0}
                onChange={setField('pricePence')}
              />
            </label>

            <label>
              Sort order
              <input type="number" value={form.sortOrder} onChange={setField('sortOrder')} />
            </label>

            <label>
              Ends at (optional)
              <input
                type="datetime-local"
                value={form.endsAt ?? ''}
                onChange={setField('endsAt')}
              />
              <span className={styles.help}>Controls the countdown timer on the auction page.</span>
            </label>

            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={form.active} onChange={toggleActive} />
              <span>Item is active (visible on site)</span>
            </label>

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update item' : 'Create item'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: List */}
        <aside className={styles.listPane}>
          <div className={styles.listHeader}>
            <span>Existing items</span>
            <span className={styles.listCount}>
              {loading ? 'Loading…' : `${items.length} total`}
            </span>
          </div>

          {loading ? (
            <p className={styles.muted}>Loading items…</p>
          ) : items.length === 0 ? (
            <p className={styles.muted}>No items yet. Create your first one.</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isDragging = draggingId === item.id;
                const isActiveRow = editingId === item.id;
                const endsInfo = getEndsLabelInfo(item.endsAt);

                return (
                  <li
                    key={item.id}
                    className={`${styles.listItem} ${isDragging ? styles.listItemDragging : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <button
                      type="button"
                      className={styles.dragHandle}
                      aria-label="Drag to reorder"
                    >
                      ☰
                    </button>

                    <label className={styles.rowCheckbox}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </label>

                    <button
                      type="button"
                      className={`${styles.listItemButton} ${
                        isActiveRow ? styles.listItemButtonActive : ''
                      }`}
                      onClick={() => startEdit(item)}
                    >
                      <span className={styles.listTitle}>{item.title}</span>

                      <div className={styles.listMeta}>
                        <div className={styles.listMetaRow}>
                          <span className={styles.listPrice}>
                            £{(item.pricePence / 100).toFixed(2)}
                          </span>
                          <span
                            className={`${styles.statusBadge} ${
                              item.active ? styles.statusActive : styles.statusHidden
                            }`}
                          >
                            {item.active ? 'Active' : 'Hidden'}
                          </span>
                        </div>

                        {endsInfo && (
                          <span
                            className={`${styles.endsLabel} ${
                              endsInfo.status === 'past'
                                ? styles.endsLabelEnded
                                : endsInfo.status === 'today'
                                  ? styles.endsLabelToday
                                  : styles.endsLabelFuture
                            }`}
                          >
                            {endsInfo.text}
                          </span>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      className={styles.delete}
                      onClick={() => void deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>

      {/* Image modal */}
      {imageModalUrl && (
        <div className={styles.imageModal} onClick={closeImageModal}>
          <div className={styles.imageModalInner} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.imageModalClose} onClick={closeImageModal}>
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageModalUrl} alt={imageModalTitle || 'Preview'} />
            {imageModalTitle && <p className={styles.imageModalCaption}>{imageModalTitle}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
