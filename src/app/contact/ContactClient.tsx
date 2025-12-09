// src/app/contact/ContactClient.tsx
'use client';

import { FormEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './Contact.module.scss';
import mailAnim from '../../assets/lottie/mail.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactClient() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          data?.error || 'Something went wrong while sending your message. Please try again.'
        );
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('[CONTACT_FORM_ERROR]', err);
      setError('Something went wrong while sending your message. Please try again.');
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.leftCard}>
          <header className={styles.headingBlock}>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.title}>Let&apos;s talk</h1>
            <p className={styles.subtitle}>
              Questions about donations, Baraawe, or partnerships? Send us a note and we&apos;ll get
              back to you quickly.
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="How can we help?"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className={styles.formFooter}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !email || !message}
              >
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>

              <p className={styles.disclaimer}>
                By submitting, you agree that we can contact you about your message. Your details
                are kept private.
              </p>
            </div>

            <div className={styles.statusArea} aria-live="polite" aria-atomic="true">
              {error && <p className={styles.statusError}>{error}</p>}
              {status === 'success' && !error && (
                <p className={styles.statusSuccess}>
                  Thank you — your message has been sent. We&apos;ll be in touch soon.
                </p>
              )}
            </div>
          </form>
        </div>

        <aside className={styles.rightPanel}>
          <div className={styles.rightInner}>
            <div className={styles.lottieWrap}>
              <Lottie animationData={mailAnim} loop autoplay className={styles.lottie} />
            </div>
            <div className={styles.rightCopy}>
              <h2>Travel With Shego</h2>
              <p>Every message helps us improve how we support children and families in Baraawe.</p>
              <ul>
                <li>Questions about donating or receipts</li>
                <li>Ideas for fundraising or partnerships</li>
                <li>Media and speaking invitations</li>
              </ul>
              <p className={styles.rightNote}>We usually reply within 1–2 working days.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
