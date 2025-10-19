'use client';

import { useEffect, useState } from 'react';
import styles from './DonationSettings.module.scss';

type DonationForm = {
  title: string;
  subtitle?: string;
};

const DEFAULTS: DonationForm = {
  title: 'Give Shelter & Hope',
  subtitle: 'Your gift creates safe housing, education and care in Baraawe.',
};

export default function DonationSettings() {
  const [form, setForm] = useState<DonationForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/donation', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<DonationForm>;
        setForm({ ...DEFAULTS, ...data });
      } catch {}
    })();
  }, []);

  const setField = (key: keyof DonationForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    if (!form.title.trim()) {
      alert('Title is required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/home/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Donation section updated!');
    } catch {
      alert('Network error saving donation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Donation Section</h2>
      <p>Edit the title/subtitle shown above the donate button on the homepage.</p>

      <div className={styles.form}>
        <label className={styles.full}>
          Title
          <input placeholder={DEFAULTS.title} value={form.title} onChange={setField('title')} />
        </label>

        <label className={styles.full}>
          Subtitle (optional)
          <input
            placeholder={DEFAULTS.subtitle}
            value={form.subtitle ?? ''}
            onChange={setField('subtitle')}
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
