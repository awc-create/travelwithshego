'use client';

import { useEffect, useRef, useState } from 'react';

export function useCountUpOnView(target: number, durationMs = 900, stepMs = 16) {
  const [value, setValue] = useState(0);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true;
            setReady(true);
          }
        });
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.15 }
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const totalSteps = Math.max(1, Math.floor(durationMs / stepMs));
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      const next = Math.round((target * step) / totalSteps);
      setValue(next >= target ? target : next);
      if (step >= totalSteps) clearInterval(timer);
    }, stepMs);
    return () => clearInterval(timer);
  }, [ready, target, durationMs, stepMs]);

  return { ref, value };
}
