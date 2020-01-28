import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import AddButton from '@zoonk/components/AddButton';
import Meta from '@zoonk/components/Meta';
import TopicList from '@zoonk/components/TopicList';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Topics: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topics');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('topics')}
        description={translate('seo_topics_desc')}
        canonicalUrl={`${rootUrl}/topics`}
      />
      <TopicsBreadcrumb />
      <TopicList allowLoadMore />
      <AddButton href="/topics/add" />
    </Container>
  );
};

export default Topics;
