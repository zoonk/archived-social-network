import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Posts: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('posts');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('posts')}
        description={translate('seo_posts_desc')}
        canonicalUrl={`${rootUrl}/posts`}
      />
      <SidebarPage>
        <PostsCard
          category={['posts', 'lessons']}
          listOnly
          allowLoadMore
          limit={20}
        />
      </SidebarPage>
    </Container>
  );
};

export default Posts;
