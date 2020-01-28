import { useContext } from 'react';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

interface LinkPathProps {
  id: string;
  title?: string;
}

/**
 * Default link to a learning path page.
 */
const LinkPath = ({ id, title }: LinkPathProps) => {
  const { translate } = useContext(GlobalContext);
  const name = title || translate('path');

  return (
    <NextLink href="/paths/[id]" as={`/paths/${id}`} passHref>
      <Link color="inherit" title={name}>
        {name}
      </Link>
    </NextLink>
  );
};

export default LinkPath;
