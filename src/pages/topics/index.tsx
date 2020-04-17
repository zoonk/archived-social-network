import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicsCard from '@zoonk/components/TopicsCard';
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
        <TopicsCard allowLoadMore allowAdd hideLink limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Topics;
