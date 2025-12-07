// src/components/donation/direct/DirectDonation.tsx
'use client';

import { useState, type ChangeEvent } from 'react';
import styles from './DirectDonation.module.scss';

export const directDonationMetadata = {
  title: 'Direct Donation – Shelter, Education & Care',
  description:
    'Make a one-off or monthly Donation to support safe housing, education and daily care for children and families in Baraawe.',
};

type DirectDonationProps = {
  paypalUrl?: string | null;
};

type Frequency = 'once' | 'monthly';

const PRESET_AMOUNTS = [25, 50, 75, 150];

export default function DirectDonation({ paypalUrl }: DirectDonationProps) {
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [amount, setAmount] = useState<number | ''>(50);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handlePresetClick = (value: number) => {
    setAmount(value);
  };

  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setAmount(val === '' ? '' : Number(val));
  };

  const isAmountValid = typeof amount === 'number' && amount > 0;
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = isAmountValid && isEmailValid;

  // TODO: replace this with a call to /api/checkout/direct
  const handleCardCheckout = () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;

    // For now, just confirm we captured things
    alert(
      `Card checkout coming soon.\n\nAmount: £${amount}\nFrequency: ${frequency}\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
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

        {/* RIGHT PANEL UI */}
        <div className={styles.panel} aria-label="Donation options">
          {/* Frequency toggle */}
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

          {/* Amount selection */}
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

          {/* Donor details */}
          <div className={styles.detailsBlock}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="donor-name">
                Your name (optional)
              </label>
              <input
                id="donor-name"
                className={styles.textInput}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="donor-email">
                Email for your receipt
              </label>
              <input
                id="donor-email"
                className={styles.textInput}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {submitAttempted && !isEmailValid && (
                <p className={styles.error}>
                  Please enter a valid email so we can send your receipt.
                </p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="donor-message">
                Leave a message (optional)
              </label>
              <textarea
                id="donor-message"
                className={styles.textInput}
                rows={3}
                placeholder="A note of encouragement or how you heard about us"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Primary CTA — future Stripe/card checkout */}
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!canSubmit}
            onClick={handleCardCheckout}
          >
            Continue to secure card checkout
          </button>

          {/* PayPal express option */}
          {paypalUrl ? (
            <div className={styles.paypalBlock}>
              <div className={styles.paypalDivider}>
                <span>or</span>
              </div>

              <a href={paypalUrl} target="_blank" rel="noreferrer" className={styles.paypalButton}>
                Donate quickly with PayPal
              </a>

              <p className={styles.paypalNote}>
                Opens our secure PayPal Donation page in a new tab. You can give any amount and help
                families smile again.
              </p>
            </div>
          ) : null}

          <p className={styles.trustNote}>
            Payments are handled through our{' '}
            <span className={styles.gold}>secure Donation partners</span>. We never ask for bank
            details over social media.
          </p>
        </div>
      </div>
    </section>
  );
}
