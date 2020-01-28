import { useContext, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { ContentCategory, SnackbarAction } from '@zoonk/models';
import { createComment, createReply } from '@zoonk/services';
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
  category: ContentCategory;
  commentId?: string;
  postId: string;
  topics: string[];
  onCancel?: () => void;
  onSave?: () => void;
}

/**
 * Form for adding a new comment or reply.
 * @property `category` - where this comment was posted.
 * @property `commentId` - use it for replies.
 * @property `postId` - which post this comment belongs to.
 * @property `topics` - list which topics this post has.
 * @property `onCancel()` - event fired when the user cancels editing the form.
 * @property `onSave()` - event fired when the user saves their comment.
 */
const CommentForm = ({
  category,
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
    category,
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

  const addComment = (): Promise<firebase.firestore.DocumentReference> => {
    return createComment({ ...data, replies: 0 });
  };

  const addReply = (): Promise<firebase.firestore.DocumentReference> => {
    return createReply({ ...data, commentId: commentId! });
  };

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    // If there's a commentId, then it's a reply.
    const saveItem = commentId ? addReply : addComment;

    saveItem()
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
