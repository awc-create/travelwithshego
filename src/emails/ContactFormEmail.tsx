// src/emails/ContactFormEmail.tsx
import * as React from 'react';

type ContactFormEmailProps = {
  name?: string | null;
  email: string;
  message: string;
  submittedAt: Date;
};

export function ContactFormEmail({ name, email, message, submittedAt }: ContactFormEmailProps) {
  const displayName = name?.trim() || 'Not provided';

  const submittedAtStr = submittedAt.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: '14px',
        color: '#0f172a',
        backgroundColor: '#f3f4f6',
        padding: '16px',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '16px 18px 18px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#6b7280',
          }}
        >
          Travel With Shego – Contact Form
        </p>

        <h1
          style={{
            margin: '0 0 4px',
            fontSize: '18px',
            color: '#020617',
          }}
        >
          New message from the website
        </h1>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: '13px',
            color: '#4b5563',
          }}
        >
          Someone submitted the contact form on the Travel With Shego site.
        </p>

        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  fontWeight: 600,
                  color: '#4b5563',
                  width: '120px',
                  verticalAlign: 'top',
                }}
              >
                Name
              </td>
              <td style={{ padding: '4px 8px', color: '#111827' }}>{displayName}</td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  fontWeight: 600,
                  color: '#4b5563',
                  verticalAlign: 'top',
                }}
              >
                Email
              </td>
              <td style={{ padding: '4px 8px', color: '#111827' }}>{email}</td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  fontWeight: 600,
                  color: '#4b5563',
                  verticalAlign: 'top',
                }}
              >
                Submitted
              </td>
              <td style={{ padding: '4px 8px', color: '#111827' }}>{submittedAtStr}</td>
            </tr>
          </tbody>
        </table>

        <p
          style={{
            margin: '0 0 4px',
            fontWeight: 600,
            fontSize: '13px',
            color: '#111827',
          }}
        >
          Message
        </p>
        <div
          style={{
            margin: '0 0 16px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            whiteSpace: 'pre-wrap',
            fontSize: '13px',
            color: '#111827',
          }}
        >
          {message}
        </div>

        <p
          style={{
            margin: '0',
            fontSize: '12px',
            color: '#6b7280',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '8px',
          }}
        >
          You can reply directly to this email to contact the sender.
        </p>
      </div>
    </div>
  );
}
