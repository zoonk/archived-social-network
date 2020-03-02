import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  analytics,
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
} from '@zoonk/utils';

interface TopicBooksProps {
  topicId: string;
  title: string;
}

const TopicBooks: NextPage<TopicBooksProps> = ({ title, topicId }) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_books');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_books_title', { title })}
        description={translate('seo_topic_books_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${topicId}/books`}
      />
      <TopicsBreadcrumb topicId={topicId} title={translate('books')} />
      <PostsCard
        category={['books']}
        topicId={topicId}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        orderBy={['likes']}
        title={translate('books')}
      />
    </Container>
  );
};

TopicBooks.getInitialProps = ({ query }) => {
  const topicId = String(query.id);
  const title = getPageTitle(topicId);
  preRender();

  return { title, topicId };
};

export default TopicBooks;
