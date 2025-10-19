'use client';

import { useState } from 'react';
import styles from './AdminClient.module.scss';
import HomeSettings from '@/components/admin/home/HomeSettings';
import AboutUsSettings from '@/components/admin/about/AboutUsSettings';
import ContactSettings from '@/components/admin/contact/ContactSettings';

type SectionKey = 'home' | 'about' | 'contact';

const sections: { key: SectionKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact' },
];

export default function AdminClient() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSettings />; // ⬅️ has Hero / Mission / Gallery tabs
      case 'about':
        return <AboutUsSettings />;
      case 'contact':
        return <ContactSettings />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <button className={styles.toggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰ Menu
        </button>

        {sidebarOpen && (
          <nav className={styles.mobileNav}>
            <ul>
              {sections.map(({ key, label }) => (
                <li key={key}>
                  <button
                    className={activeSection === key ? styles.active : ''}
                    onClick={() => {
                      setActiveSection(key);
                      setSidebarOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav className={styles.desktopNav}>
          <ul>
            {sections.map(({ key, label }) => (
              <li key={key}>
                <button
                  className={activeSection === key ? styles.active : ''}
                  onClick={() => setActiveSection(key)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>{renderSection()}</main>
    </div>
  );
}
