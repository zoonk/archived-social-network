import { useContext, useEffect, useState } from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Delete, Favorite, FavoriteBorder, Reply } from '@material-ui/icons';
import { Comment, SnackbarAction } from '@zoonk/models';
import { deleteComment, getLikedStatus, toggleLike } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';

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
}));

const CommentActions = ({ data, onReply }: CommentActionsProps) => {
  const { translate, user } = useContext(GlobalContext);
  const { createdById, id, likes, replies } = data;
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const isAuthor = createdById === user?.uid;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (user) {
      const itemPath = `comments/${id}`;
      unsubscribe = getLikedStatus(itemPath, user.uid, setLiked);
    }

    return () => {
      unsubscribe();
    };
  }, [id, user]);

  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    toggleLike(`comments/${id}`, user.uid, liked);
  };

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
      <Button
        variant="outlined"
        color="secondary"
        startIcon={liked ? <Favorite /> : <FavoriteBorder />}
        onClick={like}
      >
        {likes}
      </Button>

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

      {(isAuthor || isModerator) && (
        <IconButton
          edge="end"
          aria-label={translate('delete')}
          onClick={remove}
        >
          <Delete />
        </IconButton>
      )}

      <Snackbar action={snackbar} />
    </div>
  );
};

export default CommentActions;
