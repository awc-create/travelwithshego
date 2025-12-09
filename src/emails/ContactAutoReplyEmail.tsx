// src/emails/ContactAutoReplyEmail.tsx
import * as React from 'react';
import Image from 'next/image';

type Props = {
  name?: string;
};

export function ContactAutoReplyEmail({ name }: Props) {
  const displayName = name && name.trim().length > 0 ? name : 'there';

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <Image
            src="https://travelwithshego.com/assets/logo-tws.png"
            alt="Travel With Shego"
            style={styles.logo}
          />
        </div>

        <h1 style={styles.title}>Thank you for your message</h1>

        <p style={styles.text}>Hi {displayName},</p>

        <p style={styles.text}>
          We’ve received your message and our team will get back to you as soon as possible. Thank
          you for taking the time to contact Travel With Shego.
        </p>

        <p style={styles.text}>
          If your enquiry is urgent, you can reply directly to this email and we’ll do our best to
          prioritise it.
        </p>

        <hr style={styles.hr} />

        <p style={styles.footer}>
          Travel With Shego
          <br />
          <a href="https://travelwithshego.com" style={styles.link}>
            travelwithshego.com
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: '#f3f4f6',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    maxWidth: '540px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    padding: '24px 24px 20px',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  logo: {
    maxWidth: '140px',
    height: 'auto',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 12px',
    color: '#111827',
    textAlign: 'center' as const,
  },
  text: {
    fontSize: '14px',
    lineHeight: 1.6,
    margin: '0 0 10px',
    color: '#374151',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #e5e7eb',
    margin: '18px 0',
  },
  footer: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center' as const,
    margin: 0,
  },
  link: {
    color: '#111827',
    textDecoration: 'none',
  },
};
