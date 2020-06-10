import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import BackButton from '@zoonk/components/BackButton';
import EditNotAllowed from '@zoonk/components/EditNotAllowed';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import PostEdit from '@zoonk/components/PostEdit';
import Snackbar from '@zoonk/components/Snackbar';
import useAuth from '@zoonk/components/useAuth';
import { Post, SnackbarAction } from '@zoonk/models';
import { deletePost, getPost } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';

const EditPost: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [data, setData] = useState<Post.Get>();
  const { query, push } = useRouter();
  const isAuthor = user?.uid === data?.createdById;
  const isPost = data?.category === 'posts';
  const isQuestion = data?.category === 'questions';
  const isEditable = !isPost && !isQuestion;
  const isModerator = user?.role === 'admin' || user?.role === 'moderator';
  const canDelete = isModerator || isAuthor;

  useEffect(() => {
    if (query.id) {
      getPost(String(query.id))
        .then(setData)
        .catch((e) => setSnackbar(firebaseError(e, 'post_get')));
    }
  }, [query.id]);

  if (user === null) {
    return <LoginForm />;
  }

  if (!data || user === undefined) {
    return <CircularProgress />;
  }

  if (!isAuthor && !isEditable && !isModerator) {
    return <EditNotAllowed />;
  }

  const handleDelete = () => {
    if (profile && window.confirm(translate('post_delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      const { chapterId, id, topics } = data;
      const linkPath = chapterId ? '/chapters/[id]' : '/topics/[id]';
      const linkAs = chapterId
        ? `/chapters/${chapterId}`
        : `/topics/${topics[0]}`;

      deletePost(id, profile, user.uid)
        .then(() => {
          setSnackbar(null);
          push(linkPath, linkAs);
        })
        .catch((e) => setSnackbar(firebaseError(e, 'post_delete')));
    }
  };

  return (
    <Container component="main">
      <Meta title={translate('post_edit')} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <BackButton />
        {canDelete && (
          <IconButton
            color="secondary"
            edge="end"
            title={translate('delete')}
            aria-label={translate('delete')}
            onClick={handleDelete}
          >
            <Delete />
          </IconButton>
        )}
      </div>
      <PostEdit data={data} />
      <Snackbar action={snackbar} />
    </Container>
  );
};

export default EditPost;
