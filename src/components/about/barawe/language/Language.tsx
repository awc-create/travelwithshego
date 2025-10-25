// src/components/about/barawe/language/Language.tsx
import Link from 'next/link';
import styles from './Language.module.scss';

type Props = {
  title?: string;
  desc?: string;
  facts?: { label: string; value: string }[];
  dictionaryHref: string; // required
  dictionaryLabel?: string;
};

export default function Language({
  title = 'Language of Baraawe: Chimiini',
  desc = 'Chimiini (Bravanese Swahili) is a coastal Bantu language shaped by centuries of trade and scholarship. Preserving it protects memory, poetry, and community identity.',
  facts = [
    { label: 'Family', value: 'Swahili (Bantu), with local archaisms' },
    { label: 'Scripts', value: 'Arabic & Latin traditions' },
    { label: 'Notable', value: 'Uways al-Barawi, Qassim al-Barawi, Dada Masiti' },
  ],
  dictionaryHref,
  dictionaryLabel = 'Open the Baraawe Dictionary →',
}: Props) {
  return (
    <section className={styles.wrap} aria-labelledby="language-heading">
      <div className={styles.card}>
        <div className={styles.head}>
          <h2 id="language-heading">{title}</h2>
          <p className={styles.note}>{desc}</p>
        </div>

        <ul className={styles.facts}>
          {facts.map((f) => (
            <li key={f.label}>
              <strong>{f.label}:</strong> <span>{f.value}</span>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link
            href={dictionaryHref}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.cta}
          >
            {dictionaryLabel}
          </Link>
          <span className={styles.secondary}>
            Tip: Add your favourite words so others can learn.
          </span>
        </div>
      </div>
    </section>
  );
}
