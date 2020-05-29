import { fromString } from 'html-to-text';
import { Post } from '@zoonk/models';

/**
 * Get the URL from a post image.
 */
export const getPostImage = (content: string): string | null => {
  const tagPattern = /<img[^>]+src="(.*?)"/;
  const tagUrl = content.match(tagPattern);
  return tagUrl ? tagUrl[1] : null;
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

export const getPlainText = (text: string): string => {
  return fromString(text, {
    uppercaseHeadings: false,
    ignoreHref: true,
    ignoreImage: true,
  }).replace('\n', ' ');
};
