// src/components/admin/home/GallerySettings.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/image/ImageUploader';
import styles from './GallerySettings.module.scss';

type GalleryForm = {
  imageUrls: string[];
  title?: string | null;
  subtitle?: string | null;
  caption?: string | null;
};

const DEFAULTS: GalleryForm = {
  imageUrls: [],
  title: 'Moments of Hope',
  subtitle: 'Our journey in pictures',
  caption: 'Snapshots from daily life, community work, and progress on the ground.',
};

export default function GallerySettings() {
  const [form, setForm] = useState<GalleryForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  // Load saved gallery
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/gallery', { cache: 'no-store' });
        if (!res.ok) return;

        const data = (await res.json()) as Partial<GalleryForm>;
        setForm({ ...DEFAULTS, ...data });
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      }
    })();
  }, []);

  const setField =
    (key: keyof GalleryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const removeUrl = (i: number) => {
    setForm((f) => ({
      ...f,
      imageUrls: f.imageUrls.filter((_, idx) => idx !== i),
    }));
  };

  const move = (i: number, dir: -1 | 1) => {
    setForm((f) => {
      const arr = [...f.imageUrls];
      const j = i + dir;

      if (j < 0 || j >= arr.length) return f;

      [arr[i], arr[j]] = [arr[j], arr[i]];

      return {
        ...f,
        imageUrls: arr,
      };
    });
  };

  const clearAll = () =>
    setForm((f) => ({
      ...f,
      imageUrls: [],
    }));

  const save = async () => {
    setSaving(true);

    try {
      const payload = {
        imageUrls: form.imageUrls,
        title: form.title ?? null,
        subtitle: form.subtitle ?? null,
        caption: form.caption ?? null,
      };

      const res = await fetch('/api/home/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      alert('Gallery updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving gallery.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Home Gallery</h2>
      <p>Upload images and edit the section text shown on the homepage gallery.</p>

      <div className={styles.form}>
        {/* Section Title */}
        <label className={styles.full}>
          Section Title
          <input
            type="text"
            placeholder={DEFAULTS.title ?? 'Moments of Hope'}
            value={form.title ?? ''}
            onChange={setField('title')}
          />
        </label>

        {/* Section Subtitle */}
        <label className={styles.full}>
          Section Subtitle
          <input
            type="text"
            placeholder={DEFAULTS.subtitle ?? 'Our journey in pictures'}
            value={form.subtitle ?? ''}
            onChange={setField('subtitle')}
          />
        </label>

        {/* Caption */}
        <label className={styles.full}>
          Caption (optional)
          <textarea
            rows={3}
            placeholder={DEFAULTS.caption ?? 'Short description shown beneath the heading'}
            value={form.caption ?? ''}
            onChange={setField('caption')}
          />
        </label>

        {/* Upload images */}
        <label className={styles.full}>
          <span>Upload Images</span>

          <ImageUploader
            files={form.imageUrls}
            setFiles={(urls) =>
              setForm((f) => ({
                ...f,
                imageUrls: urls,
              }))
            }
            pathSegments={['gallery']}
            itemName="home-gallery"
          />
        </label>

        {/* Image grid */}
        <div className={styles.grid}>
          {form.imageUrls.length === 0 && <p className={styles.empty}>No images uploaded yet.</p>}

          {form.imageUrls.map((url, i) => (
            <div key={url + i} className={styles.thumb}>
              <div className={styles.imageWrap}>
                <Image
                  src={url}
                  alt={`Gallery image ${i + 1}`}
                  width={320}
                  height={200}
                  className={styles.img}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.thumbActions}>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  aria-label="Move left"
                  disabled={i === 0}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  aria-label="Move right"
                  disabled={i === form.imageUrls.length - 1}
                >
                  →
                </button>

                <button type="button" onClick={() => removeUrl(i)} className={styles.removeBtn}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save / Clear */}
        <div className={styles.actions}>
          <button
            className={styles.save}
            onClick={save}
            disabled={saving}
            aria-label="Save gallery"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={clearAll}
            disabled={saving || form.imageUrls.length === 0}
            style={{ marginLeft: '.5rem' }}
          >
            Clear All Images
          </button>
        </div>
      </div>
    </section>
  );
}
