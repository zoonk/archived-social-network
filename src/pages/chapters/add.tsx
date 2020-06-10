import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChapterCreate from '@zoonk/components/ChapterCreate';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { GlobalContext } from '@zoonk/utils';

const ChapterAdd: NextPage = () => {
  const { translate } = useContext(GlobalContext);
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
