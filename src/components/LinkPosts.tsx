import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface LinkPostsProps {
  category?: Post.Category;
  chapterId?: string | null;
  topicId?: string;
}

/**
 * Default link to the posts page.
 */
const LinkPosts = ({ category, chapterId, topicId }: LinkPostsProps) => {
  const { translate } = useContext(GlobalContext);
  const title = translate(category || 'posts');
  const listPath = category || 'posts';
  const id = chapterId || topicId;
  const prefix = chapterId ? 'chapters' : 'topics';

  const href = id ? `/${prefix}/[id]/${listPath}` : `/${listPath}`;
  const as = id ? `/${prefix}/${id}/${listPath}` : `/${listPath}`;

  return (
    <NextLink href={href} as={as} passHref>
      <Link color="inherit" title={title}>
        {title}
      </Link>
    </NextLink>
  );
};

export default LinkPosts;
