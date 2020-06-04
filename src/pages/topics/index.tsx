import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicList from '@zoonk/components/TopicList';
import TopicsHeader from '@zoonk/components/TopicsHeader';
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
      <SidebarPage title={translate('post_share')}>
        <TopicsHeader active="all" />
        <TopicList allowLoadMore limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Topics;
