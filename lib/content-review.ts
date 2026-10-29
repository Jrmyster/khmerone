export type TeacherReview = { text: string; teacher: string; reviewedAt: string };
// Only add records after a teacher has actually checked the exact Khmer text.
// Keeping the reviewed snapshot means edits automatically return to unreviewed.
export function matchingReview(text: string, review?: TeacherReview): TeacherReview | undefined {
  return review && review.text === text && review.teacher.trim() && /^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) && Number.isFinite(Date.parse(review.reviewedAt)) && new Date(review.reviewedAt).toISOString().slice(0,10) === review.reviewedAt ? review : undefined;
}
