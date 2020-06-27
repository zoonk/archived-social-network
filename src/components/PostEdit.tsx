import { Fragment, useEffect, useState } from 'react';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { Post } from '@zoonk/models';
import { deletePost, getPost } from '@zoonk/services';
import EditNotAllowed from './EditNotAllowed';
import LoginForm from './LoginForm';
import PostEditForm from './PostEditForm';
import PostsBreadcrumb from './PostsBreadcrumb';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface PostEditProps {
  id: string;
}

const PostEdit = ({ id }: PostEditProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { snackbar } = useSnackbar();
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
      .catch(() => setData(null));
  }, [id]);

  if (user === null) return <LoginForm />;
  if (data === null) return <Error statusCode={404} />;
  if (data === undefined || user === undefined) return <CircularProgress />;
  if (!canEdit) return <EditNotAllowed />;

  const { chapterId, chapterData, groupId, groupData, title, topics } = data;

  const handleDelete = () => {
    if (profile && window.confirm(translate('post_delete_confirmation'))) {
      snackbar('progress', translate('deleting'));

      const linkPath = chapterId ? '/chapters/[id]' : '/topics/[id]';
      const linkAs = chapterId
        ? `/chapters/${chapterId}`
        : `/topics/${topics[0]}`;

      deletePost(id, profile, user.uid)
        .then(() => {
          snackbar('dismiss');
          push(linkPath, linkAs);
        })
        .catch((e) => snackbar('error', e.message));
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
        <PostsBreadcrumb
          chapterId={chapterId}
          chapterName={chapterData?.title}
          groupId={groupId}
          groupName={groupData?.title}
          postId={id}
          postTitle={title}
          title={translate('edit')}
          topicId={topics[0]}
        />
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
    </Fragment>
  );
};

export default PostEdit;
