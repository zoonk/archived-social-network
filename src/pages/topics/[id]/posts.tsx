import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  analytics,
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
} from '@zoonk/utils';

interface TopicPostsProps {
  id: string;
  title: string;
}

const TopicPosts: NextPage<TopicPostsProps> = ({ id, title }) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_posts');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_posts_title', { title })}
        description={translate('seo_topic_posts_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${id}/posts`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('forum')} />
      <PostsCard
        format={['text']}
        topicId={id}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('posts')}
      />
    </Container>
  );
};

TopicPosts.getInitialProps = ({ query }) => {
  const id = String(query.id);
  const title = getPageTitle(id);
  preRender();

  return { id, title };
};

export default TopicPosts;
