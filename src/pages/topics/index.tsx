import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import Meta from '@zoonk/components/Meta';
import TopicsCard from '@zoonk/components/TopicsCard';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

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
      <CategoryTabs active="topics" />
      <div style={{ margin: theme.spacing(1) }} />
      <TopicsCard allowLoadMore allowAdd hideLink limit={10} />
    </Container>
  );
};

export default Topics;
