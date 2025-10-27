// src/components/about/barawe/map/Map.tsx
'use client';

import dynamic from 'next/dynamic';
import styles from './Map.module.scss';

const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

export default function Map() {
  return (
    <section className={styles.heroMap} aria-labelledby="map-title">
      <div className={styles.titleWrapper}>
        <p className={styles.eyebrow}>Discover the Location</p>
        <h2 id="map-title" className={styles.title}>
          Where Is <span className={styles.highlight}>Baraawe?</span>
        </h2>
        <p className={styles.subtitle}>
          A coastal city nestled along the Indian Ocean — rich in culture, heritage, and resilience.
        </p>
      </div>

      {/* Map + Info Grid */}
      <div className={styles.mapGrid}>
        {/* Info Card */}
        <aside className={styles.infoCard} aria-label="Baraawe key facts">
          <div className={styles.infoHeader}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.dot} aria-hidden />
            <span className={styles.dot} aria-hidden />
            <p className={styles.infoTitle}>Key Facts</p>
          </div>

          <ul className={styles.infoList} role="list">
            <li className={styles.infoItem}>
              <span className={styles.icon} aria-hidden>
                🌍
              </span>
              <div>
                <p className={styles.label}>Coordinates</p>
                <p className={styles.value}>1.1167° N, 44.0333° E</p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.icon} aria-hidden>
                🏝️
              </span>
              <div>
                <p className={styles.label}>Location</p>
                <p className={styles.value}>~180 km SW of Mogadishu</p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.icon} aria-hidden>
                🌊
              </span>
              <div>
                <p className={styles.label}>Geography</p>
                <p className={styles.value}>Indian Ocean coast; white sands & coral-blue waters</p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.icon} aria-hidden>
                🕋
              </span>
              <div>
                <p className={styles.label}>Culture</p>
                <p className={styles.value}>
                  Swahili–Arab trading heritage; Bravanese (Maay) dialect
                </p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.icon} aria-hidden>
                🏛️
              </span>
              <div>
                <p className={styles.label}>History</p>
                <p className={styles.value}>
                  Medieval Ajuran Sultanate; centre of Islamic learning
                </p>
              </div>
            </li>
          </ul>

          <div className={styles.tags} aria-label="Quick tags">
            <span className={styles.tag}>Port City</span>
            <span className={styles.tag}>Lower Shabelle</span>
            <span className={styles.tag}>Somalia</span>
          </div>
        </aside>

        {/* Map */}
        <div className={styles.mapWrapper}>
          <MapClient />
          <div className={styles.blurLayer} aria-hidden />
        </div>
      </div>
    </section>
  );
}
