import '@/styles/Global.scss';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import '@/styles/founderTheme.scss';
import '@/styles/donationTheme.scss';
import 'leaflet/dist/leaflet.css';

import AppealFloatingButton from '@/components/campaign/AppealFloatingButton';

const appealUrl = 'https://www.paypal.com/ncp/payment/7RSWYTZQDP7NL';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main>{children}</main>

        {/* GLOBAL FLOATING BUTTON — copy adapts to the season (Ramadan, Eid, back-to-school, year-end) */}
        <AppealFloatingButton paypalUrl={appealUrl} />

        <Footer />
      </body>
    </html>
  );
}
