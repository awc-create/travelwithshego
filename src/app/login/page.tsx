// src/app/login/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Admin Login – Travel with Shego',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
          }}
        >
          <p>Loading login…</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
