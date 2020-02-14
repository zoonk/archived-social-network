import NextLink from 'next/link';
import { Chip } from '@material-ui/core';
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
      <Chip
        component="a"
        size="small"
        variant="outlined"
        color="primary"
        label={getPageTitle(id)}
        style={{
          marginRight: theme.spacing(0.5),
          marginBottom: theme.spacing(0.5),
        }}
      />
    </NextLink>
  );
};

export default TopicLabel;
