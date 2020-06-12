import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TimelineHeader from '@zoonk/components/TimelineHeader';
import useAuth from '@zoonk/components/useAuth';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const Home: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();

  return (
    <Container component="main">
      <Meta
        title={translate('seo_home_title')}
        description={translate('seo_home_desc')}
        canonicalUrl={rootUrl}
        noAppName
      />
      <SidebarPage title={translate('post_share')}>
        {user && <TimelineHeader active="all" />}
        <PostsCard limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Home;
