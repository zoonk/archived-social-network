import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface LinkPostsProps {
  category?: Post.Category;
  topicId?: string;
}

/**
 * Default link to the posts page.
 */
const LinkPosts = ({ category, topicId }: LinkPostsProps) => {
  const { translate } = useContext(GlobalContext);
  const title = translate(category || 'posts');

  /**
   * Page to list all posts. When there's no category or it's a lesson,
   * then we go to a general "posts" page. Otherwise, navigate to a
   * page containing all posts from the specified category.
   */
  const page = !category || category === 'lessons' ? 'posts' : category;

  const href = topicId ? `/topics/[id]/${page}` : `/${page}`;
  const as = topicId ? `/topics/${topicId}/${page}` : `/${page}`;

  return (
    <NextLink href={href} as={as} passHref>
      <Link color="inherit" title={title}>
        {title}
      </Link>
    </NextLink>
  );
};

export default LinkPosts;
