import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, SnackbarAction } from '@zoonk/models';
import { createPost, getChapter } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
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
  const [topicIds, setTopics] = useState<string[]>(topicId ? [topicId] : []);

  useEffect(() => {
    if (chapterId) {
      getChapter(chapterId).then((res) => setTopics(res.topics));
    }
  }, [chapterId]);

  if (!user || !profile) {
    return null;
  }

  const redirect = (id: string) => {
    setSnackbar({ type: 'success', msg: translate('saved') });

    let href = '/posts/[id]';
    let linkAs = `/posts/${id}`;

    // Go to lessons page when the category is a lesson.
    // This makes easier for reordering items.
    if (chapterId && category === 'lessons') {
      href = '/chapters/[id]/lessons';
      linkAs = `/chapters/${chapterId}/lessons`;
    }

    // Go to the chapter page when there's a chapter id but it's not a lesson.
    if (chapterId && category !== 'lessons') {
      href = '/chapters/[id]';
      linkAs = `/chapters/${chapterId}`;
    }

    push(href, linkAs);
  };

  const handleSubmit = async (
    data: Omit<Post.EditableFields, 'chapters' | 'order'>,
    topics: string[],
  ) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });
    const links = data.links ? data.links.filter(Boolean) : [];

    createPost({
      ...data,
      category: category || 'posts',
      chapterId: chapterId || null,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      language: appLanguage,
      likes: 0,
      links,
      order: order || null,
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
        topicIds={topicIds}
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostCreate;
