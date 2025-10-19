// src/components/admin/settings/MissionSettings.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './MissionSettings.module.scss';

type MissionForm = {
  title: string;
  description: string;
  familiesHoused: number;
  childrenInCare: number;
  mealsServed: number;
};

const DEFAULTS: MissionForm = {
  title: 'Hope, Home, and a Path to the Future',
  description:
    'We’re building a safe haven in Baraawe — a place where vulnerable children and families can live, learn and heal.',
  familiesHoused: 0,
  childrenInCare: 0,
  mealsServed: 0,
};

export default function MissionSettings() {
  const [form, setForm] = useState<MissionForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/home/mission', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setForm({ ...DEFAULTS, ...data });
    })();
  }, []);

  const setField =
    (key: keyof MissionForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/home/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        alert('Failed to save mission');
        return;
      }
      alert('Mission updated successfully!');
    } catch {
      alert('Network error saving mission');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2>Mission Section</h2>
      <p>Update the mission text and impact numbers displayed on the homepage.</p>

      <div className={styles.form}>
        <label className={styles.full}>
          Title
          <input value={form.title} onChange={setField('title')} />
        </label>

        <label className={styles.full}>
          Description
          <textarea rows={4} value={form.description} onChange={setField('description')} />
        </label>

        <label>
          Families Housed
          <input type="number" value={form.familiesHoused} onChange={setField('familiesHoused')} />
        </label>

        <label>
          Children in Care
          <input type="number" value={form.childrenInCare} onChange={setField('childrenInCare')} />
        </label>

        <label>
          Meals Served
          <input type="number" value={form.mealsServed} onChange={setField('mealsServed')} />
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
