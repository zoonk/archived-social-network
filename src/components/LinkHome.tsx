import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Default link to the homepage
 */
const LinkHome = () => {
  const { translate, user } = useContext(GlobalContext);

  return (
    <NextLink href={user ? '/following' : '/'} passHref>
      <Link color="inherit" title="Free learning app">
        {translate('home')}
      </Link>
    </NextLink>
  );
};

export default LinkHome;
