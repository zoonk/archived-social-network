import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import PostCreate from '@zoonk/components/PostCreate';
import { Post } from '@zoonk/models';
import { analytics, GlobalContext, postCategories } from '@zoonk/utils';

const LessonAddPage: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const [category, setCategory] = useState<Post.Category>();
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('lessons_add');
  }, []);

  useEffect(() => {
    const postCategory = postCategories.includes(
      (query.category as Post.Category) || '',
    )
      ? (String(query.category) as Post.Category)
      : undefined;
    setCategory(postCategory);
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
      <ChaptersBreadcrumb
        title={translate('chapter')}
        page={translate('post_add')}
      />
      <PostCreate
        category={category}
        chapterId={String(query.chapterId)}
        topicId={String(query.id)}
        onCategoryChange={setCategory}
      />
    </Container>
  );
};

export default LessonAddPage;
