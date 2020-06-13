import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl } from '@zoonk/utils';

const TopicCreate = dynamic(() => import('@zoonk/components/TopicCreate'), {
  ssr: false,
});

const CreateTopic: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main" maxWidth="xs">
      <Meta
        title={translate('topic_create')}
        description={translate('seo_topics_create_desc')}
        canonicalUrl={`${rootUrl}/topics/add`}
      />
      <TopicsBreadcrumb title={translate('topic_create')} />
      <TopicCreate />
    </Container>
  );
};

export default CreateTopic;
