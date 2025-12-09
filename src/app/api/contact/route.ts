// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { sendContactFormEmail, sendContactAutoReply } from '@/lib/email/contact';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fire both in parallel:
    // 1) Notify you/Shego
    // 2) Auto-reply to the sender
    await Promise.all([
      sendContactFormEmail({ name, email, message }),
      sendContactAutoReply({ name, email }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_FORM_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
