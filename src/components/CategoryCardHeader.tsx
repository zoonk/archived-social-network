import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Link, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ContentCategory, EditableOrder, Post } from '@zoonk/models';
import { GlobalContext, removeTrailingSlash, theme } from '@zoonk/utils';

interface CategoryCardHeaderProps {
  canAdd?: boolean;
  category: ContentCategory | 'leaderboard';
  edit?: EditableOrder;
  hideLink?: boolean;
  list?: Post.Category;
  query?: any;
  title: string;
}

const CategoryCardHeader = ({
  canAdd,
  category,
  edit,
  hideLink,
  list,
  query,
  title,
}: CategoryCardHeaderProps) => {
  const { translate } = useContext(GlobalContext);
  const { asPath, pathname } = useRouter();
  const href = removeTrailingSlash(pathname) || '';
  const as = removeTrailingSlash(asPath) || '';
  const listSlug = list || category;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!hideLink && (
        <NextLink
          href={`${href}/${listSlug}`}
          as={`${as}/${listSlug}`}
          passHref
        >
          <Link color="textPrimary">
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
          </Link>
        </NextLink>
      )}

      {hideLink && (
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      )}

      <div style={{ flexGrow: 1 }} />

      {canAdd && (
        <NextLink href={{ pathname: `/${category}/add`, query }} passHref>
          <Button component="a" size="small" color="primary">
            <Add
              aria-label={translate('create')}
              style={{ marginRight: theme.spacing(0.5) }}
            />
            {translate('create')}
          </Button>
        </NextLink>
      )}

      {edit && (
        <NextLink href={`${href}/${edit}`} as={`${as}/${edit}`} passHref>
          <Button component="a" size="small" color="secondary">
            {translate('edit')}
          </Button>
        </NextLink>
      )}
    </div>
  );
};

export default CategoryCardHeader;
