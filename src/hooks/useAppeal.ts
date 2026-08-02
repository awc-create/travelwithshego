'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_APPEAL, resolveAppeal, type Appeal } from '@/lib/appeal/appeals';

/**
 * Returns the appeal that matches today's date.
 *
 * The first render (server and hydration) always uses the year-round appeal
 * so the markup matches; the seasonal framing is applied immediately after
 * mount using the visitor's own clock. That keeps cached/static pages from
 * ever showing a stale season — the page corrects itself in the browser.
 */
export function useAppeal(): Appeal {
  const [appeal, setAppeal] = useState<Appeal>(DEFAULT_APPEAL);

  useEffect(() => {
    setAppeal(resolveAppeal(new Date()));
  }, []);

  return appeal;
}
