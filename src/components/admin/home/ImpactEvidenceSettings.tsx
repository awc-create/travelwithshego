'use client';

import ImageUploader from '@/components/admin/image/ImageUploader';
import { uploadSingleFile } from '@/lib/client-upload';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ImpactEvidenceSettings.module.scss';

type EvidenceItem =
  | {
      type: 'image';
      src: string;
      alt?: string;
      title?: string;
      caption?: string;
      date?: string;
      location?: string;
    }
  | {
      type: 'video';
      src: string;
      poster?: string;
      title?: string;
      caption?: string;
      date?: string;
      location?: string;
    };

type EvidenceForm = {
  title: string;
  subtitle: string;
  items: EvidenceItem[];
};

const DEFAULTS: EvidenceForm = {
  title: 'Evidence of Where Your Money Has Been Helping',
  subtitle: 'Real updates from the ground — photos and video moments showing progress and impact.',
  items: [],
};

function isVideoFile(file: File) {
  return file.type.startsWith('video/');
}

export default function ImpactEvidenceSettings() {
  const [form, setForm] = useState<EvidenceForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/evidence', { cache: 'no-store' });
        if (!res.ok) return;

        const data = (await res.json()) as Partial<EvidenceForm>;
        setForm({
          ...DEFAULTS,
          ...data,
          items: Array.isArray(data.items) ? data.items : [],
        });
      } catch (err) {
        console.error('Failed to fetch impact evidence:', err);
      }
    })();
  }, []);

  const setField =
    (key: keyof Pick<EvidenceForm, 'title' | 'subtitle'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const updateItem = (index: number, patch: Partial<EvidenceItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? ({ ...item, ...patch } as EvidenceItem) : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.items];
      const target = index + direction;

      if (target < 0 || target >= next.length) return prev;

      [next[index], next[target]] = [next[target], next[index]];

      return {
        ...prev,
        items: next,
      };
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = Array.from(e.target.files ?? []);
    if (pickedFiles.length === 0) return;

    try {
      setUploading(true);

      const uploaded = await Promise.all(
        pickedFiles.map(async (file) => {
          const result = await uploadSingleFile(file, {
            pathSegments: ['pages', 'home', 'impact-evidence'],
            itemName: 'evidence-item',
          });

          if (isVideoFile(file)) {
            const item: EvidenceItem = {
              type: 'video',
              src: result.url,
              poster: '',
              title: '',
              caption: '',
              date: '',
              location: '',
            };
            return item;
          }

          const item: EvidenceItem = {
            type: 'image',
            src: result.url,
            alt: file.name,
            title: '',
            caption: '',
            date: '',
            location: '',
          };
          return item;
        })
      );

      setForm((prev) => ({
        ...prev,
        items: [...prev.items, ...uploaded],
      }));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const clearAll = () => {
    setForm((prev) => ({
      ...prev,
      items: [],
    }));
  };

  const save = async () => {
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        items: form.items,
      };

      const res = await fetch('/api/home/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      alert('Impact evidence updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving impact evidence.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Impact Evidence</h2>
      <p>
        Upload photos and videos showing supporters where their money is helping. You can upload
        many at once, then edit captions, dates and locations after.
      </p>

      <div className={styles.form}>
        <label className={styles.full}>
          Section Title
          <input
            type="text"
            value={form.title}
            onChange={setField('title')}
            placeholder={DEFAULTS.title}
          />
        </label>

        <label className={styles.full}>
          Section Subtitle
          <textarea
            rows={3}
            value={form.subtitle}
            onChange={setField('subtitle')}
            placeholder={DEFAULTS.subtitle}
          />
        </label>

        <div className={styles.full}>
          <label className={styles.uploadLabel}>
            <span>Upload Images / Videos</span>
            <span className={styles.uploadHint}>
              You can select multiple files at once — 5, 10, or more in one go.
            </span>
          </label>

          <label className={styles.bulkUploadBox}>
            <span>{uploading ? 'Uploading…' : 'Choose images/videos'}</span>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              multiple
              onChange={handleBulkUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className={styles.grid}>
          {form.items.length === 0 && (
            <p className={styles.empty}>No evidence items uploaded yet.</p>
          )}

          {form.items.map((item, index) => (
            <div key={`${item.src}-${index}`} className={styles.card}>
              <div className={styles.previewWrap}>
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.alt || `Evidence image ${index + 1}`}
                    width={360}
                    height={240}
                    className={styles.preview}
                  />
                ) : (
                  <video
                    src={item.src}
                    controls
                    preload="metadata"
                    className={styles.preview}
                    poster={item.poster || undefined}
                  />
                )}
              </div>

              <div className={styles.metaEditor}>
                <label className={styles.full}>
                  Media URL
                  <input
                    type="text"
                    value={item.src}
                    onChange={(e) => updateItem(index, { src: e.target.value })}
                  />
                </label>

                {item.type === 'image' && (
                  <label className={styles.full}>
                    Alt Text
                    <input
                      type="text"
                      value={item.alt ?? ''}
                      onChange={(e) => updateItem(index, { alt: e.target.value })}
                      placeholder="Describe the image"
                    />
                  </label>
                )}

                {item.type === 'video' && (
                  <div className={styles.full}>
                    <ImageUploader
                      label="Video Poster (optional)"
                      single
                      files={item.poster ? [item.poster] : []}
                      setFiles={(urls) => updateItem(index, { poster: urls[0] ?? '' })}
                      pathSegments={['pages', 'home', 'impact-evidence', 'posters']}
                      itemName={`poster-${index + 1}`}
                      accept="image/*"
                    />
                  </div>
                )}

                <label>
                  Title
                  <input
                    type="text"
                    value={item.title ?? ''}
                    onChange={(e) => updateItem(index, { title: e.target.value })}
                    placeholder="Classroom building progress"
                  />
                </label>

                <label>
                  Date
                  <input
                    type="text"
                    value={item.date ?? ''}
                    onChange={(e) => updateItem(index, { date: e.target.value })}
                    placeholder="Jan 2026"
                  />
                </label>

                <label className={styles.full}>
                  Location
                  <input
                    type="text"
                    value={item.location ?? ''}
                    onChange={(e) => updateItem(index, { location: e.target.value })}
                    placeholder="Baraawe, Somalia"
                  />
                </label>

                <label className={styles.full}>
                  Caption
                  <textarea
                    rows={3}
                    value={item.caption ?? ''}
                    onChange={(e) => updateItem(index, { caption: e.target.value })}
                    placeholder="Brief description of what supporters are seeing here."
                  />
                </label>
              </div>

              <div className={styles.cardActions}>
                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                  ↑ Move Up
                </button>

                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === form.items.length - 1}
                >
                  ↓ Move Down
                </button>

                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeItem(index)}
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save Evidence'}
          </button>

          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={clearAll}
            disabled={saving || form.items.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
    </section>
  );
}
