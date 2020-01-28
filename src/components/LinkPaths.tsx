import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Default link to the learning paths page.
 */
const LinkPaths = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <NextLink href="/paths" passHref>
      <Link color="inherit" title={translate('learningPaths')}>
        {translate('learningPaths')}
      </Link>
    </NextLink>
  );
};

export default LinkPaths;
