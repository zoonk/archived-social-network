import { useContext, useState } from 'react';
import { Button, makeStyles, Paper, TextField } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { createComment } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import Snackbar from './Snackbar';
import LoginRequired from './LoginRequired';

interface CommentFormProps {
  commentId?: string;
  groupId: string | null;
  postId: string;
  topics: string[];
  onCancel?: () => void;
  onSave?: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(1), margin: theme.spacing(2, 0) },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > *': { marginLeft: theme.spacing(1) },
  },
}));

const CommentForm = ({
  commentId,
  groupId,
  postId,
  topics,
  onCancel,
  onSave,
}: CommentFormProps) => {
  const { translate, profile, user } = useContext(GlobalContext);
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [content, setContent] = useState<string>('');

  if (!user || !profile) {
    return <LoginRequired message={translate('comment_login_required')} />;
  }

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createComment({
      category: commentId ? 'replies' : 'comments',
      commentId: commentId || null,
      content,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      groupId,
      language: appLanguage,
      likes: 0,
      postId,
      replies: 0,
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then(() => {
        // Reset the form after saving it.
        setContent('');
        setSnackbar({ type: 'success', msg: translate('saved') });
        if (onSave) onSave();
      })
      .catch((err) => {
        setSnackbar(firebaseError(err, 'comment_save'));
      });
  };

  return (
    <Paper variant="outlined" className={classes.root}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={translate('comment_leave')}
          fullWidth
          type="textarea"
          rows={5}
          multiline
          variant="outlined"
          id="comment-form"
          name="comment-form"
        />
        <div className={classes.actions}>
          {commentId && onCancel && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              {translate('cancel')}
            </Button>
          )}
          <Button variant="outlined" color="primary" type="submit">
            {translate('save')}
          </Button>
        </div>
      </form>
      <Snackbar action={snackbar} />
    </Paper>
  );
};

export default CommentForm;
