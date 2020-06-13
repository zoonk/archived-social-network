import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import useTranslation from './useTranslation';

const LinkTopics = () => {
  const translate = useTranslation();

  return (
    <NextLink href="/topics" passHref>
      <Link color="inherit" title="Topics for learning">
        {translate('topics')}
      </Link>
    </NextLink>
  );
};

export default LinkTopics;
