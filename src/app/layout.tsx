import '@/styles/Global.scss';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import '@/styles/founderTheme.scss';
import '@/styles/donationTheme.scss';
import 'leaflet/dist/leaflet.css';

import RamadanFloatingButton from '@/components/common/RamadanFloatingButton';

const ramadanUrl = process.env.NEXT_PUBLIC_RAMADAN_DONATION_URL ?? null;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main>{children}</main>

        {/* GLOBAL FLOATING BUTTON */}
        <RamadanFloatingButton paypalUrl={ramadanUrl} />

        <Footer />
      </body>
    </html>
  );
}
