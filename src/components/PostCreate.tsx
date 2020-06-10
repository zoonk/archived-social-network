import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, SnackbarAction } from '@zoonk/models';
import { createPost, getChapter } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  getPostLinks,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import CategorySelector from './CategorySelector';
import PostForm from './PostForm';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface PostCreateProps {
  category?: Post.Category;
  chapterId?: string;
  groupId?: string;
  pinned?: boolean;
  topicId?: string;
  onCategoryChange: (category?: Post.Category) => void;
}

const PostCreate = ({
  category,
  chapterId,
  groupId,
  pinned,
  topicId,
  onCategoryChange,
}: PostCreateProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [topicIds, setTopics] = useState<string[]>(topicId ? [topicId] : []);

  useEffect(() => {
    if (chapterId) {
      getChapter(chapterId).then((res) => setTopics(res.topics));
    }
  }, [chapterId]);

  if (!user || !profile) {
    return null;
  }

  if (!category) {
    return <CategorySelector onSelect={onCategoryChange} />;
  }

  const redirect = (id: string) => {
    setSnackbar({ type: 'success', msg: translate('saved') });
    push('/posts/[id]', `/posts/${id}`);
  };

  const handleSubmit = async (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });
    createPost({
      ...data,
      category,
      chapterId: chapterId || null,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      delta: JSON.stringify(data.delta),
      groupId: groupId || null,
      language: appLanguage,
      likes: 0,
      links: data.links || getPostLinks(data.delta),
      pinned: Boolean(pinned),
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then(redirect)
      .catch((e) => setSnackbar(firebaseError(e, 'post_add')));
  };

  return (
    <Fragment>
      <PostForm
        category={category}
        topicIds={topicIds}
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostCreate;
