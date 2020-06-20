import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';

const ChapterSortableList = dynamic(
  () => import('@zoonk/components/ChapterSortableList'),
  { ssr: false },
);

const TopicChapters: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const id = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('chapters')} noIndex />
      <TopicsBreadcrumb topicId={id} title={translate('chapters')} />
      {query.id && <ChapterSortableList topicId={id} />}
    </Container>
  );
};

export default TopicChapters;
