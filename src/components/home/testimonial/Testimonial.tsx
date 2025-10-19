'use client';

import Image from 'next/image';
import styles from './Testimonial.module.scss';

type Props = {
  id?: string;
  quote: string;
  author: string;
  role?: string;
  avatarSrc?: string; // optional headshot/logo
};

export default function Testimonial({ id = 'testimonial', quote, author, role, avatarSrc }: Props) {
  return (
    <section id={id} className={styles.block} aria-label="Testimonial">
      <div className="container">
        <figure className={styles.card}>
          {avatarSrc ? (
            <div className={styles.avatar}>
              <Image src={avatarSrc} alt={author} width={64} height={64} />
            </div>
          ) : null}

          <blockquote className={styles.quote}>“{quote}”</blockquote>
          <figcaption className={styles.meta}>
            <strong>{author}</strong>
            {role ? <span> · {role}</span> : null}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
