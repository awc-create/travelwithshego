// src/emails/DonationFailedEmail.tsx
import * as React from 'react';

type DonationFailedEmailProps = {
  donorName?: string | null;
  amountCents: number;
  currency: string;
  frequency: 'ONCE' | 'MONTHLY';
  reason?: string;
};

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function DonationFailedEmail({
  donorName,
  amountCents,
  currency,
  frequency,
  reason,
}: DonationFailedEmailProps) {
  const friendlyName = donorName?.trim() || 'friend';
  const amountFormatted = formatMoney(amountCents, currency);
  const isMonthly = frequency === 'MONTHLY';

  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, sans-serif',
          backgroundColor: '#f3f4f6',
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '24px 0' }}>
                <table
                  width="100%"
                  style={{
                    maxWidth: '640px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #fee2e2',
                    boxShadow: '0 10px 30px rgba(248,113,113,0.25)',
                    overflow: 'hidden',
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: '16px 24px',
                          background: 'linear-gradient(120deg,#7f1d1d,#b91c1c,#dc2626)',
                          color: '#fef2f2',
                          borderBottom: '1px solid #fecaca',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            opacity: 0.9,
                            marginBottom: '4px',
                          }}
                        >
                          Travel With Shego
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>
                          Your Donation payment did not go through
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '20px 24px 12px' }}>
                        <p
                          style={{
                            margin: '0 0 12px',
                            fontSize: '15px',
                            color: '#111827',
                          }}
                        >
                          Dear {friendlyName},
                        </p>
                        <p
                          style={{
                            margin: '0 0 12px',
                            fontSize: '14px',
                            color: '#374151',
                            lineHeight: 1.6,
                          }}
                        >
                          We attempted to charge <strong>{amountFormatted}</strong> for your{' '}
                          {isMonthly ? 'monthly' : 'one-off'} Donation, but the payment did not
                          complete.
                        </p>
                        {reason && (
                          <p
                            style={{
                              margin: '0 0 12px',
                              fontSize: '14px',
                              color: '#b91c1c',
                            }}
                          >
                            Stripe reported: {reason}
                          </p>
                        )}
                        <p
                          style={{
                            margin: '0 0 12px',
                            fontSize: '14px',
                            color: '#374151',
                            lineHeight: 1.6,
                          }}
                        >
                          Please return to the Travel With Shego Donation page to try again or
                          update your card details. If the issue continues, contact your bank for
                          more information.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          Please do not reply to this email — this inbox is not monitored.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
