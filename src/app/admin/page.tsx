// src/app/admin/page.tsx
import type { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Travel With Shego',
  description: 'Manage home page, about page, contact page, and auction items.',
};

export default function AdminPage() {
  return <AdminClient />;
}
