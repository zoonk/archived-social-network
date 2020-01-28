import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
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
      <PostsBreadcrumb />
      <PostsCard
        allowAdd
        allowLoadMore
        hideLink
        limit={20}
        title={translate('posts')}
      />
    </Container>
  );
};

export default Posts;
