import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ContentCategory } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface AddButtonProps {
  category: ContentCategory | 'leaderboard';
  query?: any;
}

const AddButton = ({ category, query }: AddButtonProps) => {
  const translate = useTranslation();

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
