import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';

const TopicEdit = dynamic(() => import('@zoonk/components/TopicEdit'), {
  ssr: false,
});

const EditTopic: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const id = String(query.id);

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('edit_topic')} noIndex />
      <TopicsBreadcrumb topicId={id} title={translate('edit_topic')} />
      {query.id && <TopicEdit id={id} />}
    </Container>
  );
};

export default EditTopic;
