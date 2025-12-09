// src/emails/DonationReceiptEmail.tsx
import * as React from 'react';

type DonationReceiptEmailProps = {
  donorName?: string | null;
  amountCents: number;
  currency: string;
  frequency: 'ONCE' | 'MONTHLY';
  createdAt: Date;
  reference: string;
  isRecurringCharge?: boolean;
};

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

export function DonationReceiptEmail({
  donorName,
  amountCents,
  currency,
  frequency,
  createdAt,
  reference,
  isRecurringCharge,
}: DonationReceiptEmailProps) {
  const friendlyName = donorName?.trim() || 'friend';
  const amountFormatted = formatMoney(amountCents, currency);
  const dateFormatted = createdAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const isMonthly = frequency === 'MONTHLY';
  // const isDirect = type === 'DIRECT'; // not used – safe to remove

  const headline = isMonthly
    ? isRecurringCharge
      ? `Thank you for your monthly Donation`
      : `Thank you for starting a monthly Donation`
    : 'Thank you for your Donation';

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
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ padding: '24px 0' }}>
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="100%"
                  style={{
                    maxWidth: '640px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          padding: '16px 24px',
                          borderBottom: '1px solid #e5e7eb',
                          background: 'linear-gradient(120deg,#0f172a,#111827,#1f2937)',
                          color: '#f9fafb',
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
                          Travel With Shego · Baraawe
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>{headline}</div>
                      </td>
                    </tr>

                    {/* Content */}
                    <tr>
                      <td style={{ padding: '20px 24px 6px' }}>
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
                          Thank you for your{' '}
                          <strong>{isMonthly ? 'monthly Donation' : 'one-off Donation'}</strong> to
                          support children and families in Baraawe. Your gift helps us provide safe
                          places to sleep, time in school, regular meals and practical support.
                        </p>

                        {isMonthly && (
                          <p
                            style={{
                              margin: '0 0 12px',
                              fontSize: '14px',
                              color: '#374151',
                              lineHeight: 1.6,
                            }}
                          >
                            This receipt confirms the {isRecurringCharge ? 'latest' : 'first'}{' '}
                            monthly charge for your ongoing Donation.
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Receipt summary */}
                    <tr>
                      <td style={{ padding: '0 24px 18px' }}>
                        <table
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#f9fafb',
                          }}
                        >
                          <tbody>
                            <tr>
                              <td
                                colSpan={2}
                                style={{
                                  padding: '10px 14px 4px',
                                  fontSize: '13px',
                                  color: '#6b7280',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.12em',
                                }}
                              >
                                Donation receipt
                              </td>
                            </tr>

                            <tr>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '13px',
                                  color: '#6b7280',
                                  width: '35%',
                                }}
                              >
                                Amount
                              </td>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '14px',
                                  color: '#111827',
                                  fontWeight: 600,
                                }}
                              >
                                {amountFormatted}
                              </td>
                            </tr>

                            <tr>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '13px',
                                  color: '#6b7280',
                                }}
                              >
                                Date
                              </td>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '14px',
                                  color: '#111827',
                                }}
                              >
                                {dateFormatted}
                              </td>
                            </tr>

                            <tr>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '13px',
                                  color: '#6b7280',
                                }}
                              >
                                Frequency
                              </td>
                              <td
                                style={{
                                  padding: '4px 14px',
                                  fontSize: '14px',
                                  color: '#111827',
                                }}
                              >
                                {isMonthly ? 'Monthly' : 'One-off'}
                              </td>
                            </tr>

                            <tr>
                              <td
                                style={{
                                  padding: '4px 14px 10px',
                                  fontSize: '13px',
                                  color: '#6b7280',
                                }}
                              >
                                Reference
                              </td>
                              <td
                                style={{
                                  padding: '4px 14px 10px',
                                  fontSize: '13px',
                                  color: '#111827',
                                  wordBreak: 'break-all',
                                }}
                              >
                                {reference}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer / legal */}
                    <tr>
                      <td
                        style={{
                          padding: '8px 24px 18px',
                          fontSize: '12px',
                          color: '#6b7280',
                          lineHeight: 1.5,
                        }}
                      >
                        <p style={{ margin: '0 0 8px' }}>
                          This email acts as a receipt for your records. Please keep it in a safe
                          place.
                        </p>
                        <p style={{ margin: '0 0 8px' }}>
                          This inbox is not monitored. <strong>Please do not reply</strong> to this
                          email. If you have any questions about your Donation, contact us through
                          the Travel With Shego website instead.
                        </p>
                        <p style={{ margin: 0 }}>
                          Thank you again for standing with families in Baraawe.
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
