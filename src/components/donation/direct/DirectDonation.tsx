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

  // 🔑 Keep the raw input as a *string* so the user can type "0.01"
  const [amountInput, setAmountInput] = useState<string>('50'); // dollars as text

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper: parse the current string into a number (dollars)
  const parsedAmount: number | null = (() => {
    if (!amountInput.trim()) return null;
    const normalised = amountInput.replace(/,/g, '.');
    const n = Number(normalised);
    if (!Number.isFinite(n)) return null;
    return n;
  })();

  const handlePresetClick = (value: number) => {
    // Set to a clean value like "25" / "50" etc
    setAmountInput(value.toString());
  };

  // Allow decimals (up to 2 dp), ignore invalid keystrokes
  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty (user clearing field)
    if (raw === '') {
      setAmountInput('');
      return;
    }

    // Normalise comma to dot for typing
    const normalised = raw.replace(/,/g, '.');

    // Only digits + optional single dot + up to 2 decimals
    const validPattern = /^\d*\.?\d{0,2}$/;
    if (!validPattern.test(normalised)) {
      // Ignore invalid characters (do not update state)
      return;
    }

    // Store exactly what the user typed (with dot)
    setAmountInput(normalised);
  };

  const isAmountValid =
    parsedAmount !== null && Number.isFinite(parsedAmount) && parsedAmount >= 0.01;

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = isAmountValid && isEmailValid;

  const handleCardCheckout = async () => {
    setSubmitAttempted(true);
    setErrorMsg(null);

    if (!canSubmit || parsedAmount == null) return;

    try {
      setIsSubmitting(true);

      // Send *dollar* amount to backend; it will convert dollars → cents.
      const res = await fetch('/api/checkout/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount, // e.g. 0.01, 1.50, 25, etc.
          email,
          name,
          frequency,
          message,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setErrorMsg(data.error || 'Something went wrong starting the checkout.');
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('[DIRECT_DONATION_CHECKOUT_ERROR]', err);
      setErrorMsg('Unable to start secure card checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showEmailError = submitAttempted && !isEmailValid;
  const showAmountError = submitAttempted && !isAmountValid;

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
              <strong>$25</strong> – school supplies and learning materials.
            </li>
            <li>
              <strong>$75</strong> – hygiene kits and meals for a family.
            </li>
            <li>
              <strong>$150</strong> – a contribution towards safe housing.
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
                  className={`${styles.pill} ${parsedAmount === val ? styles.pillActive : ''}`}
                  onClick={() => handlePresetClick(val)}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className={styles.customRow}>
              <label className={styles.customLabel} htmlFor="direct-custom-amount">
                Or enter a custom amount
              </label>
              <div className={styles.customInputWrap}>
                <span className={styles.currency}>$</span>
                <input
                  id="direct-custom-amount"
                  inputMode="decimal"
                  className={styles.customInput}
                  value={amountInput}
                  onChange={handleCustomChange}
                  min={0.01}
                  step={0.01}
                />
              </div>
              {showAmountError && (
                <p className={styles.error}>Please enter an amount of at least $0.01.</p>
              )}
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
              {showEmailError && (
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

          {/* Primary CTA — Stripe/card checkout */}
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!canSubmit || isSubmitting}
            onClick={handleCardCheckout}
          >
            {isSubmitting ? 'Starting secure card checkout…' : 'Continue to secure card checkout'}
          </button>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

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
