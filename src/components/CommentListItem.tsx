import { Fragment, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Delete, Favorite, Reply as ReplyIcon } from '@material-ui/icons';
import { Comment, SnackbarAction } from '@zoonk/models';
import { deleteComment, getLikedStatus, toggleLike } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';

const useStyles = makeStyles(() => ({
  avatar: {
    // Hide the avatar on smaller screens
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

interface CommentListItemProps {
  divider?: boolean;
  item: Comment.Get;
  type: 'comments' | 'replies';
  onReply?: (id: string) => void;
}

/**
 * Display a single comment. This is intended to be used
 * with inside a list component.
 */
const CommentListItem = ({
  divider,
  item,
  type,
  onReply,
}: CommentListItemProps) => {
  const { translate, user } = useContext(GlobalContext);
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [liked, setLiked] = useState<boolean>(false);

  /**
   * Toggle a comment like.
   */
  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    toggleLike(`${type}/${item.id}`, user.uid, liked);
  };

  /**
   * Delete current comment.
   */
  const remove = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });
      deleteComment(item.id)
        .then(() => setSnackbar({ type: 'success', msg: translate('deleted') }))
        .catch((err) => setSnackbar(firebaseError(err, 'comment_delete')));
    }
  };

  /**
   * Check if the current user has liked this comment or not.
   */
  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (user) {
      const itemPath = `${type}/${item.id}`;
      unsubscribe = getLikedStatus(itemPath, user.uid, setLiked);
    }

    return () => {
      unsubscribe();
    };
  }, [type, item.id, user]);

  return (
    <ListItem alignItems="flex-start" divider={divider}>
      <ListItemAvatar className={classes.avatar}>
        <NextLink
          href="/profile/[id]"
          as={`/profile/${item.createdBy.username}`}
          passHref
        >
          <a>
            <Avatar
              src={item.createdBy?.photo || undefined}
              alt={item.createdBy?.name}
            />
          </a>
        </NextLink>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={
          <div style={{ display: 'inline' }}>
            <NextLink
              href="/profile/[id]"
              as={`/profile/${item.createdBy.username}`}
              passHref
            >
              <Link color="textPrimary">
                <Typography component="span" variant="body1">
                  {item.createdBy?.name}
                </Typography>
              </Link>
            </NextLink>
            <Typography component="span" variant="caption">
              {' '}
              - {item.createdAt}
            </Typography>
          </div>
        }
        secondary={
          <Fragment>
            {item.content
              .split('\n')
              .filter(Boolean)
              .map((text) => (
                <Typography
                  variant="body2"
                  gutterBottom
                  color="textSecondary"
                  key={text}
                >
                  {text}
                </Typography>
              ))}

            <Typography
              component="span"
              variant="body2"
              color={liked ? 'secondary' : 'textSecondary'}
            >
              {item.likes}
            </Typography>
            <IconButton
              edge="start"
              aria-label={liked ? translate('liked') : translate('like')}
              onClick={like}
            >
              <Favorite color={liked ? 'secondary' : 'inherit'} />
            </IconButton>

            {type === 'comments' && onReply && (
              <Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {item.replies}
                </Typography>
                <IconButton
                  edge="start"
                  aria-label="reply"
                  onClick={() => onReply(item.id)}
                >
                  <ReplyIcon />
                </IconButton>
              </Fragment>
            )}

            {user?.uid === item.createdById && (
              <IconButton edge="end" aria-label="delete" onClick={remove}>
                <Delete />
              </IconButton>
            )}
          </Fragment>
        }
      />

      <Snackbar action={snackbar} />
    </ListItem>
  );
};

export default CommentListItem;
