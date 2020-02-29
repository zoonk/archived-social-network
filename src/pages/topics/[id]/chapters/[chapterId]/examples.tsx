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

  return (
    <Container component="main">
      <Meta title={translate('examples')} noIndex />
      <ChaptersBreadcrumb
        title={translate('chapter')}
        page={translate('examples')}
      />
      {query.chapterId && (
        <LessonSortableList
          category="examples"
          chapterId={String(query.chapterId)}
        />
      )}
    </Container>
  );
};

export default ChapterEdits;
