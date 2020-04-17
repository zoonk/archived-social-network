import { useContext, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { createComment } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
  theme,
} from '@zoonk/utils';
import Snackbar from './Snackbar';
import LoginRequired from './LoginRequired';

interface CommentFormProps {
  commentId?: string;
  postId: string;
  topics: string[];
  onCancel?: () => void;
  onSave?: () => void;
}

/**
 * Form for adding a new comment or reply.
 */
const CommentForm = ({
  commentId,
  postId,
  topics,
  onCancel,
  onSave,
}: CommentFormProps) => {
  const { translate, profile, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [content, setContent] = useState<string>('');

  if (!user || !profile) {
    return <LoginRequired message={translate('comment_login_required')} />;
  }

  const data = {
    content,
    createdAt: timestamp,
    createdBy: profile,
    createdById: user.uid,
    language: appLanguage,
    likes: 0,
    postId,
    replies: 0,
    topics,
    updatedAt: timestamp,
    updatedBy: profile,
    updatedById: user.uid,
  };

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createComment({
      ...data,
      category: commentId ? 'replies' : 'comments',
      commentId: commentId || null,
      replies: 0,
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
    <form
      style={{
        width: '100%',
        margin: theme.spacing(3, 0),
      }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        id="comment-form"
        label={translate('comment_leave')}
        name="comment-form"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 0) }}
      >
        {translate('save_changes')}
      </Button>

      {commentId && onCancel && (
        <Button
          type="reset"
          color="secondary"
          style={{ margin: theme.spacing(3, 2, 0) }}
          onClick={() => onCancel()}
        >
          {translate('cancel')}
        </Button>
      )}

      <Snackbar action={snackbar} />
    </form>
  );
};

export default CommentForm;
