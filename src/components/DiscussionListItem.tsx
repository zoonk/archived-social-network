import { useContext, useState } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Comment, SnackbarAction } from '@zoonk/models';
import { deleteComment } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';

interface DiscussionListItemProps {
  comment: Comment.Get;
}

const DiscussionListItem = ({ comment }: DiscussionListItemProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { content, createdAt, createdBy, createdById, id, postId } = comment;
  const isAuthor = createdById === user?.uid;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

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
      deleteComment(id)
        .then(() => setSnackbar({ type: 'success', msg: translate('deleted') }))
        .catch((err) => setSnackbar(firebaseError(err, 'comment_delete')));
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <a>
              <Avatar
                src={createdBy.photo || undefined}
                alt={createdBy.name}
                title={createdBy.name}
              />
            </a>
          </NextLink>
        }
        title={
          <NextLink
            href="/profile/[id]"
            as={`/profile/${createdBy.username}`}
            passHref
          >
            <Link color="textPrimary">
              <Typography variant="h6">{createdBy.name}</Typography>
            </Link>
          </NextLink>
        }
        subheader={createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
        <Snackbar action={snackbar} />
      </CardContent>
      <CardActions disableSpacing>
        <NextLink href="/posts/[id]" as={`/posts/${postId}`} passHref>
          <Button component="a" color="primary">
            {translate('see_discussion')}
          </Button>
        </NextLink>

        {(isAuthor || isModerator) && (
          <IconButton onClick={remove}>
            <Delete />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default DiscussionListItem;
