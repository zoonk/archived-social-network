import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { createPost, getChapter } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import CategorySelector from './CategorySelector';
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
  const [postCategory, setCategory] = useState<Post.Category | undefined>(
    category,
  );

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

    // Use the post category. Otherwise, set as `references` if there are links.
    let itemCategory: Post.Category = !postCategory ? 'posts' : postCategory;

    if (!postCategory && links.length > 0) {
      itemCategory = 'references';
    }

    createPost(
      {
        ...data,
        category: itemCategory,
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

  if (!postCategory) {
    return <CategorySelector onSelect={setCategory} />;
  }

  return (
    <Fragment>
      <Button
        color="primary"
        variant="outlined"
        onClick={() => setCategory(undefined)}
      >
        {translate('category_change')}
      </Button>
      <PostForm
        category={postCategory}
        topicIds={topicIds}
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PostCreate;
