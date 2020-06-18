import { Post } from '@zoonk/models';

export const getEmptyEditor = () => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const postCategories: Post.Category[] = [
  'books',
  'courses',
  'examples',
  'lessons',
  'posts',
  'questions',
  'references',
];

/**
 * Slate doesn't support Android devices.
 * We're disabling the editor for now.
 * Track issue: https://github.com/ianstormtaylor/slate/issues/3112
 */
export const editorEnabled = (): boolean | undefined => {
  if (typeof window === 'undefined') return undefined;
  const ua = window.navigator.userAgent.toLowerCase();
  return !ua.includes('android');
};
