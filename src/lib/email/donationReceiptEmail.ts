// src/lib/email/donationReceiptEmail.ts

export type DonationReceiptParams = {
  name: string | null;
  email: string;
  amountCents: number;
  currency: string;
  frequency: 'ONCE' | 'MONTHLY' | string;
  type: 'DIRECT' | 'AUCTION' | string;
  createdAt: Date;
  donationId: string;
  stripeCheckoutSessionId?: string | null;
};

function formatMoney(amountCents: number, currency: string): string {
  const value = amountCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: Date): string {
  // You can adjust locale/timezone as needed
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Builds subject, HTML and text for a donation receipt email.
 * Use with Resend's emails.send({ subject, html, text, ... })
 */
export function buildDonationReceiptEmail(params: DonationReceiptParams) {
  const {
    name,
    email,
    amountCents,
    currency,
    frequency,
    type,
    createdAt,
    donationId,
    stripeCheckoutSessionId,
  } = params;

  const displayName = name?.trim() || 'there';
  const amountFormatted = formatMoney(amountCents, currency);
  const dateFormatted = formatDate(createdAt);

  const freqLabel = frequency === 'MONTHLY' ? 'monthly donation' : 'one-off donation';

  const typeLabel = type === 'AUCTION' ? 'auction donation' : 'direct donation';

  const referenceLines = [
    `Internal reference: ${donationId}`,
    stripeCheckoutSessionId ? `Stripe session: ${stripeCheckoutSessionId}` : null,
  ].filter(Boolean) as string[];

  const subject = `Your donation receipt – Travel With Shego`;

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <tr>
        <td style="padding: 18px 20px; background: #020617; color: #f9fafb;">
          <h1 style="margin: 0 0 4px; font-size: 18px;">Travel With Shego</h1>
          <p style="margin: 0; font-size: 13px; opacity: 0.85;">
            Donation receipt – please keep this for your records.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 14px; color: #111827;">
            Hi ${displayName},
          </p>

          <p style="margin: 0 0 12px; font-size: 14px; color: #111827;">
            Thank you for your ${freqLabel} to support families in Baraawe.
          </p>

          <table cellpadding="0" cellspacing="0" style="width: 100%; margin: 12px 0 16px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Amount</td>
              <td style="padding: 6px 0; font-size: 13px; color: #111827; text-align: right;"><strong>${amountFormatted}</strong> ${currency.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Type</td>
              <td style="padding: 6px 0; font-size: 13px; color: #111827; text-align: right;">${typeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Date</td>
              <td style="padding: 6px 0; font-size: 13px; color: #111827; text-align: right;">${dateFormatted}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Receipt sent to</td>
              <td style="padding: 6px 0; font-size: 13px; color: #111827; text-align: right;">${email}</td>
            </tr>
          </table>

          <div style="margin: 0 0 16px; padding: 10px 12px; border-radius: 10px; background: #fef3c7; border: 1px solid #fde68a;">
            <p style="margin: 0 0 4px; font-size: 13px; color: #854d0e; font-weight: 600;">
              What your gift supports
            </p>
            <p style="margin: 0; font-size: 13px; color: #92400e;">
              Your donation helps provide safe places to sleep, time in school, regular meals and practical support for children and families in Baraawe.
            </p>
          </div>

          <div style="margin: 0 0 16px;">
            <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280; font-weight: 600;">
              Reference
            </p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #4b5563;">
              ${referenceLines.map((line) => `<li>${line}</li>`).join('')}
            </ul>
          </div>

          <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">
            Please note: this is a simple donation receipt for your records. It does not constitute tax advice. 
            If you plan to claim tax relief, please speak with your accountant or local tax authority.
          </p>

          <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">
            <strong>Do not reply:</strong> this email address is not monitored. 
            If you need to contact us, please email 
            <a href="mailto:info@travelwithshego.com" style="color: #0ea5e9; text-decoration: none;">info@travelwithshego.com</a>.
          </p>

          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            We never see or store your full card details. Payments are processed securely by our payment partners.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 10px 20px 16px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} Travel With Shego. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;

  const text = [
    `Travel With Shego – Donation receipt`,
    ``,
    `Hi ${displayName},`,
    ``,
    `Thank you for your ${freqLabel} to support families in Baraawe.`,
    ``,
    `Amount: ${amountFormatted} ${currency.toUpperCase()}`,
    `Type: ${typeLabel}`,
    `Date: ${dateFormatted}`,
    `Receipt sent to: ${email}`,
    ``,
    `What your gift supports:`,
    `Your donation helps provide safe places to sleep, time in school, regular meals and practical support for children and families in Baraawe.`,
    ``,
    `Reference:`,
    ...referenceLines.map((l) => `- ${l}`),
    ``,
    `Please do not reply to this email – this inbox is not monitored.`,
    `If you need to contact us, email info@travelwithshego.com.`,
    ``,
    `We never see or store your full card details. Payments are processed securely by our payment partners.`,
    ``,
    `© ${new Date().getFullYear()} Travel With Shego. All rights reserved.`,
  ].join('\n');

  return { subject, html, text };
}
