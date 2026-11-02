import type { LocalizedText } from '@/types/app';
export { bi } from '../learning';
export type MinistryGuide = {
  n: number;
  slug: string;
  ministry: LocalizedText;
  title: LocalizedText;
  benefit: LocalizedText;
  steps: LocalizedText[];
  links: { label: LocalizedText; url: string }[];
  prompts: LocalizedText[];
};
