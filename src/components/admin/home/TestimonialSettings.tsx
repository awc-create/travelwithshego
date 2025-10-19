'use client';

import { useEffect, useState } from 'react';
import styles from './TestimonialSettings.module.scss';
// If you want avatar uploads with UploadThing later, we can plug it in easily.

type TestimonialForm = {
  quote: string;
  author: string;
  role?: string;
  avatarSrc?: string;
};

const DEFAULTS: TestimonialForm = {
  quote: 'When we educate one child, we educate the whole village.',
  author: 'Project Lead, Baraawe',
  role: 'Founder',
  avatarSrc: '',
};

export default function TestimonialSettings() {
  const [form, setForm] = useState<TestimonialForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/testimonial', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<TestimonialForm>;
        setForm({ ...DEFAULTS, ...data });
      } catch {}
    })();
  }, []);

  const setField =
    (key: keyof TestimonialForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    if (!form.quote.trim() || !form.author.trim()) {
      alert('Quote and Author are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/home/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Testimonial updated!');
    } catch {
      alert('Network error saving testimonial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Home Testimonial</h2>
      <p>Update the quote, author details and optional avatar.</p>

      <div className={styles.form}>
        <label className={styles.full}>
          Quote
          <textarea
            rows={3}
            placeholder={DEFAULTS.quote}
            value={form.quote}
            onChange={setField('quote')}
          />
        </label>

        <label>
          Author
          <input placeholder="Name" value={form.author} onChange={setField('author')} />
        </label>

        <label>
          Role (optional)
          <input placeholder="Founder" value={form.role ?? ''} onChange={setField('role')} />
        </label>

        <label className={styles.full}>
          Avatar URL (optional)
          <input
            placeholder="/assets/avatar.jpg or https://..."
            value={form.avatarSrc ?? ''}
            onChange={setField('avatarSrc')}
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
