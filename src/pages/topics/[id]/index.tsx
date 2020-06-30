import { NextPage } from 'next';
import Error from 'next/error';
import { Container } from '@material-ui/core';
import ChaptersCard from '@zoonk/components/ChaptersCard';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import PostShare from '@zoonk/components/PostShare';
import TopicBase from '@zoonk/components/TopicBase';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { Post, Topic } from '@zoonk/models';
import { getPosts, getTopic } from '@zoonk/services';
import { preRender } from '@zoonk/utils';

interface TopicPageProps {
  posts: Post.Get[];
  topic: Topic.Get | null;
}

const limit = 10;

const TopicPage: NextPage<TopicPageProps> = ({ posts, topic }) => {
  const translate = useTranslation();

  if (!topic) return <Error statusCode={404} />;

  const { chapterData, id, language, photo, title } = topic;

  return (
    <Container component="main">
      <Meta
        title={translate('learn_about', { title })}
        description={translate('seo_topic_desc', { title })}
        image={photo}
        canonicalUrl={`https://${language}.zoonk.org/topics/${id}`}
      />

      <TopicsBreadcrumb title={title} />

      <TopicBase topic={topic}>
        <PostShare
          title={translate('post_share_topic', { title })}
          topicId={id}
        />
        <ChaptersCard chapters={chapterData} topic={topic} />
        <PostsList data={posts} topicId={id} limit={10} />
      </TopicBase>
    </Container>
  );
};

TopicPage.getInitialProps = async ({ query }) => {
  const topicId = String(query.id);
  const topicReq = getTopic(topicId);
  const postsReq = getPosts({ topicId, limit });
  const [topic, posts] = await Promise.all([topicReq, postsReq]);
  preRender();
  return { posts, topic };
};

export default TopicPage;
