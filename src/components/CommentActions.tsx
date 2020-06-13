import { useContext } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Delete, Reply } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { Comment } from '@zoonk/models';
import { deleteComment } from '@zoonk/services';
import { PostContext } from '@zoonk/utils';
import LikeButton from './LikeButton';
import MarkAsAnswer from './MarkAsAnswer';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

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
  const translate = useTranslation();
  const { user } = useAuth();
  const { category: postCategory, createdById: postAuthor } = useContext(
    PostContext,
  );
  const { category, createdById, id, likes, replies } = data;
  const classes = useStyles();
  const { snackbar } = useSnackbar();
  const isAuthor = createdById === user?.uid;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';
  const isPostAuthor = postAuthor === user?.uid;
  const canDelete = isAuthor || isModerator;
  const canPin =
    postCategory === 'questions' && category === 'comments' && isPostAuthor;

  const remove = () => {
    if (!user) {
      snackbar('error', translate('need_to_be_loggedin'));
      return;
    }

    if (window.confirm(translate('delete_confirmation'))) {
      snackbar('progress', translate('deleting'));
      deleteComment(id).catch((e) => snackbar('error', e.message));
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
    </div>
  );
};

export default CommentActions;
