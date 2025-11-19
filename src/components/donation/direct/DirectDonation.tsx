'use client';

import { useState } from 'react';
import styles from './DirectDonation.module.scss';

export const directDonationMetadata = {
  title: 'Direct Donation – Shelter, Education & Care',
  description:
    'Make a one-off or monthly Donation to support safe housing, education and daily care for children and families in Baraawe.',
};

type Frequency = 'once' | 'monthly';

const PRESET_AMOUNTS = [25, 50, 75, 150];

export default function DirectDonation() {
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [amount, setAmount] = useState<number | ''>(50);

  const handlePresetClick = (value: number) => {
    setAmount(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setAmount(val === '' ? '' : Number(val));
  };

  return (
    <section id="direct-give" className={styles.wrap} aria-labelledby="direct-donation-heading">
      <div className={styles.inner}>
        {/* LEFT COPY */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Direct Giving</p>

          <h2 id="direct-donation-heading" className={styles.heading}>
            Choose how you’d like to <span className={styles.gold}>Donate</span>.
          </h2>

          <p className={styles.intro}>
            A direct <span className={styles.gold}>Donation</span> helps us keep a simple promise:
            safe places to sleep, time in school, regular meals and practical support for families
            in Baraawe.
          </p>

          <ul className={styles.impactList}>
            <li>
              <strong>£25</strong> – school supplies and learning materials.
            </li>
            <li>
              <strong>£75</strong> – hygiene kits and meals for a family.
            </li>
            <li>
              <strong>£150</strong> – a contribution towards safe housing.
            </li>
          </ul>

          <p className={styles.note}>
            You’ll receive a simple receipt by email. We don’t take a cut from your gift – it goes
            straight to work in Baraawe.
          </p>
        </div>

        {/* RIGHT FORM UI (non-functional for now) */}
        <div className={styles.panel} aria-label="Donation options">
          <div className={styles.frequencyToggle} role="radiogroup" aria-label="Donation frequency">
            <button
              type="button"
              role="radio"
              aria-checked={frequency === 'once'}
              className={`${styles.freqBtn} ${frequency === 'once' ? styles.freqBtnActive : ''}`}
              onClick={() => setFrequency('once')}
            >
              One-off Donation
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={frequency === 'monthly'}
              className={`${styles.freqBtn} ${frequency === 'monthly' ? styles.freqBtnActive : ''}`}
              onClick={() => setFrequency('monthly')}
            >
              Monthly Donation
            </button>
          </div>

          <div className={styles.amountBlock}>
            <p className={styles.label}>Choose an amount</p>
            <div className={styles.pills}>
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.pill} ${amount === val ? styles.pillActive : ''}`}
                  onClick={() => handlePresetClick(val)}
                >
                  £{val}
                </button>
              ))}
            </div>

            <div className={styles.customRow}>
              <label className={styles.customLabel} htmlFor="direct-custom-amount">
                Or enter a custom amount
              </label>
              <div className={styles.customInputWrap}>
                <span className={styles.currency}>£</span>
                <input
                  id="direct-custom-amount"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={styles.customInput}
                  value={amount === '' ? '' : amount}
                  onChange={handleCustomChange}
                />
              </div>
            </div>
          </div>

          <button type="button" className={styles.submitBtn}>
            Continue to secure checkout
          </button>

          <p className={styles.trustNote}>
            Payments are handled through our{' '}
            <span className={styles.gold}>secure Donation partner</span>. We never ask for bank
            details over social media.
          </p>
        </div>
      </div>
    </section>
  );
}
