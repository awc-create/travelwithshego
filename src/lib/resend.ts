// src/lib/resend.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';

export const RESEND_ENABLED = Boolean(RESEND_API_KEY);
export const RESEND_FROM =
  process.env.RESEND_FROM ?? 'Travel With Shego <donations@travelwithshego.com>';
export const RESEND_CONTACT_TO = process.env.RESEND_CONTACT_TO ?? 'shegosaid@gmail.com';

export const resend = RESEND_ENABLED ? new Resend(RESEND_API_KEY) : undefined;

if (!RESEND_ENABLED) {
  // This is safe at build time – just a warning, no crash
  console.warn('[resend] RESEND_API_KEY not set. Email features are disabled.');
}
