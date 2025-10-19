import '@/styles/Global.scss';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
