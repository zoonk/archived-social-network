import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { Button, Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicList from '@zoonk/components/TopicList';
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
      <SidebarPage title={translate('post_share')}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: theme.spacing(1),
            }}
          >
            <NextLink href="/topics/add" passHref>
              <Button component="a" color="primary" variant="outlined">
                {translate('topic_create')}
              </Button>
            </NextLink>
          </div>
          <TopicList allowLoadMore limit={10} />
        </div>
      </SidebarPage>
    </Container>
  );
};

export default Topics;
