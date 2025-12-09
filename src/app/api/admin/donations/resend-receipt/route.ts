// src/app/api/admin/donations/resend-receipt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { buildDonationReceiptEmail } from '@/lib/email/donationReceiptEmail';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Optional but nice: make it explicit this is a Node, dynamic route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resendApiKey = process.env.RESEND_API_KEY;

// ✅ Safe: don’t construct Resend if there’s no API key (prevents build-time crash)
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as { donationId?: string } | null;

    if (!body?.donationId) {
      return NextResponse.json({ error: 'donationId is required.' }, { status: 400 });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: body.donationId },
    });

    if (!donation || !donation.email) {
      return NextResponse.json({ error: 'Donation or email not found.' }, { status: 404 });
    }

    if (donation.status !== 'SUCCEEDED') {
      return NextResponse.json(
        { error: 'Only succeeded donations can receive a receipt.' },
        { status: 400 }
      );
    }

    // 🔐 Ensure email infra is configured
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service is not configured (missing RESEND_API_KEY).' },
        { status: 500 }
      );
    }

    const from = process.env.RESEND_FROM;
    if (!from) {
      return NextResponse.json(
        { error: 'RESEND_FROM is not configured on the server.' },
        { status: 500 }
      );
    }

    const { subject, html, text } = buildDonationReceiptEmail({
      name: donation.name,
      email: donation.email,
      amountCents: donation.amountPence, // stored in cents
      currency: donation.currency || 'USD',
      frequency: donation.frequency,
      type: donation.type,
      createdAt: donation.createdAt,
      donationId: donation.id,
      stripeCheckoutSessionId: donation.stripeCheckoutSessionId,
    });

    await resend.emails.send({
      from,
      to: donation.email,
      subject,
      html,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ADMIN_DONATION_RESEND_RECEIPT_ERROR]', err);
    return NextResponse.json({ error: 'Failed to resend donation receipt.' }, { status: 500 });
  }
}
