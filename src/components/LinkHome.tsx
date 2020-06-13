import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const LinkHome = () => {
  const translate = useTranslation();
  const { user } = useAuth();

  return (
    <NextLink href={user ? '/following' : '/'} passHref>
      <Link color="inherit" title={translate('seo_home_title')}>
        {translate('home')}
      </Link>
    </NextLink>
  );
};

export default LinkHome;
