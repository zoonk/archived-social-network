import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LinkChapter from '@zoonk/components/LinkChapter';
import PostsCard from '@zoonk/components/PostsCard';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterQuestions: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_questions');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('questions')} noIndex />
      <ChaptersBreadcrumb title={translate('questions')}>
        <LinkChapter title={translate('chapter')} id={String(query.id)} />
      </ChaptersBreadcrumb>
      {query.id && (
        <PostsCard
          category={['questions']}
          chapterId={String(query.id)}
          limit={10}
          hideLink
          allowAdd
          allowLoadMore
          orderBy={['likes']}
          title={translate('questions')}
        />
      )}
    </Container>
  );
};

export default ChapterQuestions;
