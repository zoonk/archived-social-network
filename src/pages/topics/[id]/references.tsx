import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  analytics,
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
  theme,
} from '@zoonk/utils';

interface TopicReferencesProps {
  topicId: string;
  title: string;
}

const TopicReferences: NextPage<TopicReferencesProps> = ({
  title,
  topicId,
}) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_references');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_ref_title', { title })}
        description={translate('seo_topic_ref_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${topicId}/references`}
      />
      <TopicsBreadcrumb topicId={topicId} title={translate('references')} />
      <PostShare
        category="references"
        title={translate('teach_ref_title')}
        topicId={topicId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['references']} topicId={topicId} limit={10} />
    </Container>
  );
};

TopicReferences.getInitialProps = ({ query }) => {
  const topicId = String(query.id);
  const title = getPageTitle(topicId);
  preRender();

  return { title, topicId };
};

export default TopicReferences;
