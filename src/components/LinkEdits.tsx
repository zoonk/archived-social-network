import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import useTranslation from './useTranslation';

const LinkEdits = () => {
  const translate = useTranslation();

  return (
    <NextLink href="/edits" passHref>
      <Link color="inherit">{translate('edit_history')}</Link>
    </NextLink>
  );
};

export default LinkEdits;
