import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import AddButton from '@zoonk/components/AddButton';
import Meta from '@zoonk/components/Meta';
import PathsList from '@zoonk/components/PathsList';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  analytics,
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
} from '@zoonk/utils';

interface PathsProps {
  id: string;
  title: string;
}

const Paths: NextPage<PathsProps> = ({ title, id }) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_paths');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_paths_title', { title })}
        description={translate('seo_topic_paths_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${id}/paths`}
      />
      <TopicsBreadcrumb topicId={id} title={translate('learningPaths')} />
      <PathsList allowLoadMore topicId={id} />
      <AddButton href={{ pathname: '/paths/add', query: { topicId: id } }} />
    </Container>
  );
};

Paths.getInitialProps = ({ query }) => {
  const id = String(query.id);
  const title = getPageTitle(id);
  preRender();

  return { title, id };
};

export default Paths;
