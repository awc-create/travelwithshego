// src/components/about/barawe/history/historyData.ts

export type IconKey = 'books' | 'sail' | 'feather' | 'users' | 'history';

export type HistoryEntry = {
  id: string;
  title: string;
  summary: string;
  body: string;
  icon: IconKey;
  source?: {
    label: string;
    href: string;
  };
};

const historyData: HistoryEntry[] = [
  {
    id: 'early',
    title: 'Early City & Swahili World',
    summary: 'Content coming soon...',
    body: '',
    icon: 'sail',
  },
  {
    id: 'republic',
    title: 'Republic & Trade',
    summary: 'Content coming soon...',
    body: '',
    icon: 'books',
  },
  {
    id: 'scholars',
    title: 'Scholars & Language',
    summary: 'Content coming soon...',
    body: '',
    icon: 'feather',
  },
  {
    id: 'invasions',
    title: 'Invasions Through the Years',
    summary: 'Content coming soon...',
    body: '',
    icon: 'history',
  },
  {
    id: 'lineages',
    title: 'Lineages & Local Ties',
    summary: 'Content coming soon...',
    body: '',
    icon: 'users',
  },
  {
    id: 'recent',
    title: 'Recent History',
    summary: 'Content coming soon...',
    body: '',
    icon: 'books',
  },
];

export default historyData;
