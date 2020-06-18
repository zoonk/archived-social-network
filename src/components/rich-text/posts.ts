import { Node, Text } from 'slate';
import { rootUrl } from '@zoonk/utils';

const getImage = (node: Node): string | null => {
  if (node.type === 'image' && node.src) return node.src as string;
  if (Text.isText(node)) return null;

  const children = node.children.map(getImage).filter(Boolean);
  const firstImage = children.flat()[0];

  return firstImage || null;
};

/**
 * Get the URL from a post image.
 */
export const getPostImage = (nodes: Node[]): string | null => {
  return getImage({ children: nodes });
};

export const getPlainText = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const getLinks = (node: Node): string[] => {
  if (Text.isText(node)) return [];

  const children = node.children
    .map((n) => {
      if (n.url) {
        const link = n.url as string;
        return link.startsWith('/') ? `${rootUrl}${link}` : link;
      }
      if (n.children) return getLinks(n);
      return '';
    })
    .filter(Boolean);

  return children?.flat();
};

export const getPostLinks = (node: Node[]): string[] => {
  const links = getLinks({ children: node });
  return [...new Set(links)];
};
