import { bi } from './types';
import { peopleResources, type LearningResource } from './peopleResources';
import { tourismListings } from './tourismListings';
import type { Locale } from '../../types/app';

export function resourcesFor(n: number): LearningResource[] {
  if (n !== 16) return peopleResources[n] || [];
  return tourismListings.map(listing => {
    const details = (lang: Locale) => [listing.location, listing.ownership, listing.booking, listing.access].map(field => field[lang]).join('\n\n');
    return { title: listing.title, detail: bi(details('en'), details('km')), label: bi('Visit the operator’s website', 'ទៅគេហទំព័ររបស់ប្រតិបត្តិករ'), url: listing.url };
  });
}
