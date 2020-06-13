import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import TeachGuide from '@zoonk/components/TeachGuide';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';

const TopicTeach: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const id = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('teach')} noIndex />
      <TopicsBreadcrumb topicId={id} title={translate('teach')} />
      <TeachGuide />
    </Container>
  );
};

export default TopicTeach;
