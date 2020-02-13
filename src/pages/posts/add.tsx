import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import LessonLimit from '@zoonk/components/LessonLimit';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import PostCreate from '@zoonk/components/PostCreate';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import { Post } from '@zoonk/models';
import { analytics, GlobalContext, maxLessons } from '@zoonk/utils';

const PostAddPage: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const { query } = useRouter();
  const category = query.category
    ? (String(query.category) as Post.Category)
    : undefined;
  const chapterId = query.chapterId ? String(query.chapterId) : undefined;
  const order = query.order ? Number(query.order) : undefined;
  const topicId = query.topicId ? String(query.topicId) : undefined;
  const reachedLimit = order && order > maxLessons;

  useEffect(() => {
    analytics().setCurrentScreen('posts_add');
  }, []);

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
        chapter={{ id: chapterId } as any}
        topicId={topicId}
        title={translate('post_add')}
      />

      {reachedLimit && <LessonLimit />}

      {!reachedLimit && (
        <PostCreate
          category={category}
          chapterId={chapterId}
          order={order}
          topicId={topicId}
        />
      )}
    </Container>
  );
};

export default PostAddPage;
