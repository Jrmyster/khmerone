import type { Metadata } from 'next';
import { PostsGuide } from '@/components/posts/PostsGuide';
import '../public-services/services.css';

export const metadata: Metadata = {
  title: 'Posts and Telecommunications | Khmer One',
  description: 'Find official Cambodian postal and internet service links, compare costs, and explore proposals for better access.',
  alternates: { canonical: '/posts-and-telecommunications' },
};

export default function Page() {
  return <PostsGuide />;
}
