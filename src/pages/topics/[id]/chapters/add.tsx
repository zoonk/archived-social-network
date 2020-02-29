import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChapterCreate from '@zoonk/components/ChapterCreate';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const ChapterAdd: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const topicId = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('chapters_add');
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('chapter_add')} noIndex />
      <TopicsBreadcrumb topicId={topicId} title={translate('chapter_add')} />
      <ChapterFormContainer>
        <ChapterCreate topicId={topicId} />
      </ChapterFormContainer>
    </Container>
  );
};

export default ChapterAdd;
