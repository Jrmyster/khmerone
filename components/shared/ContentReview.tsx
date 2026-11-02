import { contentReviews } from '@/data/contentReviews';
import { matchingReview } from '@/lib/content-review';
export function ContentReview({ contentId, text = '', lang = 'en', machine = false }: { contentId?: string; text?: string; lang?: 'en' | 'km'; machine?: boolean }) {
  const review = matchingReview(text, contentId ? contentReviews[contentId] : undefined);
  return <p className="ko-review" data-reviewed={!!review}>
    <strong>{review ? (lang === 'km' ? 'គ្រូបានពិនិត្យ' : 'Teacher-reviewed') : (lang === 'km' ? 'មិនទាន់បានពិនិត្យដោយគ្រូ' : 'Not teacher-reviewed')}</strong>
    <small>{review ? `${review.teacher} · ${review.reviewedAt}` : machine ? (lang === 'km' ? 'ការបកប្រែដោយម៉ាស៊ីន។ សូមឱ្យគ្រូពិនិត្យមុនប្រើ។' : 'Machine translation. Ask a teacher to check it before use.') : (lang === 'km' ? 'អត្ថបទខ្មែរនេះរង់ចាំការពិនិត្យដោយគ្រូ។' : 'This Khmer text is awaiting a teacher’s check.')}</small>
  </p>;
}
