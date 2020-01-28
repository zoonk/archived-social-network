import NextLink from 'next/link';
import { Link } from '@material-ui/core';

interface LinkPostProps {
  id: string;
  title: string;
}

/**
 * Default link to an post page.
 */
const LinkPost = ({ id, title }: LinkPostProps) => {
  return (
    <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
      <Link color="inherit" title={title}>
        {title}
      </Link>
    </NextLink>
  );
};

export default LinkPost;
