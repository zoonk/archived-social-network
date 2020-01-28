import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LessonSortableList from '@zoonk/components/LessonSortableList';
import LinkChapter from '@zoonk/components/LinkChapter';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_lessons');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('lessons')} noIndex />

      <ChaptersBreadcrumb title={translate('lessons')}>
        <LinkChapter
          title={translate('chapter')}
          chapterId={String(query.id)}
        />
      </ChaptersBreadcrumb>

      {query.id && <LessonSortableList chapterId={String(query.id)} />}
    </Container>
  );
};

export default ChapterEdits;
