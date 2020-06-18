import { useContext, useMemo, useState } from 'react';
import { Node } from 'slate';
import { Slate } from 'slate-react';
import { Button, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { createComment } from '@zoonk/services';
import {
  appLanguage,
  editorEnabled,
  getEmptyEditor,
  PostContext,
} from '@zoonk/utils';
import EditorDisabled from './EditorDisabled';
import LoginRequired from './LoginRequired';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';
import Editor from './rich-text/Editor';
import ToolbarStatic from './rich-text/ToolbarStatic';
import { withEditor } from './rich-text/utils';

interface CommentFormProps {
  commentId?: string;
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

const CommentForm = ({ commentId, onCancel, onSave }: CommentFormProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const [content, setContent] = useState<Node[]>(getEmptyEditor());
  const editor = useMemo(() => withEditor(), []);
  const { category, groupId, id, topics } = useContext(PostContext);
  const classes = useStyles();
  const { snackbar } = useSnackbar();

  if (!user || !profile) {
    return <LoginRequired message={translate('comment_login_required')} />;
  }

  if (editorEnabled() === undefined) return <CircularProgress />;
  if (editorEnabled() === false) return <EditorDisabled />;

  const handleSubmit = () => {
    snackbar('progress');

    createComment({
      category: commentId ? 'replies' : 'comments',
      commentId: commentId || null,
      content: JSON.stringify(content),
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      groupId,
      language: appLanguage,
      likes: 0,
      postId: id,
      replies: 0,
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then(() => {
        snackbar('success');
        // Reset the current content
        setContent(getEmptyEditor());
        if (onSave) onSave();
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Slate editor={editor} value={content} onChange={setContent}>
      <Paper variant="outlined" className={classes.root}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ToolbarStatic />
          <Editor
            placeholder={
              category === 'questions' && !commentId
                ? translate('answer_question')
                : translate('comment_leave')
            }
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
      </Paper>
    </Slate>
  );
};

export default CommentForm;
