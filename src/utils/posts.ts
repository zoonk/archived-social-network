import { Post } from '@zoonk/models';

/**
 * Get the URL from a post image.
 */
export const getPostImage = (content: string): string | null => {
  const pattern = /\((.+?\.(?:png|jpg|gif|svg)[^)]*)\)/;
  const findImage = content.match(pattern);
  const imageUrl = findImage ? findImage[1] : null;
  return imageUrl ? imageUrl.split(' ')[0] : null;
};

export const postCategories: Post.Category[] = [
  'books',
  'courses',
  'examples',
  'lessons',
  'posts',
  'questions',
  'references',
];
