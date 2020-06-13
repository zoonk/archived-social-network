import { useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { Button, makeStyles, Paper } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { createComment } from '@zoonk/services';
import { appLanguage, PostContext } from '@zoonk/utils';
import LoginRequired from './LoginRequired';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const Editor = dynamic(() => import('./rich-text/Editor'), { ssr: false });

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
  const editorRef = useRef<Quill>();
  const { category, groupId, id, topics } = useContext(PostContext);
  const classes = useStyles();
  const { snackbar } = useSnackbar();

  if (!user || !profile) {
    return <LoginRequired message={translate('comment_login_required')} />;
  }

  const handleSubmit = () => {
    snackbar('progress');

    if (!editorRef.current) return;

    const delta = editorRef.current.getContents();
    const html = editorRef.current.root.innerHTML;

    createComment({
      category: commentId ? 'replies' : 'comments',
      commentId: commentId || null,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      delta: JSON.stringify(delta),
      groupId,
      html,
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
        if (editorRef.current) editorRef.current.setText('');
        if (onSave) onSave();
      })
      .catch((e) => snackbar('error', e.message));
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
        <Editor
          editorRef={editorRef}
          id={commentId || 'main'}
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
  );
};

export default CommentForm;
