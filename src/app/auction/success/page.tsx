// src/app/auction/success/page.tsx
import Link from 'next/link';

type Props = {
  searchParams: { session_id?: string };
};

export default function AuctionSuccessPage({ searchParams }: Props) {
  const { session_id } = searchParams;

  return (
    <main className="auction-success-page">
      <section style={{ padding: '60px 16px', textAlign: 'center' }}>
        <h1>Thank you for your bid</h1>
        <p>
          Your payment has been received. Your bid will now be counted towards the auction item.
        </p>
        {session_id && (
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Stripe session id: {session_id}</p>
        )}
        <p style={{ marginTop: '20px' }}>
          <Link href="/auction">← Back to all auction items</Link>
        </p>
      </section>
    </main>
  );
}
