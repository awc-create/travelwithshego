// src/app/page.tsx
import { getHomeData } from '@/lib/getHomeData';
import HomeClient from './HomeClient';
import styles from './page.module.scss';

export const metadata = {
  title: 'Travel With Shego — Supporting Children & Families',
  description: 'Helping children and families in Baraawe with education, housing and support.',
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main className={styles.main}>
      <HomeClient data={data} />
    </main>
  );
}
