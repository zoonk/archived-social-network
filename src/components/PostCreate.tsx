import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, SnackbarAction } from '@zoonk/models';
import { createPost } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import FormatSelector from './FormatSelector';
import PostForm from './PostForm';
import Snackbar from './Snackbar';

interface PostCreateProps {
  category?: Post.Category;
  chapterId?: string;
  order?: number;
  topicId?: string;
}

/**
 * Component for creating a post.
 */
const PostCreate = ({
  category,
  chapterId,
  order,
  topicId,
}: PostCreateProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [format, setFormat] = useState<Post.Format>('text');

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (
    data: Omit<Post.EditableFields, 'chapters' | 'order'>,
    topics: string[],
  ) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createPost({
      ...data,
      category: category || 'posts',
      chapters: chapterId ? [chapterId] : [],
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      language: appLanguage,
      likes: 0,
      order: chapterId && order ? { [chapterId]: order } : {},
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        push('/posts/[id]', `/posts/${id}`);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'post_add')));
  };

  return (
    <FormatSelector format={format} onSelect={setFormat}>
      <PostForm
        format={format}
        topicId={topicId}
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </FormatSelector>
  );
};

export default PostCreate;
