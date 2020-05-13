import { useContext } from 'react';
import NextLink from 'next/link';
import { makeStyles } from '@material-ui/core';
import { Dictionary, Post } from '@zoonk/models';
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

interface PostShareProps {
  category?: Post.Category;
  groupId?: string;
  title?: string;
  topicId?: string;
}

const PostShare = ({ category, groupId, title, topicId }: PostShareProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const query: Dictionary<string> = {};

  if (category) {
    query.category = category;
  }

  if (topicId) {
    query.topicId = topicId;
  }

  if (groupId) {
    query.groupId = groupId;
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <NextLink href={{ pathname: '/posts/add', query }} passHref>
        <a className={classes.button}>{title || translate('post_add')}</a>
      </NextLink>
    </div>
  );
};

export default PostShare;
