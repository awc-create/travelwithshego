import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'contact';

export async function GET() {
  const contact = await prisma.contactPage.findUnique({ where: { key: KEY } });
  return NextResponse.json(
    contact ?? {
      key: KEY,
      title: 'Contact Us',
      description: 'Drop us a message and we’ll get back to you fast 🚀',
      submitLabel: 'Send Message',
      successMessage: 'Message sent! We’ll get back to you soon.',
      recipientEmail: null,
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      title: string;
      description: string;
      submitLabel: string;
      successMessage: string;
      recipientEmail: string | null;
    }>;

    const title = (body.title ?? '').toString().trim();
    const description = (body.description ?? '').toString().trim();
    const submitLabel = (body.submitLabel ?? '').toString().trim();
    const successMessage = (body.successMessage ?? '').toString().trim();
    const recipientEmail = body.recipientEmail ? body.recipientEmail.toString().trim() : null;

    if (!title || !description || !submitLabel || !successMessage) {
      return NextResponse.json(
        { error: 'title, description, submitLabel, and successMessage are required.' },
        { status: 400 }
      );
    }

    const saved = await prisma.contactPage.upsert({
      where: { key: KEY },
      create: { key: KEY, title, description, submitLabel, successMessage, recipientEmail },
      update: { title, description, submitLabel, successMessage, recipientEmail },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error('POST /api/contact failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
