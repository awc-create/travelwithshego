'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  /** 0–1: how much of the element must be visible before revealing */
  threshold?: number;
};

export default function Reveal({ children, className, threshold = 0.15 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal--in');
            obs.unobserve(el);
          }
        });
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={['reveal', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
