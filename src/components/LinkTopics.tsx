import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Default link to the topics page.
 */
const LinkTopics = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <NextLink href="/topics" passHref>
      <Link color="inherit" title="Topics for learning">
        {translate('topics')}
      </Link>
    </NextLink>
  );
};

export default LinkTopics;
