import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LessonSortableList from '@zoonk/components/LessonSortableList';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const ChapterLessons: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  if (!query.id) return null;

  return (
    <Container component="main">
      <Meta title={translate('lessons')} noIndex />
      <ChaptersBreadcrumb
        chapterId={String(query.id)}
        title={translate('chapter')}
        page={translate('lessons')}
      />
      <LessonSortableList category="lessons" chapterId={String(query.id)} />
    </Container>
  );
};

export default ChapterLessons;
