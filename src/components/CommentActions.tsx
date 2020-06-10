import { useContext, useState } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Delete, Reply } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { Comment, SnackbarAction } from '@zoonk/models';
import { deleteComment } from '@zoonk/services';
import { firebaseError, GlobalContext, PostContext } from '@zoonk/utils';
import LikeButton from './LikeButton';
import MarkAsAnswer from './MarkAsAnswer';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface CommentActionsProps {
  data: Comment.Get;
  onReply?: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& > *': { marginRight: theme.spacing(1) },
  },
  pin: { color: green[600] },
}));

const CommentActions = ({ data, onReply }: CommentActionsProps) => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { category: postCategory, createdById: postAuthor } = useContext(
    PostContext,
  );
  const { category, createdById, id, likes, replies } = data;
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const isAuthor = createdById === user?.uid;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';
  const isPostAuthor = postAuthor === user?.uid;
  const canDelete = isAuthor || isModerator;
  const canPin =
    postCategory === 'questions' && category === 'comments' && isPostAuthor;

  const remove = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });
      deleteComment(id).catch((err) =>
        setSnackbar(firebaseError(err, 'comment_delete')),
      );
    }
  };

  return (
    <div className={classes.root}>
      <LikeButton likes={likes} itemPath={`comments/${id}`} />

      {onReply && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Reply />}
          onClick={onReply}
        >
          {replies}
        </Button>
      )}

      {canDelete && (
        <IconButton
          edge="end"
          aria-label={translate('delete')}
          onClick={remove}
        >
          <Delete />
        </IconButton>
      )}

      <div style={{ flexGrow: 1 }} />
      {canPin && <MarkAsAnswer commentId={id} />}
      <Snackbar action={snackbar} />
    </div>
  );
};

export default CommentActions;
