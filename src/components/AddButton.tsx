import { useContext } from 'react';
import { UrlObject } from 'url';
import NextLink from 'next/link';
import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { GlobalContext, theme } from '@zoonk/utils';

interface AddButtonProps {
  href: string | UrlObject;
  as?: string | UrlObject;
}

/**
 * Fixed "+" (add) button positioned in the bottom right corner.
 */
const AddButton = ({ href, as }: AddButtonProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <NextLink href={href} as={as} passHref>
      <Fab
        color="primary"
        aria-label={translate('create')}
        variant="extended"
        style={{
          position: 'fixed',
          right: theme.spacing(2),
          bottom: theme.spacing(2),
        }}
      >
        <Add style={{ marginRight: theme.spacing(0.5) }} />
        {translate('create')}
      </Fab>
    </NextLink>
  );
};

export default AddButton;
