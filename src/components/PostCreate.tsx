import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Post } from '@zoonk/models';
import { createPost, getChapter } from '@zoonk/services';
import { appLanguage } from '@zoonk/utils';
import CategorySelector from './CategorySelector';
import PostForm from './PostForm';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';
import { getPostLinks } from './rich-text/posts';

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
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [topicIds, setTopics] = useState<string[]>(topicId ? [topicId] : []);

  useEffect(() => {
    if (chapterId) {
      getChapter(chapterId).then((res) => {
        if (res) setTopics(res.topics);
      });
    }
  }, [chapterId]);

  // Log when a user started creating a post
  useEffect(() => {
    const start = new Date().getTime();
    localStorage.setItem('postStart', String(start));
  }, []);

  if (!user || !profile) {
    return null;
  }

  if (!category) {
    return <CategorySelector onSelect={onCategoryChange} />;
  }

  const redirect = (id: string) => {
    snackbar('success');
    push('/posts/[id]', `/posts/${id}`);
  };

  const handleSubmit = async (
    data: Omit<Post.EditableFields, 'pinned'>,
    topics: string[],
  ) => {
    snackbar('progress');
    createPost({
      ...data,
      category,
      chapterId: chapterId || null,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      groupId: groupId || null,
      language: appLanguage,
      likes: 0,
      links: data.links || getPostLinks(JSON.parse(data.content)),
      pinned: Boolean(pinned),
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then(redirect)
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <PostForm
      category={category}
      topicIds={topicIds}
      saving={action === 'progress' || action === 'success'}
      onSubmit={handleSubmit}
    />
  );
};

export default PostCreate;
