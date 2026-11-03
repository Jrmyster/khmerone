import type { Resource } from './learning/contracts';

/** Fetch only public, approved records. Never request an editor queue or attachment. */
export async function fetchPublishedResources(signal?: AbortSignal, id?: string): Promise<Resource[]> {
  const deadline = AbortSignal.timeout(30000);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  const resources: Resource[] = [];
  const seen = new Set<string>();
  let cursor = '';
  do {
    const path = id ? `?id=${encodeURIComponent(id)}` : '?index=1' + (cursor ? `&after=${encodeURIComponent(cursor)}` : '');
    const response = await fetch('/api/learning/resources' + path, { signal: combined, cache: 'no-store' });
    if (!response.ok) throw new Error('Published school resources are unavailable. Try again shortly.');
    const data = await response.json() as { items: Resource[]; nextCursor?: string | null };
    if (!Array.isArray(data.items)) throw new Error('School resources could not be read.');
    resources.push(...data.items.filter(resource => resource.status === 'approved'));
    cursor = id ? '' : data.nextCursor || '';
    if (cursor && seen.has(cursor)) throw new Error('School resources could not be read.');
    seen.add(cursor);
  } while (cursor);
  return resources;
}
