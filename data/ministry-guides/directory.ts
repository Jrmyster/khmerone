import { apps } from '../apps';
import { ministryGuides } from './index';
import { bi, type MinistryGuide } from './types';

export type DirectoryEntry = Pick<MinistryGuide, 'n' | 'title' | 'ministry' | 'benefit'> & { url: string };

const dedicated = [
  [19, '/posts-and-telecommunications', bi('Posts and Telecommunications', 'ប្រៃសណីយ៍ និងទូរគមនាគមន៍')],
  [21, '/interior', bi('Interior', 'មហាផ្ទៃ')],
  [23, '/inspection', bi('Inspection', 'អធិការកិច្ច')],
  [26, '/international-services', bi('Foreign Affairs and International Cooperation', 'ការបរទេស និងសហប្រតិបត្តិការអន្តរជាតិ')],
  [27, '/community-safety', bi('National Defence', 'ការពារជាតិ')],
  [28, '/public-services', bi('Office of the Council of Ministers', 'ទីស្តីការគណៈរដ្ឋមន្ត្រី')],
] as const;

export const ministryDirectory: DirectoryEntry[] = [
  ...ministryGuides.map(({ n, slug, title, ministry, benefit }) => ({ n, url: '/ministries/' + slug, title, ministry, benefit })),
  ...dedicated.map(([n, url, ministry]) => {
    const app = apps.find(entry => entry.url === url);
    if (!app) throw new Error('Missing ministry tool ' + url);
    return { n, url, ministry, title: app.title, benefit: app.description };
  }),
];
