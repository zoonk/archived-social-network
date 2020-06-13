import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const LessonSortableList = dynamic(
  () => import('@zoonk/components/LessonSortableList'),
  { ssr: false },
);

const ChapterLessons: NextPage = () => {
  const translate = useTranslation();
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
