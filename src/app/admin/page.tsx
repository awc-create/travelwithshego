// src/app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error('[ADMIN_SESSION_ERROR]', err);
    redirect('/login');
  }

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/login');
  }

  return <AdminClient />;
}
