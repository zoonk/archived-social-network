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
  topicId?: string;
}

/**
 * Component for creating a post.
 */
const PostCreate = ({ category, chapterId, topicId }: PostCreateProps) => {
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

    const categories = ['examples', 'lessons'];
    if (chapterId && categories.includes(String(category))) {
      href = '/topics/[id]/chapters/[chapterId]/[lessonId]';
      linkAs = `/topics/${topicId}/chapters/${chapterId}/${id}`;
    }

    push(href, linkAs);
  };

  const handleSubmit = async (data: Post.EditableFields, topics: string[]) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });
    const links = data.links ? data.links.filter(Boolean) : [];

    createPost(
      {
        ...data,
        category: category || 'posts',
        comments: 0,
        createdAt: timestamp,
        createdBy: profile,
        createdById: user.uid,
        language: appLanguage,
        likes: 0,
        links,
        topics,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      chapterId,
    )
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
