import { Fragment, useContext, useEffect, useState } from 'react';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import BackButton from '@zoonk/components/BackButton';
import EditNotAllowed from '@zoonk/components/EditNotAllowed';
import LoginForm from '@zoonk/components/LoginForm';
import PostEditForm from '@zoonk/components/PostEditForm';
import Snackbar from '@zoonk/components/Snackbar';
import useAuth from '@zoonk/components/useAuth';
import { Post, SnackbarAction } from '@zoonk/models';
import { deletePost, getPost } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';

interface PostEditProps {
  id: string;
}

const PostEdit = ({ id }: PostEditProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [data, setData] = useState<Post.Get | null | undefined>();
  const { push } = useRouter();
  const isAuthor = user?.uid === data?.createdById;
  const isPost = data?.category === 'posts';
  const isQuestion = data?.category === 'questions';
  const isEditable = !isPost && !isQuestion;
  const isModerator = user?.role === 'admin' || user?.role === 'moderator';
  const canDelete = isModerator || isAuthor;
  const canEdit = isAuthor || isEditable || isModerator;

  useEffect(() => {
    getPost(id)
      .then(setData)
      .catch((e) => setSnackbar(firebaseError(e, 'post_get')));
  }, [id]);

  if (user === null) return <LoginForm />;
  if (data === null) return <Error statusCode={404} />;
  if (data === undefined || user === undefined) return <CircularProgress />;
  if (!canEdit) return <EditNotAllowed />;

  const handleDelete = () => {
    if (profile && window.confirm(translate('post_delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      const { chapterId, topics } = data;
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
    <Fragment>
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
      <PostEditForm data={data} />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostEdit;
