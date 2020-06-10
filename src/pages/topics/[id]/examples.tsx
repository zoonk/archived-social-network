import { useContext } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
  theme,
} from '@zoonk/utils';

interface TopicExamplesProps {
  topicId: string;
  title: string;
}

const TopicExamples: NextPage<TopicExamplesProps> = ({ title, topicId }) => {
  const { translate } = useContext(GlobalContext);

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
      <PostShare
        category="examples"
        title={translate('teach_example_title')}
        topicId={topicId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['examples']} topicId={topicId} limit={10} />
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
