import { timestamp } from '@zoonk/firebase/db';
import { Post } from '@zoonk/models';
import { updatePost } from '@zoonk/services';
import PostForm from './PostForm';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import { getPostLinks } from './rich-text/posts';

interface PostEditFormProps {
  data: Post.Get;
}

const PostEditForm = ({ data }: PostEditFormProps) => {
  const { profile, user } = useAuth();
  const { action, snackbar } = useSnackbar();

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = (
    newData: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => {
    snackbar('progress');

    const changes: Post.Update = {
      ...newData,
      links: newData.links || getPostLinks(JSON.parse(newData.content)),
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    updatePost(changes, data.id)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <PostForm
      category={data.category}
      data={data}
      saving={action === 'progress'}
      onSubmit={handleSubmit}
    />
  );
};

export default PostEditForm;
