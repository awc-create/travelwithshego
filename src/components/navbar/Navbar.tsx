'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';
import { NAV_LINKS } from '@/config/menu.config';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Image src="/assets/footer-light.png" alt="Logo" width={50} height={50} priority />
        </Link>

        <div className={styles.desktopLinks}>
          {NAV_LINKS.map(({ slug, label }) => {
            const href = `/${slug}`;
            return (
              <Link
                key={slug}
                href={href}
                onClick={closeMenu}
                className={isLinkActive(href) ? styles.active : ''}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(({ slug, label }) => {
          const href = `/${slug}`;
          return (
            <Link
              key={slug}
              href={href}
              onClick={closeMenu}
              className={isLinkActive(href) ? styles.active : ''}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
