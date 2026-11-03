import type { TeacherReview } from '@/lib/content-review';
// No teacher approvals have been supplied. Do not infer approval from publication.
// Keys: dictionary:stem-1, story:seed, toolkit:<unit-id>, etc.
export const contentReviews: Record<string, TeacherReview> = {};
