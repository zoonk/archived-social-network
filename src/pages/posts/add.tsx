import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import PostCreate from '@zoonk/components/PostCreate';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import { Post } from '@zoonk/models';
import { analytics, GlobalContext, postCategories } from '@zoonk/utils';

const PostAddPage: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const [category, setCategory] = useState<Post.Category | undefined>();
  const { query } = useRouter();
  const chapterId = query.chapterId ? String(query.chapterId) : undefined;
  const groupId = query.groupId ? String(query.groupId) : undefined;
  const topicId = query.topicId ? String(query.topicId) : undefined;

  useEffect(() => {
    analytics().setCurrentScreen('posts_add');
  }, []);

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
        category={category}
        chapterId={chapterId}
        topicId={topicId}
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
