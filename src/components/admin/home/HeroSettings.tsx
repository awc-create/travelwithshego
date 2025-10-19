// src/components/admin/home/HeroSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './HeroSettings.module.scss';

type HeroForm = {
  imageSrc: string;
  title: string;
  description: string;
};

const DEFAULTS: HeroForm = {
  imageSrc: '/assets/hero.png',
  title: 'Hope & Home for Baraawe’s Children',
  description:
    'We’re building a safe haven for orphans and struggling families — a place where every child can live, learn, and dream without fear.',
};

export default function HeroSettings() {
  const [form, setForm] = useState<HeroForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/hero', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<HeroForm>;
        setForm({ ...DEFAULTS, ...data });
      } catch {}
    })();
  }, []);

  const setField =
    (key: keyof HeroForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/home/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) return alert('Failed to save. Check server logs.');
      alert('Hero updated! Visit Home to see it.');
    } catch {
      alert('Network error saving hero.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Home Hero</h2>
      <p>Update the home page hero image, heading, and paragraph.</p>

      <div className={styles.form}>
        <label>
          Hero Image (PNG path or URL)
          <input
            placeholder="/assets/hero.png"
            value={form.imageSrc}
            onChange={setField('imageSrc')}
          />
        </label>

        <label>
          Heading
          <input placeholder={DEFAULTS.title} value={form.title} onChange={setField('title')} />
        </label>

        <label className={styles.full}>
          Paragraph
          <textarea
            rows={4}
            placeholder={DEFAULTS.description}
            value={form.description}
            onChange={setField('description')}
          />
        </label>

        <div className={styles.actions}>
          <button className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </section>
  );
}
