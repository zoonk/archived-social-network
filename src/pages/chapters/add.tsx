import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';

const ChapterCreate = dynamic(() => import('@zoonk/components/ChapterCreate'), {
  ssr: false,
});

const ChapterAdd: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const topicId = String(query.topicId);

  if (!query.topicId) return null;

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('chapter_add')} noIndex />
      <TopicsBreadcrumb topicId={topicId} title={translate('chapter_add')} />
      <ChapterFormContainer type="add">
        <ChapterCreate topicId={topicId} />
      </ChapterFormContainer>
    </Container>
  );
};

export default ChapterAdd;
