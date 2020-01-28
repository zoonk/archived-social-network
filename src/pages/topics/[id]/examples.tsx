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

interface TopicExamplesProps {
  topicId: string;
  title: string;
}

const TopicExamples: NextPage<TopicExamplesProps> = ({ title, topicId }) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_examples');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_examples_title', { title })}
        description={translate('seo_topic_examples_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${topicId}/examples`}
      />
      <TopicsBreadcrumb
        topicId={topicId}
        title={translate('real_life_examples')}
      />
      <PostsCard
        category="examples"
        topicId={topicId}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('examples')}
      />
    </Container>
  );
};

TopicExamples.getInitialProps = ({ query }) => {
  const topicId = String(query.id);
  const title = getPageTitle(topicId);
  preRender();

  return { title, topicId };
};

export default TopicExamples;
