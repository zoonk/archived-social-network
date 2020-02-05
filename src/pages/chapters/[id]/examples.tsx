import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LinkChapter from '@zoonk/components/LinkChapter';
import PostsCard from '@zoonk/components/PostsCard';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterExamples: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_examples');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('real_life_examples')} noIndex />
      <ChaptersBreadcrumb title={translate('real_life_examples')}>
        <LinkChapter
          title={translate('chapter')}
          chapterId={String(query.id)}
        />
      </ChaptersBreadcrumb>
      {query.id && (
        <PostsCard
          category="examples"
          chapterId={String(query.id)}
          limit={10}
          hideLink
          allowAdd
          allowLoadMore
          orderBy={['likes']}
          title={translate('examples')}
        />
      )}
    </Container>
  );
};

export default ChapterExamples;
