import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';
import { getPageTitle, theme } from '@zoonk/utils';

interface TopicLabelProps {
  id: string;
}

/**
 * Display a topic label.
 */
const TopicLabel = ({ id }: TopicLabelProps) => {
  return (
    <NextLink key={id} href="/topics/[id]" as={`/topics/${id}`} passHref>
      <Link>
        <Typography
          variant="caption"
          style={{ marginRight: theme.spacing(0.5) }}
        >
          #{getPageTitle(id)}
        </Typography>
      </Link>
    </NextLink>
  );
};

export default TopicLabel;
