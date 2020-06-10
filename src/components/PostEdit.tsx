import { Fragment, useContext, useState } from 'react';
import { Post, SnackbarAction } from '@zoonk/models';
import { updatePost } from '@zoonk/services';
import {
  firebaseError,
  getPostLinks,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import Snackbar from './Snackbar';
import PostForm from './PostForm';
import useAuth from './useAuth';

interface PostEditProps {
  data: Post.Get;
}

const PostEdit = ({ data }: PostEditProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = (
    newData: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    const changes: Post.Update = {
      ...newData,
      delta: JSON.stringify(newData.delta),
      links: newData.links || getPostLinks(newData.delta),
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
        category={data.category}
        data={data}
        saving={snackbar?.type === 'progress'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostEdit;
