import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { getPageTitle, preRender, rootUrl, theme } from '@zoonk/utils';

interface TopicPostsProps {
  id: string;
  title: string;
}

const TopicPosts: NextPage<TopicPostsProps> = ({ id, title }) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_posts_title', { title })}
        description={translate('seo_topic_posts_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${id}/posts`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('posts')} />
      <PostShare
        category="posts"
        title={translate('teach_article_title')}
        topicId={id}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['posts', 'lessons']} topicId={id} limit={10} />
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
