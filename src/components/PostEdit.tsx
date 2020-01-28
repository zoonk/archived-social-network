import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, SnackbarAction } from '@zoonk/models';
import { deletePost, updatePost } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import PostForm from './PostForm';

interface PostEditProps {
  data: Post.Get;
}

/**
 * Component for editing a post.
 */
const PostEdit = ({ data }: PostEditProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      const { id, topics } = data;

      deletePost(id, profile, user.uid)
        .then(() => {
          setSnackbar(null);
          push('/topics/[id]', `/topics/${topics[0]}`);
        })
        .catch((e) => setSnackbar(firebaseError(e, 'post_delete')));
    }
  };

  const handleSubmit = (
    newData: Omit<Post.EditableFields, 'chapters' | 'order'>,
    topics: string[],
  ) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    const changes: Post.Update = {
      ...newData,
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    updatePost(changes, data.id)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'post_edit')));
  };

  return (
    <Fragment>
      <PostForm
        data={data}
        format={data.format}
        saving={snackbar?.type === 'progress'}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostEdit;
