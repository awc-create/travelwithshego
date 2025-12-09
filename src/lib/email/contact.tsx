// src/lib/email/contact.tsx
import React from 'react';
import { resend } from '@/lib/resend';
import { ContactFormEmail } from '@/emails/ContactFormEmail';
import { ContactAutoReplyEmail } from '@/emails/ContactAutoReplyEmail';

const FROM = process.env.RESEND_FROM || 'Travel With Shego <no-reply@travelwithshego.com>';

// This is where messages from the contact form go (your inbox)
const TO = process.env.RESEND_CONTACT_TO || 'shegosaid@gmail.com';

/**
 * Email sent TO YOU / TEAM with the visitor's message
 */
export async function sendContactFormEmail(options: {
  name?: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = options;

  const safeName = (name || '').toString().trim();
  const safeEmail = email.toString().trim();
  const safeMessage = message.toString().trim();
  const submittedAt = new Date();

  const subject = safeName
    ? `New contact form message from ${safeName}`
    : 'New contact form message';

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    react: (
      <ContactFormEmail
        name={safeName || null}
        email={safeEmail}
        message={safeMessage}
        submittedAt={submittedAt}
      />
    ),
    // So when you click Reply in Gmail/Outlook, it goes back to the sender
    replyTo: safeEmail,
  });
}

/**
 * Auto-reply sent BACK to the visitor
 */
export async function sendContactAutoReply(options: { name?: string; email: string }) {
  const { name, email } = options;

  const safeName = (name || '').toString().trim();
  const safeEmail = email.toString().trim();

  if (!safeEmail) return;

  await resend.emails.send({
    from: FROM,
    to: safeEmail,
    subject: safeName ? `Thanks for getting in touch, ${safeName}` : 'Thanks for getting in touch',
    react: <ContactAutoReplyEmail name={safeName || 'there'} />,
    // If they hit reply, it comes to you
    replyTo: process.env.CONTACT_REPLY_TO || 'shegosaid@gmail.com',
  });
}
