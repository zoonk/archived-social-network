import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { postCategories } from '@zoonk/utils';

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const PostCreate = dynamic(() => import('@zoonk/components/PostCreate'), {
  ssr: false,
});

const PostAddPage: NextPage = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const [category, setCategory] = useState<Post.Category | undefined>();
  const { query } = useRouter();
  const chapterId = query.chapterId ? String(query.chapterId) : undefined;
  const groupId = query.groupId ? String(query.groupId) : undefined;
  const topicId = query.topicId ? String(query.topicId) : undefined;

  useEffect(() => {
    // Check if `query.category` is a valid post category
    const queryCategory = String(query.category) as Post.Category;
    const isValid = postCategories.includes(queryCategory);
    if (isValid) setCategory(queryCategory);
  }, [query.category]);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <Container component="main">
      <Meta title={translate('post_add')} noIndex />
      <PostsBreadcrumb
        chapterId={chapterId}
        topicId={topicId}
        groupId={groupId}
        title={translate('post_add')}
      />
      <PostCreate
        category={category}
        chapterId={chapterId}
        groupId={groupId}
        pinned={Boolean(query.pinned)}
        topicId={topicId}
        onCategoryChange={setCategory}
      />
    </Container>
  );
};

export default PostAddPage;
