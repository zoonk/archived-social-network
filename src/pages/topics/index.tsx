import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicList from '@zoonk/components/TopicList';
import TopicsHeader from '@zoonk/components/TopicsHeader';
import useTranslation from '@zoonk/components/useTranslation';
import { Topic } from '@zoonk/models';
import { getTopics } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

const limit = 10;

interface TopicsProps {
  data: Topic.Get[];
}

export const getStaticProps: GetStaticProps<TopicsProps> = async () => {
  const data = await getTopics({ limit });
  return { props: { data }, revalidate: 1 };
};

const Topics = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('topics')}
        description={translate('seo_topics_desc')}
        canonicalUrl={`${rootUrl}/topics`}
      />
      <SidebarPage title={translate('post_share')}>
        <TopicsHeader active="all" />
        <TopicList data={data} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default Topics;
