import { useContext } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import ChapterSortableList from '@zoonk/components/ChapterSortableList';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { GlobalContext } from '@zoonk/utils';

const TopicChapters: NextPage = () => {
  const { translate } = useContext(GlobalContext);
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
