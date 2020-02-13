import { useContext } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ContentCategory } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';

interface AddButtonProps {
  category: ContentCategory | 'leaderboard';
  query?: any;
}

/**
 * Button for navigating to an "add page".
 */
const AddButton = ({ category, query }: AddButtonProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <NextLink href={{ pathname: `/${category}/add`, query }} passHref>
      <Button component="a" size="small" color="primary">
        <Add
          aria-label={translate('create')}
          style={{ marginRight: theme.spacing(0.5) }}
        />
        {translate('create')}
      </Button>
    </NextLink>
  );
};

export default AddButton;
