import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const Posts: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('posts')}
        description={translate('seo_posts_desc')}
        canonicalUrl={`${rootUrl}/posts`}
      />
      <SidebarPage category="posts" title={translate('teach_article_title')}>
        <PostsCard category={['posts', 'lessons']} limit={20} />
      </SidebarPage>
    </Container>
  );
};

export default Posts;
