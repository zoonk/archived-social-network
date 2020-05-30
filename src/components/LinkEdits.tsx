import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

const LinkEdits = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <NextLink href="/edits" passHref>
      <Link color="inherit">{translate('edit_history')}</Link>
    </NextLink>
  );
};

export default LinkEdits;
