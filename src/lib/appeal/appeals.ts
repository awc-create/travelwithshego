// src/lib/appeal/appeals.ts
//
// One appeal, many seasons.
//
// The cause never changes: we are building a school and a safe home for
// orphaned children in Baraawe. What changes is the moment we're asking in.
// This file resolves the current date to the right framing, so the site
// speaks to Ramadan, Eid, back-to-school or year-end without anyone having
// to remember to swap the copy.
//
// Islamic dates are lunar, so they're derived from the Umm al-Qura calendar
// via Intl rather than hardcoded. Gregorian moments are simple month checks.

export type AppealPillar = {
  amount: string;
  title: string;
  note: string;
};

export type Appeal = {
  /** Stable id, useful for analytics / testing. */
  id: string;
  /** Small uppercase label above the headline. */
  eyebrow: string;
  /** Headline. */
  title: string;
  /** Supporting paragraph. */
  body: string;
  /** Primary button text. */
  ctaLabel: string;
  /** Dark "focus" panel on the home banner. */
  focusLabel: string;
  focusMain: string;
  focusNote: string;
  /** Floating button labels. */
  fabDesktop: string;
  fabMobile: string;
  /** Screen-reader description for the floating button. */
  ariaLabel: string;
};

/**
 * What a gift actually buys. Deliberately identical in every season — the
 * occasion changes, the promise doesn't. Amounts are indicative.
 */
export const APPEAL_PILLARS: AppealPillar[] = [
  {
    amount: '$25',
    title: 'Books, uniforms & supplies',
    note: 'Everything one child needs to walk into class ready to learn.',
  },
  {
    amount: '$40',
    title: 'School meals for a child',
    note: 'A month of hot meals, so no child has to learn on an empty stomach.',
  },
  {
    amount: '$75',
    title: 'Skills for a parent',
    note: 'Sewing and carpentry training, so families can earn and stand on their own.',
  },
  {
    amount: '$150',
    title: 'A bed in the orphans’ home',
    note: 'A safe room, a bed and daily care for a child with nowhere else to go.',
  },
  {
    amount: '$500',
    title: 'Part of a classroom',
    note: 'Bricks, desks and materials that become a room children learn in for years.',
  },
];

/** The default appeal. Runs whenever no special season is active. */
const YEAR_ROUND: Appeal = {
  id: 'year-round',
  eyebrow: 'Build the School & Orphans’ Home',
  title: 'Help build a school — and a home for children who have none.',
  body: 'In Baraawe, most children have never sat in a classroom, and many have lost their parents. We are building one place that answers both: a school with real classrooms, and a safe home beside it where orphaned children live, eat and are cared for. Your gift builds it, brick by brick.',
  ctaLabel: 'Give to the School Fund',
  focusLabel: 'Where your gift goes',
  focusMain: 'Classrooms, beds, books & meals',
  focusNote:
    '100% of your gift goes to building and running the school and orphans’ home in Baraawe.',
  fabDesktop: 'Build the School',
  fabMobile: 'Donate',
  ariaLabel: 'Donate to build a school and a safe home for orphaned children in Baraawe.',
};

/**
 * Seasonal framings. Each one only changes the invitation — the destination
 * is always the school and the orphans' home.
 */
const SEASONS: Record<string, Appeal> = {
  ramadan: {
    id: 'ramadan',
    eyebrow: 'Ramadan · Build the School',
    title: 'This Ramadan, build something that outlives the month.',
    body: 'Ramadan Mubarak. Food runs out; a classroom doesn’t. Every gift this month goes towards the school and the safe home for orphaned children in Baraawe — classrooms, beds, books and daily meals. Many supporters choose this fund for their Ramadan giving.',
    ctaLabel: 'Give to the School Fund',
    focusLabel: 'Ramadan focus',
    focusMain: 'Classrooms, beds & daily meals',
    focusNote:
      '100% of your Ramadan gift goes towards building and running the school and orphans’ home in Baraawe.',
    fabDesktop: 'Ramadan · Build the School',
    fabMobile: 'Ramadan Appeal',
    ariaLabel:
      'Ramadan appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  eidAlFitr: {
    id: 'eid-al-fitr',
    eyebrow: 'Eid Mubarak · Build the School',
    title: 'Mark Eid with a classroom.',
    body: 'Eid Mubarak. As you celebrate with your family, you can give a child in Baraawe a desk to sit at, a bed to sleep in and a meal at lunchtime. Your Eid gift goes straight into building the school and the orphans’ home.',
    ctaLabel: 'Give an Eid Gift',
    focusLabel: 'Eid focus',
    focusMain: 'A desk, a bed, a meal',
    focusNote: '100% of your Eid gift goes towards the school and orphans’ home in Baraawe.',
    fabDesktop: 'Eid Gift · Build the School',
    fabMobile: 'Eid Gift',
    ariaLabel:
      'Eid appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  dhulHijjah: {
    id: 'dhul-hijjah',
    eyebrow: 'The First Ten Days · Build the School',
    title: 'Ten days of giving. One school that stays.',
    body: 'The first ten days of Dhul Hijjah are a season of generosity. This year, let that generosity become something you could walk into: classrooms, beds, books and meals for orphaned children in Baraawe.',
    ctaLabel: 'Give to the School Fund',
    focusLabel: 'This season’s focus',
    focusMain: 'Classrooms, beds & books',
    focusNote:
      '100% of your gift goes towards building and running the school and orphans’ home in Baraawe.',
    fabDesktop: 'First Ten Days · Give',
    fabMobile: 'Give Now',
    ariaLabel:
      'Dhul Hijjah appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  eidAlAdha: {
    id: 'eid-al-adha',
    eyebrow: 'Eid al-Adha · Build the School',
    title: 'Share the day. Give a child a place to belong.',
    body: 'Eid Mubarak. Alongside the meat you share, you can share something that lasts the year — a classroom to learn in, a bed to sleep in and a meal each school day for a child in Baraawe.',
    ctaLabel: 'Give an Eid Gift',
    focusLabel: 'Eid al-Adha focus',
    focusMain: 'Classrooms, beds & meals',
    focusNote: '100% of your Eid gift goes towards the school and orphans’ home in Baraawe.',
    fabDesktop: 'Eid al-Adha · Give',
    fabMobile: 'Eid Gift',
    ariaLabel:
      'Eid al-Adha appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  islamicNewYear: {
    id: 'islamic-new-year',
    eyebrow: 'A New Year · Build the School',
    title: 'Start the year by building a school.',
    body: 'A new year begins. Start it with something you can point to a year from now — a classroom finished, a room filled with beds, a child who is fed and in school in Baraawe.',
    ctaLabel: 'Give to the School Fund',
    focusLabel: 'This year’s focus',
    focusMain: 'Classrooms, beds & books',
    focusNote:
      '100% of your gift goes towards building and running the school and orphans’ home in Baraawe.',
    fabDesktop: 'New Year · Build the School',
    fabMobile: 'Give Now',
    ariaLabel:
      'New year appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  backToSchool: {
    id: 'back-to-school',
    eyebrow: 'Back to School · Build the School',
    title: 'While your children go back to school, help build theirs.',
    body: 'September means a new uniform, a fresh set of books, a classroom to walk into. In Baraawe, most children have none of those things. Your gift pays for the books and uniforms — and builds the classroom itself.',
    ctaLabel: 'Give to the School Fund',
    focusLabel: 'Back-to-school focus',
    focusMain: 'Books, uniforms & classrooms',
    focusNote:
      '100% of your gift goes towards building and running the school and orphans’ home in Baraawe.',
    fabDesktop: 'Back to School · Give',
    fabMobile: 'Give Now',
    ariaLabel:
      'Back to school appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },

  yearEnd: {
    id: 'year-end',
    eyebrow: 'Year-End Appeal · Build the School',
    title: 'Finish the year by finishing a classroom.',
    body: 'As the year closes, help us get one step further than we were: another classroom built, another room in the orphans’ home ready, another child fed and in class in Baraawe.',
    ctaLabel: 'Give Before the Year Ends',
    focusLabel: 'Year-end focus',
    focusMain: 'One more classroom',
    focusNote:
      '100% of your gift goes towards building and running the school and orphans’ home in Baraawe.',
    fabDesktop: 'Year-End · Build the School',
    fabMobile: 'Give Now',
    ariaLabel:
      'Year-end appeal — donate towards building a school and a safe home for orphaned children in Baraawe.',
  },
};

export type HijriDate = { year: number; month: number; day: number };

/**
 * Current Hijri (Umm al-Qura) date. Returns null if the runtime lacks the
 * calendar, so the site quietly falls back to the year-round appeal.
 */
export function getHijriDate(date: Date): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(date);

    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);

    const year = get('year');
    const month = get('month');
    const day = get('day');

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }

    return { year, month, day };
  } catch {
    return null;
  }
}

/**
 * Pick the appeal that fits the moment.
 *
 * Islamic occasions take priority, then Gregorian ones, then the year-round
 * default. Nothing here needs touching each year — the dates move on their own.
 */
export function resolveAppeal(date: Date = new Date()): Appeal {
  const hijri = getHijriDate(date);

  if (hijri) {
    const { month, day } = hijri;

    // Muharram 1–10 — Islamic new year through Ashura
    if (month === 1 && day <= 10) return SEASONS.islamicNewYear;

    // Ramadan — the whole month
    if (month === 9) return SEASONS.ramadan;

    // Shawwal 1–3 — Eid al-Fitr
    if (month === 10 && day <= 3) return SEASONS.eidAlFitr;

    // Dhul Hijjah 1–9 — the first ten days
    if (month === 12 && day <= 9) return SEASONS.dhulHijjah;

    // Dhul Hijjah 10–13 — Eid al-Adha and the days of Tashreeq
    if (month === 12 && day >= 10 && day <= 13) return SEASONS.eidAlAdha;
  }

  const gregorianMonth = date.getUTCMonth(); // 0-indexed

  // September — back to school
  if (gregorianMonth === 8) return SEASONS.backToSchool;

  // December — year-end giving
  if (gregorianMonth === 11) return SEASONS.yearEnd;

  return YEAR_ROUND;
}

export const DEFAULT_APPEAL = YEAR_ROUND;
