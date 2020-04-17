import { useContext } from 'react';
import NextLink from 'next/link';
import { makeStyles } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  button: {
    flex: 1,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    color: theme.palette.text.hint,
    textDecoration: 'none',
    cursor: 'text',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.light}`,
    },
  },
}));

interface HomeShareProps {
  category?: Post.Category;
  title?: string;
}

const HomeShare = ({ category, title }: HomeShareProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <NextLink
        href={category ? `/posts/add?category=${category}` : '/posts/add'}
        passHref
      >
        <a className={classes.button}>{title || translate('post_add')}</a>
      </NextLink>
    </div>
  );
};

export default HomeShare;
