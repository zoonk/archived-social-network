import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LessonSortableList from '@zoonk/components/LessonSortableList';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_examples');
  }, []);

  if (!query.id) return null;

  return (
    <Container component="main">
      <Meta title={translate('examples')} noIndex />
      <ChaptersBreadcrumb
        chapterId={String(query.id)}
        title={translate('chapter')}
        page={translate('examples')}
      />
      <LessonSortableList category="examples" chapterId={String(query.id)} />
    </Container>
  );
};

export default ChapterEdits;
