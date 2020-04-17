import { useEffect, useContext } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Home: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('home');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_home_title')}
        description={translate('seo_home_desc')}
        canonicalUrl={rootUrl}
        noAppName
      />
      <SidebarPage title={translate('post_share')}>
        <PostsCard limit={10} listOnly allowLoadMore />
      </SidebarPage>
    </Container>
  );
};

export default Home;
